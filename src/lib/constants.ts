// 브랜드 설정
export const BRAND = {
  name: "Nexora",
  slogan: "Intelligence Beyond Limits",
  description: "AI 기반 데이터 분석/자동화 플랫폼",
  url: "https://nexora-ai.vercel.app",
} as const;

// 컬러 팔레트
export const COLORS = {
  dark: "#08080D",
  darkAlt: "#0c0c14",
  blue: "#4a9eff",
  cyan: "#00d4ff",
  white: "#f0f0f0",
  gray: "#8a8a9a",
} as const;

// 네비게이션 섹션
export const SECTIONS = [
  { id: "hero", label: "Home" },
  { id: "why", label: "Why Nexora" },
  { id: "products", label: "Products" },
  { id: "solution", label: "Solution" },
  { id: "contact", label: "Contact" },
] as const;

// Why Nexora 카드
export const WHY_CARDS = [
  {
    icon: "⚡",
    title: "Real-Time Analysis",
    description: "밀리초 단위의 데이터 처리로 실시간 인사이트를 제공합니다.",
  },
  {
    icon: "🔒",
    title: "Enterprise Security",
    description: "엔터프라이즈급 보안으로 데이터를 안전하게 보호합니다.",
  },
  {
    icon: "🧠",
    title: "Adaptive AI",
    description: "비즈니스에 맞게 스스로 학습하고 진화하는 AI 엔진입니다.",
  },
  {
    icon: "📊",
    title: "Smart Dashboard",
    description: "직관적인 대시보드로 복잡한 데이터를 한눈에 파악합니다.",
  },
] as const;

// 제품
export const PRODUCTS = [
  {
    name: "NexFlow",
    tagline: "AI Workflow Automation",
    description:
      "반복적인 비즈니스 프로세스를 AI가 자동화합니다. 데이터 수집부터 리포트 생성까지 원클릭으로.",
  },
  {
    name: "NexInsight",
    tagline: "Predictive Analytics Engine",
    description:
      "과거 데이터를 기반으로 미래 트렌드를 예측합니다. 의사결정에 필요한 인사이트를 실시간으로 제공.",
  },
] as const;

// 네비게이션 링크 (서브페이지 포함)
export const NAV_LINKS = [
  { href: "/", label: "Home" },
  { href: "/about", label: "About" },
] as const;

// Solution 특징
export const SOLUTION_FEATURES = [
  {
    number: "01",
    title: "데이터 수집",
    description: "다양한 소스에서 실시간으로 데이터를 수집하고 정제합니다.",
  },
  {
    number: "02",
    title: "AI 분석",
    description: "딥러닝 기반 모델이 패턴을 인식하고 이상 징후를 탐지합니다.",
  },
  {
    number: "03",
    title: "인사이트 도출",
    description: "분석 결과를 비즈니스 맥락에 맞게 해석하고 시각화합니다.",
  },
  {
    number: "04",
    title: "자동 실행",
    description: "도출된 인사이트를 기반으로 최적의 액션을 자동 수행합니다.",
  },
] as const;

// ─────────────────────────────────────────────────────────────
// About 페이지 관련 상수
// ─────────────────────────────────────────────────────────────

// 글로벌 네트워크 수치
export const ABOUT_STATS = [
  { value: "12", label: "Data Centers", suffix: "+" },
  { value: "47", label: "Countries", suffix: "" },
  { value: "99.97", label: "Uptime", suffix: "%" },
  { value: "2.4", label: "Requests/Day", suffix: "B" },
] as const;

// 팀원 정보
export const TEAM_MEMBERS = [
  {
    name: "Daniel Kim",
    role: "CEO & Co-Founder",
    bio: "전 Google Brain 연구원. 분산 AI 시스템 분야 10년 경력.",
    avatar: "DK",
  },
  {
    name: "Sarah Chen",
    role: "CTO",
    bio: "MIT CS Ph.D. 대규모 데이터 파이프라인 및 MLOps 전문가.",
    avatar: "SC",
  },
  {
    name: "James Park",
    role: "VP of Engineering",
    bio: "전 AWS 시니어 아키텍트. 글로벌 인프라 설계 전문.",
    avatar: "JP",
  },
  {
    name: "Emily Wang",
    role: "Head of AI Research",
    bio: "Stanford AI Lab 출신. NLP 및 컴퓨터 비전 연구 리드.",
    avatar: "EW",
  },
] as const;

// 회사 연혁
export const TIMELINE = [
  {
    year: "2021",
    title: "Nexora 설립",
    description: "실리콘밸리에서 3명의 공동 창업자가 AI 인프라 혁신을 목표로 설립.",
  },
  {
    year: "2022",
    title: "시리즈 A 투자 유치",
    description: "Sequoia Capital 리드로 $25M 시리즈 A 투자 유치. NexFlow v1.0 출시.",
  },
  {
    year: "2023",
    title: "글로벌 확장",
    description: "아시아-태평양 데이터센터 오픈. 고객사 500+ 달성.",
  },
  {
    year: "2024",
    title: "NexInsight 출시",
    description: "예측 분석 엔진 NexInsight 런칭. 기업 고객 1,200+ 돌파.",
  },
  {
    year: "2025",
    title: "유니콘 달성",
    description: "시리즈 C $120M 유치. 기업 가치 $1.2B 돌파. 글로벌 팀 350명.",
  },
  {
    year: "2026",
    title: "차세대 AI 플랫폼",
    description: "자율 AI 에이전트 플랫폼 베타 출시. 47개국 서비스 확대.",
  },
] as const;

// 글로브 도시 좌표 (위도, 경도) - 아크 연결선용
export const GLOBE_CITIES = [
  { name: "San Francisco", lat: 37.77, lng: -122.42 },
  { name: "New York", lat: 40.71, lng: -74.01 },
  { name: "London", lat: 51.51, lng: -0.13 },
  { name: "Tokyo", lat: 35.68, lng: 139.69 },
  { name: "Seoul", lat: 37.57, lng: 126.98 },
  { name: "Singapore", lat: 1.35, lng: 103.82 },
  { name: "Sydney", lat: -33.87, lng: 151.21 },
  { name: "São Paulo", lat: -23.55, lng: -46.63 },
] as const;

// 도시 간 아크 연결 쌍 (인덱스 기반)
export const GLOBE_ARCS = [
  [0, 3], // SF → Tokyo
  [0, 4], // SF → Seoul
  [1, 2], // NY → London
  [2, 5], // London → Singapore
  [3, 5], // Tokyo → Singapore
  [4, 3], // Seoul → Tokyo
  [5, 6], // Singapore → Sydney
  [1, 7], // NY → São Paulo
] as const;
