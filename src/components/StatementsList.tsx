import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Link } from 'react-router-dom';

export const StatementsList = () => {
  const [statements, setStatements] = useState<any[]>([]);

  useEffect(() => {
    const fetchStatements = async () => {
      try {
        const res = await fetch('/api/statements');
        if (res.ok) {
          const data = await res.json();
          setStatements(data);
        } else {
          const saved = localStorage.getItem('gov_statements');
          if (saved) setStatements(JSON.parse(saved));
        }
      } catch (err) {
        const saved = localStorage.getItem('gov_statements');
        if (saved) setStatements(JSON.parse(saved));
      }
    };
    fetchStatements();
  }, []);

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="govuk-width-container py-12"
    >
      <div className="mb-12">
        <Link to="/" className="text-gds-blue underline font-bold mb-4 block">← Home</Link>
        <h1 className="text-5xl md:text-6xl font-bold">Statements</h1>
        <p className="text-xl mt-4 text-gds-dark-grey">Official statements made by the government to Parliament and the public.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        <div className="lg:col-span-3">
          {statements.length === 0 ? (
            <div className="p-12 border-2 border-dashed border-gray-300 text-center">
              <p className="text-xl">No official statements found.</p>
            </div>
          ) : (
            <ul className="space-y-12">
              {statements.map((s, i) => (
                <li key={s._id || s.id || i} className="border-b border-gray-200 pb-12 flex flex-col md:flex-row gap-8">
                  {s.imageUrl && (
                    <div className="md:w-1/4 aspect-video overflow-hidden bg-gray-100 shrink-0">
                      <img src={s.imageUrl} alt="" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                    </div>
                  )}
                  <div className="flex-1">
                    <span className="text-sm font-bold text-gds-dark-grey block mb-2">{s.date}</span>
                    <Link to={`/statements/${s._id || s.id}`} className="text-3xl font-bold text-gds-blue underline block mb-4">
                      {s.title}
                    </Link>
                    <p className="text-lg text-gds-black line-clamp-3 mb-4">{s.content}</p>
                    <span className="text-sm italic">Published by: {s.publisher}</span>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
        
        <div className="flex flex-col gap-6">
          <div className="border-t-4 border-gds-black pt-4">
            <h4 className="font-bold mb-2">Subscribe</h4>
            <p className="text-sm mb-4">Get email alerts when news and communications are published.</p>
            <button className="bg-gds-grey px-4 py-2 text-sm font-bold underline hover:no-underline">Subscribe to email alerts</button>
          </div>
        </div>
      </div>
    </motion.div>
  );
};
