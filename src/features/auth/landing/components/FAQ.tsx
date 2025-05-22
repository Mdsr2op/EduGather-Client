import * as React from "react";
import { ChevronDown } from "lucide-react";
import { useTheme } from "@/context/ThemeContext";

interface FAQItem {
  question: string;
  answer: string;
}

const faqs: FAQItem[] = [
  {
    question: "How does the platform ensure the security and privacy of our students' data?",
    answer:
      "We take security seriously. In line with NFR-01, user passwords are stored using industry-standard encryption, and all data travels over encrypted connections (HTTPS/TLS). We also comply with data protection regulations, ensuring that student information remains confidential and protected.",
  },
  {
    question:
      "Can faculty easily moderate and manage study groups, including assigning roles and removing inappropriate content?",
    answer:
      "Yes. Faculty and assigned moderators can create and manage study groups, assign roles, and have full control over channels. They can also remove users or inappropriate messages, ensuring a safe and productive environment for all participants.",
  },
  {
    question:
      "Does EduGather integrate with our university's existing systems (e.g., SSO, LMS) and can it scale across multiple classes?",
    answer:
      "Our platform is designed with scalability in mind (NFR-02). While direct SSO or LMS integration depends on your institution's setup, EduGather's architecture supports cross-communication between servers, allowing you to scale across multiple classes or departments seamlessly.",
  },
  {
    question:
      "How do we schedule and organize video conferences, and can faculty control participant audio/video settings?",
    answer:
      "Faculty can schedule video calls in advance, and during live sessions, hosts have tools to mute/unmute participants, disable cameras, and manage screen-sharing permissions. This ensures structured, focused discussions and effective collaborative sessions.",
  },
  {
    question:
      "Are there accessibility features to support students with disabilities or varying technical needs?",
    answer:
      "We're committed to accessibility and continuously work to ensure EduGather is inclusive. Features such as keyboard navigation, screen reader compatibility, and clear interface design help all students participate fully.",
  },
  {
    question:
      "How does the pricing model work for institutions or larger groups of students?",
    answer:
      "We offer scalable pricing plans. Institutions can opt for bulk licensing or enterprise plans that include additional support and customization options. Please contact our sales team for a tailored solution that fits your academic needs.",
  },
  {
    question:
      "What measures are in place to ensure the platform remains reliable and data is backed up regularly?",
    answer:
      "EduGather's infrastructure is built for reliability. We maintain regular data backups and have redundancy measures in place to minimize downtime. In case of unexpected issues, our support team is ready to assist, ensuring continuous access to study materials and communication tools.",
  },
];

export function FAQ() {
  const [openIndex, setOpenIndex] = React.useState<number | null>(null);
  const { theme } = useTheme();

  const toggleFAQ = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section
      id="faq"
      className={`w-full ${theme === 'dark' ? 'bg-dark-3 text-light-1' : 'bg-light-bg-2 text-light-text-1'} py-16`}
      aria-labelledby="faq-heading"
    >
      <div className="mx-auto max-w-7xl px-6 sm:px-8">
        <h2
          id="faq-heading"
          className={`text-3xl sm:text-4xl lg:text-5xl font-extrabold ${theme === 'dark' ? 'text-light-1' : 'text-light-text-1'} mb-10`}
        >
          Frequently Asked Questions
        </h2>

        <div className="space-y-6">
          {faqs.map((faq, index) => (
            <div
              key={index}
              className={`border ${theme === 'dark' ? 'border-dark-5' : 'border-light-bg-3'} rounded-xl shadow-md overflow-hidden transition-all duration-2000 ease-in-out transform`}
            >
              <button
                onClick={() => toggleFAQ(index)}
                className={`w-full flex justify-between items-center px-6 py-4 transition-all duration-500 ease-in-out focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 ${
                  openIndex === index
                    ? "bg-gradient-to-r from-primary-500 via-primary-600 to-blue-500"
                    : theme === 'dark' 
                      ? "bg-gradient-to-r from-dark-5 to-dark-4" 
                      : "bg-gradient-to-r from-light-bg-3 to-light-bg-2"
                }`}
                aria-expanded={openIndex === index}
              >
                <span className={`text-left ${openIndex === index ? 'text-light-1' : theme === 'dark' ? 'text-light-1' : 'text-light-text-1'} font-semibold text-lg`}>
                  {faq.question}
                </span>
                <ChevronDown
                  className={`h-6 w-6 ${openIndex === index ? 'text-light-1' : theme === 'dark' ? 'text-light-1' : 'text-light-text-1'} transition-transform duration-500 ease-in-out ${
                    openIndex === index ? "rotate-180" : ""
                  }`}
                />
              </button>
              <div
                className={`transition-all duration-500 ease-in-out overflow-hidden ${
                  openIndex === index ? "max-h-screen opacity-100" : "max-h-0 opacity-0"
                }`}
              >
                <div
                  className={`px-6 py-4 ${theme === 'dark' ? 'bg-dark-3 border-dark-5' : 'bg-light-bg-2 border-light-bg-3'} border-t`}
                  role="region"
                  aria-labelledby={`faq-question-${index}`}
                >
                  <p
                    id={`faq-question-${index}`}
                    className={`${theme === 'dark' ? 'text-light-3' : 'text-light-text-3'} text-base leading-relaxed`}
                  >
                    {faq.answer}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
