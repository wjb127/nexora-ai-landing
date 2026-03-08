"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { TIMELINE } from "@/lib/constants";

const itemVariants = {
  hidden: { opacity: 0, x: -30 },
  visible: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.6, ease: "easeOut" as const },
  },
};

export default function TimelineSection() {
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.15 });

  return (
    <section ref={ref} className="py-24 md:py-32" style={{ backgroundColor: "#08080D" }}>
      <div className="max-w-4xl mx-auto px-6">
        {/* 섹션 헤더 */}
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 24 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7, ease: "easeOut" as const }}
        >
          <h2
            className="text-3xl md:text-5xl font-bold mb-4"
            style={{
              background: "linear-gradient(90deg, #4a9eff 0%, #00d4ff 100%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
            }}
          >
            Our Journey
          </h2>
          <p className="text-base md:text-lg max-w-2xl mx-auto" style={{ color: "#8a8a9a" }}>
            혁신의 시작부터 글로벌 리더까지, Nexora의 여정입니다.
          </p>
        </motion.div>

        {/* 타임라인 */}
        <div className="relative">
          {/* 세로선 */}
          <div
            className="absolute left-4 md:left-1/2 top-0 bottom-0 w-px md:-translate-x-px"
            style={{ backgroundColor: "#1a1a2e" }}
          />

          {TIMELINE.map((item, i) => (
            <motion.div
              key={item.year}
              variants={itemVariants}
              initial="hidden"
              animate={inView ? "visible" : "hidden"}
              transition={{ delay: i * 0.12 }}
              className={`relative flex items-start mb-12 last:mb-0 ${
                i % 2 === 0
                  ? "md:flex-row"
                  : "md:flex-row-reverse"
              }`}
            >
              {/* 도트 (세로선 위) */}
              <div
                className="absolute left-4 md:left-1/2 w-3 h-3 rounded-full -translate-x-1.5 mt-1.5 z-10"
                style={{
                  background: "linear-gradient(135deg, #4a9eff, #00d4ff)",
                  boxShadow: "0 0 12px rgba(74, 158, 255, 0.5)",
                }}
              />

              {/* 카드 */}
              <div
                className={`ml-12 md:ml-0 md:w-[calc(50%-2rem)] ${
                  i % 2 === 0 ? "md:pr-8 md:text-right" : "md:pl-8 md:text-left"
                }`}
              >
                {/* 연도 */}
                <span
                  className="inline-block text-sm font-mono font-bold mb-2 px-3 py-1 rounded-full"
                  style={{
                    backgroundColor: "rgba(74, 158, 255, 0.1)",
                    color: "#4a9eff",
                    border: "1px solid rgba(74, 158, 255, 0.2)",
                  }}
                >
                  {item.year}
                </span>

                {/* 제목 */}
                <h3 className="text-xl font-semibold mb-2" style={{ color: "#f0f0f0" }}>
                  {item.title}
                </h3>

                {/* 설명 */}
                <p className="text-sm leading-relaxed" style={{ color: "#8a8a9a" }}>
                  {item.description}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
