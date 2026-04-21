import { motion } from 'motion/react';
import { ArrowLeft, Scale, Users, ScrollText } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function FamilyTerms() {
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
              <Scale size={32} />
            </div>
            <h1 className="text-4xl font-serif font-bold text-heritage-ink">Family Terms of Use</h1>
          </div>

          <div className="prose prose-stone lg:prose-lg max-w-none font-serif italic text-stone-700 leading-relaxed space-y-8">
            <p className="text-xl text-heritage-accent font-medium">
              By accessing the Jamgram Ghoshbari Digital Journal, you agree to uphold the dignity of our family's 250-year-old heritage.
            </p>

            <section>
              <div className="flex items-center gap-2 mb-4 text-heritage-ink not-italic font-bold uppercase tracking-widest text-xs">
                <Users size={16} className="text-heritage-gold" /> Community Guidelines
              </div>
              <p>
                This space is created to celebrate the Ghosh Family lineage and the Jamgram Durga Puja. We expect all comments and feedback to be respectful, relevant, and free of hate speech or offensive language. The family reserves the right to remove any content that violates these principles.
              </p>
            </section>

            <section>
              <div className="flex items-center gap-2 mb-4 text-heritage-ink not-italic font-bold uppercase tracking-widest text-xs">
                <ScrollText size={16} className="text-heritage-gold" /> Intellectual Property
              </div>
              <p>
                All stories, chronicles, and historical accounts published here are the intellectual property of the Ghosh Family. Unauthorized copying or redistribution of these narratives is strictly prohibited. We encourage sharing links to the website instead of copying text.
              </p>
            </section>

            <section>
              <div className="flex items-center gap-2 mb-4 text-heritage-ink not-italic font-bold uppercase tracking-widest text-xs">
                <Scale size={16} className="text-heritage-gold" /> Accuracy of Information
              </div>
              <p>
                History is often passed down orally. While we strive for absolute accuracy in our chronicles, we acknowledge that different branches of the family may have varying recollections. We welcome constructive corrections and additional memories from family members to enrich our collective history.
              </p>
            </section>

            <div className="pt-10 border-t border-stone-100 mt-10">
              <p className="text-sm text-stone-400">
                Participation in this digital archive implies acceptance of these terms. Thank you for being a part of our legacy.
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
