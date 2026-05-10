import React from 'react';
import { motion } from 'motion/react';
import { Link } from 'react-router-dom';

export const MinistersList = () => {
  const [ministers, setMinisters] = React.useState<any[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [selectedDept, setSelectedDept] = React.useState<string | null>(null);

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

  const departments = Array.from(new Set(ministers.map(m => m.department))).sort();

  const filteredMinisters = selectedDept 
    ? ministers.filter(m => m.department === selectedDept)
    : ministers;

  const cabinetMinisters = filteredMinisters.filter(m => m.isCabinet);
  const otherMinisters = filteredMinisters.filter(m => !m.isCabinet);

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

      <div className="mb-12 p-6 bg-gds-grey border-t-4 border-gds-blue">
        <h3 className="text-lg font-bold mb-4">View ministers by department</h3>
        <div className="flex flex-wrap gap-2">
          <button 
            onClick={() => setSelectedDept(null)}
            className={`px-3 py-1 text-sm font-bold border-2 ${!selectedDept ? 'bg-gds-black text-white border-gds-black' : 'bg-white border-gds-black hover:bg-gray-100'}`}
          >
            All Departments
          </button>
          {departments.map(dept => (
            <button 
              key={dept}
              onClick={() => setSelectedDept(dept)}
              className={`px-3 py-1 text-sm font-bold border-2 ${selectedDept === dept ? 'bg-gds-black text-white border-gds-black' : 'bg-white border-gds-black hover:bg-gray-100'}`}
            >
              {dept}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 gap-12">
        {loading ? (
          <div className="py-20 text-center">
            <div className="inline-block w-8 h-8 border-4 border-gds-blue border-t-transparent rounded-full animate-spin"></div>
            <p className="mt-4 font-bold">Loading ministers...</p>
          </div>
        ) : (
          <>
            {cabinetMinisters.length > 0 && (
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
                        <span className="text-xl font-bold text-gds-blue underline decoration-2 cursor-pointer leading-tight">{m.name}</span>
                        <span className="text-sm font-bold text-gds-black">{m.title}</span>
                        <span className="text-xs text-gds-dark-grey">{m.department}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {otherMinisters.length > 0 && (
              <section>
                <h2 className="text-3xl font-bold border-b-4 border-gds-black pb-2 mb-8 mt-12">
                  {selectedDept ? `Other ministers in ${selectedDept}` : 'Also attends Cabinet'}
                </h2>
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
                        <span className="text-xl font-bold text-gds-blue underline decoration-2 cursor-pointer leading-tight">{m.name}</span>
                        <span className="text-sm font-bold text-gds-black">{m.title}</span>
                        <span className="text-xs text-gds-dark-grey">{m.department}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            )}
            
            {filteredMinisters.length === 0 && (
               <div className="p-12 border-2 border-dashed border-gray-300 text-center">
                 <p className="text-xl font-bold">No ministers found for this selection.</p>
               </div>
            )}
          </>
        )}
      </div>
    </motion.div>
  );
};
