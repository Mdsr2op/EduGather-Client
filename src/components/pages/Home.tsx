import { Features } from "@/features/Home/components/Features";
import { Header } from "@/features/Home/components/Header";
import { Hero } from "@/features/Home/components/Hero";

const Home = () => {
  return (
    <div className="">
      <Header />
      <Hero />
      <Features />
    </div>
  );
};

export default Home;
