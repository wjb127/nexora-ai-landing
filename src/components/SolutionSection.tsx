"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { SOLUTION_FEATURES } from "@/lib/constants";

// 플로우 다이어그램 단계 데이터
const FLOW_STEPS = [
  { number: "01", label: "데이터 수집" },
  { number: "02", label: "AI 분석" },
  { number: "03", label: "인사이트" },
  { number: "04", label: "자동 실행" },
] as const;

// 애니메이션 변수 (컨테이너)
const containerVariants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.15,
    },
  },
};

// 애니메이션 변수 (개별 아이템 - 위에서 아래로)
const itemVariants = {
  hidden: { opacity: 0, y: 32 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
      ease: "easeOut" as const,
    },
  },
};

// 플로우 스텝 애니메이션 변수
const stepVariants = {
  hidden: { opacity: 0, scale: 0.8 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: {
      duration: 0.5,
      ease: "easeOut" as const,
    },
  },
};

// 커넥터 선 애니메이션 변수
const connectorVariants = {
  hidden: { scaleX: 0, opacity: 0 },
  visible: {
    scaleX: 1,
    opacity: 1,
    transition: {
      duration: 0.4,
      ease: "easeOut" as const,
      delay: 0.2,
    },
  },
};

// 모바일 세로 커넥터 애니메이션
const connectorYVariants = {
  hidden: { scaleY: 0, opacity: 0 },
  visible: {
    scaleY: 1,
    opacity: 1,
    transition: {
      duration: 0.4,
      ease: "easeOut" as const,
      delay: 0.2,
    },
  },
};

