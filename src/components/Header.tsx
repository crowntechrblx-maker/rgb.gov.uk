import React from 'react';
import { CrownIcon } from './CrownIcon';

export const Header = () => {
  return (
    <header className="bg-gds-black text-white h-12 md:h-20 flex items-center border-b-8 border-gds-blue">
      <div className="govuk-header-container w-full">
        <div className="flex items-center gap-2">
          <a href="/" className="flex items-center gap-2 hover:opacity-90 group transition-all">
            <CrownIcon className="w-8 h-6 md:w-12 md:h-8" />
            <span className="text-xl md:text-3xl font-bold tracking-tight">GOV.UK</span>
          </a>
        </div>
      </div>
    </header>
  );
};
