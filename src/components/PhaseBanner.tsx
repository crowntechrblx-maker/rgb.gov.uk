import React from 'react';

export const PhaseBanner = () => {
  return (
    <div className="govuk-width-container py-3 border-b border-gray-300">
      <div className="flex items-center gap-2 text-sm md:text-base">
        <strong className="bg-gds-blue text-white px-2 py-0.5 font-bold">BETA</strong>
        <span className="text-gds-black">
          This is a new service – your <a href="#" className="underline hover:text-gds-blue italic">feedback</a> will help us to improve it.
        </span>
      </div>
    </div>
  );
};
