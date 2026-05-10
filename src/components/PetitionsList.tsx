import React from 'react';
import { motion } from 'motion/react';
import { Link } from 'react-router-dom';

export const PetitionsList = () => {
  const [petitions, setPetitions] = React.useState<any[]>([]);

  React.useEffect(() => {
    const fetchPetitions = async () => {
      try {
        const res = await fetch('/api/petitions');
        if (res.ok) setPetitions(await res.json());
      } catch (err) { console.error(err); }
    };
    fetchPetitions();
  }, []);

  const [isCreating, setIsCreating] = React.useState(false);
  const [petTitle, setPetTitle] = React.useState('');
  const [petContent, setPetContent] = React.useState('');
  const [creatorName, setCreatorName] = React.useState('');
  const [creatorEmail, setCreatorEmail] = React.useState('');

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch('/api/petitions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          title: petTitle, 
          content: petContent, 
          creatorName, 
          creatorEmail 
        }),
      });
      if (res.ok) {
        setIsCreating(false);
        setPetTitle('');
        setPetContent('');
        setCreatorName('');
        setCreatorEmail('');
        // Refresh list
        const refreshed = await fetch('/api/petitions');
        if (refreshed.ok) setPetitions(await refreshed.json());
      }
    } catch (err) { console.error(err); }
  };

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="govuk-width-container py-12"
    >
      <div className="flex flex-col gap-4 mb-12">
        <Link to="/" className="text-gds-blue underline font-bold flex items-center gap-2">
          ← Home
        </Link>
        <h1 className="text-5xl md:text-7xl font-bold">Petitions</h1>
        <p className="text-2xl pt-4 max-w-3xl">
          Petitions to Government and Parliament. If a petition gets 10,000 signatures, government will respond. At 100,000 signatures, it will be considered for debate in Parliament.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
        <div className="lg:col-span-2 space-y-12">
          <section>
            <h2 className="text-3xl font-bold border-b-4 border-gds-black pb-2 mb-6">Popular petitions</h2>
            <ul className="space-y-8">
              {petitions.map(p => (
                <li key={p._id || p.id} className="border-b border-gray-200 pb-8">
                  <Link to={`/petitions/${p._id || p.id}`} className="text-3xl font-bold text-gds-blue underline decoration-2 underline-offset-4 block mb-4">
                    {p.title}
                  </Link>
                  <div className="flex items-end gap-4">
                    <div className="flex flex-col">
                      <span className="text-4xl font-bold">{p.signatures?.toLocaleString() || 0}</span>
                      <span className="text-sm font-bold uppercase text-gds-dark-grey">signatures</span>
                    </div>
                    <div className="mb-1">
                      <span className={`px-2 py-1 font-bold text-sm ${p.status?.includes('Debated') ? 'bg-purple-100 text-purple-800' : 'bg-gds-grey'}`}>
                        {p.status || 'Open'}
                      </span>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          </section>

          <div className="bg-gds-blue text-white p-8">
            <h2 className="text-3xl font-bold mb-4">Start your own petition</h2>
            <p className="text-xl mb-6">It only takes a few minutes to start a petition and get your voice heard.</p>
            <button 
              onClick={() => setIsCreating(true)}
              className="bg-white text-gds-blue px-6 py-3 text-xl font-bold hover:bg-gds-grey transition-colors"
            >
              Start a petition
            </button>
          </div>
        </div>

        <div className="space-y-8">
          <div className="bg-gds-grey p-6">
            <h3 className="text-xl font-bold mb-4">How petitions work</h3>
            <ul className="space-y-4 text-sm">
              <li className="flex gap-3">
                <span className="font-bold">1</span>
                <span>Petitions are submitted by members of the public.</span>
              </li>
              <li className="flex gap-3">
                <span className="font-bold">2</span>
                <span>The Petitions Committee reviews the petition.</span>
              </li>
              <li className="flex gap-3">
                <span className="font-bold">3</span>
                <span>Petitions reaching 10,000 signatures get a response.</span>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Start Petition Modal */}
      {isCreating && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <motion.div 
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-white w-full max-w-2xl p-8 shadow-2xl max-h-[90vh] overflow-y-auto"
          >
            <h2 className="text-3xl font-bold mb-6">Start a petition</h2>
            <form onSubmit={handleCreate} className="space-y-6">
              <div className="flex flex-col gap-2">
                <label className="font-bold">What do you want us to do?</label>
                <input 
                  autoFocus
                  className="border-2 border-gds-black p-2 focus:ring-4 focus:ring-gds-yellow outline-none"
                  value={petTitle}
                  onChange={(e) => setPetTitle(e.target.value)}
                  placeholder="e.g. Ban energy drinks for under 16s"
                  required
                />
              </div>
              <div className="flex flex-col gap-2">
                <label className="font-bold">Background info</label>
                <textarea 
                  rows={4}
                  className="border-2 border-gds-black p-2 focus:ring-4 focus:ring-gds-yellow outline-none"
                  value={petContent}
                  onChange={(e) => setPetContent(e.target.value)}
                  placeholder="Explain why this petition is important..."
                  required
                />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex flex-col gap-2">
                  <label className="font-bold">Your name</label>
                  <input 
                    className="border-2 border-gds-black p-2"
                    value={creatorName}
                    onChange={(e) => setCreatorName(e.target.value)}
                    required
                  />
                </div>
                <div className="flex flex-col gap-2">
                  <label className="font-bold">Your email</label>
                  <input 
                    type="email"
                    className="border-2 border-gds-black p-2"
                    value={creatorEmail}
                    onChange={(e) => setCreatorEmail(e.target.value)}
                    required
                  />
                </div>
              </div>
              <p className="text-sm text-gds-dark-grey italic">By submitting, you agree to our terms. We will email you to verify your signature.</p>
              <div className="flex gap-4">
                <button 
                  type="submit"
                  className="bg-purple-600 text-white px-6 py-2 font-bold hover:bg-purple-700"
                >
                  Create petition
                </button>
                <button 
                  type="button"
                  onClick={() => setIsCreating(false)}
                  className="text-gds-blue underline font-bold"
                >
                  Cancel
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </motion.div>
  );
};
