
import * as React from 'react';
import { UserPlus, Users, MessageCircle, Calendar } from 'lucide-react';

interface Step {
  icon: React.ReactNode;
  title: string;
  description: string;
}

const steps: Step[] = [
  {
    icon: <UserPlus className="h-8 w-8 text-primary-500" />,
    title: "Create an Account",
    description: "Simple registration with secure password encryption."
  },
  {
    icon: <Users className="h-8 w-8 text-primary-500" />,
    title: "Join or Create a Study Group",
    description: "Connect with peers and form learning communities."
  },
  {
    icon: <MessageCircle className="h-8 w-8 text-primary-500" />,
    title: "Collaborate in Real-Time",
    description: "Use messaging, video calls, and file sharing to study effectively."
  },
  {
    icon: <Calendar className="h-8 w-8 text-primary-500" />,
    title: "Organize & Manage",
    description: "Assign roles, schedule events, and streamline communication."
  },
];

export function HowItWorks() {
  return (
    <section
      className="w-full bg-dark-3 text-light-1 py-16"
      aria-labelledby="how-it-works-heading"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <h2
          id="how-it-works-heading"
          className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-light-1 mb-8"
        >
          How It Works
        </h2>
        
        <div className="flex flex-col lg:flex-row gap-12">
          {/* Steps Section */}
          <div className="flex-1 space-y-8">
            {steps.map((step, index) => (
              <div key={index} className="flex items-start space-x-4">
                <div className="flex-shrink-0">
                  {step.icon}
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-light-1 mb-1">
                    {step.title}
                  </h3>
                  <p className="text-light-3 text-sm sm:text-base">
                    {step.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
          
          {/* Supportive Imagery (Screenshot) */}
          <div className="flex-1 flex justify-center items-center">
            <div className="relative w-full max-w-lg aspect-video bg-dark-4 rounded-lg overflow-hidden">
              {/* Replace the src below with your actual screenshot. 
                 Add a CSS blur filter to obscure sensitive data if needed. */}
              <img
                src="/path/to/platform-screenshot.png"
                alt="EduGather platform screenshot"
                className="w-full h-full object-cover rounded-lg"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}