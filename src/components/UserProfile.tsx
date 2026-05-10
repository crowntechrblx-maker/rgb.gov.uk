import React, { useEffect, useState } from 'react';
import { motion } from 'motion/react';
import { Link, useNavigate } from 'react-router-dom';
import { Bell, Heart, FileText, ChevronRight, LogOut, Settings, User } from 'lucide-react';

export const UserProfile = () => {
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('gov_token');
    fetch('/api/profile', {
      headers: { 'Authorization': `Bearer ${token}` }
    })
      .then(res => res.json())
      .then(data => {
        setProfile(data);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
  }, []);

  const handleLogout = () => {
    localStorage.clear();
    navigate('/login');
  };

  if (loading) return <div className="py-20 text-center">Loading profile...</div>;

  return (
    <div className="bg-white min-h-screen pb-20">
      <div className="bg-gds-grey py-12 border-b-2 border-gray-200">
        <div className="govuk-width-container flex flex-col md:flex-row justify-between items-end gap-6">
          <div>
            <h1 className="text-4xl md:text-5xl font-bold mb-2">Account for {profile?.name || profile?.email}</h1>
            <p className="text-xl text-gds-dark-grey">{profile?.email}</p>
          </div>
          <button 
            onClick={handleLogout}
            className="flex items-center gap-2 text-gds-blue underline font-bold"
          >
            <LogOut className="w-5 h-5" /> Sign out
          </button>
        </div>
      </div>

      <div className="govuk-width-container py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          <div className="lg:col-span-2 space-y-12">
            <section>
              <h2 className="text-3xl font-bold mb-6 flex items-center gap-3">
                <Heart className="w-7 h-7 text-red-500" /> Followed Bills
              </h2>
              <div className="space-y-4">
                {profile?.followedBills?.length > 0 ? (
                  profile.followedBills.map((bill: any) => (
                    <Link 
                      key={bill._id} 
                      to={`/bills/${bill._id}`}
                      className="block p-6 bg-white border-2 border-gray-200 hover:border-gds-blue transition-colors group"
                    >
                      <div className="flex justify-between items-center">
                        <div>
                          <h3 className="text-xl font-bold group-hover:text-gds-blue underline">{bill.title}</h3>
                          <p className="text-sm text-gds-dark-grey mt-1">Status: {bill.status}</p>
                        </div>
                        <ChevronRight className="w-6 h-6 text-gray-300 group-hover:text-gds-blue" />
                      </div>
                    </Link>
                  ))
                ) : (
                  <div className="p-8 bg-gray-50 border-2 border-dashed border-gray-300 text-center">
                    <p className="text-gds-dark-grey">You are not following any bills yet.</p>
                    <Link to="/bills" className="text-gds-blue underline font-bold mt-2 inline-block">Browse bills</Link>
                  </div>
                )}
              </div>
            </section>

            <section>
              <h2 className="text-3xl font-bold mb-6 flex items-center gap-3">
                <FileText className="w-7 h-7 text-gds-blue" /> Your Petitions
              </h2>
              <div className="space-y-4">
                {profile?.followedPetitions?.length > 0 ? (
                  profile.followedPetitions.map((p: any) => (
                    <Link 
                      key={p._id} 
                      to={`/petitions/${p._id}`}
                      className="block p-6 bg-white border-2 border-gray-200 hover:border-gds-blue transition-colors group"
                    >
                      <div className="flex justify-between items-center">
                        <div>
                          <h3 className="text-xl font-bold group-hover:text-gds-blue underline">{p.title}</h3>
                          <p className="text-sm text-gds-dark-grey mt-1">{p.signatures} signatures</p>
                        </div>
                        <ChevronRight className="w-6 h-6 text-gray-300 group-hover:text-gds-blue" />
                      </div>
                    </Link>
                  ))
                ) : (
                  <div className="p-8 bg-gray-50 border-2 border-dashed border-gray-300 text-center">
                    <p className="text-gds-dark-grey">You haven't signed or created any petitions recently.</p>
                    <Link to="/petitions" className="text-gds-blue underline font-bold mt-2 inline-block">Browse petitions</Link>
                  </div>
                )}
              </div>
            </section>
          </div>

          <div className="lg:col-span-1">
            <div className="bg-gds-grey p-6 space-y-8">
              <div>
                <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                  <Settings className="w-5 h-5" /> Settings
                </h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="font-bold">Email alerts</span>
                    <button className="bg-gds-blue text-white px-3 py-1 text-sm font-bold">Enabled</button>
                  </div>
                  <p className="text-sm text-gds-dark-grey">Get notified when bills you follow change stage or status.</p>
                </div>
              </div>

              <div className="pt-8 border-t border-gray-300">
                <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                  <User className="w-5 h-5" /> Identity
                </h3>
                <p className="text-sm">Logged in via Google Account</p>
                <div className="mt-4 p-4 bg-white border-l-4 border-gds-black text-xs font-mono break-all">
                  Token: {localStorage.getItem('gov_token')?.substring(0, 20)}...
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
