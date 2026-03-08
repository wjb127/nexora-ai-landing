"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import dynamic from "next/dynamic";
import Link from "next/link";
import { motion } from "framer-motion";
import StorySection from "@/components/demo/StorySection";
import MetricsSection from "@/components/demo/MetricsSection";

// ParticleScene은 Three.js → SSR 불가
const ParticleScene = dynamic(() => import("@/components/ParticleScene"), {
  ssr: false,
  loading: () => (
    <div className="w-full h-full flex items-center justify-center">
      <div
        className="w-16 h-16 rounded-full border-2 border-t-transparent animate-spin"
        style={{ borderColor: "rgba(74,158,255,0.3)", borderTopColor: "transparent" }}
      />
    </div>
  ),
});

// 스크롤 섹션 수 (각 섹션 = 100vh)
const SCROLL_SECTIONS = 4;

export default function DemoClient() {
  const [scrollProgress, setScrollProgress] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);

  // 스크롤 진행도 계산 (0 ~ SCROLL_SECTIONS)
  const handleScroll = useCallback(() => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const totalHeight = containerRef.current.scrollHeight - window.innerHeight;
    const scrolled = -rect.top;
    const progress = Math.max(0, Math.min(SCROLL_SECTIONS, (scrolled / totalHeight) * SCROLL_SECTIONS));
    setScrollProgress(progress);
  }, []);

  useEffect(() => {
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [handleScroll]);

  // 현재 모핑 상태 라벨
  const getPhaseLabel = (p: number) => {
    if (p < 1) return "Text Formation";
    if (p < 2) return "Sphere Morphing";
    if (p < 3) return "Data Scattering";
    return "Reformation";
  };

  const getPhaseDesc = (p: number) => {
    if (p < 1) return "파티클이 텍스트 형태를 유지합니다. 스크롤하여 변환을 시작하세요.";
    if (p < 2) return "데이터가 구조화되며 구체 형태로 조직화됩니다.";
    if (p < 3) return "분석된 데이터가 인사이트로 분산됩니다.";
    return "인사이트가 다시 결합하여 액션으로 변환됩니다.";
  };

  return (
    <main className="min-h-screen" style={{ backgroundColor: "#08080D" }}>
      {/* ── 파티클 인터랙션 영역 (고정 캔버스 + 스크롤 섹션) ── */}
      <div
        ref={containerRef}
        className="relative"
        style={{ height: `${(SCROLL_SECTIONS + 1) * 100}vh` }}
      >
        {/* 고정 캔버스 */}
        <div className="sticky top-0 w-full h-screen overflow-hidden">
          <ParticleScene scrollProgress={scrollProgress} />

          {/* 히어로 텍스트 오버레이 */}
          <div className="absolute inset-0 z-10 flex flex-col items-center justify-center px-4 text-center pointer-events-none">
            {/* 배지 */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.3 }}
              className="mb-6 inline-flex items-center gap-2 rounded-full border px-4 py-1.5 text-xs font-medium tracking-widest uppercase"
              style={{
                borderColor: "rgba(74,158,255,0.35)",
                background: "rgba(74,158,255,0.07)",
                color: "#4a9eff",
              }}
            >
              <span
                className="inline-block w-1.5 h-1.5 rounded-full animate-pulse"
                style={{ background: "#00d4ff" }}
              />
              GPGPU Particle System
            </motion.div>

            {/* 메인 타이틀 - 스크롤 시 페이드아웃 */}
            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.5 }}
              className="font-bold leading-tight tracking-tight transition-opacity duration-500"
              style={{
                fontSize: "clamp(1.8rem, 5vw, 3.5rem)",
                background:
                  "linear-gradient(135deg, #ffffff 30%, #4a9eff 65%, #00d4ff 100%)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
                opacity: Math.max(0, 1 - scrollProgress * 1.5),
              }}
            >
              AI Data Processing
              <br />
              Visualized
            </motion.h1>

            {/* 스크롤 인디케이터 */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.2 }}
              className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
              style={{ opacity: Math.max(0, 1 - scrollProgress * 3) }}
            >
              <span className="text-xs tracking-widest uppercase" style={{ color: "#4a4a5a" }}>
                Scroll to morph
              </span>
              <svg
                width="16"
                height="24"
                viewBox="0 0 16 24"
                fill="none"
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
            </motion.div>

            {/* 진행 상태 HUD (스크롤 시 표시) */}
            <div
              className="absolute bottom-8 left-6 right-6 flex items-end justify-between transition-opacity duration-300"
              style={{ opacity: scrollProgress > 0.3 ? 1 : 0 }}
            >
              {/* 페이즈 라벨 */}
              <div className="text-left">
                <div
                  className="text-xs font-mono tracking-wider mb-1"
                  style={{ color: "#4a9eff" }}
                >
                  Phase {Math.min(4, Math.floor(scrollProgress) + 1)} / 4
                </div>
                <div className="text-sm font-semibold" style={{ color: "#f0f0f0" }}>
                  {getPhaseLabel(scrollProgress)}
                </div>
                <div className="text-xs mt-1 max-w-xs" style={{ color: "#8a8a9a" }}>
                  {getPhaseDesc(scrollProgress)}
                </div>
              </div>

              {/* 프로그레스 바 */}
              <div className="hidden md:flex flex-col items-end gap-1">
                <div className="text-xs font-mono" style={{ color: "#4a9eff" }}>
                  {Math.round((scrollProgress / SCROLL_SECTIONS) * 100)}%
                </div>
                <div
                  className="w-32 h-1 rounded-full overflow-hidden"
                  style={{ backgroundColor: "rgba(74,158,255,0.15)" }}
                >
                  <div
                    className="h-full rounded-full transition-all duration-200"
                    style={{
                      width: `${(scrollProgress / SCROLL_SECTIONS) * 100}%`,
                      background: "linear-gradient(90deg, #4a9eff, #00d4ff)",
                    }}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ── Story 섹션 ──────────────────────────────────────── */}
      <StorySection />

      {/* ── Metrics 섹션 ────────────────────────────────────── */}
      <MetricsSection />

      {/* ── CTA 섹션 ──────────────────────────────────────── */}
      <section className="py-24 md:py-32" style={{ backgroundColor: "#08080D" }}>
        <div className="max-w-4xl mx-auto px-6 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.7, ease: "easeOut" as const }}
          >
            <h2
              className="text-3xl md:text-5xl font-bold mb-6"
              style={{
                background:
                  "linear-gradient(135deg, #ffffff 30%, #4a9eff 65%, #00d4ff 100%)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
              }}
            >
              Experience the Power
              <br />
              of AI Analytics
            </h2>
            <p
              className="text-base md:text-lg mb-10 max-w-xl mx-auto"
              style={{ color: "#8a8a9a" }}
            >
              지금 바로 Nexora의 AI 분석 플랫폼을 체험해보세요.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/#contact"
                className="inline-block rounded-full px-10 py-4 text-sm font-semibold text-white transition-all duration-300 hover:scale-105 hover:shadow-lg"
                style={{
                  background: "linear-gradient(135deg, #4a9eff, #00d4ff)",
                  boxShadow: "0 0 24px rgba(74,158,255,0.35)",
                }}
              >
                무료로 시작하기
              </Link>
              <Link
                href="/about"
                className="inline-block rounded-full px-10 py-4 text-sm font-semibold transition-all duration-300 hover:scale-105"
                style={{
                  border: "1px solid rgba(74,158,255,0.4)",
                  color: "#4a9eff",
                  background: "rgba(74,158,255,0.06)",
                }}
              >
                About Nexora
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* CSS 키프레임 */}
      <style>{`
        @keyframes scrollBounce {
          0%, 100% { transform: translateY(0); opacity: 0.5; }
          50% { transform: translateY(6px); opacity: 1; }
        }
      `}</style>
    </main>
  );
}
