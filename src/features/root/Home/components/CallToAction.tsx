import * as React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';

export function CallToAction() {
  return (
    <section
      className="w-full bg-dark-3 text-light-1 py-20"
      aria-labelledby="cta-heading"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 flex flex-col items-center text-center">
        <h2
          id="cta-heading"
          className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-light-1 mb-6"
        >
          Ready to Join?
        </h2>
        <p className="max-w-3xl text-light-3 text-base sm:text-lg mb-10 leading-relaxed">
          Experience seamless study group collaboration with equal participation and balanced speaking time—ensuring everyone’s voice is heard.
        </p>

        <Button
          asChild
          className="bg-primary-500 hover:bg-primary-600 focus:bg-primary-700 text-light-1 font-semibold px-10 py-4 rounded-md shadow-lg transition-transform transform hover:scale-105 focus:scale-105 focus:outline-none focus:ring-2 focus:ring-primary-400"
        >
          <Link to="/signup" className="flex items-center justify-center w-full h-full">
            Sign Up Now
          </Link>
        </Button>
      </div>
    </section>
  );
}
