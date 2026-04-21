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
    <footer className="bg-heritage-ink text-stone-400 py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-16 border-b border-heritage-gold/10 pb-16 mb-12">
          <div className="md:col-span-1">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-12 h-12 rounded-full border border-heritage-gold/30 overflow-hidden shrink-0 bg-white">
                <img 
                  src={logoUrl || "https://picsum.photos/seed/cultural-heritage/100/100"} 
                  alt="Logo" 
                  className="w-full h-full object-cover grayscale-[0.2]"
                  onError={(e) => {
                    e.currentTarget.src = "https://picsum.photos/seed/jamgram/100/100";
                  }}
                />
              </div>
              <h3 className="text-heritage-gold font-serif text-2xl font-bold">Jamgram Ghoshbari</h3>
            </div>
            <p className="max-w-sm leading-relaxed italic font-serif text-stone-300">
              "Jamgram is a small village in the Hooghly district. In this village, two Durga pujas are held, one of the Ghosh Family. Jamgram Ghosh Barir Durga Puja is the oldest, preserving traditions for over 250 years."
            </p>
          </div>
          <div>
            <h4 className="text-heritage-gold font-medium mb-6 uppercase tracking-[0.2em] text-[10px] font-bold">Explore Content</h4>
            <ul className="space-y-3 text-sm mb-10">
              <li><Link to="/#archives" className="hover:text-white transition-colors">Digital Archives</Link></li>
              <li><Link to="/admin/login" className="hover:text-white transition-colors">Admin Access</Link></li>
            </ul>

            <h4 className="text-heritage-gold font-medium mb-4 uppercase tracking-[0.2em] text-[10px] font-bold">Subscribe to Chronicle</h4>
            <p className="text-[10px] italic mb-4 leading-relaxed">Get notified when new historical accounts or family updates are published.</p>
            <form onSubmit={handleSubscribe} className="relative max-w-xs">
              <input 
                type="email"
                required
                placeholder="Email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-sm text-white focus:outline-none focus:border-heritage-gold/50 transition-colors pr-12"
              />
              <button 
                type="submit"
                disabled={submitting || success}
                className="absolute right-1 top-1 bottom-1 px-3 bg-heritage-gold text-heritage-ink rounded-md hover:bg-heritage-gold/80 transition-colors disabled:opacity-50"
              >
                {success ? <Check size={16} /> : <Send size={16} />}
              </button>
            </form>
            {success && <p className="text-[10px] text-green-500 mt-2 font-bold uppercase tracking-widest">Thank you for joining our legacy!</p>}
          </div>
          <div>
            <h4 className="text-heritage-gold font-medium mb-6 uppercase tracking-[0.2em] text-[10px] font-bold">Legacy & Tradition</h4>
            <p className="text-sm italic font-serif leading-relaxed">
              Documenting the rituals, festivities, and memories of the Ghosh family heritage for future generations.
            </p>
          </div>
        </div>
        <div className="flex flex-col sm:flex-row justify-between items-center text-[10px] uppercase tracking-widest font-bold text-stone-500">
          <p>&copy; {new Date().getFullYear()} Jamgram Ghoshbari Heritage. All rights reserved.</p>
          <div className="mt-4 sm:mt-0 flex space-x-8">
            <Link to="/privacy" className="hover:text-heritage-gold transition-colors underline-offset-4 hover:underline">Cultural Privacy</Link>
            <Link to="/terms" className="hover:text-heritage-gold transition-colors underline-offset-4 hover:underline">Family Terms</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
