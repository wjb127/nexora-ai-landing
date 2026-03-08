"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";
import { GLOBE_CITIES, GLOBE_ARCS } from "@/lib/constants";

// ─────────────────────────────────────────────────────────────
// 상수
// ─────────────────────────────────────────────────────────────
const GLOBE_RADIUS = 2.0;
const DOT_COUNT_DESKTOP = 8000;
const DOT_COUNT_MOBILE = 3500;
const ARC_SEGMENTS = 64;
const ARC_HEIGHT_FACTOR = 0.4; // 아크 높이 배수
const AUTO_ROTATE_SPEED = 0.001;

const COL_DOT = new THREE.Color("#4a9eff");
const COL_ARC = new THREE.Color("#00d4ff");
const COL_GLOW = new THREE.Color("#4a9eff");

// ─────────────────────────────────────────────────────────────
// 유틸: 위도/경도 → 3D 좌표
// ─────────────────────────────────────────────────────────────
function latLngToVec3(lat: number, lng: number, radius: number): THREE.Vector3 {
  const phi = (90 - lat) * (Math.PI / 180);
  const theta = (lng + 180) * (Math.PI / 180);
  return new THREE.Vector3(
    -radius * Math.sin(phi) * Math.cos(theta),
    radius * Math.cos(phi),
    radius * Math.sin(phi) * Math.sin(theta)
  );
}

// ─────────────────────────────────────────────────────────────
// 유틸: Fibonacci sphere 알고리즘으로 구면 균일 분포 생성
// ─────────────────────────────────────────────────────────────
function fibonacciSphere(count: number, radius: number): Float32Array {
  const positions = new Float32Array(count * 3);
  const goldenRatio = (1 + Math.sqrt(5)) / 2;

  for (let i = 0; i < count; i++) {
    const theta = (2 * Math.PI * i) / goldenRatio;
    const phi = Math.acos(1 - (2 * (i + 0.5)) / count);

    positions[i * 3] = radius * Math.sin(phi) * Math.cos(theta);
    positions[i * 3 + 1] = radius * Math.cos(phi);
    positions[i * 3 + 2] = radius * Math.sin(phi) * Math.sin(theta);
  }

  return positions;
}

// ─────────────────────────────────────────────────────────────
// 유틸: 두 점 사이 아크 커브 생성
// ─────────────────────────────────────────────────────────────
function createArcCurve(
  start: THREE.Vector3,
  end: THREE.Vector3,
  radius: number
): THREE.CubicBezierCurve3 {
  const mid = new THREE.Vector3().addVectors(start, end).multiplyScalar(0.5);
  const midLen = mid.length();
  // 중간점을 구체 바깥으로 밀어올림
  const arcHeight = radius + start.distanceTo(end) * ARC_HEIGHT_FACTOR;
  mid.normalize().multiplyScalar(arcHeight);

  // 컨트롤 포인트: start ↔ mid, mid ↔ end 사이
  const ctrl1 = new THREE.Vector3().lerpVectors(start, mid, 0.33);
  ctrl1.normalize().multiplyScalar(midLen + (arcHeight - midLen) * 0.5);

  const ctrl2 = new THREE.Vector3().lerpVectors(end, mid, 0.33);
  ctrl2.normalize().multiplyScalar(midLen + (arcHeight - midLen) * 0.5);

  return new THREE.CubicBezierCurve3(start, ctrl1, ctrl2, end);
}

