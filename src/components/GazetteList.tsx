import React, { useEffect, useState } from 'react';
import { motion } from 'motion/react';
import { FileText, Calendar, Tag, ChevronRight } from 'lucide-react';

export const GazetteList = () => {
  const [notices, setNotices] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/gazette')
      .then(res => res.json())
      .then(data => {
        setNotices(data);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
  }, []);

  return (
    <div className="bg-white min-h-screen pb-20">
      <div className="bg-[#1d70b8] text-white py-12 border-b-8 border-gds-black">
        <div className="govuk-width-container">
          <h1 className="text-4xl md:text-6xl font-bold mb-4">The Gazette</h1>
          <p className="text-xl md:text-2xl max-w-3xl">
            Official Public Record since 1665. View official notices of state, parliament, and planning notices.
          </p>
        </div>
      </div>

      <div className="govuk-width-container py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          <div className="lg:col-span-2 space-y-8">
            {loading ? (
              <div className="h-40 flex items-center justify-center">
                <div className="w-8 h-8 border-4 border-gds-blue border-t-transparent rounded-full animate-spin"></div>
              </div>
            ) : notices.map((notice, idx) => (
              <motion.div 
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: idx * 0.1 }}
                key={notice._id} 
                className="border-b-2 border-gray-200 pb-8"
              >
                <div className="flex items-center gap-4 text-sm font-bold text-gds-dark-grey mb-2">
                  <span className="bg-gds-grey px-2 py-1 uppercase">{notice.category}</span>
                  <span>Notice {notice.noticeNumber}</span>
                  <span>{notice.date}</span>
                </div>
                <h2 className="text-2xl font-bold mb-4 hover:text-gds-blue cursor-pointer">
                  {notice.title}
                </h2>
                <p className="text-lg text-gds-black line-clamp-3 mb-4">
                  {notice.content}
                </p>
                <button className="text-gds-blue underline font-bold flex items-center gap-1">
                  Read full notice <ChevronRight className="w-4 h-4" />
                </button>
              </motion.div>
            ))}
          </div>

          <div className="lg:col-span-1">
            <div className="bg-gds-grey p-6 sticky top-8">
              <h3 className="text-xl font-bold mb-6">Filter notices</h3>
              <div className="space-y-4">
                <button className="w-full text-left p-3 bg-white border-2 border-gds-black font-bold flex justify-between items-center">
                  All notices <ChevronRight className="w-4 h-4" />
                </button>
                <button className="w-full text-left p-3 bg-white border-2 border-gray-300 font-bold flex justify-between items-center hover:border-gds-black">
                  State <ChevronRight className="w-4 h-4" />
                </button>
                <button className="w-full text-left p-3 bg-white border-2 border-gray-300 font-bold flex justify-between items-center hover:border-gds-black">
                  Parliament <ChevronRight className="w-4 h-4" />
                </button>
                <button className="w-full text-left p-3 bg-white border-2 border-gray-300 font-bold flex justify-between items-center hover:border-gds-black">
                  Public Notices <ChevronRight className="w-4 h-4" />
                </button>
              </div>

              <div className="mt-12 pt-8 border-t border-gray-300">
                <h4 className="font-bold mb-4">About the Gazette</h4>
                <p className="text-sm text-gds-dark-grey">
                  The Gazette is the UK's official public record. It is published by TSO on behalf of The National Archives.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
