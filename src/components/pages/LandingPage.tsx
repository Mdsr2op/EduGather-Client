import { CallToAction } from "@/features/auth/landing/components/CallToAction";
import { FAQ } from "@/features/auth/landing/components/FAQ";
import { Features } from "@/features/auth/landing/components/Features";
import { Footer } from "@/features/auth/landing/components/Footer";
import { Header } from "@/features/auth/landing/components/Header";
import { Hero } from "@/features/auth/landing/components/Hero";
import { HowItWorks } from "@/features/auth/landing/components/HowItWorks";
import { SecurityAndReliability } from "@/features/auth/landing/components/SecurityAndReliability";
import { useEffect } from "react";

const LandingPage = () => {
  // Add smooth scrolling behavior when the page loads
  useEffect(() => {
    // Add smooth scrolling to the HTML element
    document.documentElement.style.scrollBehavior = "smooth";

    // Clean up function to remove the style when component unmounts
    return () => {
      document.documentElement.style.scrollBehavior = "auto";
    };
  }, []);

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

export default LandingPage;