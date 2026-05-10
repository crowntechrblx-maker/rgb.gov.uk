import React from 'react';

export const Footer = () => {
  return (
    <footer className="bg-gds-grey py-12 mt-20 border-t-8 border-gds-blue">
      <div className="govuk-width-container">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mb-12">
          <div>
            <h2 className="text-2xl font-bold mb-6">Services and information</h2>
            <ul className="space-y-3 columns-1 md:columns-2 gap-8">
              <li><a href="#" className="underline hover:text-gds-blue">Benefits</a></li>
              <li><a href="#" className="underline hover:text-gds-blue">Births, deaths, marriages and care</a></li>
              <li><a href="#" className="underline hover:text-gds-blue">Business and self-employed</a></li>
              <li><a href="#" className="underline hover:text-gds-blue">Childcare and parenting</a></li>
              <li><a href="#" className="underline hover:text-gds-blue">Citizenship and living in the UK</a></li>
              <li><a href="#" className="underline hover:text-gds-blue">Crime, justice and the law</a></li>
              <li><a href="#" className="underline hover:text-gds-blue">Disabled people</a></li>
              <li><a href="#" className="underline hover:text-gds-blue">Driving and transport</a></li>
              <li><a href="#" className="underline hover:text-gds-blue">Education and learning</a></li>
              <li><a href="#" className="underline hover:text-gds-blue">Employing people</a></li>
            </ul>
          </div>
          <div>
            <h2 className="text-2xl font-bold mb-6">Departments and policy</h2>
            <ul className="space-y-3">
              <li><a href="#" className="underline hover:text-gds-blue">How government works</a></li>
              <li><a href="#" className="underline hover:text-gds-blue">Departments</a></li>
              <li><a href="#" className="underline hover:text-gds-blue">Worldwide</a></li>
              <li><a href="#" className="underline hover:text-gds-blue">Policies</a></li>
              <li><a href="#" className="underline hover:text-gds-blue">Publications</a></li>
              <li><a href="#" className="underline hover:text-gds-blue">Announcements</a></li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-gray-300 pt-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-8">
          <div className="flex flex-col gap-4">
            <div className="flex flex-wrap gap-4 text-sm font-bold">
              <a href="#" className="underline hover:text-gds-blue">Help</a>
              <a href="#" className="underline hover:text-gds-blue">Privacy</a>
              <a href="#" className="underline hover:text-gds-blue">Cookies</a>
              <a href="#" className="underline hover:text-gds-blue">Contact</a>
              <a href="#" className="underline hover:text-gds-blue">Accessibility statement</a>
              <a href="#" className="underline hover:text-gds-blue">Terms and conditions</a>
              <a href="#" className="underline hover:text-gds-blue">Rhestr o Wasanaethau Cymraeg</a>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-12 h-8 bg-gds-blue inline-block"></span>
              <p className="text-sm">
                All content is available under the <a href="#" className="underline font-bold">Open Government Licence v3.0</a>, except where otherwise stated
              </p>
            </div>
          </div>
          <div className="flex flex-col items-end gap-2 shrink-0">
            <div className="text-sm font-bold italic">© Crown copyright</div>
          </div>
        </div>
      </div>
    </footer>
  );
};
