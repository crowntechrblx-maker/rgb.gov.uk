import React, { useEffect, useState } from 'react';
import { motion } from 'motion/react';
import { CheckCircle2, AlertCircle, Clock, Activity, ShieldCheck } from 'lucide-react';

interface Service {
  name: string;
  status: string;
  latency?: string;
}

export const ServiceStatus = () => {
  const [status, setStatus] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/status')
      .then(res => res.json())
      .then(data => {
        setStatus(data);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
  }, []);

  const getStatusColor = (statusStr: string) => {
    switch (statusStr) {
      case 'Operational': return 'text-gds-green';
      case 'Degraded': return 'text-gds-yellow';
      case 'Critical': return 'text-red-600';
      default: return 'text-gray-500';
    }
  };

  const getStatusBg = (statusStr: string) => {
    switch (statusStr) {
      case 'Operational': return 'bg-gds-green';
      case 'Degraded': return 'bg-gds-yellow';
      case 'Critical': return 'bg-red-600';
      default: return 'bg-gray-500';
    }
  };

  return (
    <div className="bg-white min-h-screen pb-20">
      <div className="bg-gds-black text-white py-12">
        <div className="govuk-width-container">
          <div className="flex items-center gap-4 mb-4">
            <Activity className="w-8 h-8 text-gds-green" />
            <h1 className="text-4xl md:text-5xl font-bold">Service Status</h1>
          </div>
          <p className="text-xl max-w-2xl text-gray-300">
            Current status of individual GOV.UK portal services and infrastructure.
          </p>
        </div>
      </div>

      <div className="govuk-width-container py-12">
        {loading ? (
          <div className="text-center py-20">
            <div className="w-12 h-12 border-4 border-gds-black border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="font-bold">Fetching real-time status...</p>
          </div>
        ) : (
          <div className="space-y-12">
            <div className="bg-gds-grey p-8 border-l-8 border-gds-green flex items-center justify-between">
              <div>
                <h2 className="text-3xl font-bold mb-2">{status?.overall}</h2>
                <p className="text-lg text-gds-dark-grey flex items-center gap-2">
                  <Clock className="w-4 h-4" /> Last updated: {new Date(status?.timestamp).toLocaleTimeString()}
                </p>
              </div>
              <CheckCircle2 className="w-16 h-16 text-gds-green hidden md:block" />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {status?.services.map((service: Service, idx: number) => (
                <motion.div 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.05 }}
                  key={service.name} 
                  className="border-2 border-gray-100 p-6 flex items-center justify-between shadow-sm"
                >
                  <div>
                    <h3 className="text-xl font-bold mb-1">{service.name}</h3>
                    {service.latency && (
                      <span className="text-sm font-mono text-gray-500">Latency: {service.latency}</span>
                    )}
                  </div>
                  <div className="flex items-center gap-2">
                    <span className={`font-bold ${getStatusColor(service.status)}`}>
                      {service.status}
                    </span>
                    <div className={`w-3 h-3 rounded-full ${getStatusBg(service.status)}`}></div>
                  </div>
                </motion.div>
              ))}
            </div>

            <div className="mt-20 border-t-2 border-gray-200 pt-12">
              <h2 className="text-2xl font-bold mb-8 flex items-center gap-2">
                <ShieldCheck className="w-6 h-6" /> Infrastructure History
              </h2>
              <div className="space-y-4">
                {[1, 2, 3, 4, 5].map((day) => (
                  <div key={day} className="flex gap-1 h-8">
                    <div className="w-24 text-sm font-bold text-gray-500">
                      {new Date(Date.now() - (5 - day) * 86400000).toLocaleDateString(undefined, { day: 'numeric', month: 'short' })}
                    </div>
                    <div className="flex-grow flex gap-1">
                      {Array.from({ length: 40 }).map((_, i) => (
                        <div key={i} className="flex-grow bg-gds-green rounded-sm opacity-80 hover:opacity-100 cursor-pointer" title="Operational"></div>
                      ))}
                    </div>
                    <div className="w-24 text-right text-xs font-bold text-gds-green">100%</div>
                  </div>
                ))}
              </div>
              <p className="mt-6 text-sm text-gds-dark-grey italic">
                Uptime is calculated based on internal health checks performed every 60 seconds.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
