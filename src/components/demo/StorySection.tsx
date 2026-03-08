"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { DEMO_STORIES } from "@/lib/constants";

const itemVariants = {
  hidden: { opacity: 0, x: -40 },
  visible: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.6, ease: "easeOut" as const },
  },
};

export default function StorySection() {
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.15 });

  return (
    <section ref={ref} className="py-24 md:py-32" style={{ backgroundColor: "#08080D" }}>
      <div className="max-w-5xl mx-auto px-6">
        {/* 섹션 헤더 */}
        <motion.div
          className="text-center mb-20"
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
            How It Works
          </h2>
          <p className="text-base md:text-lg max-w-2xl mx-auto" style={{ color: "#8a8a9a" }}>
            데이터가 AI를 통해 인사이트로 변환되는 과정을 직접 확인하세요.
          </p>
        </motion.div>

        {/* 스토리 카드 */}
        <div className="space-y-8">
          {DEMO_STORIES.map((story, i) => (
            <motion.div
              key={story.phase}
              variants={itemVariants}
              initial="hidden"
              animate={inView ? "visible" : "hidden"}
              transition={{ delay: i * 0.15 }}
              className="group relative flex flex-col md:flex-row items-start gap-6 md:gap-10 rounded-2xl p-8 md:p-10"
              style={{
                backgroundColor: "#0c0c14",
                border: "1px solid #1a1a2e",
                transition: "border-color 0.25s ease",
              }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLDivElement).style.borderColor = "#4a9eff";
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLDivElement).style.borderColor = "#1a1a2e";
              }}
            >
              {/* 페이즈 넘버 */}
              <div
                className="shrink-0 w-16 h-16 rounded-2xl flex items-center justify-center text-2xl font-bold font-mono"
                style={{
                  background: "linear-gradient(135deg, rgba(74,158,255,0.15), rgba(0,212,255,0.1))",
                  border: "1px solid rgba(74,158,255,0.25)",
                  color: "#4a9eff",
                }}
              >
                {story.phase}
              </div>

              {/* 콘텐츠 */}
              <div className="flex-1">
                <h3 className="text-xl md:text-2xl font-semibold mb-3" style={{ color: "#f0f0f0" }}>
                  {story.title}
                </h3>
                <p className="text-sm md:text-base leading-relaxed mb-4" style={{ color: "#8a8a9a" }}>
                  {story.description}
                </p>
                <div
                  className="inline-flex items-center gap-2 text-xs font-mono px-3 py-1.5 rounded-full"
                  style={{
                    backgroundColor: "rgba(0, 212, 255, 0.08)",
                    border: "1px solid rgba(0, 212, 255, 0.2)",
                    color: "#00d4ff",
                  }}
                >
                  <span
                    className="w-1.5 h-1.5 rounded-full"
                    style={{ backgroundColor: "#00d4ff" }}
                  />
                  {story.detail}
                </div>
              </div>

              {/* hover 글로우 */}
              <div
                className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 pointer-events-none"
                style={{
                  background:
                    "radial-gradient(ellipse at left center, rgba(74,158,255,0.05) 0%, transparent 60%)",
                  transition: "opacity 0.3s ease",
                }}
              />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
