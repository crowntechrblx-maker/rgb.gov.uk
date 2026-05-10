import React from 'react';
import { Link } from 'react-router-dom';

export const Footer = () => {
  return (
    <footer className="bg-gds-grey py-12 mt-20 border-t-8 border-gds-blue">
      <div className="govuk-width-container">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mb-12">
          <div>
            <h2 className="text-2xl font-bold mb-6">Government and Parliament</h2>
            <ul className="space-y-3">
              <li><Link to="/bills" className="underline hover:text-gds-blue">Parliament bills database</Link></li>
              <li><Link to="/petitions" className="underline hover:text-gds-blue">Parliament petitions</Link></li>
              <li><Link to="/statements" className="underline hover:text-gds-blue">Government statements</Link></li>
              <li><Link to="/ministers" className="underline hover:text-gds-blue">Government ministers</Link></li>
            </ul>
          </div>
          <div className="bg-white p-6 border-l-4 border-gds-black">
            <h2 className="text-xl font-bold mb-4">Official Disclaimer</h2>
            <p className="text-sm">
              This website is a <strong>prototype</strong>. We are <strong>not associated</strong> with the real UK Government or Parliament.
              This platform is for demonstration of digital government service patterns.
            </p>
          </div>
        </div>
        
        <div className="border-t border-gray-300 pt-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-8">
          <div className="flex flex-col gap-4">
            <div className="flex flex-wrap gap-4 text-sm font-bold">
              <Link to="/privacy" className="underline hover:text-gds-blue">Privacy</Link>
              <Link to="/cookies" className="underline hover:text-gds-blue">Cookies</Link>
              <Link to="/terms" className="underline hover:text-gds-blue">Terms and conditions</Link>
              <a href="#" className="underline hover:text-gds-blue">Accessibility statement</a>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-12 h-8 bg-gds-blue inline-block"></span>
              <p className="text-sm">
                All content is available under the <a href="#" className="underline font-bold">Open Government Licence v3.0</a>, except where otherwise stated
              </p>
            </div>
          </div>
          <div className="flex flex-col items-end gap-2 shrink-0">
            <div className="text-sm font-bold italic">© Crown copyright (Prototype)</div>
          </div>
        </div>
      </div>
    </footer>
  );
};
