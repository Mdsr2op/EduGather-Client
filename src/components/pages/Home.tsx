import { Features } from "@/features/root/Home/components/Features";
import { Header } from "@/features/root/Home/components/Header";
import { Hero } from "@/features/root/Home/components/Hero";
import { HowItWorks } from "@/features/root/Home/components/HowItWorks";
import { SecurityAndReliability } from "@/features/root/Home/components/SecurityAndReliability";

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
