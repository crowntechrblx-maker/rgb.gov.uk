import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { AlertTriangle, Info, X } from 'lucide-react';
import { Link } from 'react-router-dom';

interface Alert {
  _id: string;
  title: string;
  content: string;
  severity: 'Extreme' | 'Severe' | 'Monitor';
}

export const EmergencyAlertBanner = () => {
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    fetch('/api/alerts')
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) setAlerts(data);
      })
      .catch(err => console.error(err));
  }, []);

  if (alerts.length === 0 || dismissed) return null;

  const currentAlert = alerts[currentIndex];

  const getSeverityStyles = (severity: string) => {
    switch (severity) {
      case 'Extreme': return 'bg-red-700 border-red-900';
      case 'Severe': return 'bg-orange-600 border-orange-800';
      default: return 'bg-gds-black border-gray-800';
    }
  };

  return (
    <AnimatePresence>
      <motion.div 
        initial={{ height: 0, opacity: 0 }}
        animate={{ height: 'auto', opacity: 1 }}
        exit={{ height: 0, opacity: 0 }}
        className={`${getSeverityStyles(currentAlert.severity)} text-white overflow-hidden border-b-4`}
      >
        <div className="govuk-width-container py-4 relative">
          <div className="flex items-start gap-4 pr-12">
            <div className="shrink-0 mt-1">
              {currentAlert.severity === 'Extreme' ? <AlertTriangle className="w-8 h-8" /> : <Info className="w-8 h-8" />}
            </div>
            <div>
              <h2 className="text-xl font-bold mb-1">
                {currentAlert.severity} Alert: {currentAlert.title}
              </h2>
              <p className="text-sm md:text-base mb-2 opacity-90 leading-relaxed">
                {currentAlert.content}
              </p>
              <div className="flex gap-4">
                <Link to="/alerts" className="text-sm font-bold underline hover:opacity-80">View all national alerts</Link>
                {alerts.length > 1 && (
                  <button 
                    onClick={() => setCurrentIndex((currentIndex + 1) % alerts.length)}
                    className="text-sm font-bold underline"
                  >
                    Next alert ({currentIndex + 1}/{alerts.length})
                  </button>
                )}
              </div>
            </div>
          </div>
          <button 
            onClick={() => setDismissed(true)}
            className="absolute top-4 right-4 p-1 hover:bg-white/20 rounded-full transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>
      </motion.div>
    </AnimatePresence>
  );
};
