import { motion } from 'motion/react';
import { ArrowLeft, ShieldCheck, Heart, EyeOff } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function PrivacyPolicy() {
  return (
    <div className="min-h-screen bg-stone-50 py-20">
      <div className="max-w-3xl mx-auto px-4">
        <Link to="/" className="inline-flex items-center gap-2 text-stone-500 hover:text-stone-900 transition-colors mb-12 group">
          <ArrowLeft size={18} className="transition-transform group-hover:-translate-x-1" /> Back to Home
        </Link>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-3xl p-12 shadow-sm border border-stone-100"
        >
          <div className="flex items-center gap-4 mb-8">
            <div className="w-16 h-16 rounded-full bg-heritage-gold/10 flex items-center justify-center text-heritage-gold">
              <ShieldCheck size={32} />
            </div>
            <h1 className="text-4xl font-serif font-bold text-heritage-ink">Cultural Privacy Policy</h1>
          </div>

          <div className="prose prose-stone lg:prose-lg max-w-none font-serif italic text-stone-700 leading-relaxed space-y-8">
            <p className="text-xl text-heritage-accent font-medium">
              The Jamgram Ghoshbari Journal is dedicated to the preservation of heritage while respecting the sanctity of our family's cultural identity.
            </p>

            <section>
              <div className="flex items-center gap-2 mb-4 text-heritage-ink not-italic font-bold uppercase tracking-widest text-xs">
                <Heart size={16} className="text-heritage-gold" /> Sanctity of Rituals
              </div>
              <p>
                We believe that some rituals and family traditions are sacred. While we share our joy and history with the world, certain aspects of our traditions are documented with the highest respect for the privacy of the participants and the sanctity of the "Durga Dalan".
              </p>
            </section>

            <section>
              <div className="flex items-center gap-2 mb-4 text-heritage-ink not-italic font-bold uppercase tracking-widest text-xs">
                <EyeOff size={16} className="text-heritage-gold" /> Image Usage & Protection
              </div>
              <p>
                All photographs, manuscripts, and digital captures shared on this platform are part of the Ghosh Family collection. We request that these images not be reproduced, modified, or used for commercial purposes without explicit written consent from the family administrators.
              </p>
            </section>

            <section>
              <div className="flex items-center gap-2 mb-4 text-heritage-ink not-italic font-bold uppercase tracking-widest text-xs">
                <ShieldCheck size={16} className="text-heritage-gold" /> Data Collection
              </div>
              <p>
                When you leave a comment or feedback, we collect your name and message to foster a community of shared memories. We do not sell or share your personal information with third parties. Your data is used solely to enhance the interactive experience of this digital journal.
              </p>
            </section>

            <div className="pt-10 border-t border-stone-100 mt-10">
              <p className="text-sm text-stone-400">
                Last Updated: April 2026. For any privacy-related inquiries, please contact the site administrators.
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
