import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'motion/react';

export const PetitionDetail = () => {
  const { id } = useParams();
  const [petition, setPetition] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [signing, setSigning] = useState(false);
  const userToken = localStorage.getItem('gov_token');

  useEffect(() => {
    fetchPetition();
  }, [id]);

  const fetchPetition = async () => {
    try {
      const res = await fetch(`/api/petitions/${id}`);
      if (res.ok) {
        const item = await res.json();
        setPetition(item);
      } else {
        const errorData = await res.json().catch(() => ({}));
        console.error("Failed to fetch petition:", errorData);
      }
    } catch (err) { console.error(err); }
    finally { setLoading(false); }
  };

  const [email, setEmail] = useState('');

  const handleSign = async () => {
    let finalEmail = email;
    if (!userToken && !email) {
      const input = prompt("Please enter your email to sign this petition:");
      if (!input) return;
      finalEmail = input;
    }
    
    setSigning(true);
    try {
      const res = await fetch(`/api/petitions/${id}/sign`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': userToken ? `Bearer ${userToken}` : '' 
        },
        body: JSON.stringify({ email: finalEmail })
      });
      if (res.ok) {
        alert("Petition signed successfully!");
        fetchPetition();
      } else {
        const data = await res.json();
        alert(data.message || "Failed to sign petition.");
      }
    } catch (err) { console.error(err); }
    finally { setSigning(false); }
  };

  if (loading) return <div className="govuk-width-container py-12">Loading...</div>;
  if (!petition) return <div className="govuk-width-container py-12">Petition not found.</div>;

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="govuk-width-container py-12"
    >
      <Link to="/petitions" className="text-gds-blue underline font-bold mb-8 block">← Back to Petitions</Link>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
        <div className="lg:col-span-2">
          <h1 className="text-4xl md:text-6xl font-bold mb-8">{petition.title}</h1>
          <div className="prose prose-lg mb-12">
            <p className="whitespace-pre-wrap text-xl">{petition.content}</p>
          </div>

          {petition.responses && petition.responses.length > 0 && (
            <div className="bg-gds-grey p-8 border-l-8 border-gds-blue mb-12">
              <h2 className="text-2xl font-bold mb-4">Government Response</h2>
              {petition.responses.map((r: any, i: number) => (
                <div key={i} className="space-y-2">
                  <p className="text-sm font-bold mb-2">Published {r.date} by {r.authorRole === 'MEMBER' ? 'the Government' : 'the Portal Administrator'}</p>
                  <p className="whitespace-pre-wrap">{r.content}</p>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="bg-gds-grey p-8 h-fit lg:sticky lg:top-8">
          <div className="flex flex-col gap-2 mb-8">
            <span className="text-5xl font-bold">{petition.signatures.toLocaleString()}</span>
            <span className="text-sm font-bold uppercase text-gds-dark-grey">signatures</span>
          </div>
          
          <div className="w-full h-4 bg-white mb-4">
            <div 
              className="h-full bg-gds-blue transition-all duration-1000" 
              style={{ width: `${Math.min(100, (petition.signatures / 100000) * 100)}%` }}
            ></div>
          </div>
          <p className="text-sm mb-8">
            {petition.signatures < 10000 ? (
              `Needs ${10000 - petition.signatures} more to get a response`
            ) : petition.signatures < 100000 ? (
              `Needs ${100000 - petition.signatures} more to be considered for debate`
            ) : (
              "This petition will be considered for debate in Parliament"
            )}
          </p>

          <button 
            onClick={handleSign}
            disabled={signing}
            className="w-full bg-gds-blue text-white py-4 text-xl font-bold hover:bg-gds-hover-blue transition-colors disabled:opacity-50"
          >
            {signing ? "Processing..." : "Sign this petition"}
          </button>
        </div>
      </div>
    </motion.div>
  );
};
