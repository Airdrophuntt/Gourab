/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { onAuthStateChanged, User } from 'firebase/auth';
import { auth, db } from './lib/firebase';
import { doc, getDoc } from 'firebase/firestore';
import Home from './pages/Home';
import PostView from './pages/PostView';
import AdminDashboard from './pages/AdminDashboard';
import AdminLogin from './pages/AdminLogin';
import Editor from './pages/Editor';
import Header from './components/Header';
import Footer from './components/Footer';

export default function App() {
  const [user, setUser] = useState<User | null>(null);
  const [isAdmin, setIsAdmin] = useState<boolean>(false);
  const [authLoading, setAuthLoading] = useState(true);
  const [logoLoading, setLogoLoading] = useState(true);
  const [logoUrl, setLogoUrl] = useState<string | null>(null);

  useEffect(() => {
    // Fetch Site Logo
    const fetchLogo = async () => {
      try {
        const snap = await getDoc(doc(db, 'settings', 'site'));
        if (snap.exists()) {
          setLogoUrl(snap.data().logoUrl);
        }
      } catch (err) {
        console.error("Logo fetch error:", err);
      } finally {
        setLogoLoading(false);
      }
    };
    fetchLogo();

    const unsubscribe = onAuthStateChanged(auth, async (u) => {
      setUser(u);
      if (u) {
        const adminDoc = await getDoc(doc(db, 'admins', u.uid));
        setIsAdmin(adminDoc.exists());
      } else {
        setIsAdmin(false);
      }
      setAuthLoading(false);
    });
    return unsubscribe;
  }, []);

  const loading = authLoading || logoLoading;

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-stone-50 font-sans">
        <div className="w-12 h-12 border-4 border-stone-200 border-t-stone-800 rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <Router>
      <div className="min-h-screen bg-stone-50 flex flex-col selection:bg-stone-200">
        <Header user={user} isAdmin={isAdmin} logoUrl={logoUrl} />
        <main className="flex-grow">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/post/:id" element={<PostView />} />
            <Route path="/admin/login" element={<AdminLogin user={user} isAdmin={isAdmin} />} />
            <Route 
              path="/admin" 
              element={isAdmin ? <AdminDashboard /> : <Navigate to="/admin/login" />} 
            />
            <Route 
              path="/admin/new" 
              element={isAdmin ? <Editor /> : <Navigate to="/admin/login" />} 
            />
            <Route 
              path="/admin/edit/:id" 
              element={isAdmin ? <Editor /> : <Navigate to="/admin/login" />} 
            />
          </Routes>
        </main>
        <Footer logoUrl={logoUrl} />
      </div>
    </Router>
  );
}

