"use client";

import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { BRAND, NAV_LINKS } from "@/lib/constants";

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const pathname = usePathname();

  // 스크롤 감지 → 배경 전환
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // 모바일 메뉴 열릴 때 body 스크롤 잠금
  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [menuOpen]);

  // 오버레이 메뉴 애니메이션 variants
  const overlayVariants = {
    hidden: { opacity: 0, y: "-100%" },
    visible: {
      opacity: 1,
      y: "0%",
      transition: { duration: 0.4, ease: "easeOut" as const },
    },
    exit: {
      opacity: 0,
      y: "-100%",
      transition: { duration: 0.3, ease: "easeIn" as const },
    },
  };

  // 메뉴 아이템 개별 애니메이션 variants
  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: (i: number) => ({
      opacity: 1,
      y: 0,
      transition: {
        delay: i * 0.07 + 0.15,
        duration: 0.35,
        ease: "easeOut" as const,
      },
    }),
  };

  // 현재 페이지인지 판별
  const isActive = (href: string) => {
    if (href === "/") return pathname === "/";
    return pathname.startsWith(href);
  };

  return (
    <>
      {/* 메인 네비게이션 바 */}
      <header
        className={[
          "fixed top-0 left-0 right-0 z-50",
          "transition-all duration-300",
          scrolled
            ? "bg-[#08080D]/90 backdrop-blur-md border-b border-white/5 shadow-lg shadow-black/30"
            : "bg-transparent",
        ].join(" ")}
      >
        <nav className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          {/* 로고 */}
          <Link
            href="/"
            className="text-xl font-bold tracking-tight focus:outline-none focus-visible:ring-2 focus-visible:ring-[#4a9eff] rounded"
            aria-label={`${BRAND.name} 홈으로 이동`}
          >
            <span
              className="bg-clip-text text-transparent"
              style={{
                backgroundImage: "linear-gradient(135deg, #4a9eff, #00d4ff)",
              }}
            >
              {BRAND.name}
            </span>
          </Link>

          {/* 데스크탑 링크: Home / About / Demo */}
          <ul className="hidden md:flex items-center gap-8" role="list">
            {NAV_LINKS.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className={[
                    "text-sm transition-colors duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#4a9eff] rounded px-1",
                    isActive(link.href)
                      ? "text-white font-medium"
                      : "text-[#8a8a9a] hover:text-white",
                  ].join(" ")}
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>

          {/* 데스크탑 CTA */}
          <div className="hidden md:block">
            <Link
              href="/#contact"
              className="px-5 py-2 text-sm font-medium rounded-full border border-[#4a9eff]/50 text-[#4a9eff] hover:bg-[#4a9eff]/10 transition-all duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#4a9eff]"
            >
              Get Started
            </Link>
          </div>

          {/* 모바일 햄버거 버튼 */}
          <button
            onClick={() => setMenuOpen((prev) => !prev)}
            className="md:hidden relative w-10 h-10 flex items-center justify-center rounded-lg focus:outline-none focus-visible:ring-2 focus-visible:ring-[#4a9eff]"
            aria-label={menuOpen ? "메뉴 닫기" : "메뉴 열기"}
            aria-expanded={menuOpen}
            aria-controls="mobile-menu"
          >
            <span className="sr-only">{menuOpen ? "메뉴 닫기" : "메뉴 열기"}</span>
            <div className="w-5 h-4 flex flex-col justify-between">
              <motion.span
                animate={menuOpen ? { rotate: 45, y: 6 } : { rotate: 0, y: 0 }}
                transition={{ duration: 0.2 }}
                className="block h-0.5 w-full bg-white rounded-full origin-center"
              />
              <motion.span
                animate={menuOpen ? { opacity: 0, scaleX: 0 } : { opacity: 1, scaleX: 1 }}
                transition={{ duration: 0.15 }}
                className="block h-0.5 w-full bg-white rounded-full"
              />
              <motion.span
                animate={menuOpen ? { rotate: -45, y: -6 } : { rotate: 0, y: 0 }}
                transition={{ duration: 0.2 }}
                className="block h-0.5 w-full bg-white rounded-full origin-center"
              />
            </div>
          </button>
        </nav>
      </header>

      {/* 모바일 전체화면 오버레이 메뉴 */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            id="mobile-menu"
            role="dialog"
            aria-modal="true"
            aria-label="네비게이션 메뉴"
            variants={overlayVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="fixed inset-0 z-40 md:hidden flex flex-col"
            style={{ backgroundColor: "#08080D" }}
          >
            {/* 상단 여백 (Navbar 높이만큼) */}
            <div className="h-16 shrink-0" />

            {/* 메뉴 콘텐츠 */}
            <div className="flex-1 flex flex-col justify-center px-8 pb-16">
              {/* 구분선 */}
              <div className="w-full h-px bg-white/5 mb-12" />

              <ul className="flex flex-col gap-2" role="list">
                {NAV_LINKS.map((link, i) => (
                  <motion.li
                    key={link.href}
                    custom={i}
                    variants={itemVariants}
                    initial="hidden"
                    animate="visible"
                  >
                    <Link
                      href={link.href}
                      onClick={() => setMenuOpen(false)}
                      className={[
                        "block w-full text-left py-4 text-3xl font-light transition-colors duration-200 focus:outline-none focus-visible:text-white",
                        isActive(link.href)
                          ? "text-white"
                          : "text-[#8a8a9a] hover:text-white",
                      ].join(" ")}
                    >
                      <span className="text-sm text-[#4a9eff] font-mono mr-3 align-middle">
                        {String(i + 1).padStart(2, "0")}
                      </span>
                      {link.label}
                    </Link>
                  </motion.li>
                ))}
              </ul>

              {/* 하단 구분선 + CTA */}
              <div className="w-full h-px bg-white/5 mt-12 mb-8" />
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1, transition: { delay: 0.5, duration: 0.3 } }}
              >
                <Link
                  href="/#contact"
                  onClick={() => setMenuOpen(false)}
                  className="block w-full py-4 text-center text-base font-medium rounded-full border border-[#4a9eff]/50 text-[#4a9eff] hover:bg-[#4a9eff]/10 transition-all duration-200 focus:outline-none"
                >
                  Get Started
                </Link>
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
