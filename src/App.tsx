/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { Suspense } from 'react';
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { Header } from './components/Header';
import { SearchHero } from './components/SearchHero';
import { PhaseBanner } from './components/PhaseBanner';
import { PopularServices } from './components/PopularServices';
import { Footer } from './components/Footer';
import { CookieBanner } from './components/CookieBanner';

const Home = () => (
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
            <div className="border-t-2 border-gray-200 pt-4">
              <span className="text-sm text-gds-dark-grey block mb-1">10 May 2026 — News story</span>
              <a href="#" className="text-xl font-bold text-gds-blue underline decoration-2 underline-offset-4 hover:text-gds-hover-blue">
                Prime Minister announces new measures to support small businesses
              </a>
            </div>
            <div className="border-t-2 border-gray-200 pt-4">
              <span className="text-sm text-gds-dark-grey block mb-1">09 May 2026 — Guidance</span>
              <a href="#" className="text-xl font-bold text-gds-blue underline decoration-2 underline-offset-4 hover:text-gds-hover-blue">
                Revised guidance on environmental protection regulations
              </a>
            </div>
          </div>
          <div className="flex flex-col gap-6">
            <div className="bg-gds-grey p-8 flex flex-col gap-4">
              <h3 className="text-2xl font-bold">Find out how government works</h3>
              <ul className="space-y-4">
                <li><a href="#" className="text-lg font-bold text-gds-blue underline">Get involved and have your say</a></li>
                <li><a href="#" className="text-lg font-bold text-gds-blue underline">How government is run and structured</a></li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </section>
  </motion.div>
);

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
        
        <main className="flex-grow">
          <AnimatePresence mode="wait">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/benefits" element={<Placeholder title="Benefits" />} />
              <Route path="/business" element={<Placeholder title="Business and self-employed" />} />
              <Route path="/driving" element={<Placeholder title="Driving and transport" />} />
              <Route path="*" element={<Home />} />
            </Routes>
          </AnimatePresence>
        </main>
        
        <Footer />
      </div>
    </BrowserRouter>
  );
}
