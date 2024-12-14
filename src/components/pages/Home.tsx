import { Features } from "@/features/root/Home/components/Features";
import { Header } from "@/features/root/Home/components/Header";
import { Hero } from "@/features/root/Home/components/Hero";
import { HowItWorks } from "@/features/root/Home/components/HowItWorks";

const Home = () => {
  return (
    <div className="w-full overflow-x-hidden custom-scrollbar">
      <Header />
      <Hero />
      <Features />
      <HowItWorks />
    </div>
  );
};

export default Home;
