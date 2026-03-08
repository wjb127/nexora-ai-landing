import type { Metadata } from "next";
import { BRAND } from "@/lib/constants";
import DemoClient from "./DemoClient";

export const metadata: Metadata = {
  title: `Demo - ${BRAND.name} | AI Data Processing Visualization`,
  description:
    "5만 개의 파티클로 시각화된 AI 데이터 처리 과정. GPGPU 기반 실시간 렌더링 데모.",
  openGraph: {
    title: `Demo - ${BRAND.name}`,
    description:
      "AI가 데이터를 처리하는 과정을 수만 개 파티클의 형태 변환으로 시각화합니다.",
    url: `${BRAND.url}/demo`,
    siteName: BRAND.name,
    type: "website",
  },
};

export default function DemoPage() {
  return <DemoClient />;
}
