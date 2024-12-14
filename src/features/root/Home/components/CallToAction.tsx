
import * as React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';

export function CallToAction() {
  return (
    <section
      className="w-full bg-dark-3 text-light-1 py-16"
      aria-labelledby="cta-heading"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 flex flex-col items-center text-center">
        <h2
          id="cta-heading"
          className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-light-1 mb-4"
        >
          Ready to Join?
        </h2>
        <p className="max-w-2xl text-light-3 text-base sm:text-lg mb-8">
          Experience seamless study group collaboration with equal participation 
          and balanced speaking time—ensuring everyone’s voice is heard.
        </p>

        <Button
          asChild
          className="bg-primary-500 hover:bg-primary-600 text-light-1 font-medium px-8 py-3"
        >
          <Link to="/signup">Sign Up Now</Link>
        </Button>
      </div>
    </section>
  );
}