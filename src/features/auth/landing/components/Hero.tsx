import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { CheckCircle } from "lucide-react";

export function Hero() {
  return (
    <section
      id="home"
      className="w-full bg-dark-1 text-light-1 py-16"
      aria-labelledby="hero-heading"
    >
      <div className="lg:mx-5 flex w-full flex-col-reverse justify-between items-center gap-8 px-4 sm:px-6 lg:flex-row lg:px-8  ">
        {/* Left Content: Headline, Subheadline, CTA, Features */}
        <div className="flex-1 flex flex-col items-start">
          <h1
            id="hero-heading"
            className="text-3xl sm:text-4xl lg:text-5xl font-extrabold leading-tight text-light-1"
          >
            Collaborate, Learn, and Grow with{" "}
            <span className="text-primary-500">EduGather</span>
          </h1>
          <p className="mt-4 max-w-2xl text-light-3 text-base sm:text-lg">
            A platform built for real-time study group collaboration—persistent
            text chat, video conferencing, file sharing, and study group
            management all in one place.
          </p>

          <div className="mt-8">
            <Button
              asChild
              className="bg-primary-500 hover:bg-primary-600 text-light-1 font-medium px-8 py-3 rounded-xl"
            >
              <Link to="/sign-up">Sign Up Now</Link>
            </Button>
          </div>

          {/* Feature Highlights */}
          <ul className="mt-8 space-y-3">
            <li className="flex items-center space-x-3">
              <CheckCircle className="h-5 w-5 text-primary-500" />
              <span className="text-light-1">Persistent Text Chat</span>
            </li>
            <li className="flex items-center space-x-3">
              <CheckCircle className="h-5 w-5 text-primary-500" />
              <span className="text-light-1">Video Conferencing</span>
            </li>
            <li className="flex items-center space-x-3">
              <CheckCircle className="h-5 w-5 text-primary-500" />
              <span className="text-light-1">
                File Sharing &amp; Management
              </span>
            </li>
            <li className="flex items-center space-x-3">
              <CheckCircle className="h-5 w-5 text-primary-500" />
              <span className="text-light-1">
                Study Group Creation &amp; Management
              </span>
            </li>
          </ul>
        </div>

        {/* Right Content: Hero Image/Illustration */}
        <div className="flex-1 flex justify-end items-center">
          <div className="relative w-full max-w-md aspect-video lg:aspect-auto  bg-dark-4 rounded-xl overflow-hidden">
            <img
              src="/Hero.png"
              alt="Students collaborating online"
              className="w-full h-full object-cover rounded-lg"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
