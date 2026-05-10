import React from 'react';
import { ArrowRight } from 'lucide-react';

const services = [
  { title: 'Benefits', description: 'Includes tax credits, eligibility and appeals' },
  { title: 'Births, deaths, marriages and care', description: 'Parenting, civil partnerships, divorce and Lasting Power of Attorney' },
  { title: 'Business and self-employed', description: 'Tools and guidance for businesses' },
  { title: 'Childcare and parenting', description: 'Includes adoption, fostering, and child benefit' },
  { title: 'Citizenship and living in the UK', description: 'Voting, community and British citizenship' },
  { title: 'Crime, justice and the law', description: 'Legal aid, prison and court details' },
  { title: 'Disabled people', description: 'Includes rights, benefits, and the carer\'s allowance' },
  { title: 'Driving and transport', description: 'Includes vehicle tax, driving licences and MOTs' },
  { title: 'Education and learning', description: 'Includes student loans and university applications' },
  { title: 'Employing people', description: 'Includes payroll, pensions and health and safety' },
  { title: 'Environment and countryside', description: 'Includes farming, energy, and pollution' },
  { title: 'Housing and local services', description: 'Owning or renting a home and council tax' },
];

export const PopularServices = () => {
  return (
    <section className="py-12 bg-white">
      <div className="govuk-width-container">
        <h2 className="text-3xl md:text-4xl font-bold mb-8 border-b-4 border-gds-black pb-4">
          Popular on GOV.UK
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {services.map((service, index) => (
            <div key={index} className="group cursor-pointer">
              <h3 className="text-xl md:text-2xl font-bold text-gds-blue underline decoration-2 underline-offset-4 group-hover:text-gds-hover-blue mb-2 flex items-center gap-2">
                {service.title}
                <ArrowRight className="w-5 h-5 opacity-0 group-hover:opacity-100 transition-opacity" />
              </h3>
              <p className="text-lg text-gds-black">
                {service.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
