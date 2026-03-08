"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { DEMO_METRICS } from "@/lib/constants";

const containerVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.1 } },
};

const itemVariants = {
  hidden: { opacity: 0, scale: 0.8 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: { duration: 0.5, ease: "easeOut" as const },
  },
};

export default function MetricsSection() {
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.3 });

  return (
    <section ref={ref} className="py-20 md:py-28" style={{ backgroundColor: "#0c0c14" }}>
      <div className="max-w-5xl mx-auto px-6">
        <motion.div
          className="text-center mb-12"
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-2xl md:text-3xl font-bold mb-3" style={{ color: "#f0f0f0" }}>
            Real-Time Performance
          </h2>
          <p className="text-sm md:text-base" style={{ color: "#8a8a9a" }}>
            이 데모는 실시간으로 GPU에서 렌더링되고 있습니다.
          </p>
        </motion.div>

        <motion.div
          className="grid grid-cols-2 lg:grid-cols-4 gap-4"
          variants={containerVariants}
          initial="hidden"
          animate={inView ? "visible" : "hidden"}
        >
          {DEMO_METRICS.map((metric) => (
            <motion.div
              key={metric.label}
              variants={itemVariants}
              className="relative rounded-xl p-6 text-center"
              style={{
                backgroundColor: "#08080D",
                border: "1px solid #1a1a2e",
              }}
            >
              <div
                className="text-3xl md:text-4xl font-bold font-mono mb-1"
                style={{
                  background: "linear-gradient(135deg, #4a9eff, #00d4ff)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  backgroundClip: "text",
                }}
              >
                {metric.value}
                {metric.suffix && (
                  <span className="text-xl">{metric.suffix}</span>
                )}
              </div>
              <div className="text-xs font-medium tracking-wide" style={{ color: "#8a8a9a" }}>
                {metric.label}
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
