"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { PRODUCTS } from "@/lib/constants";

// 컨테이너 - 두 카드를 순차 등장시킴
const containerVariants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.2,
    },
  },
};

// 개별 카드 애니메이션
const cardVariants = {
  hidden: {
    opacity: 0,
    y: 40,
  },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.65,
      ease: "easeOut" as const,
    },
  },
};

// 섹션 헤더 애니메이션
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

export default function ProductsSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const isInView = useInView(sectionRef, { once: true, amount: 0.2 });

  return (
    <section
      id="products"
      ref={sectionRef}
      className="py-24 md:py-32"
      // WhySection과 약간 다른 배경으로 시각적 구분
      style={{ backgroundColor: "#0a0a10" }}
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
            Products
          </h2>
          <p className="text-base md:text-lg" style={{ color: "#8a8a9a" }}>
            비즈니스를 위한 AI 솔루션
          </p>
        </motion.div>

        {/* 제품 카드 그리드 - 모바일 1열, md 이상 2열 */}
        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 gap-8"
          variants={containerVariants}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
        >
          {PRODUCTS.map((product) => (
            <ProductCard key={product.name} product={product} />
          ))}
        </motion.div>
      </div>
    </section>
  );
}

// 개별 제품 카드 컴포넌트
interface ProductCardProps {
  product: {
    name: string;
    tagline: string;
    description: string;
  };
}

function ProductCard({ product }: ProductCardProps) {
  return (
    <motion.div
      variants={cardVariants}
      whileHover={{
        y: -6,
        transition: { duration: 0.22, ease: "easeOut" as const },
      }}
      className="group relative flex flex-col rounded-2xl p-8 overflow-hidden"
      style={{
        backgroundColor: "#0c0c14",
        border: "1px solid #1a1a2e",
        // hover 시 파란 글로우 - box-shadow 전환
        transition: "border-color 0.25s ease, box-shadow 0.25s ease",
      }}
      onMouseEnter={(e) => {
        const el = e.currentTarget as HTMLDivElement;
        el.style.borderColor = "rgba(74, 158, 255, 0.5)";
        el.style.boxShadow =
          "0 0 32px rgba(74, 158, 255, 0.12), 0 0 8px rgba(74, 158, 255, 0.08)";
      }}
      onMouseLeave={(e) => {
        const el = e.currentTarget as HTMLDivElement;
        el.style.borderColor = "#1a1a2e";
        el.style.boxShadow = "none";
      }}
    >
      {/* 배경 그라디언트 장식 - 카드 상단 왼쪽 */}
      <div
        className="absolute -top-16 -left-16 w-48 h-48 rounded-full pointer-events-none"
        style={{
          background:
            "radial-gradient(circle, rgba(0, 212, 255, 0.07) 0%, transparent 70%)",
        }}
      />

      {/* 제품 태그라인 - 작은 뱃지 스타일 */}
      <div className="mb-5 inline-flex w-fit">
        <span
          className="text-xs font-medium tracking-wider uppercase px-3 py-1 rounded-full"
          style={{
            background:
              "linear-gradient(90deg, rgba(74, 158, 255, 0.15), rgba(0, 212, 255, 0.15))",
            border: "1px solid rgba(74, 158, 255, 0.25)",
            color: "#00d4ff",
          }}
        >
          {product.tagline}
        </span>
      </div>

      {/* 제품 이름 - 크고 굵게 */}
      <h3
        className="text-3xl md:text-4xl font-bold mb-4"
        style={{ color: "#f0f0f0" }}
      >
        {product.name}
      </h3>

      {/* 제품 설명 */}
      <p
        className="text-sm md:text-base leading-relaxed flex-1"
        style={{ color: "#8a8a9a" }}
      >
        {product.description}
      </p>

      {/* 구분선 */}
      <div
        className="my-6 h-px"
        style={{
          background:
            "linear-gradient(90deg, rgba(74, 158, 255, 0.3), transparent)",
        }}
      />

      {/* Learn more 링크 */}
      <a
        href={`#${product.name.toLowerCase()}`}
        className="inline-flex items-center gap-2 text-sm font-medium group/link w-fit"
        style={{
          color: "#4a9eff",
          textDecoration: "none",
          transition: "color 0.2s ease",
        }}
        onMouseEnter={(e) => {
          (e.currentTarget as HTMLAnchorElement).style.color = "#00d4ff";
          (e.currentTarget as HTMLAnchorElement).style.textDecoration =
            "underline";
        }}
        onMouseLeave={(e) => {
          (e.currentTarget as HTMLAnchorElement).style.color = "#4a9eff";
          (e.currentTarget as HTMLAnchorElement).style.textDecoration = "none";
        }}
      >
        <span>Learn more</span>
        {/* 화살표 - hover 시 오른쪽으로 이동 */}
        <motion.span
          className="inline-block"
          initial={{ x: 0 }}
          whileHover={{ x: 4 }}
          transition={{ duration: 0.2, ease: "easeOut" as const }}
        >
          →
        </motion.span>
      </a>

      {/* hover 시 전체 글로우 레이어 */}
      <div
        className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse at top left, rgba(74, 158, 255, 0.05) 0%, transparent 70%)",
          transition: "opacity 0.3s ease",
        }}
      />
    </motion.div>
  );
}
