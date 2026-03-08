"use client";

import dynamic from "next/dynamic";
import Link from "next/link";
import { motion } from "framer-motion";
import NetworkSection from "@/components/about/NetworkSection";
import TeamSection from "@/components/about/TeamSection";
import TimelineSection from "@/components/about/TimelineSection";

// GlobeScene은 Three.js 사용으로 SSR 불가 → dynamic import
const GlobeScene = dynamic(() => import("@/components/GlobeScene"), {
  ssr: false,
  loading: () => (
    <div className="absolute inset-0 flex items-center justify-center">
      <div
        className="w-16 h-16 rounded-full border-2 border-t-transparent animate-spin"
        style={{ borderColor: "rgba(74,158,255,0.3)", borderTopColor: "transparent" }}
      />
    </div>
  ),
});

export default function AboutClient() {
  return (
    <main className="min-h-screen" style={{ backgroundColor: "#08080D" }}>
      {/* ── 히어로: 전체 화면 3D 지구본 ─────────────────── */}
      <section className="relative w-full" style={{ height: "100vh" }}>
        <GlobeScene />

        {/* 텍스트 오버레이 */}
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
            Global Infrastructure
          </motion.div>

          {/* 메인 타이틀 */}
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.5 }}
            className="font-bold leading-tight tracking-tight"
            style={{
              fontSize: "clamp(2rem, 7vw, 5rem)",
              background:
                "linear-gradient(135deg, #ffffff 30%, #4a9eff 65%, #00d4ff 100%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
            }}
          >
            Global AI
            <br />
            Infrastructure
          </motion.h1>

          {/* 서브텍스트 */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.7 }}
            className="mt-6 max-w-lg text-base md:text-xl leading-relaxed"
            style={{ color: "#8a8a9a" }}
          >
            전 세계 47개국을 연결하는
            <br className="sm:hidden" />
            {" "}차세대 AI 인프라 네트워크
          </motion.p>
        </div>

        {/* 하단 그라데이션 페이드 */}
        <div
          className="absolute bottom-0 left-0 right-0 h-32 z-10 pointer-events-none"
          style={{
            background: "linear-gradient(to top, #08080D, transparent)",
          }}
        />
      </section>

      {/* ── Network 섹션 ──────────────────────────────────── */}
      <NetworkSection />

      {/* ── Team 섹션 ─────────────────────────────────────── */}
      <TeamSection />

      {/* ── Timeline 섹션 ─────────────────────────────────── */}
      <TimelineSection />

      {/* ── CTA 섹션 ──────────────────────────────────────── */}
      <section className="py-24 md:py-32" style={{ backgroundColor: "#0c0c14" }}>
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
              Ready to Transform
              <br />
              Your Business?
            </h2>
            <p className="text-base md:text-lg mb-10 max-w-xl mx-auto" style={{ color: "#8a8a9a" }}>
              Nexora의 AI 인프라로 비즈니스의 새로운 가능성을 열어보세요.
            </p>
            <Link
              href="/#contact"
              className="inline-block rounded-full px-10 py-4 text-sm font-semibold text-white transition-all duration-300 hover:scale-105 hover:shadow-lg pointer-events-auto"
              style={{
                background: "linear-gradient(135deg, #4a9eff, #00d4ff)",
                boxShadow: "0 0 24px rgba(74,158,255,0.35)",
              }}
            >
              문의하기
            </Link>
          </motion.div>
        </div>
      </section>
    </main>
  );
}
