import { Link } from 'react-router-dom';
import { useState } from 'react';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { Send, Check } from 'lucide-react';

interface FooterProps {
  logoUrl?: string | null;
}

export default function Footer({ logoUrl }: FooterProps) {
  const [email, setEmail] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || submitting) return;

    setSubmitting(true);
    try {
      await addDoc(collection(db, 'newsletter'), {
        email,
        createdAt: serverTimestamp()
      });
      setSuccess(true);
      setEmail('');
      setTimeout(() => setSuccess(false), 5000);
    } catch (err) {
      console.error("Subscription error:", err);
      alert("Failed to subscribe. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <footer className="bg-heritage-ink text-stone-400 py-16 lg:py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-16 lg:gap-24 border-b border-heritage-gold/10 pb-16 lg:pb-24 mb-12">
          <div className="md:col-span-1">
            <div className="flex items-center gap-4 mb-8 group cursor-default">
              <div className="w-14 h-14 rounded-full border border-heritage-gold/30 overflow-hidden shrink-0 bg-white transition-transform group-hover:rotate-6">
                <img 
                  src={logoUrl || "https://picsum.photos/seed/cultural-heritage/100/100"} 
                  alt="Logo" 
                  className="w-full h-full object-cover grayscale-[0.2]"
                  onError={(e) => {
                    e.currentTarget.src = "https://picsum.photos/seed/jamgram/100/100";
                  }}
                />
              </div>
              <h3 className="text-heritage-gold font-serif text-2xl lg:text-3xl font-bold">Jamgram Ghoshbari</h3>
            </div>
            <p className="max-w-sm leading-relaxed italic font-serif text-stone-300 text-sm lg:text-base opacity-80">
              "Jamgram is a small village in the Hooghly district. In this village, two Durga pujas are held, one of the Ghosh Family. Jamgram Ghosh Barir Durga Puja is the oldest, preserving traditions for over 250 years."
            </p>
          </div>
          <div>
            <h4 className="text-heritage-gold font-medium mb-8 uppercase tracking-[0.3em] text-[10px] lg:text-[11px] font-bold">Explore Content</h4>
            <ul className="space-y-4 text-sm lg:text-base mb-12">
              <li><Link to="/#archives" className="hover:text-white hover:translate-x-1 transition-all inline-block">Digital Archives</Link></li>
              <li><Link to="/admin/login" className="hover:text-white hover:translate-x-1 transition-all inline-block">Admin Access</Link></li>
            </ul>

            <h4 className="text-heritage-gold font-medium mb-6 uppercase tracking-[0.3em] text-[10px] lg:text-[11px] font-bold">Subscribe to Chronicle</h4>
            <p className="text-[10px] lg:text-[12px] italic mb-6 leading-relaxed opacity-70">Get notified when new historical accounts or family updates are published.</p>
            <form onSubmit={handleSubscribe} className="relative max-w-sm">
              <input 
                type="email"
                required
                placeholder="Email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-white/5 border border-white/10 rounded-xl px-5 py-4 text-sm text-white focus:outline-none focus:border-heritage-gold/50 transition-all pr-14 hover:bg-white/[0.07]"
              />
              <button 
                type="submit"
                disabled={submitting || success}
                className="absolute right-1.5 top-1.5 bottom-1.5 px-4 bg-heritage-gold text-heritage-ink rounded-lg hover:bg-heritage-gold/80 transition-all disabled:opacity-50 active:scale-95"
              >
                {success ? <Check size={18} /> : <Send size={18} />}
              </button>
            </form>
            {success && <p className="text-[10px] lg:text-[12px] text-green-500 mt-4 font-bold uppercase tracking-widest animate-in fade-in slide-in-from-top-1">Thank you for joining our legacy!</p>}
          </div>
          <div>
            <h4 className="text-heritage-gold font-medium mb-8 uppercase tracking-[0.3em] text-[10px] lg:text-[11px] font-bold">Legacy & Tradition</h4>
            <p className="text-sm lg:text-base italic font-serif leading-relaxed opacity-80">
              Documenting the rituals, festivities, and memories of the Ghosh family heritage for future generations.
            </p>
          </div>
        </div>
        <div className="flex flex-col md:flex-row justify-between items-center text-[10px] lg:text-[11px] uppercase tracking-widest font-bold text-stone-500 border-t border-heritage-gold/5 pt-8">
          <p className="mb-4 md:mb-0">&copy; {new Date().getFullYear()} Jamgram Ghoshbari Heritage. All rights reserved.</p>
          <div className="flex space-x-10">
            <Link to="/privacy" className="hover:text-heritage-gold transition-colors underline-offset-4 hover:underline">Cultural Privacy</Link>
            <Link to="/terms" className="hover:text-heritage-gold transition-colors underline-offset-4 hover:underline">Family Terms</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
