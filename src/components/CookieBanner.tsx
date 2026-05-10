import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';

export const CookieBanner = () => {
  const [isVisible, setIsVisible] = useState(true);

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div 
          initial={{ y: -100 }}
          animate={{ y: 0 }}
          exit={{ opacity: 0 }}
          className="bg-gds-grey border-b-4 border-gds-blue py-6 relative z-50"
        >
          <div className="govuk-width-container">
            <h2 className="text-2xl font-bold mb-4">Cookies on GOV.UK</h2>
            <div className="max-w-3xl mb-6">
              <p className="text-lg mb-4">We use some essential cookies to make this website work.</p>
              <p className="text-lg">We’d like to set additional cookies to understand how you use GOV.UK, remember your settings and improve government services.</p>
              <p className="text-lg">We also use cookies set by other sites to help us deliver content from their services.</p>
            </div>
            <div className="flex flex-wrap gap-4">
              <button 
                onClick={() => setIsVisible(false)}
                className="bg-gds-black text-white px-4 py-2 font-bold hover:bg-gds-dark-grey transition-colors"
              >
                Accept additional cookies
              </button>
              <button 
                onClick={() => setIsVisible(false)}
                className="bg-gds-black text-white px-4 py-2 font-bold hover:bg-gds-dark-grey transition-colors"
              >
                Reject additional cookies
              </button>
              <a href="#" className="underline font-bold self-center">View cookies</a>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
