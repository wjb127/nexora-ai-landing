// 서버 컴포넌트 (use client 불필요)
import { BRAND, SECTIONS } from "@/lib/constants";

// 소셜 링크 데이터
const SOCIAL_LINKS = [
  {
    name: "GitHub",
    href: "#",
    icon: (
      <svg
        width="20"
        height="20"
        viewBox="0 0 24 24"
        fill="currentColor"
        aria-hidden="true"
      >
        <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z" />
      </svg>
    ),
  },
  {
    name: "LinkedIn",
    href: "#",
    icon: (
      <svg
        width="20"
        height="20"
        viewBox="0 0 24 24"
        fill="currentColor"
        aria-hidden="true"
      >
        <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
      </svg>
    ),
  },
  {
    name: "Twitter",
    href: "#",
    icon: (
      <svg
        width="20"
        height="20"
        viewBox="0 0 24 24"
        fill="currentColor"
        aria-hidden="true"
      >
        <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
      </svg>
    ),
  },
] as const;

// 네비게이션 링크 (hero 제외하고 표시)
const NAV_LINKS = SECTIONS.filter((s) => s.id !== "hero");

export default function Footer() {
  return (
    <footer
      style={{
        backgroundColor: "#08080D",
        borderTop: "1px solid #1a1a2e",
      }}
      role="contentinfo"
    >
      <div className="max-w-6xl mx-auto px-6 py-12">
        {/* 상단 3열 그리드 */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 md:gap-8 mb-10">
          {/* 열 1: 로고 + 태그라인 */}
          <div className="flex flex-col gap-3">
            {/* 로고 */}
            <a
              href="#hero"
              className="inline-block w-fit"
              aria-label={`${BRAND.name} 홈으로 이동`}
            >
              <span className="text-2xl font-black tracking-tight bg-gradient-to-r from-[#4a9eff] to-[#00d4ff] bg-clip-text text-transparent">
                {BRAND.name}
              </span>
            </a>
            {/* 태그라인 */}
            <p className="text-[#8a8a9a] text-sm leading-relaxed max-w-[220px]">
              {BRAND.slogan}
              <br />
              <span className="text-xs mt-1 inline-block opacity-70">
                {BRAND.description}
              </span>
            </p>
          </div>

          {/* 열 2: 빠른 링크 */}
          <div>
            <h3 className="text-white font-semibold text-sm mb-4 uppercase tracking-wider">
              Quick Links
            </h3>
            <nav aria-label="Footer navigation">
              <ul className="flex flex-col gap-2.5">
                {NAV_LINKS.map((link) => (
                  <li key={link.id}>
                    <a
                      href={`#${link.id}`}
                      className="text-[#8a8a9a] text-sm hover:text-[#4a9eff] transition-colors duration-200"
                    >
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </nav>
          </div>

          {/* 열 3: 소셜 링크 */}
          <div>
            <h3 className="text-white font-semibold text-sm mb-4 uppercase tracking-wider">
              Follow Us
            </h3>
            <ul className="flex flex-col gap-3">
              {SOCIAL_LINKS.map((social) => (
                <li key={social.name}>
                  <a
                    href={social.href}
                    className="inline-flex items-center gap-2.5 text-[#8a8a9a] text-sm hover:text-[#4a9eff] transition-colors duration-200 group"
                    aria-label={`${social.name}으로 이동`}
                  >
                    <span className="group-hover:scale-110 transition-transform duration-200">
                      {social.icon}
                    </span>
                    <span>{social.name}</span>
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* 하단 구분선 + 저작권 */}
        <div
          className="pt-8 flex flex-col md:flex-row items-center justify-between gap-3"
          style={{ borderTop: "1px solid rgba(26,26,46,0.8)" }}
        >
          <p className="text-[#8a8a9a] text-xs">
            &copy; 2026 {BRAND.name}. All rights reserved.
          </p>
          <p className="text-[#8a8a9a] text-xs opacity-50">
            Built with Next.js &amp; Tailwind CSS
          </p>
        </div>
      </div>
    </footer>
  );
}
