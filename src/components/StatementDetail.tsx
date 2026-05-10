import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'motion/react';

export const StatementDetail = () => {
  const { id } = useParams();
  const [statement, setStatement] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDetail = async () => {
      try {
        const res = await fetch(`/api/statements`);
        if (res.ok) {
          const list = await res.json();
          const item = list.find((s: any) => s._id === id || s.id === id);
          setStatement(item);
        }
      } catch (err) { console.error(err); }
      finally { setLoading(false); }
    };
    fetchDetail();
  }, [id]);

  if (loading) return <div className="govuk-width-container py-12">Loading...</div>;
  if (!statement) return <div className="govuk-width-container py-12">Statement not found.</div>;

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="govuk-width-container py-12"
    >
      <Link to="/statements" className="text-gds-blue underline font-bold mb-8 block">← Back to Statements</Link>
      <article className="max-w-4xl">
        <span className="bg-gds-blue text-white px-2 py-1 text-sm font-bold uppercase mb-4 inline-block">Official Statement</span>
        <h1 className="text-4xl md:text-6xl font-bold mb-6">{statement.title}</h1>
        <div className="flex flex-col gap-1 mb-10 pb-6 border-b border-gray-300">
          <p className="text-lg">Published by: <span className="font-bold">{statement.publisher}</span></p>
          <p className="text-gds-dark-grey">Date: {statement.date}</p>
        </div>
        <div className="prose prose-xl max-w-none text-gds-black whitespace-pre-wrap">
          {statement.content}
        </div>
      </article>
    </motion.div>
  );
};
