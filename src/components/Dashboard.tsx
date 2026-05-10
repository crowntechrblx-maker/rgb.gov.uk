import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { useNavigate, Link } from 'react-router-dom';
import { 
  FilePlus, 
  LayoutDashboard, 
  LogOut, 
  CheckCircle2, 
  Clock, 
  MessageSquare,
  AlertCircle
} from 'lucide-react';

interface Statement {
  _id?: string;
  id?: string;
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
  const userRole = localStorage.getItem('gov_role') || 'USER';
  const [isCreatingBill, setIsCreatingBill] = useState(false);
  const [billTitle, setBillTitle] = useState('');
  const [billHouse, setBillHouse] = useState('Commons');
  const [billType, setBillType] = useState('Government');

  const handleCreateBill = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await fetch('/api/bills', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ 
          title: billTitle, 
          status: 'First Reading', 
          house: billHouse, 
          type: billType 
        }),
      });

      if (response.ok) {
        const newBill = await response.json();
        setBills([newBill, ...bills]);
        setBillTitle('');
        setIsCreatingBill(false);
      }
    } catch (err) { console.error(err); }
  };

  const [respondingTo, setRespondingTo] = useState<string | null>(null);
  const [responseContent, setResponseContent] = useState('');

  const handleReplyPetition = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!respondingTo) return;
    try {
      const res = await fetch(`/api/petitions/${respondingTo}/reply`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ content: responseContent }),
      });
      if (res.ok) {
        setRespondingTo(null);
        setResponseContent('');
        fetchPetitions();
      }
    } catch (err) { console.error(err); }
  };

  const [activeTab, setActiveTab] = useState('statements');

  useEffect(() => {
    fetchStatements();
    fetchPetitions();
    fetchBills();
  }, []);

  const fetchStatements = async () => {
    try {
      const res = await fetch('/api/statements');
      if (res.ok) setStatements(await res.json());
    } catch (err) { console.error(err); }
  };

  const [petitions, setPetitions] = useState<any[]>([]);
  const fetchPetitions = async () => {
    try {
      const res = await fetch('/api/petitions');
      if (res.ok) setPetitions(await res.json());
    } catch (err) { console.error(err); }
  };

  const [bills, setBills] = useState<any[]>([]);
  const fetchBills = async () => {
    try {
      const res = await fetch('/api/bills');
      if (res.ok) setBills(await res.json());
    } catch (err) { console.error(err); }
  };

  const handleLogout = () => {
    localStorage.clear();
    navigate('/');
  };

  const [isCreatingPetition, setIsCreatingPetition] = useState(false);
  const [petTitle, setPetTitle] = useState('');
  const [petContent, setPetContent] = useState('');

  const handleCreatePetition = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await fetch('/api/petitions', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ title: petTitle, content: petContent }),
      });

      if (response.ok) {
        const newPet = await response.json();
        setPetitions([newPet, ...petitions]);
        setPetTitle('');
        setPetContent('');
        setIsCreatingPetition(false);
      }
    } catch (err) { console.error(err); }
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
        const data = await response.json();
        alert(data.message || 'Failed to publish');
      }
    } catch (err) {
      console.error('Publish error:', err);
    }
  };

  const canPublishStatements = ['ADMIN', 'CLERK'].includes(userRole);
  const canUpdateBills = ['ADMIN', 'CLERK'].includes(userRole);
  const canReplyToPetitions = ['ADMIN', 'MEMBER'].includes(userRole);

  return (
    <div className="bg-gds-grey min-h-screen font-sans">
      <div className="bg-white border-b border-gray-200 py-4 mb-8">
        <div className="govuk-width-container flex justify-between items-center">
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <LayoutDashboard className="w-6 h-6 text-gds-blue" />
            GOV.UK Portal
          </h1>
          <div className="flex items-center gap-4 text-right">
            <div className="flex flex-col items-end">
              <span className="text-sm font-bold text-gds-black">{userEmail}</span>
              <span className="text-[10px] bg-gds-blue text-white px-1 font-bold uppercase tracking-wider">{userRole}</span>
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
        {/* Navigation Tabs */}
        <div className="flex gap-4 mb-8 border-b border-gray-300">
          <button 
            onClick={() => setActiveTab('statements')}
            className={`px-4 py-2 font-bold ${activeTab === 'statements' ? 'border-b-4 border-gds-blue' : 'text-gds-dark-grey'}`}
          >
            Statements
          </button>
          <button 
            onClick={() => setActiveTab('petitions')}
            className={`px-4 py-2 font-bold ${activeTab === 'petitions' ? 'border-b-4 border-gds-blue' : 'text-gds-dark-grey'}`}
          >
            Petitions
          </button>
          {canUpdateBills && (
            <button 
              onClick={() => setActiveTab('bills')}
              className={`px-4 py-2 font-bold ${activeTab === 'bills' ? 'border-b-4 border-gds-blue' : 'text-gds-dark-grey'}`}
            >
              Bills
            </button>
          )}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            {activeTab === 'statements' && (
              <section className="space-y-6">
                <div className="flex justify-between items-center border-b-2 border-gds-black pb-2">
                  <h2 className="text-3xl font-bold">Statements</h2>
                  {canPublishStatements && (
                    <button 
                      onClick={() => setIsPublishing(true)}
                      className="bg-gds-blue text-white px-4 py-1 font-bold"
                    >
                      New Statement
                    </button>
                  )}
                </div>
                {/* Statement List logic... */}
                <div className="space-y-4">
                  {statements.map((s, i) => (
                    <div key={s._id || i} className="bg-white p-4 border-l-4 border-gds-blue shadow-sm">
                      <h3 className="font-bold">{s.title}</h3>
                      <p className="text-sm text-gds-dark-grey">{s.date}</p>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {activeTab === 'petitions' && (
              <section className="space-y-6">
                <div className="flex justify-between items-center border-b-2 border-gds-black pb-2">
                  <h2 className="text-3xl font-bold">Petitions</h2>
                  <button 
                    onClick={() => setIsCreatingPetition(true)}
                    className="bg-purple-600 text-white px-4 py-1 font-bold"
                  >
                    Start Petition
                  </button>
                </div>
                {/* Petition List */}
                <div className="space-y-4">
                  {petitions.length === 0 ? (
                    <div className="p-8 border-2 border-dashed border-gray-300 text-center">
                      <p>No petitions found.</p>
                    </div>
                  ) : (
                    petitions.map((p, i) => (
                      <div key={p._id || i} className="bg-white p-4 border-l-4 border-purple-600 shadow-sm">
                        <Link to={`/petitions/${p._id || p.id}`} className="font-bold text-gds-blue underline">{p.title}</Link>
                        <div className="flex justify-between items-center mt-2">
                          <span className="text-sm font-bold text-gds-dark-grey">{p.signatures} signatures</span>
                          {canReplyToPetitions && p.status === 'Open' && (
                            <button 
                              onClick={() => setRespondingTo(p._id)}
                              className="bg-gds-blue text-white px-3 py-0.5 text-xs font-bold"
                            >
                              Draft Response
                            </button>
                          )}
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </section>
            )}

            {activeTab === 'bills' && (
              <section className="space-y-6">
                <div className="flex justify-between items-center border-b-2 border-gds-black pb-2">
                  <h2 className="text-3xl font-bold">Parliamentary Bills</h2>
                  <button 
                    onClick={() => setIsCreatingBill(true)}
                    className="bg-gds-blue text-white px-4 py-1 font-bold"
                  >
                    Add Bill
                  </button>
                </div>
                <div className="space-y-4">
                  {bills.map((b, i) => (
                    <div key={b._id || i} className="bg-white p-4 border-l-4 border-gds-black shadow-sm">
                      <h3 className="font-bold">{b.title}</h3>
                      <div className="flex justify-between items-center mt-2">
                        <span className="text-sm bg-gds-grey px-2">{b.status}</span>
                        <button className="text-gds-blue underline text-sm font-bold">Update Status</button>
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            )}
          </div>

          <div className="space-y-6">
            <div className="bg-white p-6 border-t-4 border-gds-blue">
              <h3 className="text-xl font-bold mb-4">Quick Links</h3>
              <ul className="space-y-4 text-sm font-bold">
                <li><Link to="/bills" className="text-gds-blue underline">View public bills database</Link></li>
                <li><Link to="/petitions" className="text-gds-blue underline">View active petitions</Link></li>
                <li><Link to="/statements" className="text-gds-blue underline">View all statements</Link></li>
              </ul>
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

      {/* Petition Modal */}
      {isCreatingPetition && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <motion.div 
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-white w-full max-w-2xl p-8 shadow-2xl"
          >
            <h2 className="text-3xl font-bold mb-6">Start a petition</h2>
            <form onSubmit={handleCreatePetition} className="space-y-6">
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
                  rows={6}
                  className="border-2 border-gds-black p-2 focus:ring-4 focus:ring-gds-yellow outline-none"
                  value={petContent}
                  onChange={(e) => setPetContent(e.target.value)}
                  placeholder="Explain why this petition is important..."
                  required
                />
              </div>
              <div className="flex gap-4">
                <button 
                  type="submit"
                  className="bg-purple-600 text-white px-6 py-2 font-bold hover:bg-purple-700"
                >
                  Launch petition
                </button>
                <button 
                  type="button"
                  onClick={() => setIsCreatingPetition(false)}
                  className="text-gds-blue underline font-bold"
                >
                  Cancel
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
      {/* Petition Response Modal */}
      {respondingTo && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <motion.div 
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-white w-full max-w-2xl p-8 shadow-2xl"
          >
            <h2 className="text-3xl font-bold mb-6">Government Response</h2>
            <form onSubmit={handleReplyPetition} className="space-y-6">
              <div className="flex flex-col gap-2">
                <label className="font-bold">Enter official response</label>
                <textarea 
                  autoFocus
                  rows={8}
                  className="border-2 border-gds-black p-2 focus:ring-4 focus:ring-gds-yellow outline-none"
                  value={responseContent}
                  onChange={(e) => setResponseContent(e.target.value)}
                  placeholder="Draft the official response or debate outcome..."
                  required
                />
              </div>
              <div className="flex gap-4">
                <button type="submit" className="bg-gds-blue text-white px-6 py-2 font-bold">Publish Response</button>
                <button type="button" onClick={() => setRespondingTo(null)} className="text-gds-blue underline font-bold">Cancel</button>
              </div>
            </form>
          </motion.div>
        </div>
      )}

      {/* Add Bill Modal */}
      {isCreatingBill && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <motion.div 
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-white w-full max-w-2xl p-8 shadow-2xl"
          >
            <h2 className="text-3xl font-bold mb-6">Register a new Bill</h2>
            <form onSubmit={handleCreateBill} className="space-y-6">
              <div className="flex flex-col gap-2">
                <label className="font-bold">Bill Title</label>
                <input 
                  autoFocus
                  className="border-2 border-gds-black p-2 focus:ring-4 focus:ring-gds-yellow outline-none"
                  value={billTitle}
                  onChange={(e) => setBillTitle(e.target.value)}
                  required
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="flex flex-col gap-2">
                  <label className="font-bold">Originating House</label>
                  <select 
                    className="border-2 border-gds-black p-2"
                    value={billHouse}
                    onChange={(e) => setBillHouse(e.target.value)}
                  >
                    <option value="Commons">House of Commons</option>
                    <option value="Lords">House of Lords</option>
                  </select>
                </div>
                <div className="flex flex-col gap-2">
                  <label className="font-bold">Bill Type</label>
                  <select 
                    className="border-2 border-gds-black p-2"
                    value={billType}
                    onChange={(e) => setBillType(e.target.value)}
                  >
                    <option value="Government">Government Bill</option>
                    <option value="Private Members">Private Members Bill</option>
                    <option value="Hybrid">Hybrid Bill</option>
                  </select>
                </div>
              </div>
              <div className="flex gap-4">
                <button type="submit" className="bg-gds-blue text-white px-6 py-2 font-bold">Create Bill Record</button>
                <button type="button" onClick={() => setIsCreatingBill(false)} className="text-gds-blue underline font-bold">Cancel</button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </div>
  );
};
