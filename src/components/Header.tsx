import { Link, useNavigate } from 'react-router-dom';
import { User, signOut } from 'firebase/auth';
import { auth } from '../lib/firebase';
import { LogOut, PenTool, LayoutDashboard, User as UserIcon, Facebook } from 'lucide-react';

interface HeaderProps {
  user: User | null;
  isAdmin: boolean;
  logoUrl?: string | null;
}

export default function Header({ user, isAdmin, logoUrl }: HeaderProps) {
  const navigate = useNavigate();

  const handleSignOut = async () => {
    await signOut(auth);
    navigate('/');
  };

  return (
    <header className="border-b border-heritage-gold/20 bg-heritage-bg/80 backdrop-blur-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-4 group">
          <div className="w-12 h-12 rounded-full border-2 border-heritage-gold overflow-hidden shadow-lg transition-transform group-hover:scale-105 bg-white">
            <img 
              src={logoUrl || "https://picsum.photos/seed/cultural-heritage/200/200"} 
              alt="Jamgram Ghoshbari Logo" 
              className="w-full h-full object-cover"
              onError={(e) => {
                e.currentTarget.src = "https://picsum.photos/seed/jamgram/200/200";
              }}
            />
          </div>
          <div className="flex flex-col">
            <span className="text-xl lg:text-2xl font-serif font-bold tracking-tight text-heritage-accent group-hover:text-heritage-accent/80 transition-colors">
              Jamgram Ghoshbari
            </span>
            <span className="text-[9px] lg:text-[10px] uppercase tracking-[0.3em] font-bold text-heritage-gold -mt-1 ml-1 opacity-80">Cultural Heritage Journal</span>
          </div>
        </Link>

        <nav className="flex items-center space-x-4 lg:space-x-8">
          <a 
            href="https://www.facebook.com/share/g/1CMA8Eh7b8/" 
            target="_blank" 
            rel="noopener noreferrer" 
            className="flex items-center gap-2 text-heritage-ink/60 hover:text-[#1877F2] transition-all hover:scale-110"
            title="Join our Facebook Community"
          >
            <Facebook size={20} fill="currentColor" strokeWidth={0} />
            <span className="hidden xl:inline text-[10px] uppercase tracking-widest font-bold">Community</span>
          </a>

          <div className="h-6 w-px bg-heritage-gold/20 hidden sm:block" />

          {isAdmin ? (
            <>
              <Link to="/admin" className="flex items-center gap-2 text-heritage-ink/70 hover:text-heritage-accent font-medium transition-all hover:translate-y-[-1px]">
                <LayoutDashboard size={18} />
                <span className="hidden md:inline">Archives</span>
              </Link>
              <Link to="/admin/new" className="flex items-center gap-2 text-heritage-ink/70 hover:text-heritage-accent font-medium transition-all hover:translate-y-[-1px]">
                <PenTool size={18} />
                <span className="hidden md:inline">New Entry</span>
              </Link>
              <button 
                onClick={handleSignOut}
                className="flex items-center gap-2 text-heritage-ink/70 hover:text-red-600 font-medium transition-all hover:translate-y-[-1px]"
              >
                <LogOut size={18} />
                <span className="hidden md:inline">Logout</span>
              </button>
            </>
          ) : user ? (
             <button 
                onClick={handleSignOut}
                className="flex items-center space-x-1 text-heritage-ink/70 hover:text-heritage-accent font-medium transition-colors"
              >
                <LogOut size={18} />
                <span>Logout</span>
              </button>
          ) : null}
        </nav>
      </div>
    </header>
  );
}
