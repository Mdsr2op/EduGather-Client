import { CallToAction } from "@/features/root/Home/components/CallToAction";
import { FAQ } from "@/features/root/Home/components/FAQ";
import { Features } from "@/features/root/Home/components/Features";
import { Footer } from "@/features/root/Home/components/Footer";
import { Header } from "@/features/root/Home/components/Header";
import { Hero } from "@/features/root/Home/components/Hero";
import { HowItWorks } from "@/features/root/Home/components/HowItWorks";
import { SecurityAndReliability } from "@/features/root/Home/components/SecurityAndReliability";

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
