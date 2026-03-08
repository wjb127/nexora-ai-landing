"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { TEAM_MEMBERS } from "@/lib/constants";

const containerVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.15 } },
};

const cardVariants = {
  hidden: { opacity: 0, y: 40 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: "easeOut" as const },
  },
};

export default function TeamSection() {
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.2 });

  return (
    <section
      ref={ref}
      className="py-24 md:py-32"
      style={{ backgroundColor: "#0c0c14" }}
    >
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
            Leadership Team
          </h2>
          <p className="text-base md:text-lg max-w-2xl mx-auto" style={{ color: "#8a8a9a" }}>
            세계적인 AI 전문가들이 Nexora를 이끌고 있습니다.
          </p>
        </motion.div>

        {/* 팀원 카드 그리드 */}
        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
          variants={containerVariants}
          initial="hidden"
          animate={inView ? "visible" : "hidden"}
        >
          {TEAM_MEMBERS.map((member) => (
            <motion.div
              key={member.name}
              variants={cardVariants}
              className="group relative rounded-2xl p-8 text-center"
              style={{
                backgroundColor: "#08080D",
                border: "1px solid #1a1a2e",
                transition: "border-color 0.25s ease",
              }}
              whileHover={{
                y: -6,
                transition: { duration: 0.25, ease: "easeOut" as const },
              }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLDivElement).style.borderColor = "#4a9eff";
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLDivElement).style.borderColor = "#1a1a2e";
              }}
            >
              {/* 아바타 */}
              <div
                className="w-20 h-20 rounded-full mx-auto mb-5 flex items-center justify-center text-2xl font-bold"
                style={{
                  background: "linear-gradient(135deg, rgba(74,158,255,0.2), rgba(0,212,255,0.15))",
                  border: "2px solid rgba(74,158,255,0.3)",
                  color: "#4a9eff",
                }}
              >
                {member.avatar}
              </div>

              {/* 이름 */}
              <h3 className="text-lg font-semibold mb-1" style={{ color: "#f0f0f0" }}>
                {member.name}
              </h3>

              {/* 직책 */}
              <p
                className="text-sm font-medium mb-4"
                style={{ color: "#4a9eff" }}
              >
                {member.role}
              </p>

              {/* 약력 */}
              <p className="text-sm leading-relaxed" style={{ color: "#8a8a9a" }}>
                {member.bio}
              </p>

              {/* hover 글로우 */}
              <div
                className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 pointer-events-none"
                style={{
                  background:
                    "radial-gradient(ellipse at top, rgba(74, 158, 255, 0.06) 0%, transparent 60%)",
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
