"use client";

import { useEffect, useRef, useCallback } from "react";
import * as THREE from "three";

// ─────────────────────────────────────────────────────────────
// 상수
// ─────────────────────────────────────────────────────────────
const PARTICLE_COUNT_DESKTOP = 50000;
const PARTICLE_COUNT_MOBILE = 15000;
const SPHERE_RADIUS = 2.2;
const TEXT_SPREAD = 6.0;
const SCATTER_RANGE = 10.0;
const MOUSE_RADIUS = 1.5;
const MOUSE_STRENGTH = 0.8;

// ─────────────────────────────────────────────────────────────
// 유틸: 캔버스에서 텍스트 픽셀 좌표 추출
// ─────────────────────────────────────────────────────────────
function extractTextPositions(
  text: string,
  count: number,
  spread: number
): Float32Array {
  const canvas = document.createElement("canvas");
  const ctx = canvas.getContext("2d")!;
  canvas.width = 512;
  canvas.height = 128;

  ctx.fillStyle = "#000";
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  ctx.fillStyle = "#fff";
  ctx.font = "bold 90px Arial, sans-serif";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillText(text, canvas.width / 2, canvas.height / 2);

  const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
  const pixels: [number, number][] = [];

  // 밝은 픽셀 좌표 수집 (2px 간격 샘플링)
  for (let y = 0; y < canvas.height; y += 2) {
    for (let x = 0; x < canvas.width; x += 2) {
      const i = (y * canvas.width + x) * 4;
      if (imageData.data[i] > 128) {
        pixels.push([x, y]);
      }
    }
  }

  const positions = new Float32Array(count * 3);
  const aspect = canvas.width / canvas.height;

  for (let i = 0; i < count; i++) {
    const pixel = pixels[i % pixels.length];
    // 중심 기준 정규화 + 약간의 Z 깊이 랜덤
    positions[i * 3] = (pixel[0] / canvas.width - 0.5) * spread * aspect;
    positions[i * 3 + 1] = -(pixel[1] / canvas.height - 0.5) * spread;
    positions[i * 3 + 2] = (Math.random() - 0.5) * 0.3;
  }

  return positions;
}

