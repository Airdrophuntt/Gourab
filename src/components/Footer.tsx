interface FooterProps {
  logoUrl?: string | null;
}

export default function Footer({ logoUrl }: FooterProps) {
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
            <ul className="space-y-3 text-sm">
              <li><a href="/#archives" className="hover:text-white transition-colors">Digital Archives</a></li>
              <li><a href="/admin/login" className="hover:text-white transition-colors">Admin Access</a></li>
            </ul>
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
            <span className="hover:text-heritage-gold cursor-pointer transition-colors">Cultural Privacy</span>
            <span className="hover:text-heritage-gold cursor-pointer transition-colors">Family Terms</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
