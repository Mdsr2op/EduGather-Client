import * as React from 'react';
import { MessageCircle, Video, File, Users } from 'lucide-react';

interface Feature {
  icon: React.ReactNode;
  title: string;
  description: string;
}

const features: Feature[] = [
  {
    icon: <MessageCircle className="h-8 w-8 text-primary-500" />,
    title: "Persistent Text Chat",
    description: "Real-time messaging, message editing, replies, and pinned messages."
  },
  {
    icon: <Video className="h-8 w-8 text-primary-500" />,
    title: "Video Conferencing",
    description: "Host and join video calls, screen sharing, and scheduled meetings."
  },
  {
    icon: <File className="h-8 w-8 text-primary-500" />,
    title: "File Sharing & Management",
    description: "Easily upload, preview, search, and download study materials."
  },
  {
    icon: <Users className="h-8 w-8 text-primary-500" />,
    title: "Study Group Creation & Management",
    description: "Create groups, manage roles, and organize study channels."
  },
];

export function Features() {
  return (
    <section
      id="features"
      className="w-full bg-dark-3 text-light-1 py-16 border-t border-dark-1"
      aria-labelledby="features-heading"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <h2
          id="features-heading"
          className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-light-1 mb-8"
        >
          Features Designed for Effective Collaboration
        </h2>

        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-4">
          {features.map((feature, index) => (
            <div
              key={index}
              className="flex flex-col items-start p-6 bg-dark-4 rounded-xl transition-transform transform hover:scale-110"
            >
              <div className="mb-4">
                {feature.icon}
              </div>
              <h3 className="text-xl font-semibold text-light-1 mb-2">
                {feature.title}
              </h3>
              <p className="text-light-3 text-sm sm:text-base">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}