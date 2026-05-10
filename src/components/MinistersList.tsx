import React from 'react';
import { motion } from 'motion/react';
import { Link } from 'react-router-dom';

const ministers = [
  { name: 'The Rt Hon Rishi Sunak MP', title: 'Prime Minister, First Lord of the Treasury and Minister for the Civil Service', dept: 'Prime Minister\'s Office, 10 Downing Street' },
  { name: 'The Rt Hon Oliver Dowden CBE MP', title: 'Deputy Prime Minister and Chancellor of the Duchy of Lancaster', dept: 'Cabinet Office' },
  { name: 'The Rt Hon Jeremy Hunt MP', title: 'Chancellor of the Exchequer', dept: 'HM Treasury' },
  { name: 'The Rt Hon James Cleverly TD MP', title: 'Secretary of State for the Home Department', dept: 'Home Office' },
  { name: 'The Rt Hon David Cameron', title: 'Secretary of State for Foreign, Commonwealth and Development Affairs', dept: 'Foreign, Commonwealth & Development Office' },
];

export const MinistersList = () => {
  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="govuk-width-container py-12"
    >
      <div className="mb-12">
        <Link to="/" className="text-gds-blue underline font-bold mb-4 block">← Home</Link>
        <h1 className="text-5xl md:text-6xl font-bold">Ministers</h1>
        <p className="text-xl mt-6 text-gds-dark-grey border-l-4 border-gds-blue pl-6 italic">
          Ministers are chosen by the Prime Minister from the members of the House of Commons and House of Lords.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-12">
        <section>
          <h2 className="text-3xl font-bold border-b-4 border-gds-black pb-2 mb-8">Cabinet ministers</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {ministers.map((m, i) => (
              <div key={i} className="flex gap-6 border-b border-gray-200 pb-6">
                <div className="w-24 h-32 bg-gray-200 shrink-0 flex items-center justify-center text-gray-400">
                  <span className="text-xs">Photo</span>
                </div>
                <div className="flex flex-col gap-1">
                  <a href="#" className="text-xl font-bold text-gds-blue underline decoration-2">{m.name}</a>
                  <span className="text-sm font-bold text-gds-black">{m.title}</span>
                  <span className="text-xs text-gds-dark-grey">{m.dept}</span>
                </div>
              </div>
            ))}
          </div>
        </section>

        <div className="bg-gds-grey p-8 mt-12">
          <h3 className="text-2xl font-bold mb-4">View ministers by department</h3>
          <p className="mb-6">Find out who governs each government department.</p>
          <a href="#" className="inline-block bg-gds-black text-white px-6 py-2 font-bold">View all departments</a>
        </div>
      </div>
    </motion.div>
  );
};
