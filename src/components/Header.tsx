import React from 'react';
import { CrownIcon } from './CrownIcon';
import { Link } from 'react-router-dom';

export const Header = () => {
  return (
    <header className="bg-gds-black text-white h-12 md:h-14 flex items-center border-b-8 border-gds-blue">
      <div className="govuk-header-container w-full py-2">
        <div className="flex items-center justify-between w-full">
          <Link to="/" className="flex items-center gap-2 hover:opacity-90 group transition-all">
            <CrownIcon className="w-8 h-6 md:w-10 md:h-7" />
            <span className="text-xl md:text-2xl font-bold tracking-tight">GOV.UK</span>
          </Link>
          
          <Link 
            to="/login" 
            className="text-sm md:text-base font-bold bg-white text-gds-black px-3 py-1 hover:bg-gds-grey transition-colors"
          >
            Sign in
          </Link>
        </div>
      </div>
    </header>
  );
};
