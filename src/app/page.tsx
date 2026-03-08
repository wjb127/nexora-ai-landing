import HeroScene from "@/components/HeroScene";
import SideNav from "@/components/SideNav";
import WhySection from "@/components/WhySection";
import ProductsSection from "@/components/ProductsSection";
import SolutionSection from "@/components/SolutionSection";
import ContactSection from "@/components/ContactSection";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <main>
      <SideNav />
      <section id="hero">
        <HeroScene />
      </section>
      <WhySection />
      <ProductsSection />
      <SolutionSection />
      <ContactSection />
      <Footer />
    </main>
  );
}
