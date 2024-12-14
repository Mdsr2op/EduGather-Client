
import * as React from 'react';
import { Lock, Server } from 'lucide-react';

export function SecurityAndReliability() {
  return (
    <section
      className="w-full bg-dark-3 text-light-1 py-16"
      aria-labelledby="security-reliability-heading"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <h2
          id="security-reliability-heading"
          className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-light-1 mb-8"
        >
          Security &amp; Reliability
        </h2>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
          {/* Encryption & Privacy Info */}
          <div className="flex flex-col space-y-6">
            <div className="flex items-start space-x-4">
              <Lock className="h-8 w-8 text-primary-500" />
              <div>
                <h3 className="text-xl font-semibold text-light-1 mb-2">
                  Encryption &amp; Privacy
                </h3>
                <p className="text-light-3 text-sm sm:text-base">
                  We take user privacy and data protection seriously. 
                  According to <strong>NFR-01</strong>, all user passwords are securely stored using 
                  industry-standard encryption techniques. Our platform ensures encrypted 
                  connections (HTTPS/TLS) and compliance with data protection regulations.
                </p>
              </div>
            </div>
          </div>

          {/* Scalability & Cross-Communication */}
          <div className="flex flex-col space-y-6">
            <div className="flex items-start space-x-4">
              <Server className="h-8 w-8 text-primary-500" />
              <div>
                <h3 className="text-xl font-semibold text-light-1 mb-2">
                  Scalability &amp; Cross-Communication
                </h3>
                <p className="text-light-3 text-sm sm:text-base">
                  Our architecture is built to scale, ensuring smooth performance 
                  even as user volume grows. As stated in <strong>NFR-02</strong>, 
                  our system supports cross-communication between different server instances, 
                  allowing you to connect and collaborate seamlessly, regardless of location.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}