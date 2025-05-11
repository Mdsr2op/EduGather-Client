import { Lock, Server } from 'lucide-react';

export function SecurityAndReliability() {
  return (
    <section
      className="w-full bg-dark-3 text-light-1 py-16"
      aria-labelledby="security-reliability-heading"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <header className="mb-12 text-center">
          <h2
            id="security-reliability-heading"
            className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-light-1 mb-4"
          >
            Security &amp; Reliability
          </h2>
          <p className="text-light-3 text-base sm:text-lg max-w-2xl mx-auto">
            Ensuring the highest standards of security and reliability to protect your data and ensure seamless performance.
          </p>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Encryption & Privacy Info */}
          <article
            className="flex flex-col space-y-6 p-6 bg-dark-4 rounded-xl shadow-md transition-transform transform hover:scale-105"
            aria-labelledby="encryption-privacy-heading"
          >
            <div className="flex items-start space-x-4">
              <Lock className="h-10 w-10 text-primary-500 flex-shrink-0" aria-hidden="true" />
              <div>
                <h3
                  id="encryption-privacy-heading"
                  className="text-xl font-semibold text-light-1 mb-2"
                >
                  Encryption &amp; Privacy
                </h3>
                <p className="text-light-3 text-sm sm:text-base leading-relaxed">
                  We prioritize user privacy and data protection. As per <strong>NFR-01</strong>, all user passwords are securely stored using industry-standard encryption techniques. Our platform ensures encrypted connections (HTTPS/TLS) and compliance with data protection regulations.
                </p>
              </div>
            </div>
          </article>

          {/* Scalability & Cross-Communication */}
          <article
            className="flex flex-col space-y-6 p-6 bg-dark-4 rounded-xl shadow-md transition-transform transform hover:scale-105"
            aria-labelledby="scalability-communication-heading"
          >
            <div className="flex items-start space-x-4">
              <Server className="h-10 w-10 text-primary-500 flex-shrink-0" aria-hidden="true" />
              <div>
                <h3
                  id="scalability-communication-heading"
                  className="text-xl font-semibold text-light-1 mb-2"
                >
                  Scalability &amp; Cross-Communication
                </h3>
                <p className="text-light-3 text-sm sm:text-base leading-relaxed">
                  Our architecture is designed to scale effortlessly, ensuring smooth performance even as user volume increases. According to <strong>NFR-02</strong>, our system supports cross-communication between different server instances, enabling seamless connection and collaboration regardless of location.
                </p>
              </div>
            </div>
          </article>
        </div>
      </div>
    </section>
  );
}