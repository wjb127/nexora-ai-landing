"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { WHY_CARDS } from "@/lib/constants";

// 컨테이너 애니메이션 - 자식 카드들을 순차적으로 등장시킴
const containerVariants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.15,
    },
  },
};

// 개별 카드 애니메이션 - 아래에서 페이드 업
const cardVariants = {
  hidden: {
    opacity: 0,
    y: 40,
  },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
      ease: "easeOut" as const,
    },
  },
};

// 섹션 타이틀 애니메이션
const titleVariants = {
  hidden: { opacity: 0, y: 24 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.7,
      ease: "easeOut" as const,
    },
  },
};

export default function WhySection() {
  const sectionRef = useRef<HTMLElement>(null);
  // once: true - 한 번만 트리거, amount: 0.2 - 20% 노출 시 시작
  const isInView = useInView(sectionRef, { once: true, amount: 0.2 });

  return (
    <section
      id="why"
      ref={sectionRef}
      className="py-24 md:py-32"
      style={{ backgroundColor: "#08080D" }}
    >
      <div className="max-w-6xl mx-auto px-6">
        {/* 섹션 헤더 */}
        <motion.div
          className="text-center mb-16"
          variants={titleVariants}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
        >
          <h2
            className="text-4xl md:text-5xl font-bold mb-4"
            style={{
              background: "linear-gradient(90deg, #4a9eff 0%, #00d4ff 100%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
            }}
          >
            Why Nexora
          </h2>
          <p className="text-base md:text-lg" style={{ color: "#8a8a9a" }}>
            더 빠르고, 더 안전하고, 더 스마트하게
          </p>
        </motion.div>

        {/* 2x2 카드 그리드 */}
        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 gap-6"
          variants={containerVariants}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
        >
          {WHY_CARDS.map((card) => (
            <WhyCard key={card.title} card={card} />
          ))}
        </motion.div>
      </div>
    </section>
  );
}

// 개별 카드 컴포넌트 - hover 상태를 인라인 스타일로 처리
interface WhyCardProps {
  card: {
    icon: string;
    title: string;
    description: string;
  };
}

function WhyCard({ card }: WhyCardProps) {
  return (
    <motion.div
      variants={cardVariants}
      whileHover={{
        scale: 1.02,
        y: -4,
        // hover 시 border 색상 변경은 CSS 변수 대신 box-shadow로 처리
        transition: { duration: 0.2, ease: "easeOut" as const },
      }}
      className="group relative rounded-2xl p-8 cursor-default"
      style={{
        backgroundColor: "#0c0c14",
        border: "1px solid #1a1a2e",
        transition: "border-color 0.25s ease",
      }}
      // hover 시 border 색상 전환 (인라인 스타일 직접 제어 불가하여 CSS 변수 활용)
      onMouseEnter={(e) => {
        (e.currentTarget as HTMLDivElement).style.borderColor = "#4a9eff";
      }}
      onMouseLeave={(e) => {
        (e.currentTarget as HTMLDivElement).style.borderColor = "#1a1a2e";
      }}
    >
      {/* 아이콘 */}
      <div
        className="w-14 h-14 rounded-xl flex items-center justify-center text-2xl mb-6"
        style={{
          backgroundColor: "rgba(74, 158, 255, 0.1)",
          border: "1px solid rgba(74, 158, 255, 0.2)",
        }}
      >
        {card.icon}
      </div>

      {/* 카드 제목 */}
      <h3 className="text-xl font-semibold mb-3" style={{ color: "#f0f0f0" }}>
        {card.title}
      </h3>

      {/* 카드 설명 */}
      <p className="text-sm leading-relaxed" style={{ color: "#8a8a9a" }}>
        {card.description}
      </p>

      {/* hover 시 미묘한 파란 글로우 효과 (절대 위치 레이어) */}
      <div
        className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse at top left, rgba(74, 158, 255, 0.06) 0%, transparent 60%)",
          transition: "opacity 0.3s ease",
        }}
      />
    </motion.div>
  );
}
