import * as React from 'react';
import { UserPlus, Users, MessageCircle, Calendar } from 'lucide-react';

interface Step {
  icon: React.ReactNode;
  title: string;
  description: string;
  imageSrc: string;
}

const steps: Step[] = [
  {
    icon: <UserPlus className="h-8 w-8 text-primary-500" />,
    title: "Create an Account",
    description: "Simple registration with secure password encryption.",
    imageSrc: "/CreateANewAccount.png", // Replace with actual image URL
  },
  {
    icon: <Users className="h-8 w-8 text-primary-500" />,
    title: "Join or Create a Study Group",
    description: "Connect with peers and form learning communities.",
    imageSrc: "/NewGroup.png", // Replace with actual image URL
  },
  {
    icon: <MessageCircle className="h-8 w-8 text-primary-500" />,
    title: "Collaborate in Real-Time",
    description: "Use messaging, video calls, and file sharing to study effectively.",
    imageSrc: "/RealTimeCollaboration.png", // Replace with actual image URL
  },
  {
    icon: <Calendar className="h-8 w-8 text-primary-500" />,
    title: "Organize & Manage",
    description: "Assign roles, schedule events, and streamline communication.",
    imageSrc: "/organize and manage.jpg", // Replace with actual image URL
  },
];

export function HowItWorks() {
  return (
    <section
      className="w-full bg-dark-1 text-light-1 py-16"
      aria-labelledby="how-it-works-heading"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <h2
          id="how-it-works-heading"
          className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-light-1 mb-12 text-center"
        >
          How It Works
        </h2>

        <div className="space-y-16">
          {steps.map((step, index) => (
            <div
              key={index}
              className="flex flex-col lg:flex-row items-center lg:items-start lg:space-x-12 space-y-8 lg:space-y-0"
            >
              {/* Step Number */}
              <div className="w-full text-center mb-4 lg:mb-0 lg:w-auto lg:text-left">
                <div className="w-12 h-12 bg-primary-500 rounded-full flex items-center justify-center text-dark-3 font-bold text-lg mx-auto lg:mx-0">
                  {index + 1}
                </div>
              </div>

              {/* Text Content */}
              <div className="flex-1 text-center lg:text-left">
                <div className="flex items-center justify-center lg:justify-start space-x-2 mb-4">
                  {step.icon}
                  <h3 className="text-2xl font-semibold text-light-1">
                    {step.title}
                  </h3>
                </div>
                <p className="text-light-3 text-sm sm:text-base">
                  {step.description}
                </p>
              </div>

              {/* Image */}
              <div className="flex-1">
                <div className="relative w-full max-w-md mx-auto lg:mx-0 aspect-video bg-dark-4 rounded-lg overflow-hidden shadow-lg">
                  <img
                    src={step.imageSrc}
                    alt={`${step.title} Image`}
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
