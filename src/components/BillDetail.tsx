import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'motion/react';
import { ArrowLeft, Clock, FileText, Landmark } from 'lucide-react';

export const BillDetail = () => {
  const { id } = useParams();
  const [bill, setBill] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`/api/bills/${id}`)
      .then(res => res.json())
      .then(data => {
        setBill(data);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
  }, [id]);

  if (loading) return (
    <div className="py-20 text-center bg-white min-h-screen">
      <div className="inline-block w-8 h-8 border-4 border-gds-blue border-t-transparent rounded-full animate-spin"></div>
    </div>
  );

  if (!bill) return (
    <div className="py-20 text-center bg-white min-h-screen">
      <h2 className="text-2xl font-bold">Bill not found</h2>
      <Link to="/bills" className="text-gds-blue underline mt-4 inline-block">Back to bills</Link>
    </div>
  );

  const stages = [
    'First Reading',
    'Second Reading',
    'Committee Stage',
    'Report Stage',
    'Third Reading',
    'Royal Assent'
  ];

  const currentStageIndex = stages.indexOf(bill.stage);

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="bg-white min-h-screen pb-20"
    >
      <div className="govuk-width-container py-8">
        <Link to="/bills" className="flex items-center gap-2 text-gds-black font-bold mb-8 hover:bg-gray-100 w-fit px-2 py-1">
          <ArrowLeft className="w-4 h-4" /> Back to bills
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          <div className="lg:col-span-2">
            <span className="text-sm font-bold bg-gds-grey px-2 py-1 inline-block mb-4">
              {bill.type} Bill
            </span>
            <h1 className="text-4xl md:text-5xl font-bold mb-6 leading-tight">{bill.title}</h1>
            
            <div className="flex flex-wrap gap-4 mb-8">
              <div className="flex items-center gap-2 text-gds-dark-grey">
                <Landmark className="w-5 h-5" />
                <span className="font-bold">Origin: House of {bill.house}</span>
              </div>
              <div className="flex items-center gap-2 text-gds-dark-grey">
                <Clock className="w-5 h-5" />
                <span>Last updated: {new Date(bill.updatedAt).toLocaleDateString('en-GB')}</span>
              </div>
            </div>

            <div className="prose max-w-none mb-12">
              <h2 className="text-2xl font-bold mb-4">Summary</h2>
              <p className="text-xl text-gds-black leading-relaxed whitespace-pre-wrap">
                {bill.summary || bill.description || 'No detailed summary available for this bill.'}
              </p>
            </div>

            <section className="mb-12">
              <h2 className="text-2xl font-bold border-b-4 border-gds-black pb-2 mb-8">Passage of the Bill</h2>
              <div className="space-y-4">
                {stages.map((stage, i) => (
                  <div key={stage} className={`flex items-center gap-4 p-4 border-l-4 ${i <= currentStageIndex ? 'border-gds-blue bg-blue-50' : 'border-gray-200 opacity-50'}`}>
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold ${i <= currentStageIndex ? 'bg-gds-blue text-white' : 'bg-gray-200 text-gray-500'}`}>
                      {i + 1}
                    </div>
                    <div>
                      <h3 className="font-bold">{stage}</h3>
                      {i === currentStageIndex && <span className="text-xs font-bold text-gds-blue uppercase tracking-wider">Current Stage</span>}
                    </div>
                  </div>
                ))}
              </div>
            </section>
          </div>

          <div className="lg:col-span-1">
            <div className="bg-gds-grey p-6 sticky top-8">
              <h3 className="text-xl font-bold mb-4">Bill details</h3>
              <dl className="space-y-4">
                <div>
                  <dt className="text-sm text-gds-dark-grey">Sponsor</dt>
                  <dd className="font-bold">{bill.sponsor || 'Government'}</dd>
                </div>
                <div>
                  <dt className="text-sm text-gds-dark-grey">Department</dt>
                  <dd className="font-bold">{bill.department || 'Not specified'}</dd>
                </div>
                <div>
                  <dt className="text-sm text-gds-dark-grey">Status</dt>
                  <dd className="font-bold text-gds-blue italic">{bill.status}</dd>
                </div>
              </dl>

              <div className="mt-8 pt-8 border-t border-gray-300">
                <button className="w-full bg-gds-black text-white py-3 font-bold flex items-center justify-center gap-2 hover:bg-gray-800 transition-colors">
                  <FileText className="w-5 h-5" /> Download text of the Bill
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};
