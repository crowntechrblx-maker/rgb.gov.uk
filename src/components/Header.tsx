import React from 'react';
import { Link } from 'react-router-dom';

export const Header = () => {
  const auth = localStorage.getItem('gov_auth');
  const role = localStorage.getItem('gov_role');

  return (
    <header className="bg-gds-black text-white h-12 md:h-14 flex items-center border-b-[6px] border-[#1d70b8]">
      <div className="govuk-width-container w-full">
        <div className="flex items-center justify-between w-full py-2">
          <div className="flex items-center gap-6">
            <Link to="/" className="flex items-center gap-2 hover:opacity-90 group transition-all">
              <span className="text-xl md:text-2xl font-bold tracking-tight">GOV.UK</span>
            </Link>
            <nav className="hidden md:flex gap-4 text-sm font-bold border-l border-gray-600 pl-4">
              <Link to="/gazette" className="hover:underline">The Gazette</Link>
              <Link to="/bills" className="hover:underline">Bills</Link>
              <Link to="/petitions" className="hover:underline">Petitions</Link>
            </nav>
          </div>
          
          <div className="flex items-center gap-4">
            {auth === 'true' && (
              <>
                {(role === 'ADMIN' || role === 'CLERK') && (
                  <Link to="/dashboard" className="text-sm font-bold text-gds-yellow hover:underline">Dashboard</Link>
                )}
                <Link 
                  to="/profile" 
                  className="text-sm font-bold hover:underline border-l border-gray-600 pl-4"
                >
                  Account
                </Link>
              </>
            )}
            {auth !== 'true' ? (
              <Link 
                to="/login" 
                className="text-sm font-bold bg-white text-gds-black px-3 py-1 hover:bg-gds-grey transition-colors"
              >
                Sign in
              </Link>
            ) : null}
          </div>
        </div>
      </div>
    </header>
  );
};
