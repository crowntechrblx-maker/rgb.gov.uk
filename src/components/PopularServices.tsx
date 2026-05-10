import React from 'react';
import { ArrowRight } from 'lucide-react';

const services = [
  { title: 'Parliament bills database', description: 'Search and track the progress of bills through Parliament.', path: '/bills' },
  { title: 'Parliament petitions', description: 'Start or sign a petition to Parliament and Government.', path: '/petitions' },
  { title: 'Government statements', description: 'Read official statements and announcements from government departments.', path: '/statements' },
  { title: 'Government ministers', description: 'The latest list of ministers across all government departments.', path: '/ministers' },
];

export const PopularServices = () => {
  return (
    <section className="py-12 bg-white">
      <div className="govuk-width-container">
        <h2 className="text-3xl md:text-4xl font-bold mb-8 border-b-4 border-gds-black pb-4">
          Government and Parliament
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {services.map((service, index) => (
            <div key={index} className="group cursor-pointer border-t border-gray-200 pt-6">
              <a href={service.path} className="text-xl md:text-2xl font-bold text-gds-blue underline decoration-2 underline-offset-4 group-hover:text-gds-hover-blue mb-2 flex items-center gap-2">
                {service.title}
                <ArrowRight className="w-5 h-5 opacity-0 group-hover:opacity-100 transition-opacity" />
              </a>
              <p className="text-lg text-gds-black mt-2">
                {service.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
