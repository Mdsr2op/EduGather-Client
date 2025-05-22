import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useTheme } from "@/context/ThemeContext";

export function CallToAction() {
  const { theme } = useTheme();
  
  return (
    <section
      id="join"
      className={`w-full ${theme === 'dark' ? 'bg-dark-1 text-light-1' : 'bg-light-bg-1 text-light-text-1'} py-16`}
      aria-labelledby="cta-heading"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 flex flex-col items-center text-center">
        <h2
          id="cta-heading"
          className={`text-3xl sm:text-4xl lg:text-5xl font-extrabold ${theme === 'dark' ? 'text-light-1' : 'text-light-text-1'} mb-4`}
        >
          Ready to Join?
        </h2>
        <p className={`max-w-2xl ${theme === 'dark' ? 'text-light-3' : 'text-light-text-3'} text-base sm:text-lg mb-8`}>
          Experience seamless study group collaboration with equal participation 
          and balanced speaking time—ensuring everyone&apos;s voice is heard.
        </p>

        <Button
          asChild
          className="bg-primary-500 hover:bg-primary-600 text-light-1 font-medium px-8 py-3 rounded-xl"
        >
          <Link to="/sign-up">Sign Up Now</Link>
        </Button>
      </div>
    </section>
  );
}