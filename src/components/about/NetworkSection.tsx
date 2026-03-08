"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { ABOUT_STATS } from "@/lib/constants";

const containerVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.12 } },
};

const itemVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: "easeOut" as const },
  },
};

export default function NetworkSection() {
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.3 });

  return (
    <section ref={ref} className="py-24 md:py-32" style={{ backgroundColor: "#08080D" }}>
      <div className="max-w-6xl mx-auto px-6">
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
            Global Network
          </h2>
          <p className="text-base md:text-lg max-w-2xl mx-auto" style={{ color: "#8a8a9a" }}>
            전 세계에 분산된 인프라로 어디서든 빠르고 안정적인 AI 서비스를 제공합니다.
          </p>
        </motion.div>

        {/* 수치 카드 그리드 */}
        <motion.div
          className="grid grid-cols-2 lg:grid-cols-4 gap-6"
          variants={containerVariants}
          initial="hidden"
          animate={inView ? "visible" : "hidden"}
        >
          {ABOUT_STATS.map((stat) => (
            <motion.div
              key={stat.label}
              variants={itemVariants}
              className="relative rounded-2xl p-8 text-center group"
              style={{
                backgroundColor: "#0c0c14",
                border: "1px solid #1a1a2e",
              }}
              whileHover={{ scale: 1.03, borderColor: "#4a9eff" }}
            >
              <div
                className="text-4xl md:text-5xl font-bold mb-2"
                style={{
                  background: "linear-gradient(135deg, #4a9eff, #00d4ff)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  backgroundClip: "text",
                }}
              >
                {stat.value}
                <span className="text-2xl md:text-3xl">{stat.suffix}</span>
              </div>
              <div className="text-sm font-medium tracking-wide" style={{ color: "#8a8a9a" }}>
                {stat.label}
              </div>

              {/* hover 글로우 */}
              <div
                className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 pointer-events-none"
                style={{
                  background:
                    "radial-gradient(ellipse at center, rgba(74, 158, 255, 0.06) 0%, transparent 60%)",
                  transition: "opacity 0.3s ease",
                }}
              />
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