export default function SolutionSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const isInView = useInView(sectionRef, { once: true, margin: "-100px" });

  return (
    <section
      id="solution"
      ref={sectionRef}
      className="py-24 md:py-32"
      style={{ backgroundColor: "#0c0c14" }}
    >
      <div className="max-w-6xl mx-auto px-6">
        {/* 섹션 헤더 */}
        <motion.div
          className="text-center mb-16 md:mb-20"
          initial={{ opacity: 0, y: 24 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 24 }}
          transition={{ duration: 0.7, ease: "easeOut" as const }}
        >
          <h2 className="text-3xl md:text-5xl font-bold mb-4">
            <span
              className="bg-gradient-to-r from-[#4a9eff] to-[#00d4ff] bg-clip-text text-transparent"
            >
              How NexFlow Works
            </span>
          </h2>
          <p className="text-[#8a8a9a] text-base md:text-lg mt-4">
            데이터에서 액션까지, AI가 모든 과정을 자동화합니다.
          </p>
        </motion.div>

        {/* 플로우 다이어그램 */}
        <motion.div
          className="mb-20 md:mb-24"
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
          variants={containerVariants}
        >
          {/* 데스크탑: 가로 배치 */}
          <div className="hidden md:flex items-center justify-center gap-0">
            {FLOW_STEPS.map((step, index) => (
              <div key={step.number} className="flex items-center">
                {/* 스텝 박스 */}
                <motion.div
                  variants={stepVariants}
                  className="flex flex-col items-center gap-2"
                >
                  {/* 번호 원 */}
                  <div
                    className="w-16 h-16 rounded-full flex items-center justify-center font-bold text-sm relative"
                    style={{
                      background:
                        "linear-gradient(135deg, rgba(74,158,255,0.15), rgba(0,212,255,0.15))",
                      border: "1.5px solid rgba(74,158,255,0.4)",
                    }}
                  >
                    {/* 내부 글로우 */}
                    <div
                      className="absolute inset-0 rounded-full opacity-30"
                      style={{
                        background:
                          "radial-gradient(circle, rgba(74,158,255,0.4) 0%, transparent 70%)",
                      }}
                    />
                    <span
                      className="relative z-10 bg-gradient-to-r from-[#4a9eff] to-[#00d4ff] bg-clip-text text-transparent font-bold"
                    >
                      {step.number}
                    </span>
                  </div>
                  {/* 스텝 라벨 */}
                  <span className="text-white text-sm font-medium whitespace-nowrap">
                    {step.label}
                  </span>
                </motion.div>

                {/* 커넥터 (마지막 아이템 제외) */}
                {index < FLOW_STEPS.length - 1 && (
                  <motion.div
                    variants={connectorVariants}
                    className="flex items-center mx-3"
                    style={{ originX: 0 }}
                  >
                    {/* 점선 + 화살표 */}
                    <div className="flex items-center gap-0">
                      <svg
                        width="80"
                        height="16"
                        viewBox="0 0 80 16"
                        fill="none"
                        className="opacity-60"
                      >
                        {/* 점선 */}
                        <line
                          x1="0"
                          y1="8"
                          x2="66"
                          y2="8"
                          stroke="url(#arrowGrad)"
                          strokeWidth="1.5"
                          strokeDasharray="4 3"
                        />
                        {/* 화살표 머리 */}
                        <polyline
                          points="60,3 70,8 60,13"
                          stroke="url(#arrowGrad)"
                          strokeWidth="1.5"
                          fill="none"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                        <defs>
                          <linearGradient
                            id="arrowGrad"
                            x1="0"
                            y1="0"
                            x2="80"
                            y2="0"
                            gradientUnits="userSpaceOnUse"
                          >
                            <stop offset="0%" stopColor="#4a9eff" />
                            <stop offset="100%" stopColor="#00d4ff" />
                          </linearGradient>
                        </defs>
                      </svg>
                    </div>
                  </motion.div>
                )}
              </div>
            ))}
          </div>

          {/* 모바일: 세로 배치 */}
          <div className="flex md:hidden flex-col items-center gap-0">
            {FLOW_STEPS.map((step, index) => (
              <div key={step.number} className="flex flex-col items-center">
                {/* 스텝 박스 */}
                <motion.div
                  variants={stepVariants}
                  className="flex items-center gap-4"
                >
                  {/* 번호 원 */}
                  <div
                    className="w-14 h-14 rounded-full flex items-center justify-center font-bold text-sm relative flex-shrink-0"
                    style={{
                      background:
                        "linear-gradient(135deg, rgba(74,158,255,0.15), rgba(0,212,255,0.15))",
                      border: "1.5px solid rgba(74,158,255,0.4)",
                    }}
                  >
                    <div
                      className="absolute inset-0 rounded-full opacity-30"
                      style={{
                        background:
                          "radial-gradient(circle, rgba(74,158,255,0.4) 0%, transparent 70%)",
                      }}
                    />
                    <span className="relative z-10 bg-gradient-to-r from-[#4a9eff] to-[#00d4ff] bg-clip-text text-transparent font-bold">
                      {step.number}
                    </span>
                  </div>
                  {/* 스텝 라벨 */}
                  <span className="text-white text-base font-medium">
                    {step.label}
                  </span>
                </motion.div>

                {/* 세로 커넥터 (마지막 아이템 제외) */}
                {index < FLOW_STEPS.length - 1 && (
                  <motion.div
                    variants={connectorYVariants}
                    className="flex flex-col items-center my-1"
                    style={{ originY: 0 }}
                  >
                    <svg
                      width="16"
                      height="48"
                      viewBox="0 0 16 48"
                      fill="none"
                      className="opacity-60"
                    >
                      <line
                        x1="8"
                        y1="0"
                        x2="8"
                        y2="36"
                        stroke="url(#arrowGradY)"
                        strokeWidth="1.5"
                        strokeDasharray="4 3"
                      />
                      <polyline
                        points="3,30 8,42 13,30"
                        stroke="url(#arrowGradY)"
                        strokeWidth="1.5"
                        fill="none"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                      <defs>
                        <linearGradient
                          id="arrowGradY"
                          x1="0"
                          y1="0"
                          x2="0"
                          y2="48"
                          gradientUnits="userSpaceOnUse"
                        >
                          <stop offset="0%" stopColor="#4a9eff" />
                          <stop offset="100%" stopColor="#00d4ff" />
                        </linearGradient>
                      </defs>
                    </svg>
                  </motion.div>
                )}
              </div>
            ))}
          </div>
        </motion.div>

        {/* 피처 리스트 */}
        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-10"
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
          variants={containerVariants}
        >
          {SOLUTION_FEATURES.map((feature) => (
            <motion.div
              key={feature.number}
              variants={itemVariants}
              className="flex items-start gap-5 group"
            >
              {/* 번호 (크게, 그라디언트) */}
              <span
                className="text-5xl md:text-6xl font-black leading-none bg-gradient-to-b from-[#4a9eff] to-[#00d4ff] bg-clip-text text-transparent flex-shrink-0 select-none"
                aria-hidden="true"
              >
                {feature.number}
              </span>

              {/* 텍스트 */}
              <div className="pt-2">
                <h3 className="text-white font-bold text-lg md:text-xl mb-2 group-hover:text-[#4a9eff] transition-colors duration-300">
                  {feature.title}
                </h3>
                <p className="text-[#8a8a9a] text-sm md:text-base leading-relaxed">
                  {feature.description}
                </p>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