// ─────────────────────────────────────────────────────────────
// 유틸: Fibonacci sphere 균일 분포
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
// 유틸: 랜덤 분산 좌표
// ─────────────────────────────────────────────────────────────
function scatterPositions(count: number, range: number): Float32Array {
  const positions = new Float32Array(count * 3);
  for (let i = 0; i < count; i++) {
    // 구면 랜덤 → 불규칙 분산
    const theta = Math.random() * Math.PI * 2;
    const phi = Math.acos(2 * Math.random() - 1);
    const r = range * (0.3 + Math.random() * 0.7);
    positions[i * 3] = r * Math.sin(phi) * Math.cos(theta);
    positions[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
    positions[i * 3 + 2] = r * Math.cos(phi);
  }
  return positions;
}

// ─────────────────────────────────────────────────────────────
// GLSL 셰이더
// ─────────────────────────────────────────────────────────────
const vertexShader = /* glsl */ `
  attribute vec3 aTextPos;
  attribute vec3 aSpherePos;
  attribute vec3 aScatterPos;
  attribute float aDelay;

  uniform float uMorph1;   // 0: text → 1: sphere
  uniform float uMorph2;   // 0: sphere → 1: scatter
  uniform float uMorph3;   // 0: scatter → 1: text (reform)
  uniform vec3 uMouse;
  uniform float uMouseRadius;
  uniform float uMouseStrength;
  uniform float uTime;
  uniform float uPointSize;

  varying float vAlpha;
  varying float vColorMix;

  // Easing: smoothstep 변형 (개별 파티클 딜레이 적용)
  float easedProgress(float progress, float delay) {
    float adjusted = clamp((progress - delay * 0.3) / 0.7, 0.0, 1.0);
    return adjusted * adjusted * (3.0 - 2.0 * adjusted); // smoothstep
  }

  void main() {
    // 각 모핑 단계의 eased progress
    float e1 = easedProgress(uMorph1, aDelay);
    float e2 = easedProgress(uMorph2, aDelay);
    float e3 = easedProgress(uMorph3, aDelay);

    // 3단계 모핑: text → sphere → scatter → text
    vec3 pos1 = mix(aTextPos, aSpherePos, e1);
    vec3 pos2 = mix(pos1, aScatterPos, e2);
    vec3 finalPos = mix(pos2, aTextPos, e3);

    // 마우스 반발력 (repulsion)
    vec3 diff = finalPos - uMouse;
    float dist = length(diff);
    float repulsion = smoothstep(uMouseRadius, 0.0, dist);
    finalPos += normalize(diff + vec3(0.001)) * repulsion * uMouseStrength;

    // 미세한 부유 모션 (perlin-like)
    float wave = sin(uTime * 0.5 + aDelay * 6.28) * 0.02;
    finalPos.y += wave;
    finalPos.x += cos(uTime * 0.3 + aDelay * 3.14) * 0.01;

    vec4 mvPosition = modelViewMatrix * vec4(finalPos, 1.0);
    gl_PointSize = uPointSize * (300.0 / -mvPosition.z);
    gl_Position = projectionMatrix * mvPosition;

    // 속도 기반 알파: 이동 중인 파티클은 약간 투명하게
    float speed = length(finalPos - aTextPos) * 0.1;
    vAlpha = 0.6 + 0.4 * (1.0 - clamp(speed, 0.0, 1.0));

    // 색상 믹스: 모핑 상태에 따라 블루 ↔ 시안
    vColorMix = e1 * 0.5 + e2 * 0.5;
  }
`;

const fragmentShader = /* glsl */ `
  varying float vAlpha;
  varying float vColorMix;

  uniform vec3 uColorA; // blue
  uniform vec3 uColorB; // cyan

  void main() {
    // 원형 파티클 (사각형 → 원 마스크)
    vec2 center = gl_PointCoord - vec2(0.5);
    float dist = length(center);
    if (dist > 0.5) discard;

    // 부드러운 엣지
    float alpha = vAlpha * smoothstep(0.5, 0.2, dist);

    // 색상 보간
    vec3 color = mix(uColorA, uColorB, vColorMix);

    // 중심부 밝기 부스트 (글로우 느낌)
    color += vec3(0.15) * smoothstep(0.3, 0.0, dist);

    gl_FragColor = vec4(color, alpha);
  }
`;

// ─────────────────────────────────────────────────────────────
// Props
// ─────────────────────────────────────────────────────────────
interface ParticleSceneProps {
  /** 외부에서 스크롤 진행도를 주입 (0~4 범위) */
  scrollProgress?: number;
}

// ─────────────────────────────────────────────────────────────
// 메인 컴포넌트
// ─────────────────────────────────────────────────────────────
export default function ParticleScene({ scrollProgress = 0 }: ParticleSceneProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const rafRef = useRef<number>(0);
  const mouseRef = useRef(new THREE.Vector3(999, 999, 999)); // 초기값: 화면 밖
  const uniformsRef = useRef<Record<string, THREE.IUniform> | null>(null);
  const scrollRef = useRef(0);

  // 외부 scrollProgress 동기화
  useEffect(() => {
    scrollRef.current = scrollProgress;
  }, [scrollProgress]);

  // 마우스 → 3D 월드 좌표 변환 핸들러
  const handleMouseMove = useCallback((e: MouseEvent) => {
    // 정규화된 디바이스 좌표 (-1 ~ 1)
    const x = (e.clientX / window.innerWidth) * 2 - 1;
    const y = -((e.clientY / window.innerHeight) * 2 - 1);
    // 근사적 3D 좌표 (카메라 z=5 기준)
    mouseRef.current.set(x * 4, y * 3, 0);
  }, []);

  const handleMouseLeave = useCallback(() => {
    mouseRef.current.set(999, 999, 999);
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const isMobile = window.innerWidth < 768;
    const COUNT = isMobile ? PARTICLE_COUNT_MOBILE : PARTICLE_COUNT_DESKTOP;

    // ── 좌표 세트 생성 ──────────────────────────────────────
    const textPos = extractTextPositions("NEXORA", COUNT, TEXT_SPREAD);
    const spherePos = fibonacciSphere(COUNT, SPHERE_RADIUS);
    const scatPos = scatterPositions(COUNT, SCATTER_RANGE);

    // 파티클별 딜레이 (0~1 랜덤, 웨이브 모핑 효과)
    const delays = new Float32Array(COUNT);
    for (let i = 0; i < COUNT; i++) {
      delays[i] = Math.random();
    }

    // ── Scene / Camera / Renderer ───────────────────────────
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(
      60,
      canvas.clientWidth / canvas.clientHeight,
      0.1,
      100
    );
    camera.position.z = 5;

    const renderer = new THREE.WebGLRenderer({
      canvas,
      antialias: false,
      alpha: true,
      powerPreference: "high-performance",
    });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, isMobile ? 1.5 : 2));
    renderer.setSize(canvas.clientWidth, canvas.clientHeight, false);
    renderer.setClearColor(0x000000, 0);

    // ── Geometry ─────────────────────────────────────────────
    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute("position", new THREE.BufferAttribute(new Float32Array(textPos), 3));
    geometry.setAttribute("aTextPos", new THREE.BufferAttribute(textPos, 3));
    geometry.setAttribute("aSpherePos", new THREE.BufferAttribute(spherePos, 3));
    geometry.setAttribute("aScatterPos", new THREE.BufferAttribute(scatPos, 3));
    geometry.setAttribute("aDelay", new THREE.BufferAttribute(delays, 1));

    // ── ShaderMaterial ──────────────────────────────────────
    const uniforms = {
      uMorph1: { value: 0.0 },
      uMorph2: { value: 0.0 },
      uMorph3: { value: 0.0 },
      uMouse: { value: new THREE.Vector3(999, 999, 999) },
      uMouseRadius: { value: MOUSE_RADIUS },
      uMouseStrength: { value: MOUSE_STRENGTH },
      uTime: { value: 0.0 },
      uPointSize: { value: isMobile ? 2.0 : 1.5 },
      uColorA: { value: new THREE.Color("#4a9eff") },
      uColorB: { value: new THREE.Color("#00d4ff") },
    };
    uniformsRef.current = uniforms;

    const material = new THREE.ShaderMaterial({
      vertexShader,
      fragmentShader,
      uniforms,
      transparent: true,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    });

    const points = new THREE.Points(geometry, material);
    scene.add(points);

    // ── 이벤트 리스너 ───────────────────────────────────────
    const handleResize = () => {
      const w = canvas.clientWidth;
      const h = canvas.clientHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h, false);
    };

    window.addEventListener("mousemove", handleMouseMove, { passive: true });
    window.addEventListener("mouseleave", handleMouseLeave);
    window.addEventListener("resize", handleResize);

    // ── 애니메이션 루프 ─────────────────────────────────────
    let time = 0;

    const animate = () => {
      rafRef.current = requestAnimationFrame(animate);
      time += 0.016;

      uniforms.uTime.value = time;
      uniforms.uMouse.value.copy(mouseRef.current);

      // 스크롤 기반 모핑 전환
      // 0~1: text 상태 (대기)
      // 1~2: text → sphere
      // 2~3: sphere → scatter
      // 3~4: scatter → text (reform)
      const p = scrollRef.current;

      uniforms.uMorph1.value = Math.max(0, Math.min(1, p - 1)); // 1~2
      uniforms.uMorph2.value = Math.max(0, Math.min(1, p - 2)); // 2~3
      uniforms.uMorph3.value = Math.max(0, Math.min(1, p - 3)); // 3~4

      // 전체 그룹 미세한 회전
      points.rotation.y = time * 0.05;
      points.rotation.x = Math.sin(time * 0.1) * 0.05;

      renderer.render(scene, camera);
    };

    animate();

    // ── 클린업 ──────────────────────────────────────────────
    return () => {
      cancelAnimationFrame(rafRef.current);
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseleave", handleMouseLeave);
      window.removeEventListener("resize", handleResize);
      geometry.dispose();
      material.dispose();
      renderer.dispose();
    };
  }, [handleMouseMove, handleMouseLeave]);

  return (
    <canvas
      ref={canvasRef}
      className="w-full h-full"
      aria-hidden="true"
      style={{ display: "block" }}
    />
  );
}
