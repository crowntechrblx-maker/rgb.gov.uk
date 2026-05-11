import React, { useEffect, useState } from 'react';
import { motion } from 'motion/react';
import { Calendar, Rocket, Monitor, Landmark, CheckCircle2 } from 'lucide-react';

interface TimelineEvent {
  _id: string;
  title: string;
  description: string;
  date: string;
  type: 'Policy' | 'Service' | 'Digital' | 'Milestone';
}

export const ServiceTimeline = () => {
  const [events, setEvents] = useState<TimelineEvent[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/timeline')
      .then(res => res.json())
      .then(data => {
        setEvents(data);
        setLoading(false);
      });
  }, []);

  const getIcon = (type: string) => {
    switch (type) {
      case 'Digital': return <Monitor className="w-5 h-5" />;
      case 'Service': return <Rocket className="w-5 h-5" />;
      case 'Policy': return <Landmark className="w-5 h-5" />;
      default: return <Calendar className="w-5 h-5" />;
    }
  };

  return (
    <div className="bg-white min-h-screen">
      <div className="bg-gds-black text-white py-12 mb-12">
        <div className="govuk-width-container">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">GOV.UK Service Timeline</h1>
          <p className="text-xl max-w-2xl text-gray-300">
            A visual history of government digital transformation and major service milestones.
          </p>
        </div>
      </div>

      <div className="govuk-width-container pb-20">
        {loading ? (
          <div className="text-center py-20">
            <div className="w-12 h-12 border-4 border-gds-black border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          </div>
        ) : (
          <div className="relative">
            {/* Vertical Line */}
            <div className="absolute left-4 md:left-1/2 top-0 bottom-0 w-1 bg-gray-200 -translate-x-1/2 hidden md:block"></div>
            
            <div className="space-y-12">
              {events.map((event, idx) => (
                <motion.div 
                  key={event._id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  className={`flex flex-col md:flex-row items-center gap-8 ${idx % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'}`}
                >
                  <div className="flex-1 w-full text-left md:text-right">
                    {idx % 2 === 0 ? (
                      <div className="p-6 bg-gds-grey border-t-4 border-gds-blue shadow-sm">
                        <span className="text-sm font-bold text-gds-blue mb-2 block">{event.date}</span>
                        <h3 className="text-xl font-bold mb-2">{event.title}</h3>
                        <p className="text-gds-dark-grey">{event.description}</p>
                      </div>
                    ) : null}
                  </div>

                  <div className="relative z-10 shrink-0">
                    <div className="w-12 h-12 rounded-full bg-gds-black text-white flex items-center justify-center shadow-lg">
                      {getIcon(event.type)}
                    </div>
                  </div>

                  <div className="flex-1 w-full text-left">
                    {idx % 2 !== 0 ? (
                      <div className="p-6 bg-gds-grey border-t-4 border-gds-blue shadow-sm">
                        <span className="text-sm font-bold text-gds-blue mb-2 block">{event.date}</span>
                        <h3 className="text-xl font-bold mb-2">{event.title}</h3>
                        <p className="text-gds-dark-grey">{event.description}</p>
                      </div>
                    ) : null}
                  </div>
                </motion.div>
              ))}
            </div>

            <div className="mt-20 flex justify-center">
              <div className="bg-gds-green text-white px-8 py-4 flex items-center gap-3 rounded-sm shadow-md">
                <CheckCircle2 className="w-6 h-6" />
                <span className="font-bold">Transformation Continues</span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
