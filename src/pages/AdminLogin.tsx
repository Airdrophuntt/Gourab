import { useState, useEffect } from 'react';
import { useNavigate, Navigate } from 'react-router-dom';
import { signInWithPopup, GoogleAuthProvider, User } from 'firebase/auth';
import { auth, db } from '../lib/firebase';
import { doc, getDoc, setDoc, collection, getDocs, limit, query } from 'firebase/firestore';
import { motion } from 'motion/react';
import { Shield, Lock, AlertCircle, Terminal } from 'lucide-react';

interface AdminLoginProps {
  user: User | null;
  isAdmin: boolean;
}

export default function AdminLogin({ user, isAdmin }: AdminLoginProps) {
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [isFirstAdmin, setIsFirstAdmin] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const checkFirstAdmin = async () => {
      const q = query(collection(db, 'admins'), limit(1));
      const snap = await getDocs(q);
      if (snap.empty) {
        setIsFirstAdmin(true);
      }
    };
    checkFirstAdmin();
  }, []);

  const handleLogin = async () => {
    setLoading(true);
    setError(null);
    try {
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(auth, provider);
      const user = result.user;
      
      const adminDoc = await getDoc(doc(db, 'admins', user.uid));
      
      if (!adminDoc.exists()) {
        // If not an admin, check if the system is still unclaimed
        const q = query(collection(db, 'admins'), limit(1));
        const snap = await getDocs(q);
        const isActuallyFirst = snap.empty;

        // EMERGENCY OVERRIDE: If the user is the one who set this up
        // or if it's genuinely the first login
        if (isActuallyFirst || user.email === 'ghoshgourab765@gmail.com') {
          await setDoc(doc(db, 'admins', user.uid), {
            email: user.email,
            role: 'admin',
            claimedAt: new Date(),
            bootstrapped: user.email === 'ghoshgourab765@gmail.com'
          });
          navigate('/admin');
        } else {
          setError("Access Denied: Your account (" + user.email + ") does not have administrative privileges.");
          await auth.signOut();
        }
      } else {
        navigate('/admin');
      }
    } catch (err: any) {
      console.error(err);
      setError(err.message || "Failed to sign in. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (isAdmin) {
    return <Navigate to="/admin" />;
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-stone-50 p-4">
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="max-w-md w-full bg-white rounded-3xl shadow-xl p-10 border border-stone-100"
      >
        <div className="flex flex-col items-center text-center mb-10">
          <div className="w-16 h-16 bg-heritage-accent rounded-2xl flex items-center justify-center text-white mb-6 shadow-lg shadow-heritage-accent/20">
            <Shield size={32} />
          </div>
          <h1 className="text-3xl font-serif font-bold mb-2 text-heritage-ink">Editor Portal</h1>
          <p className="text-stone-500">Sign in to manage the Ghoshbari Archives</p>
        </div>

        {isFirstAdmin && (
          <div className="mb-8 p-4 bg-heritage-gold/20 border border-heritage-gold/30 rounded-xl flex gap-3 text-heritage-ink text-sm">
            <Terminal size={18} className="shrink-0 mt-0.5 text-heritage-accent" />
            <div>
              <p className="font-bold mb-1">Unclaimed Instance</p>
              <p>The next family member to sign in will be granted administrative access to the journal.</p>
            </div>
          </div>
        )}

        {error && (
          <div className="mb-8 p-4 bg-red-50 border border-red-100 rounded-xl flex gap-3 text-red-800 text-sm animate-shake">
            <AlertCircle size={18} className="shrink-0 mt-0.5" />
            <p>{error}</p>
          </div>
        )}

        <button
          onClick={handleLogin}
          disabled={loading}
          className="w-full flex items-center justify-center gap-3 bg-heritage-blue hover:bg-heritage-blue/90 disabled:bg-stone-300 text-white font-bold py-4 rounded-xl transition-all duration-300 group shadow-lg shadow-heritage-blue/20 active:scale-[0.98]"
        >
          {loading ? (
            <div className="w-5 h-5 border-2 border-stone-400 border-t-white rounded-full animate-spin" />
          ) : (
            <>
              <img src="https://www.gstatic.com/firebase/builtbygoogle/google-logo.svg" alt="Google" className="w-5 h-5" />
              <span>Continue with Google</span>
            </>
          )}
        </button>

        <div className="mt-8 pt-8 border-t border-stone-100 text-center">
          <div className="flex items-center justify-center gap-2 text-stone-400 text-xs uppercase tracking-widest font-semibold font-sans">
            <Lock size={12} />
            Secure Authentication
          </div>
        </div>
      </motion.div>
    </div>
  );
}
