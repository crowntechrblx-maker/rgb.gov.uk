import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { ChevronRight, ChevronLeft, CheckCircle, Info, ArrowRight } from 'lucide-react';

interface GuideStep {
  title: string;
  content: string;
  type: 'Info' | 'Action' | 'Finish';
}

interface Guide {
  _id: string;
  title: string;
  description: string;
  steps: GuideStep[];
  category: string;
}

export const LifeGuide = () => {
  const { slug } = useParams();
  const [guide, setGuide] = useState<Guide | null>(null);
  const [currentStep, setCurrentStep] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`/api/guides/${slug}`)
      .then(res => res.json())
      .then(data => {
        setGuide(data);
        setLoading(false);
      });
  }, [slug]);

  if (loading) return <div className="py-20 text-center font-bold">Loading guide...</div>;
  if (!guide) return <div className="py-20 text-center font-bold text-red-600">Guide not found.</div>;

  const step = guide.steps?.[currentStep];
  const progress = guide.steps ? ((currentStep + 1) / guide.steps.length) * 100 : 0;

  return (
    <div className="bg-white min-h-screen pb-20">
      <div className="bg-gds-black text-white pt-12 pb-16">
        <div className="govuk-width-container">
          <Link to="/" className="text-sm border-b border-white hover:border-transparent transition-all mb-8 inline-block opacity-70">
            Back to GOV.UK
          </Link>
          <div className="flex items-center gap-3 mb-2 text-gds-grey opacity-80">
            <span className="text-xs font-bold uppercase tracking-widest">{guide.category}</span>
            <span className="bg-gds-yellow text-gds-black text-[10px] px-2 py-0.5 font-bold rounded">COMING SOON</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold mb-4">{guide.title}</h1>
          <p className="text-xl max-w-3xl opacity-80">{guide.description}</p>
        </div>
      </div>

      <div className="govuk-width-container -mt-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          <div className="lg:col-span-2">
            <div className="bg-white shadow-xl border border-gray-100 min-h-[500px] flex flex-col">
              {/* Progress Bar */}
              <div className="h-2 bg-gray-100">
                <motion.div 
                  initial={{ width: 0 }}
                  animate={{ width: `${progress}%` }}
                  className="h-full bg-gds-green"
                />
              </div>

              <div className="p-8 md:p-12 flex-grow">
                <div className="mb-6 flex justify-between items-center">
                  <span className="text-sm font-bold text-gray-400">Step {currentStep + 1} of {guide.steps?.length || 0}</span>
                  {step?.type === 'Action' && (
                    <span className="text-[10px] font-bold bg-purple-100 text-purple-700 px-2 py-0.5 rounded-full uppercase tracking-tighter">Required Action</span>
                  )}
                </div>

                <AnimatePresence mode="wait">
                  {step ? (
                    <motion.div
                      key={currentStep}
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      className="flex flex-col gap-6"
                    >
                      <h2 className="text-3xl font-bold text-gds-black">{step.title}</h2>
                      <div className="text-lg leading-relaxed text-gds-dark-grey space-y-4">
                        {step.content?.split('\n').map((para, i) => (
                          <p key={i}>{para}</p>
                        ))}
                      </div>

                      {step.type === 'Info' && (
                        <div className="bg-blue-50 p-6 flex gap-4 items-start border-l-4 border-gds-blue">
                          <Info className="w-6 h-6 text-gds-blue shrink-0" />
                          <p className="text-sm text-gds-blue italic">
                            This is an informational step. Make sure you understand these requirements before proceeding.
                          </p>
                        </div>
                      )}
                    </motion.div>
                  ) : (
                    <div className="py-20 text-center">Step content is unavailable.</div>
                  )}
                </AnimatePresence>
              </div>

              <div className="p-8 bg-gray-50 border-t border-gray-100 flex justify-between items-center">
                <button 
                  onClick={() => setCurrentStep(prev => Math.max(0, prev - 1))}
                  disabled={currentStep === 0}
                  className={`flex items-center gap-2 font-bold ${currentStep === 0 ? 'text-gray-300' : 'text-gds-black hover:underline'}`}
                >
                  <ChevronLeft className="w-5 h-5" /> Previous
                </button>

                {currentStep < (guide.steps?.length || 0) - 1 ? (
                  <button 
                    onClick={() => setCurrentStep(prev => Math.min((guide.steps?.length || 1) - 1, prev + 1))}
                    className="bg-gds-black text-white px-8 py-3 font-bold flex items-center gap-2 hover:bg-gray-800 transition-colors"
                  >
                    {step?.type === 'Action' ? 'Complete & Continue' : 'Continue'} <ChevronRight className="w-5 h-5" />
                  </button>
                ) : (
                  <Link 
                    to="/" 
                    className="bg-gds-green text-white px-8 py-3 font-bold flex items-center gap-2 hover:bg-green-700 transition-colors"
                  >
                    Finished <ArrowRight className="w-5 h-5" />
                  </Link>
                )}
              </div>
            </div>
          </div>

          <div className="lg:col-span-1">
            <div className="bg-gds-grey p-8 sticky top-8">
              <h3 className="text-xl font-bold mb-6">In this guide</h3>
              <nav className="space-y-4">
                {guide.steps?.map((s, idx) => (
                  <button 
                    key={idx}
                    onClick={() => setCurrentStep(idx)}
                    className={`block w-full text-left text-sm ${idx === currentStep ? 'font-bold pl-3 border-l-4 border-gds-blue' : 'text-gds-dark-grey hover:text-black transition-colors'}`}
                  >
                    {idx + 1}. {s.title}
                  </button>
                )) || <p className="text-sm text-gray-400">No steps available</p>}
              </nav>

              <div className="mt-12 pt-8 border-t border-gray-200">
                <h4 className="font-bold text-sm mb-4">Related services</h4>
                <ul className="space-y-2 text-sm text-gds-blue underline">
                  <li><Link to="#">Register for Self Assessment</Link></li>
                  <li><Link to="#">Companies House portal</Link></li>
                  <li><Link to="#">Business tax account</Link></li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