// ─────────────────────────────────────────────────────────────
// 메인 컴포넌트
// ─────────────────────────────────────────────────────────────
export default function GlobeScene() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const rafRef = useRef<number>(0);

  // 마우스 인터랙션
  const mouseRef = useRef({ x: 0, y: 0 });
  const isDraggingRef = useRef(false);
  const prevMouseRef = useRef({ x: 0, y: 0 });
  const rotationRef = useRef({ x: 0.3, y: 0 }); // 초기 기울임
  const targetRotRef = useRef({ x: 0.3, y: 0 });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const isMobile = window.innerWidth < 768;
    const DOT_COUNT = isMobile ? DOT_COUNT_MOBILE : DOT_COUNT_DESKTOP;

    // ── Scene / Camera / Renderer ───────────────────────────
    const scene = new THREE.Scene();

    const camera = new THREE.PerspectiveCamera(
      45,
      canvas.clientWidth / canvas.clientHeight,
      0.1,
      100
    );
    camera.position.z = isMobile ? 6 : 5;

    const renderer = new THREE.WebGLRenderer({
      canvas,
      antialias: true,
      alpha: true,
    });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(canvas.clientWidth, canvas.clientHeight, false);
    renderer.setClearColor(0x000000, 0);

    // ── 글로브 그룹 (전체 회전 제어) ─────────────────────────
    const globeGroup = new THREE.Group();
    scene.add(globeGroup);

    // ── 파티클 도트 구체 ─────────────────────────────────────
    const dotPositions = fibonacciSphere(DOT_COUNT, GLOBE_RADIUS);
    const dotColors = new Float32Array(DOT_COUNT * 3);
    const dotSizes = new Float32Array(DOT_COUNT);

    for (let i = 0; i < DOT_COUNT; i++) {
      // 파란색 계열 약간의 변주
      const t = Math.random() * 0.3;
      const col = COL_DOT.clone().lerp(COL_ARC, t);
      dotColors[i * 3] = col.r;
      dotColors[i * 3 + 1] = col.g;
      dotColors[i * 3 + 2] = col.b;
      dotSizes[i] = 0.8 + Math.random() * 0.6;
    }

    const dotGeometry = new THREE.BufferGeometry();
    dotGeometry.setAttribute("position", new THREE.BufferAttribute(dotPositions, 3));
    dotGeometry.setAttribute("color", new THREE.BufferAttribute(dotColors, 3));
    dotGeometry.setAttribute("size", new THREE.BufferAttribute(dotSizes, 1));

    const dotMaterial = new THREE.PointsMaterial({
      size: isMobile ? 0.025 : 0.018,
      vertexColors: true,
      transparent: true,
      opacity: 0.7,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
      sizeAttenuation: true,
    });

    const dots = new THREE.Points(dotGeometry, dotMaterial);
    globeGroup.add(dots);

    // ── 글로우 효과 (반투명 구체 오버레이) ──────────────────
    const glowGeometry = new THREE.SphereGeometry(GLOBE_RADIUS * 1.15, 32, 32);
    const glowMaterial = new THREE.ShaderMaterial({
      uniforms: {
        glowColor: { value: COL_GLOW },
        viewVector: { value: camera.position },
      },
      vertexShader: `
        uniform vec3 viewVector;
        varying float intensity;
        void main() {
          vec3 vNormal = normalize(normalMatrix * normal);
          vec3 vNormel = normalize(normalMatrix * viewVector);
          intensity = pow(0.65 - dot(vNormal, vNormel), 3.0);
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
      `,
      fragmentShader: `
        uniform vec3 glowColor;
        varying float intensity;
        void main() {
          vec3 glow = glowColor * intensity;
          gl_FragColor = vec4(glow, intensity * 0.4);
        }
      `,
      side: THREE.BackSide,
      blending: THREE.AdditiveBlending,
      transparent: true,
      depthWrite: false,
    });

    const glowMesh = new THREE.Mesh(glowGeometry, glowMaterial);
    globeGroup.add(glowMesh);

    // ── 아크 연결선 ──────────────────────────────────────────
    interface ArcData {
      line: THREE.Line;
      material: THREE.LineDashedMaterial;
      totalLength: number;
    }

    const arcs: ArcData[] = [];

    GLOBE_ARCS.forEach(([fromIdx, toIdx]) => {
      const from = GLOBE_CITIES[fromIdx];
      const to = GLOBE_CITIES[toIdx];

      const startVec = latLngToVec3(from.lat, from.lng, GLOBE_RADIUS);
      const endVec = latLngToVec3(to.lat, to.lng, GLOBE_RADIUS);
      const curve = createArcCurve(startVec, endVec, GLOBE_RADIUS);
      const points = curve.getPoints(ARC_SEGMENTS);

      const arcGeometry = new THREE.BufferGeometry().setFromPoints(points);
      const arcMaterial = new THREE.LineDashedMaterial({
        color: COL_ARC,
        transparent: true,
        opacity: 0.6,
        dashSize: 0.15,
        gapSize: 0.1,
        blending: THREE.AdditiveBlending,
        depthWrite: false,
      });

      const line = new THREE.Line(arcGeometry, arcMaterial);
      line.computeLineDistances();

      const totalLength = points.reduce((sum, p, i) => {
        if (i === 0) return 0;
        return sum + p.distanceTo(points[i - 1]);
      }, 0);

      globeGroup.add(line);
      arcs.push({ line, material: arcMaterial, totalLength });
    });

    // ── 도시 포인트 마커 ────────────────────────────────────
    const cityPositions = new Float32Array(GLOBE_CITIES.length * 3);
    GLOBE_CITIES.forEach((city, i) => {
      const v = latLngToVec3(city.lat, city.lng, GLOBE_RADIUS * 1.01);
      cityPositions[i * 3] = v.x;
      cityPositions[i * 3 + 1] = v.y;
      cityPositions[i * 3 + 2] = v.z;
    });

    const cityGeometry = new THREE.BufferGeometry();
    cityGeometry.setAttribute("position", new THREE.BufferAttribute(cityPositions, 3));

    const cityMaterial = new THREE.PointsMaterial({
      color: COL_ARC,
      size: isMobile ? 0.08 : 0.06,
      transparent: true,
      opacity: 1,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
      sizeAttenuation: true,
    });

    const cityPoints = new THREE.Points(cityGeometry, cityMaterial);
    globeGroup.add(cityPoints);

    // ── 이벤트 핸들러 ───────────────────────────────────────
    const handleMouseMove = (e: MouseEvent) => {
      mouseRef.current = {
        x: (e.clientX / window.innerWidth) * 2 - 1,
        y: -((e.clientY / window.innerHeight) * 2 - 1),
      };

      if (isDraggingRef.current) {
        const dx = e.clientX - prevMouseRef.current.x;
        const dy = e.clientY - prevMouseRef.current.y;
        targetRotRef.current.y += dx * 0.005;
        targetRotRef.current.x += dy * 0.003;
        // x축 회전 제한
        targetRotRef.current.x = Math.max(-1.2, Math.min(1.2, targetRotRef.current.x));
        prevMouseRef.current = { x: e.clientX, y: e.clientY };
      }
    };

    const handleMouseDown = (e: MouseEvent) => {
      isDraggingRef.current = true;
      prevMouseRef.current = { x: e.clientX, y: e.clientY };
    };

    const handleMouseUp = () => {
      isDraggingRef.current = false;
    };

    // 터치 이벤트
    const handleTouchMove = (e: TouchEvent) => {
      if (e.touches.length === 1) {
        const touch = e.touches[0];
        if (isDraggingRef.current) {
          const dx = touch.clientX - prevMouseRef.current.x;
          const dy = touch.clientY - prevMouseRef.current.y;
          targetRotRef.current.y += dx * 0.005;
          targetRotRef.current.x += dy * 0.003;
          targetRotRef.current.x = Math.max(-1.2, Math.min(1.2, targetRotRef.current.x));
          prevMouseRef.current = { x: touch.clientX, y: touch.clientY };
        }
      }
    };

    const handleTouchStart = (e: TouchEvent) => {
      if (e.touches.length === 1) {
        isDraggingRef.current = true;
        prevMouseRef.current = { x: e.touches[0].clientX, y: e.touches[0].clientY };
      }
    };

    const handleTouchEnd = () => {
      isDraggingRef.current = false;
    };

    const handleResize = () => {
      const w = canvas.clientWidth;
      const h = canvas.clientHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h, false);
    };

    canvas.addEventListener("mousemove", handleMouseMove, { passive: true });
    canvas.addEventListener("mousedown", handleMouseDown);
    canvas.addEventListener("mouseup", handleMouseUp);
    canvas.addEventListener("mouseleave", handleMouseUp);
    canvas.addEventListener("touchmove", handleTouchMove, { passive: true });
    canvas.addEventListener("touchstart", handleTouchStart, { passive: true });
    canvas.addEventListener("touchend", handleTouchEnd);
    window.addEventListener("resize", handleResize);

    // ── 애니메이션 루프 ─────────────────────────────────────
    let time = 0;

    const animate = () => {
      rafRef.current = requestAnimationFrame(animate);
      time += 0.016; // ~60fps 기준 delta

      // 자동 회전 (드래그 중이 아닐 때)
      if (!isDraggingRef.current) {
        targetRotRef.current.y += AUTO_ROTATE_SPEED;
      }

      // 현재 회전값 lerp
      rotationRef.current.x += (targetRotRef.current.x - rotationRef.current.x) * 0.05;
      rotationRef.current.y += (targetRotRef.current.y - rotationRef.current.y) * 0.05;

      globeGroup.rotation.x = rotationRef.current.x;
      globeGroup.rotation.y = rotationRef.current.y;

      // 아크 dash offset 애니메이션 (흐르는 효과)
      arcs.forEach((arc, i) => {
        (arc.material as unknown as { dashOffset: number }).dashOffset = -(time * 0.3 + i * 0.5);
      });

      // 도시 포인트 펄스
      cityMaterial.size = (isMobile ? 0.08 : 0.06) + Math.sin(time * 2) * 0.015;

      renderer.render(scene, camera);
    };

    animate();

    // ── 클린업 ──────────────────────────────────────────────
    return () => {
      cancelAnimationFrame(rafRef.current);
      canvas.removeEventListener("mousemove", handleMouseMove);
      canvas.removeEventListener("mousedown", handleMouseDown);
      canvas.removeEventListener("mouseup", handleMouseUp);
      canvas.removeEventListener("mouseleave", handleMouseUp);
      canvas.removeEventListener("touchmove", handleTouchMove);
      canvas.removeEventListener("touchstart", handleTouchStart);
      canvas.removeEventListener("touchend", handleTouchEnd);
      window.removeEventListener("resize", handleResize);

      dotGeometry.dispose();
      dotMaterial.dispose();
      glowGeometry.dispose();
      glowMaterial.dispose();
      cityGeometry.dispose();
      cityMaterial.dispose();
      arcs.forEach((arc) => {
        arc.line.geometry.dispose();
        arc.material.dispose();
      });
      renderer.dispose();
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full"
      aria-hidden="true"
      style={{ display: "block", cursor: "grab" }}
      onMouseDown={() => {
        if (canvasRef.current) canvasRef.current.style.cursor = "grabbing";
      }}
      onMouseUp={() => {
        if (canvasRef.current) canvasRef.current.style.cursor = "grab";
      }}
    />
  );
}
