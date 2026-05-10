import React, { useEffect, useState } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { motion } from 'motion/react';
import { Search, ExternalLink, ChevronRight } from 'lucide-react';

export const SearchResults = () => {
  const [searchParams] = useSearchParams();
  const query = searchParams.get('q') || '';
  const [results, setResults] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (query) {
      setLoading(true);
      fetch(`/api/search?q=${encodeURIComponent(query)}`)
        .then(res => res.json())
        .then(data => {
          setResults(data);
          setLoading(false);
        })
        .catch(err => {
          console.error(err);
          setLoading(false);
        });
    }
  }, [query]);

  return (
    <div className="bg-white min-h-screen pb-20">
      <div className="bg-gds-blue py-8 border-b-4 border-gds-black">
        <div className="govuk-width-container">
          <div className="flex items-center gap-4 text-white">
            <h1 className="text-3xl font-bold">Search results for "{query}"</h1>
          </div>
        </div>
      </div>

      <div className="govuk-width-container py-12">
        <div className="max-w-3xl">
          <p className="text-lg mb-8 font-bold">
            {loading ? 'Searching...' : `${results.length} results found`}
          </p>

          <div className="space-y-8">
            {results.length > 0 ? (
              results.map((result, idx) => (
                <motion.div 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.05 }}
                  key={idx} 
                  className="group"
                >
                  <Link to={result.path} className="block">
                    <h2 className="text-2xl font-bold text-gds-blue underline decoration-2 underline-offset-4 group-hover:text-gds-hover-blue mb-1">
                      {result.title}
                    </h2>
                    <div className="flex items-center gap-2 text-sm">
                      <span className="font-bold uppercase tracking-wider text-gds-dark-grey">{result.type}</span>
                      <ChevronRight className="w-3 h-3 text-gds-dark-grey" />
                    </div>
                  </Link>
                </motion.div>
              ))
            ) : !loading && (
              <div className="bg-gds-grey p-8 border-l-4 border-gds-black">
                <h2 className="text-xl font-bold mb-2">No results found</h2>
                <p>Try searching for something else, or check your spelling.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
