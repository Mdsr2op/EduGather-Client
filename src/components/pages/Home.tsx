import { Features } from "@/features/Home/components/Features";
import { Header } from "@/features/Home/components/Header";
import { Hero } from "@/features/Home/components/Hero";
import { HowItWorks } from "@/features/Home/components/HowItWorks";
import { SecurityAndReliability } from "@/features/Home/components/SecurityAndReliability";

const Home = () => {
  return (
    <div className="">
      <Header />
      <Hero />
      <Features />
      <HowItWorks />
      <SecurityAndReliability />
    </div>
  );
};

export default Home;
