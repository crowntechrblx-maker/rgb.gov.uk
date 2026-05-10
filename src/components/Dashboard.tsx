import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { useNavigate } from 'react-router-dom';
import { FilePlus, FileText, LayoutDashboard, LogOut } from 'lucide-react';

interface Statement {
  id: string;
  title: string;
  content: string;
  date: string;
  publisher: string;
}

export const Dashboard = () => {
  const [statements, setStatements] = useState<Statement[]>([]);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [isPublishing, setIsPublishing] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();
  const userEmail = localStorage.getItem('gov_email');
  const token = localStorage.getItem('gov_token');
  const isAdmin = localStorage.getItem('gov_isAdmin') === 'true';

  useEffect(() => {
    fetchStatements();
  }, []);

  const fetchStatements = async () => {
    try {
      const res = await fetch('/api/statements');
      if (res.ok) {
        const data = await res.json();
        setStatements(data);
      }
    } catch (err) {
      console.error('Error fetching statements:', err);
      const saved = localStorage.getItem('gov_statements');
      if (saved) setStatements(JSON.parse(saved));
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('gov_auth');
    localStorage.removeItem('gov_token');
    localStorage.removeItem('gov_isAdmin');
    navigate('/');
  };

  const handlePublish = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const response = await fetch('/api/statements', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ title, content }),
      });

      if (response.ok) {
        const newStatement = await response.json();
        setStatements([newStatement, ...statements]);
        setTitle('');
        setContent('');
        setIsPublishing(false);
      } else {
        const error = await response.json();
        alert(error.message || 'Failed to publish');
      }
    } catch (err) {
      console.error('Publish error:', err);
      // Fallback for prototype
      const mockStatement: Statement = {
        id: Date.now().toString(),
        title,
        content,
        date: new Date().toLocaleDateString('en-GB'),
        publisher: userEmail || 'Demo'
      };
      setStatements([mockStatement, ...statements]);
      localStorage.setItem('gov_statements', JSON.stringify([mockStatement, ...statements]));
      setTitle('');
      setContent('');
      setIsPublishing(false);
    }
  };

  return (
    <div className="bg-gds-grey min-h-screen font-sans">
      <div className="bg-white border-b border-gray-200 py-4 mb-8">
        <div className="govuk-width-container flex justify-between items-center">
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <LayoutDashboard className="w-6 h-6 text-gds-blue" />
            Publisher Dashboard
          </h1>
          <div className="flex items-center gap-4">
            <div className="flex flex-col items-end">
              <span className="text-sm font-bold text-gds-black">{userEmail}</span>
              {isAdmin && (
                <span className="text-[10px] bg-gds-blue text-white px-1 font-bold uppercase tracking-wider">Admin</span>
              )}
            </div>
            <button 
              onClick={handleLogout}
              className="text-sm text-red-600 underline hover:no-underline flex items-center gap-1"
            >
              <LogOut className="w-4 h-4" /> Sign out
            </button>
          </div>
        </div>
      </div>

      <div className="govuk-width-container">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column: List */}
          <div className="lg:col-span-2 space-y-6">
            <div className="flex justify-between items-center border-b-2 border-gds-black pb-2">
              <h2 className="text-3xl font-bold">Your statements</h2>
              <button 
                onClick={() => setIsPublishing(true)}
                className="bg-gds-blue text-white px-4 py-2 font-bold hover:bg-gds-hover-blue transition-colors flex items-center gap-2"
              >
                <FilePlus className="w-5 h-5" /> New statement
              </button>
            </div>

            {statements.length === 0 ? (
              <div className="bg-white p-12 text-center border-2 border-dashed border-gray-300">
                <p className="text-xl text-gds-dark-grey">No statements published yet.</p>
              </div>
            ) : (
              <div className="space-y-4">
                {statements.map((s, i) => (
                  <motion.div 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    key={s._id || s.id || i} 
                    className="bg-white p-6 shadow-sm border-l-4 border-gds-blue"
                  >
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="text-xl font-bold text-gds-blue underline">{s.title}</h3>
                      <span className="text-sm text-gds-dark-grey">{s.date}</span>
                    </div>
                    <p className="text-gds-black line-clamp-2">{s.content}</p>
                    <div className="mt-4 flex gap-4 text-sm font-bold">
                      <button className="text-gds-blue underline">Edit</button>
                      <button className="text-red-600 underline">Delete</button>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </div>

          {/* Right Column: News & Status */}
          <div className="space-y-6">
            <div className="bg-white p-6 border-t-4 border-gds-blue">
              <h3 className="text-xl font-bold mb-4">System Status</h3>
              <ul className="space-y-3">
                <li className="flex items-center gap-2 text-green-700">
                  <div className="w-2 h-2 rounded-full bg-green-500"></div>
                  Database: Online
                </li>
                <li className="flex items-center gap-2 text-green-700">
                  <div className="w-2 h-2 rounded-full bg-green-500"></div>
                  Public API: Healthy
                </li>
              </ul>
            </div>
            <div className="bg-white p-6 border-t-4 border-gds-dark-grey">
              <h3 className="text-xl font-bold mb-4">Publisher Guidance</h3>
              <p className="text-sm">Please ensure all statements comply with the Civil Service Code and departmental guidelines.</p>
              <a href="#" className="text-sm text-gds-blue underline mt-2 block">Read full publishing guidelines</a>
            </div>
          </div>
        </div>
      </div>

      {/* Publishing Modal */}
      {isPublishing && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <motion.div 
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-white w-full max-w-2xl p-8 shadow-2xl"
          >
            <h2 className="text-3xl font-bold mb-6">Create global statement</h2>
            <form onSubmit={handlePublish} className="space-y-6">
              <div className="flex flex-col gap-2">
                <label className="font-bold">Title</label>
                <input 
                  autoFocus
                  className="border-2 border-gds-black p-2 focus:ring-4 focus:ring-gds-yellow outline-none"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  required
                />
              </div>
              <div className="flex flex-col gap-2">
                <label className="font-bold">Summary / Content</label>
                <textarea 
                  rows={6}
                  className="border-2 border-gds-black p-2 focus:ring-4 focus:ring-gds-yellow outline-none"
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  required
                />
              </div>
              <div className="flex gap-4">
                <button 
                  type="submit"
                  className="bg-gds-black text-white px-6 py-2 font-bold hover:bg-gds-dark-grey"
                >
                  Publish statement
                </button>
                <button 
                  type="button"
                  onClick={() => setIsPublishing(false)}
                  className="text-gds-blue underline font-bold"
                >
                  Cancel
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </div>
  );
};
