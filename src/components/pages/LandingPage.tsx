import { CallToAction } from "@/features/auth/landing/components/CallToAction";
import { FAQ } from "@/features/auth/landing/components/FAQ";
import { Features } from "@/features/auth/landing/components/Features";
import { Footer } from "@/features/auth/landing/components/Footer";
import { Header } from "@/features/auth/landing/components/Header";
import { Hero } from "@/features/auth/landing/components/Hero";
import { HowItWorks } from "@/features/auth/landing/components/HowItWorks";
import { SecurityAndReliability } from "@/features/auth/landing/components/SecurityAndReliability";

const Home = () => {
  return (
    <div className="w-full overflow-x-hidden custom-scrollbar">
      <Header />
      <Hero />
      <Features />
      <HowItWorks />
      <SecurityAndReliability />
      <CallToAction />
      <FAQ />
      <Footer />

    </div>
  );
};

export default Home;