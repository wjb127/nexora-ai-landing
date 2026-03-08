"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";

// 이메일 주소
const CONTACT_EMAIL = "contact@nexora.ai";

export default function ContactSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const isInView = useInView(sectionRef, { once: true, margin: "-80px" });

  return (
    <section
      id="contact"
      ref={sectionRef}
      className="py-24 md:py-32 relative overflow-hidden"
      style={{ backgroundColor: "#08080D" }}
    >
      {/* 배경 데코레이션: 방사형 글로우 */}
      <div
        className="absolute inset-0 pointer-events-none"
        aria-hidden="true"
      >
        {/* 중앙 메인 글로우 */}
        <div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full opacity-10"
          style={{
            background:
              "radial-gradient(circle, #4a9eff 0%, #00d4ff 30%, transparent 70%)",
          }}
        />
        {/* 상단 좌측 보조 글로우 */}
        <div
          className="absolute -top-20 -left-20 w-[300px] h-[300px] rounded-full opacity-5"
          style={{
            background:
              "radial-gradient(circle, #00d4ff 0%, transparent 70%)",
          }}
        />
        {/* 하단 우측 보조 글로우 */}
        <div
          className="absolute -bottom-20 -right-20 w-[300px] h-[300px] rounded-full opacity-5"
          style={{
            background:
              "radial-gradient(circle, #4a9eff 0%, transparent 70%)",
          }}
        />
      </div>

      {/* 컨텐츠 */}
      <div className="relative z-10 max-w-4xl mx-auto px-6 text-center">
        {/* 작은 태그라인 */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 16 }}
          transition={{ duration: 0.5, ease: "easeOut" as const }}
          className="mb-6"
        >
          <span
            className="inline-block text-xs md:text-sm font-semibold tracking-widest uppercase px-4 py-1.5 rounded-full"
            style={{
              color: "#4a9eff",
              border: "1px solid rgba(74,158,255,0.3)",
              backgroundColor: "rgba(74,158,255,0.08)",
            }}
          >
            Get Started
          </span>
        </motion.div>

        {/* 메인 CTA 텍스트 */}
        <motion.h2
          initial={{ opacity: 0, y: 24 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 24 }}
          transition={{ duration: 0.7, delay: 0.1, ease: "easeOut" as const }}
          className="text-3xl md:text-5xl lg:text-6xl font-black leading-tight mb-6"
        >
          <span className="bg-gradient-to-r from-[#4a9eff] via-[#00d4ff] to-[#4a9eff] bg-clip-text text-transparent">
            Ready to Transform
          </span>
          <br />
          <span className="bg-gradient-to-r from-[#00d4ff] to-[#4a9eff] bg-clip-text text-transparent">
            Your Business?
          </span>
        </motion.h2>

        {/* 서브텍스트 */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.6, delay: 0.2, ease: "easeOut" as const }}
          className="text-[#8a8a9a] text-base md:text-lg mb-10 leading-relaxed"
        >
          AI의 힘으로 비즈니스를 혁신하세요.
        </motion.p>

        {/* CTA 버튼 */}
        <motion.div
          initial={{ opacity: 0, y: 20, scale: 0.95 }}
          animate={
            isInView
              ? { opacity: 1, y: 0, scale: 1 }
              : { opacity: 0, y: 20, scale: 0.95 }
          }
          transition={{ duration: 0.6, delay: 0.3, ease: "easeOut" as const }}
        >
          <a
            href={`mailto:${CONTACT_EMAIL}`}
            className="relative inline-flex items-center gap-2 px-8 py-4 rounded-full font-semibold text-base md:text-lg text-white transition-all duration-300 hover:scale-105 hover:shadow-[0_0_30px_rgba(74,158,255,0.4)] group"
            style={{
              background:
                "linear-gradient(135deg, rgba(74,158,255,0.15), rgba(0,212,255,0.15))",
              border: "1.5px solid transparent",
              backgroundClip: "padding-box",
            }}
            aria-label={`${CONTACT_EMAIL}으로 이메일 보내기`}
          >
            {/* 그라디언트 보더 레이어 */}
            <span
              className="absolute inset-0 rounded-full -z-10"
              style={{
                background:
                  "linear-gradient(135deg, #4a9eff, #00d4ff)",
                padding: "1.5px",
                WebkitMask:
                  "linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)",
                WebkitMaskComposite: "xor",
                maskComposite: "exclude",
              }}
            />
            {/* 버튼 내부 배경 */}
            <span
              className="absolute inset-[1.5px] rounded-full -z-10 transition-opacity duration-300 group-hover:opacity-80"
              style={{
                background:
                  "linear-gradient(135deg, rgba(74,158,255,0.12), rgba(0,212,255,0.12))",
              }}
            />

            {/* 텍스트 */}
            <span>Get in Touch</span>

            {/* 화살표 아이콘 */}
            <svg
              width="18"
              height="18"
              viewBox="0 0 18 18"
              fill="none"
              aria-hidden="true"
              className="transition-transform duration-300 group-hover:translate-x-1"
            >
              <path
                d="M3.75 9H14.25M14.25 9L9.75 4.5M14.25 9L9.75 13.5"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </a>
        </motion.div>

        {/* 이메일 주소 표시 */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : { opacity: 0 }}
          transition={{ duration: 0.6, delay: 0.45, ease: "easeOut" as const }}
          className="mt-5 text-sm text-[#8a8a9a]"
        >
          {CONTACT_EMAIL}
        </motion.p>
      </div>
    </section>
  );
}
