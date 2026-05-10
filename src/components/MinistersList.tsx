import React from 'react';
import { motion } from 'motion/react';
import { Link } from 'react-router-dom';

export const MinistersList = () => {
  const [ministers, setMinisters] = React.useState<any[]>([]);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    fetch('/api/ministers')
      .then(res => res.json())
      .then(data => {
        setMinisters(data);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
  }, []);

  const cabinetMinisters = ministers.filter(m => m.isCabinet);
  const otherMinisters = ministers.filter(m => !m.isCabinet);

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
        {loading ? (
          <div className="py-20 text-center">
            <div className="inline-block w-8 h-8 border-4 border-gds-blue border-t-transparent rounded-full animate-spin"></div>
            <p className="mt-4 font-bold">Loading ministers...</p>
          </div>
        ) : (
          <>
            <section>
              <h2 className="text-3xl font-bold border-b-4 border-gds-black pb-2 mb-8">Cabinet ministers</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {cabinetMinisters.map((m, i) => (
                  <div key={m._id || i} className="flex gap-6 border-b border-gray-200 pb-6">
                    <div className="w-24 h-32 bg-gray-200 shrink-0 flex items-center justify-center text-gray-400">
                      {m.photoUrl ? (
                         <img src={m.photoUrl} alt={m.name} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                      ) : (
                         <span className="text-xs">Photo</span>
                      )}
                    </div>
                    <div className="flex flex-col gap-1">
                      <span className="text-xl font-bold text-gds-blue underline decoration-2 cursor-pointer">{m.name}</span>
                      <span className="text-sm font-bold text-gds-black">{m.title}</span>
                      <span className="text-xs text-gds-dark-grey">{m.department}</span>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {otherMinisters.length > 0 && (
              <section>
                <h2 className="text-3xl font-bold border-b-4 border-gds-black pb-2 mb-8 mt-12">Also attends Cabinet</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  {otherMinisters.map((m, i) => (
                    <div key={m._id || i} className="flex gap-6 border-b border-gray-200 pb-6">
                      <div className="w-24 h-32 bg-gray-200 shrink-0 flex items-center justify-center text-gray-400">
                        {m.photoUrl ? (
                          <img src={m.photoUrl} alt={m.name} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                        ) : (
                          <span className="text-xs">Photo</span>
                        )}
                      </div>
                      <div className="flex flex-col gap-1">
                        <span className="text-xl font-bold text-gds-blue underline decoration-2 cursor-pointer">{m.name}</span>
                        <span className="text-sm font-bold text-gds-black">{m.title}</span>
                        <span className="text-xs text-gds-dark-grey">{m.department}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            )}
          </>
        )}

        <div className="bg-gds-grey p-8 mt-12">
          <h3 className="text-2xl font-bold mb-4">View ministers by department</h3>
          <p className="mb-6">Find out who governs each government department.</p>
          <button className="inline-block bg-gds-black text-white px-6 py-2 font-bold">View all departments</button>
        </div>
      </div>
    </motion.div>
  );
};
