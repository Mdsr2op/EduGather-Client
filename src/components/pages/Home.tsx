import { Features } from "@/features/Home/components/Features";
import { Header } from "@/features/Home/components/Header";
import { Hero } from "@/features/Home/components/Hero";
import { HowItWorks } from "@/features/Home/components/HowItWorks";

const Home = () => {
  return (
    <div className="">
      <Header />
      <Hero />
      <Features />
      <HowItWorks />
    </div>
  );
};

export default Home;
