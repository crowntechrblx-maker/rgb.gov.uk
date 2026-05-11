/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { Suspense, useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Link, Navigate, useSearchParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { Header } from './components/Header';
import { SearchHero } from './components/SearchHero';
import { EmergencyAlertBanner } from './components/EmergencyAlertBanner';
import { PhaseBanner } from './components/PhaseBanner';
import { PopularServices } from './components/PopularServices';
import { Footer } from './components/Footer';
import { CookieBanner } from './components/CookieBanner';
import { Login } from './components/Login';
import { Dashboard } from './components/Dashboard';
import { BillsList } from './components/BillsList';
import { PetitionsList } from './components/PetitionsList';
import { MinistersList } from './components/MinistersList';
import { StatementsList } from './components/StatementsList';
import { StatementDetail } from './components/StatementDetail';
import { PetitionDetail } from './components/PetitionDetail';
import { BillDetail } from './components/BillDetail';
import { UserProfile } from './components/UserProfile';
import { SearchResults } from './components/SearchResults';
import { ServiceStatus } from './components/ServiceStatus';
import { ServiceTimeline } from './components/ServiceTimeline';
import { LifeGuide } from './components/LifeGuide';
import { TaxCalculator } from './components/TaxCalculator';
import { Privacy, Cookies, Terms, Accessibility } from './components/Legal';

const PrivateRoute = ({ children }: { children: React.ReactNode }) => {
  const auth = localStorage.getItem('gov_auth');
  return auth === 'true' ? <>{children}</> : <Navigate to="/login" />;
};

const AuthHandler = ({ children }: { children: React.ReactNode }) => {
  const [params, setParams] = useSearchParams();
  
  useEffect(() => {
    const token = params.get('auth_token');
    const email = params.get('email');
    const role = params.get('role');
    const name = params.get('name');

    if (token) {
      localStorage.setItem('gov_auth', 'true');
      localStorage.setItem('gov_token', token);
      localStorage.setItem('gov_email', email || '');
      localStorage.setItem('gov_role', role || '');
      localStorage.setItem('gov_name', name || '');
      
      // Clean URL
      params.delete('auth_token');
      params.delete('email');
      params.delete('role');
      params.delete('name');
      setParams(params);
    }
  }, [params, setParams]);

  return <>{children}</>;
};

const Home = () => {
  const [statements, setStatements] = useState<any[]>([]);

  useEffect(() => {
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
      }
    };
    fetchStatements();
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <SearchHero />
      <PhaseBanner />
      <PopularServices />
      
      {/* Extra section for government activity */}
      <section className="py-12 bg-white">
        <div className="govuk-width-container">
          <h2 className="text-3xl md:text-4xl font-bold mb-8 border-b-4 border-gds-black pb-4">
            Government activity
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            <div className="flex flex-col gap-4">
              <h3 className="text-2xl font-bold">Latest</h3>
              
              {/* Dynamic Statements */}
              {statements.slice(0, 3).map((s, i) => (
                <div key={s.id || s._id || i} className="border-t-2 border-gray-200 pt-4 flex gap-4">
                  {s.imageUrl && (
                    <div className="w-16 h-12 bg-gray-100 shrink-0 overflow-hidden">
                      <img src={s.imageUrl} alt="" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                    </div>
                  )}
                  <div className="flex-1">
                    <span className="text-sm text-gds-dark-grey block mb-1">{s.date} — Statement</span>
                    <Link to={`/statements/${s._id || s.id}`} className="text-xl font-bold text-gds-blue underline decoration-2 underline-offset-4 hover:text-gds-hover-blue">
                      {s.title}
                    </Link>
                  </div>
                </div>
              ))}

            </div>
            
            <div className="flex flex-col gap-6">
              <div className="bg-gds-grey p-8 flex flex-col gap-4">
                <h3 className="text-2xl font-bold">Find out how government works</h3>
                <ul className="space-y-4">
                  <li><Link to="/tax-calculator" className="text-lg font-bold text-gds-blue underline">Calculate your business tax</Link></li>
                  <li><Link to="/petitions" className="text-lg font-bold text-gds-blue underline">Get involved and have your say</Link></li>
                  <li><Link to="/ministers" className="text-lg font-bold text-gds-blue underline">How government is run and structured</Link></li>
                  <li><Link to="/timeline" className="text-lg font-bold text-gds-blue underline">Interactive service timeline</Link></li>
                  <li className="pt-2">
                    <span className="text-sm font-bold block mb-2">Step-by-step guides (Coming Soon)</span>
                    <Link to="/guides/set-up-business" className="text-lg font-bold text-gds-blue underline">Set up a business in the UK</Link>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>
    </motion.div>
  );
};


const Placeholder = ({ title }: { title: string }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    className="govuk-width-container py-12 md:py-20 min-h-[60vh]"
  >
    <Link to="/" className="text-gds-blue underline flex items-center gap-2 mb-8 font-bold">
      ← Back to GOV.UK
    </Link>
    <h1 className="text-4xl md:text-6xl font-bold mb-6">{title}</h1>
    <div className="border-l-8 border-gds-blue pl-8 py-4 bg-gds-grey">
      <p className="text-xl md:text-2xl text-gds-black">
        This is a prototype section for <strong>{title}</strong>. 
        In a real application, this would contain specific government guidance, application forms, or service information.
      </p>
    </div>
  </motion.div>
);

export default function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen flex flex-col selection:bg-gds-yellow selection:text-gds-black">
        <CookieBanner />
        <Header />
        <EmergencyAlertBanner />
        
        <main className="flex-grow">
          <AnimatePresence mode="wait">
            <AuthHandler>
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/login" element={<Login />} />
                <Route 
                  path="/dashboard" 
                  element={
                    <PrivateRoute>
                      <Dashboard />
                    </PrivateRoute>
                  } 
                />
                <Route path="/bills" element={<BillsList />} />
                <Route path="/bills/:id" element={<BillDetail />} />
                <Route path="/petitions" element={<PetitionsList />} />
                <Route path="/petitions/:id" element={<PetitionDetail />} />
                <Route path="/statements" element={<StatementsList />} />
                <Route path="/statements/:id" element={<StatementDetail />} />
                <Route path="/ministers" element={<MinistersList />} />
                <Route path="/timeline" element={<ServiceTimeline />} />
                <Route path="/guides/:slug" element={<LifeGuide />} />
                <Route path="/tax-calculator" element={<TaxCalculator />} />
                <Route path="/status" element={<ServiceStatus />} />
                <Route path="/profile" element={<PrivateRoute><UserProfile /></PrivateRoute>} />
                <Route path="/search" element={<SearchResults />} />
                <Route path="/privacy" element={<Privacy />} />
                <Route path="/cookies" element={<Cookies />} />
                <Route path="/terms" element={<Terms />} />
                <Route path="/accessibility" element={<Accessibility />} />
                <Route path="*" element={<Home />} />
              </Routes>
            </AuthHandler>
          </AnimatePresence>
        </main>
        
        <Footer />
      </div>
    </BrowserRouter>
  );
}
