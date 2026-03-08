"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";

// ─────────────────────────────────────────────────────────────
// 상수
// ─────────────────────────────────────────────────────────────
const PARTICLE_COUNT_DESKTOP = 3000;
const PARTICLE_COUNT_MOBILE = 1200; // 모바일 성능 절감
const SPHERE_RADIUS = 2.2;
const COLOR_BLUE = new THREE.Color("#4a9eff");
const COLOR_CYAN = new THREE.Color("#00d4ff");

// ─────────────────────────────────────────────────────────────
// 유틸: 구면 좌표 → 직교 좌표
// ─────────────────────────────────────────────────────────────
function randomOnSphere(radius: number): [number, number, number] {
  const theta = Math.random() * Math.PI * 2;
  const phi = Math.acos(2 * Math.random() - 1);
  return [
    radius * Math.sin(phi) * Math.cos(theta),
    radius * Math.sin(phi) * Math.sin(theta),
    radius * Math.cos(phi),
  ];
}

// ─────────────────────────────────────────────────────────────
// 유틸: 0-1 클램프
// ─────────────────────────────────────────────────────────────
function clamp(v: number, min: number, max: number): number {
  return Math.min(Math.max(v, min), max);
}

// ─────────────────────────────────────────────────────────────
// 메인 컴포넌트
// ─────────────────────────────────────────────────────────────
export default function HeroScene() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Three.js 핵심 객체 refs (리렌더 방지)
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const sceneRef = useRef<THREE.Scene | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const pointsRef = useRef<THREE.Points | null>(null);
  const rafRef = useRef<number>(0);

  // 파티클 위치 버퍼 refs
  const spherePosRef = useRef<Float32Array>(new Float32Array(0));
  const randomPosRef = useRef<Float32Array>(new Float32Array(0));

  // 인터랙션 state refs
  const mouseRef = useRef({ x: 0, y: 0 }); // 정규화된 마우스 (-1 ~ 1)
  const scrollProgressRef = useRef(0); // 0(구) ~ 1(흩어짐)
  const targetRotRef = useRef({ x: 0, y: 0 }); // 마우스 기반 목표 회전
  const currentRotRef = useRef({ x: 0, y: 0 }); // 현재 (lerp)

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    // ── 파티클 수: 모바일 감소 ──────────────────────────────
    const isMobile = window.innerWidth < 768;
    const COUNT = isMobile ? PARTICLE_COUNT_MOBILE : PARTICLE_COUNT_DESKTOP;

    // ── 버퍼 초기화 ────────────────────────────────────────
    const spherePos = new Float32Array(COUNT * 3);
    const randomPos = new Float32Array(COUNT * 3);
    const colors = new Float32Array(COUNT * 3);

    const spreadRange = 8; // 흩어질 범위
    for (let i = 0; i < COUNT; i++) {
      const [sx, sy, sz] = randomOnSphere(SPHERE_RADIUS);
      spherePos[i * 3] = sx;
      spherePos[i * 3 + 1] = sy;
      spherePos[i * 3 + 2] = sz;

      randomPos[i * 3] = (Math.random() - 0.5) * spreadRange;
      randomPos[i * 3 + 1] = (Math.random() - 0.5) * spreadRange;
      randomPos[i * 3 + 2] = (Math.random() - 0.5) * spreadRange;

      // 파란색~시안 사이 랜덤 색상
      const t = Math.random();
      const color = COLOR_BLUE.clone().lerp(COLOR_CYAN, t);
      colors[i * 3] = color.r;
      colors[i * 3 + 1] = color.g;
      colors[i * 3 + 2] = color.b;
    }

    spherePosRef.current = spherePos;
    randomPosRef.current = randomPos;

    // ── Scene / Camera / Renderer ───────────────────────────
    const scene = new THREE.Scene();
    sceneRef.current = scene;

    const camera = new THREE.PerspectiveCamera(
      60,
      canvas.clientWidth / canvas.clientHeight,
      0.1,
      100
    );
    camera.position.z = 5;
    cameraRef.current = camera;

    const renderer = new THREE.WebGLRenderer({
      canvas,
      antialias: false,
      alpha: true, // 투명 배경
    });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(canvas.clientWidth, canvas.clientHeight, false);
    renderer.setClearColor(0x000000, 0); // 완전 투명
    rendererRef.current = renderer;

    // ── Geometry & Material ─────────────────────────────────
    const geometry = new THREE.BufferGeometry();
    // 초기 위치: 구면 위치 복사
    const positions = new Float32Array(spherePos);
    geometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute("color", new THREE.BufferAttribute(colors, 3));

    const material = new THREE.PointsMaterial({
      size: isMobile ? 0.025 : 0.018,
      vertexColors: true,
      transparent: true,
      opacity: 0.9,
      blending: THREE.AdditiveBlending, // 글로우 효과
      depthWrite: false,
      sizeAttenuation: true,
    });

    const points = new THREE.Points(geometry, material);
    scene.add(points);
    pointsRef.current = points;

    // ── 이벤트: 마우스 ──────────────────────────────────────
    const handleMouseMove = (e: MouseEvent) => {
      mouseRef.current = {
        x: (e.clientX / window.innerWidth) * 2 - 1,
        y: -((e.clientY / window.innerHeight) * 2 - 1),
      };
    };

    // ── 이벤트: 스크롤 ──────────────────────────────────────
    const handleScroll = () => {
      // 히어로 섹션 높이(= 100vh) 기준으로 0~1 계산
      const progress = window.scrollY / window.innerHeight;
      scrollProgressRef.current = clamp(progress, 0, 1);
    };

    // ── 이벤트: 리사이즈 ────────────────────────────────────
    const handleResize = () => {
      const w = window.innerWidth;
      const h = window.innerHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h, false);
    };

    window.addEventListener("mousemove", handleMouseMove, { passive: true });
    window.addEventListener("scroll", handleScroll, { passive: true });
    window.addEventListener("resize", handleResize);

    // ── 애니메이션 루프 ─────────────────────────────────────
    const posAttr = geometry.attributes.position as THREE.BufferAttribute;

    const animate = () => {
      rafRef.current = requestAnimationFrame(animate);

      const progress = scrollProgressRef.current;

      // 파티클 위치: 구 ↔ 분산 lerp
      const sp = spherePosRef.current;
      const rp = randomPosRef.current;
      const pos = posAttr.array as Float32Array;

      for (let i = 0; i < COUNT * 3; i++) {
        pos[i] = sp[i] + (rp[i] - sp[i]) * progress;
      }
      posAttr.needsUpdate = true;

      // 마우스 기반 회전 목표값 (미세한 반응)
      targetRotRef.current.x = mouseRef.current.y * 0.3;
      targetRotRef.current.y = mouseRef.current.x * 0.4;

      // 현재 회전을 목표로 부드럽게 lerp
      currentRotRef.current.x +=
        (targetRotRef.current.x - currentRotRef.current.x) * 0.05;
      currentRotRef.current.y +=
        (targetRotRef.current.y - currentRotRef.current.y) * 0.05;

      // 기본 자동 회전 + 마우스 오프셋
      points.rotation.x = currentRotRef.current.x;
      points.rotation.y += 0.0015 + currentRotRef.current.y * 0.001;

      // 스크롤 시 material opacity 약간 낮춤
      material.opacity = 0.9 - progress * 0.35;

      renderer.render(scene, camera);
    };

    animate();

    // ── 클린업 ──────────────────────────────────────────────
    return () => {
      cancelAnimationFrame(rafRef.current);
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("resize", handleResize);
      geometry.dispose();
      material.dispose();
      renderer.dispose();
    };
  }, []);

  return (
    <section
      className="relative w-full"
      style={{ height: "100vh" }}
      aria-label="히어로 섹션"
    >
      {/* ── Three.js 캔버스 ─────────────────────────────── */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full"
        aria-hidden="true"
        style={{ display: "block" }}
      />

      {/* ── 텍스트 오버레이 ─────────────────────────────── */}
      <div
        className="absolute inset-0 z-10 flex flex-col items-center justify-center px-4 text-center pointer-events-none"
        style={{ animation: "heroFadeIn 1.2s ease-out forwards" }}
      >
        {/* 배지 */}
        <div
          className="mb-6 inline-flex items-center gap-2 rounded-full border px-4 py-1.5 text-xs font-medium tracking-widest uppercase"
          style={{
            borderColor: "rgba(74,158,255,0.35)",
            background: "rgba(74,158,255,0.07)",
            color: "#4a9eff",
            animation: "heroFadeIn 1s ease-out 0.2s both",
          }}
        >
          <span
            className="inline-block w-1.5 h-1.5 rounded-full"
            style={{ background: "#00d4ff" }}
          />
          AI-Powered Analytics
        </div>

        {/* 메인 타이틀 */}
        <h1
          className="font-bold leading-tight tracking-tight"
          style={{
            fontSize: "clamp(2.5rem, 8vw, 5.5rem)",
            background: "linear-gradient(135deg, #ffffff 30%, #4a9eff 65%, #00d4ff 100%)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            backgroundClip: "text",
            animation: "heroFadeIn 1s ease-out 0.45s both",
          }}
        >
          Intelligence
          <br />
          Beyond Limits
        </h1>

        {/* 서브 텍스트 */}
        <p
          className="mt-6 max-w-lg text-base md:text-xl leading-relaxed"
          style={{
            color: "#8a8a9a",
            animation: "heroFadeIn 1s ease-out 0.7s both",
          }}
        >
          AI 기반 데이터 분석으로
          <br className="sm:hidden" />
          {" "}비즈니스의 한계를 넘어서세요.
        </p>

        {/* CTA 버튼 */}
        <div
          className="mt-10 flex flex-col sm:flex-row gap-3 pointer-events-auto"
          style={{ animation: "heroFadeIn 1s ease-out 0.9s both" }}
        >
          <button
            className="rounded-full px-8 py-3 text-sm font-semibold text-white transition-all duration-300 hover:scale-105 hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-offset-2"
            style={{
              background: "linear-gradient(135deg, #4a9eff, #00d4ff)",
              boxShadow: "0 0 24px rgba(74,158,255,0.35)",
            }}
            aria-label="무료로 시작하기"
          >
            무료로 시작하기
          </button>
          <button
            className="rounded-full px-8 py-3 text-sm font-semibold transition-all duration-300 hover:scale-105 focus:outline-none focus:ring-2 focus:ring-offset-2"
            style={{
              border: "1px solid rgba(74,158,255,0.4)",
              color: "#4a9eff",
              background: "rgba(74,158,255,0.06)",
            }}
            aria-label="데모 보기"
          >
            데모 보기
          </button>
        </div>
      </div>

      {/* ── 스크롤 다운 인디케이터 ──────────────────────── */}
      <div
        className="absolute bottom-8 left-1/2 z-10 -translate-x-1/2 flex flex-col items-center gap-2"
        style={{ animation: "heroFadeIn 1s ease-out 1.3s both" }}
        aria-label="아래로 스크롤"
      >
        <span className="text-xs tracking-widest uppercase" style={{ color: "#4a4a5a" }}>
          Scroll
        </span>
        {/* 애니메이션 화살표 */}
        <div className="relative flex flex-col items-center" aria-hidden="true">
          <svg
            width="16"
            height="24"
            viewBox="0 0 16 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            style={{ animation: "scrollBounce 1.8s ease-in-out infinite" }}
          >
            <path
              d="M8 2L8 18M8 18L3 13M8 18L13 13"
              stroke="#4a9eff"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>
      </div>

      {/* ── CSS 키프레임 ─────────────────────────────────── */}
      <style>{`
        @keyframes heroFadeIn {
          from {
            opacity: 0;
            transform: translateY(18px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes scrollBounce {
          0%, 100% {
            transform: translateY(0);
            opacity: 0.5;
          }
          50% {
            transform: translateY(6px);
            opacity: 1;
          }
        }
      `}</style>
    </section>
  );
}
