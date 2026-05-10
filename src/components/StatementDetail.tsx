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
        const res = await fetch(`/api/statements/${id}`);
        if (res.ok) {
          const item = await res.json();
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
        <div className="flex flex-col gap-1 mb-6 pb-6 border-b border-gray-300">
          <p className="text-lg">Published by: <span className="font-bold">{statement.publisher}</span></p>
          <p className="text-gds-dark-grey">Date: {statement.date}</p>
        </div>

        {statement.imageUrl && (
          <div className="mb-10 aspect-video w-full overflow-hidden bg-gray-100 border-b-4 border-gds-black">
            <img src={statement.imageUrl} alt={statement.title} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
          </div>
        )}

        <div className="prose prose-xl max-w-none text-gds-black whitespace-pre-wrap">
          {statement.content}
        </div>
      </article>
    </motion.div>
  );
};
