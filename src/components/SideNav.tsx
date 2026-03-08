"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { SECTIONS } from "@/lib/constants";

// 섹션 타입
type Section = (typeof SECTIONS)[number];

export default function SideNav() {
  const [activeId, setActiveId] = useState<string>(SECTIONS[0].id);
  const [tooltip, setTooltip] = useState<string | null>(null);
  const observerRef = useRef<IntersectionObserver | null>(null);

  // IntersectionObserver로 현재 섹션 추적
  useEffect(() => {
    const sectionElements: HTMLElement[] = [];

    // 각 섹션 요소 수집
    SECTIONS.forEach((section: Section) => {
      const el = document.getElementById(section.id);
      if (el) sectionElements.push(el);
    });

    if (sectionElements.length === 0) return;

    // 가장 많이 보이는 섹션을 active로 설정
    const visibilityMap = new Map<string, number>();

    observerRef.current = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          visibilityMap.set(entry.target.id, entry.intersectionRatio);
        });

        // visibilityRatio가 가장 높은 섹션을 active로
        let maxRatio = 0;
        let mostVisibleId = activeId;

        visibilityMap.forEach((ratio, id) => {
          if (ratio > maxRatio) {
            maxRatio = ratio;
            mostVisibleId = id;
          }
        });

        if (maxRatio > 0) {
          setActiveId(mostVisibleId);
        }
      },
      {
        // 루트 마진으로 viewport 중앙 기준 감지
        rootMargin: "-20% 0px -60% 0px",
        threshold: [0, 0.1, 0.25, 0.5, 0.75, 1.0],
      }
    );

    sectionElements.forEach((el) => {
      observerRef.current!.observe(el);
    });

    return () => {
      observerRef.current?.disconnect();
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // 섹션 스크롤 이동
  const scrollToSection = useCallback((id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }, []);

  return (
    <nav
      aria-label="섹션 도트 네비게이션"
      className="hidden md:flex fixed right-8 top-1/2 -translate-y-1/2 z-50 flex-col items-center gap-4"
    >
      {SECTIONS.map((section: Section) => {
        const isActive = activeId === section.id;

        return (
          <div key={section.id} className="relative flex items-center group">
            {/* 툴팁 - 왼쪽에 표시 */}
            <div
              className={[
                "absolute right-5 whitespace-nowrap",
                "px-2.5 py-1 rounded text-xs font-medium",
                "bg-[#0c0c14] border border-white/10 text-[#f0f0f0]",
                "pointer-events-none select-none",
                "transition-all duration-200",
                tooltip === section.id
                  ? "opacity-100 translate-x-0"
                  : "opacity-0 translate-x-1",
              ].join(" ")}
              role="tooltip"
              id={`tooltip-${section.id}`}
            >
              {section.label}
              {/* 툴팁 화살표 */}
              <span
                className="absolute top-1/2 -translate-y-1/2 right-[-5px] w-0 h-0"
                style={{
                  borderTop: "4px solid transparent",
                  borderBottom: "4px solid transparent",
                  borderLeft: "5px solid rgba(255,255,255,0.1)",
                }}
              />
            </div>

            {/* 도트 버튼 */}
            <button
              onClick={() => scrollToSection(section.id)}
              onMouseEnter={() => setTooltip(section.id)}
              onMouseLeave={() => setTooltip(null)}
              onFocus={() => setTooltip(section.id)}
              onBlur={() => setTooltip(null)}
              aria-label={`${section.label} 섹션으로 이동`}
              aria-describedby={`tooltip-${section.id}`}
              aria-current={isActive ? "location" : undefined}
              className="relative flex items-center justify-center focus:outline-none focus-visible:ring-2 focus-visible:ring-[#4a9eff] rounded-full"
              style={{
                width: isActive ? "20px" : "14px",
                height: isActive ? "20px" : "14px",
                transition: "width 0.25s ease, height 0.25s ease",
              }}
            >
              {/* active 링 */}
              {isActive && (
                <span
                  className="absolute inset-0 rounded-full border-2 border-[#4a9eff]"
                  style={{
                    animation: "none",
                  }}
                />
              )}

              {/* 도트 내부 원 */}
              <span
                className="rounded-full block"
                style={{
                  width: isActive ? "8px" : "6px",
                  height: isActive ? "8px" : "6px",
                  backgroundColor: isActive ? "#4a9eff" : "#8a8a9a",
                  transition: "width 0.25s ease, height 0.25s ease, background-color 0.25s ease",
                }}
              />
            </button>
          </div>
        );
      })}
    </nav>
  );
}
