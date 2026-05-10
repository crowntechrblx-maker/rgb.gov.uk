import React from 'react';
import { motion } from 'motion/react';
import { Link } from 'react-router-dom';

export const BillsList = () => {
  const [bills, setBills] = React.useState<any[]>([]);

  React.useEffect(() => {
    const fetchBills = async () => {
      try {
        const res = await fetch('/api/bills');
        if (res.ok) setBills(await res.json());
      } catch (err) { console.error(err); }
    };
    fetchBills();
  }, []);

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="govuk-width-container py-12"
    >
      <div className="flex flex-col gap-4 mb-8">
        <Link to="/" className="text-gds-blue underline font-bold flex items-center gap-2">
          ← Home
        </Link>
        <h1 className="text-4xl md:text-5xl font-bold">Parliamentary Bills</h1>
        <p className="text-xl text-gds-dark-grey max-w-2xl">
          Search for and track the progress of all Public and Private Bills currently before Parliament.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
        {/* Filters sidebar */}
        <div className="md:col-span-1 space-y-6">
          <div className="border-t-4 border-gds-black pt-4">
            <h2 className="text-xl font-bold mb-4">Filter by:</h2>
            <div className="space-y-4">
              <div>
                <label className="font-bold block mb-2">Session</label>
                <select className="w-full border-2 border-gds-black p-2">
                  <option>2023-24</option>
                  <option>2022-23</option>
                </select>
              </div>
              <div>
                <label className="font-bold block mb-2">Bill type</label>
                <div className="space-y-2">
                  <label className="flex items-center gap-2">
                    <input type="checkbox" className="w-6 h-6 border-2 border-gds-black" defaultChecked />
                    <span>Government</span>
                  </label>
                  <label className="flex items-center gap-2">
                    <input type="checkbox" className="w-6 h-6 border-2 border-gds-black" />
                    <span>Private Members</span>
                  </label>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Results */}
        <div className="md:col-span-3">
          <div className="flex justify-between items-center border-b border-gray-300 pb-2 mb-4">
            <span className="font-bold text-lg">{bills.length} bills found</span>
            <select className="border-2 border-gds-black p-1 text-sm">
              <option>Updated (newest)</option>
              <option>Alphabetical</option>
            </select>
          </div>

          <ul className="space-y-4">
            {bills.length === 0 ? (
              <p>No bills found in the database.</p>
            ) : (
              bills.map(bill => (
                <li key={bill._id || bill.id} className="border-b border-gray-200 pb-4">
                  <a href="#" className="text-2xl font-bold text-gds-blue underline decoration-2 underline-offset-4 hover:text-gds-hover-blue block mb-2">
                    {bill.title}
                  </a>
                  <div className="flex flex-wrap gap-4 text-sm font-bold">
                    <span className="bg-gds-grey px-2 py-0.5">Status: {bill.status}</span>
                    <span className="text-gds-dark-grey mr-2 italic">Originating House: {bill.house}</span>
                    <span className="text-gds-dark-grey italic">Type: {bill.type}</span>
                  </div>
                </li>
              ))
            )}
          </ul>
        </div>
      </div>
    </motion.div>
  );
};
