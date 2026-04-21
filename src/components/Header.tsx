import { Link, useNavigate } from 'react-router-dom';
import { User, signOut } from 'firebase/auth';
import { auth } from '../lib/firebase';
import { LogOut, PenTool, LayoutDashboard, User as UserIcon } from 'lucide-react';

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
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-24 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-4 group">
          <div className="w-14 h-14 rounded-full border-2 border-heritage-gold overflow-hidden shadow-lg transition-transform group-hover:scale-105 bg-white">
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
            <span className="text-3xl font-serif font-bold tracking-tight text-heritage-accent group-hover:text-heritage-accent/80 transition-colors">Jamgram Ghoshbari</span>
            <span className="text-[10px] uppercase tracking-[0.3em] font-bold text-heritage-gold -mt-1 ml-1">Cultural Heritage Journal</span>
          </div>
        </Link>

        <nav className="flex items-center space-x-6">
          {isAdmin ? (
            <>
              <Link to="/admin" className="flex items-center space-x-1 text-heritage-ink/70 hover:text-heritage-accent font-medium transition-colors">
                <LayoutDashboard size={18} />
                <span className="hidden sm:inline">Archives</span>
              </Link>
              <Link to="/admin/new" className="flex items-center space-x-1 text-heritage-ink/70 hover:text-heritage-accent font-medium transition-colors">
                <PenTool size={18} />
                <span className="hidden sm:inline">New Entry</span>
              </Link>
              <button 
                onClick={handleSignOut}
                className="flex items-center space-x-1 text-heritage-ink/70 hover:text-heritage-accent font-medium transition-colors"
              >
                <LogOut size={18} />
                <span className="hidden sm:inline">Logout</span>
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
