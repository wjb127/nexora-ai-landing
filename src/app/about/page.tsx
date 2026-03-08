import type { Metadata } from "next";
import { BRAND } from "@/lib/constants";
import AboutClient from "./AboutClient";

export const metadata: Metadata = {
  title: `About - ${BRAND.name} | Global AI Infrastructure`,
  description:
    "Nexora의 글로벌 AI 인프라, 리더십 팀, 그리고 혁신의 여정을 소개합니다. 전 세계 47개국에서 운영되는 차세대 AI 플랫폼.",
  openGraph: {
    title: `About - ${BRAND.name}`,
    description:
      "Nexora의 글로벌 AI 인프라, 리더십 팀, 그리고 혁신의 여정을 소개합니다.",
    url: `${BRAND.url}/about`,
    siteName: BRAND.name,
    type: "website",
  },
};

export default function AboutPage() {
  return <AboutClient />;
}
