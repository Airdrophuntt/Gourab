import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Timer, Bell } from 'lucide-react';

interface CountdownTimerProps {
  targetDate: Date;
}

export default function CountdownTimer({ targetDate }: CountdownTimerProps) {
  const [timeLeft, setTimeLeft] = useState<{
    days: number;
    hours: number;
    minutes: number;
    seconds: number;
  } | null>(null);

  useEffect(() => {
    const calculateTimeLeft = () => {
      const difference = +targetDate - +new Date();
      
      if (difference > 0) {
        setTimeLeft({
          days: Math.floor(difference / (1000 * 60 * 60 * 24)),
          hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
          minutes: Math.floor((difference / 1000 / 60) % 60),
          seconds: Math.floor((difference / 1000) % 60),
        });
      } else {
        setTimeLeft(null);
      }
    };

    const timer = setInterval(calculateTimeLeft, 1000);
    calculateTimeLeft();

    return () => clearInterval(timer);
  }, [targetDate]);

  if (!timeLeft) return null;

  return (
    <div className="max-w-4xl mx-auto px-4 mb-20">
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true }}
        className="bg-heritage-ink rounded-3xl p-8 md:p-12 relative overflow-hidden shadow-2xl border border-heritage-gold/20"
      >
        {/* Background Accents */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-heritage-gold/5 rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl" />
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-heritage-blue/5 rounded-full translate-y-1/2 -translate-x-1/2 blur-3xl" />

        <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-10">
          <div className="text-center md:text-left">
            <div className="inline-flex items-center gap-2 text-heritage-gold uppercase tracking-[0.3em] text-[10px] font-bold mb-4 bg-heritage-gold/10 px-3 py-1 rounded-full">
              <Timer size={14} /> Next Publication
            </div>
            <h2 className="text-3xl md:text-4xl font-serif font-bold text-white mb-4">
              A new chapter is <br /> 
              <span className="italic text-heritage-gold font-normal font-serif">being written.</span>
            </h2>
            <p className="text-stone-400 font-serif italic text-sm">
              Our scribes are documenting another piece of our legacy. STAY TUNED.
            </p>
          </div>

          <div className="grid grid-cols-4 gap-3 md:gap-6">
            {[
              { label: 'Days', value: timeLeft.days },
              { label: 'Hrs', value: timeLeft.hours },
              { label: 'Min', value: timeLeft.minutes },
              { label: 'Sec', value: timeLeft.seconds },
            ].map((unit) => (
              <div key={unit.label} className="flex flex-col items-center">
                <div className="w-14 h-14 md:w-20 md:h-20 bg-white/5 border border-white/10 rounded-xl flex items-center justify-center mb-2 shadow-inner">
                  <span className="text-xl md:text-3xl font-bold text-heritage-gold font-mono">
                    {unit.value.toString().padStart(2, '0')}
                  </span>
                </div>
                <span className="text-[10px] uppercase tracking-widest text-stone-500 font-bold">{unit.label}</span>
              </div>
            ))}
          </div>
        </div>
      </motion.div>
    </div>
  );
}
