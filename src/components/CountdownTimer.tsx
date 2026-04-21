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
    <div className="max-w-7xl mx-auto px-4 lg:px-8 mb-24">
      <motion.div 
        initial={{ opacity: 0, scale: 0.98 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
        className="bg-heritage-ink rounded-3xl p-8 md:p-16 lg:p-20 relative overflow-hidden shadow-2xl border border-heritage-gold/20"
      >
        {/* Background Accents */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-heritage-gold/5 rounded-full -translate-y-1/2 translate-x-1/2 blur-[100px]" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-heritage-blue/5 rounded-full translate-y-1/2 -translate-x-1/2 blur-[100px]" />

        <div className="relative z-10 flex flex-col lg:flex-row items-center justify-between gap-12 lg:gap-20">
          <div className="text-center lg:text-left max-w-xl">
            <div className="inline-flex items-center gap-3 text-heritage-gold uppercase tracking-[0.4em] text-[10px] lg:text-[12px] font-bold mb-6 bg-heritage-gold/10 px-4 py-2 rounded-full border border-heritage-gold/10">
              <Timer size={16} /> Next Publication
            </div>
            <h2 className="text-3xl md:text-5xl lg:text-6xl font-serif font-bold text-white mb-6 leading-tight">
              A new chapter is <br /> 
              <span className="italic text-heritage-gold font-normal font-serif">being written.</span>
            </h2>
            <p className="text-stone-400 font-serif italic text-sm lg:text-lg opacity-80">
              Our scribes are documenting another piece of our legacy. Every detail matters in the preservation of heritage.
            </p>
          </div>

          <div className="grid grid-cols-4 gap-4 md:gap-8 lg:gap-10 shrink-0">
            {[
              { label: 'Days', value: timeLeft.days },
              { label: 'Hrs', value: timeLeft.hours },
              { label: 'Min', value: timeLeft.minutes },
              { label: 'Sec', value: timeLeft.seconds },
            ].map((unit) => (
              <div key={unit.label} className="flex flex-col items-center">
                <div className="w-16 h-16 md:w-24 md:h-24 lg:w-28 lg:h-28 bg-white/5 border border-white/20 rounded-2xl flex items-center justify-center mb-3 shadow-xl backdrop-blur-sm transition-transform hover:scale-105 duration-300">
                  <span className="text-2xl md:text-4xl lg:text-5xl font-bold text-heritage-gold font-mono tracking-tighter">
                    {unit.value.toString().padStart(2, '0')}
                  </span>
                </div>
                <span className="text-[10px] lg:text-[12px] uppercase tracking-widest text-stone-500 font-bold">{unit.label}</span>
              </div>
            ))}
          </div>
        </div>
      </motion.div>
    </div>
  );
}
