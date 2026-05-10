import React, { useState } from 'react';
import { Search } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const SearchHero = () => {
  const [query, setQuery] = useState('');
  const navigate = useNavigate();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      navigate(`/search?q=${encodeURIComponent(query.trim())}`);
    }
  };

  return (
    <section className="bg-gds-blue text-white py-12 md:py-20">
      <div className="govuk-width-container">
        <h1 className="text-4xl md:text-[3.5rem] font-bold leading-tight mb-8">
          Welcome to GOV.UK
        </h1>
        <p className="text-xl md:text-2xl mb-10 max-w-2xl">
          The best place to find government services and information:
          <span className="block font-bold">simpler, clearer, faster.</span>
        </p>
        
        <form onSubmit={handleSearch} className="relative max-w-3xl">
          <input 
            type="text" 
            placeholder="Search GOV.UK"
            className="w-full h-14 md:h-16 px-6 pr-16 text-xl md:text-2xl text-gds-black bg-white border-4 border-white focus:outline-none focus:ring-4 focus:ring-gds-yellow"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
          <button 
            type="submit"
            className="absolute right-0 top-0 h-14 md:h-16 w-14 md:w-16 bg-gds-black flex items-center justify-center hover:bg-gds-dark-grey transition-colors"
          >
            <Search className="w-8 h-8" />
          </button>
        </form>
      </div>
    </section>
  );
};
