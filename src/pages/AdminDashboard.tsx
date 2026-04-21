import { useEffect, useState } from 'react';
import { collection, query, orderBy, getDocs, deleteDoc, doc, updateDoc, getDoc, setDoc } from 'firebase/firestore';
import { ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';
import { db, storage } from '../lib/firebase';
import { Link } from 'react-router-dom';
import { motion } from 'motion/react';
import { Plus, Edit3, Trash2, Eye, EyeOff, Search, MoreHorizontal, FileText, Image as ImageIcon, CheckCircle, Loader2, UploadCloud } from 'lucide-react';
import { format } from 'date-fns';

interface Post {
  id: string;
  title: string;
  published: boolean;
  createdAt: any;
  authorName: string;
}

export default function AdminDashboard() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [logoUploadLoading, setLogoUploadLoading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState<number | null>(null);
  const [logoUrl, setLogoUrl] = useState<string | null>(null);

  const fetchLogo = async () => {
    try {
      const snap = await getDoc(doc(db, 'settings', 'site'));
      if (snap.exists()) {
        setLogoUrl(snap.data().logoUrl);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleLogoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Check file size (max 5MB for logo)
    if (file.size > 5 * 1024 * 1024) {
      alert("Logo is too large. Please select a photo smaller than 5MB.");
      return;
    }

    setLogoUploadLoading(true);
    setUploadProgress(0);
    
    try {
      const imgbbKey = process.env.VITE_IMGBB_API_KEY;
      let url = "";

      if (imgbbKey) {
        // USE IMGBB (Free alternative, no credit card required)
        const formData = new FormData();
        formData.append('image', file);
        
        const response = await fetch(`https://api.imgbb.com/1/upload?key=${imgbbKey}`, {
          method: 'POST',
          body: formData
        });
        
        const result = await response.json();
        if (result.success) {
          url = result.data.url;
        } else {
          throw new Error(result.error?.message || "ImgBB upload failed");
        }
      } else {
        // USE FIREBASE STORAGE (Default)
        const fileName = `site_logo_${Date.now()}`;
        const storageRef = ref(storage, `site-branding/${fileName}`);
        const uploadTask = uploadBytesResumable(storageRef, file);

        await new Promise((resolve, reject) => {
          uploadTask.on('state_changed', 
            (snapshot) => {
              const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
              setUploadProgress(Math.round(progress));
            }, 
            (error) => reject(error), 
            async () => {
              url = await getDownloadURL(uploadTask.snapshot.ref);
              resolve(url);
            }
          );
        });
      }
      
      // Update Firestore with the URL (works for both FB and ImgBB)
      await setDoc(doc(db, 'settings', 'site'), {
        logoUrl: url,
        updatedAt: new Date()
      }, { merge: true });
      
      setLogoUrl(url);
      setLogoUploadLoading(false);
      setUploadProgress(null);
      alert("Logo updated successfully!");
      window.location.reload();
    } catch (err: any) {
      console.error("Upload error:", err);
      let msg = "Failed to upload logo.";
      if (err.code === 'storage/unauthorized') {
        msg = "Firebase Storage Error: Permission denied. Try using ImgBB for a free alternative.";
      } else if (err.message) {
        msg = err.message;
      }
      alert(msg);
      setLogoUploadLoading(false);
      setUploadProgress(null);
    }
  };

  const fetchPosts = async () => {
    setLoading(true);
    try {
      const q = query(collection(db, 'posts'), orderBy('createdAt', 'desc'));
      const snap = await getDocs(q);
      const fetched = snap.docs.map(d => ({ id: d.id, ...d.data() } as Post));
      setPosts(fetched);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPosts();
    fetchLogo();
  }, []);

  const togglePublished = async (id: string, currentStatus: boolean) => {
    try {
      await updateDoc(doc(db, 'posts', id), {
        published: !currentStatus,
        updatedAt: new Date()
      });
      setPosts(posts.map(p => p.id === id ? { ...p, published: !currentStatus } : p));
    } catch (err) {
      alert("Failed to update status");
    }
  };

  const deletePost = async (id: string) => {
    if (window.confirm("Are you sure you want to delete this post? This action cannot be undone.")) {
      try {
        await deleteDoc(doc(db, 'posts', id));
        setPosts(posts.filter(p => p.id !== id));
      } catch (err) {
        alert("Failed to delete post");
      }
    }
  };

  const filteredPosts = posts.filter(p => 
    p.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <header className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
        <div>
          <h1 className="text-4xl font-serif font-bold mb-2 text-heritage-accent">Archives</h1>
          <p className="text-stone-500 italic font-serif">Documenting the heritage of Jamgram Ghoshbari</p>
        </div>
        <Link 
          to="/admin/new" 
          className="flex items-center gap-2 bg-heritage-blue text-white px-6 py-3 rounded-xl font-bold hover:bg-heritage-blue/90 transition-all shadow-lg shadow-heritage-blue/10"
        >
          <Plus size={20} /> Create Entry
        </Link>
      </header>

      {/* Site Branding Section */}
      <section className="mb-12 bg-heritage-gold/5 border border-heritage-gold/20 rounded-2xl p-6">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-6">
            <div className="w-20 h-20 rounded-full border-2 border-heritage-gold bg-white overflow-hidden shadow-md shrink-0">
              {logoUrl ? (
                <img src={logoUrl} alt="Current Logo" className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-heritage-gold bg-heritage-gold/10">
                  <ImageIcon size={32} />
                </div>
              )}
            </div>
            <div>
              <h2 className="text-xl font-serif font-bold text-heritage-ink">Site Identity</h2>
              <p className="text-sm text-stone-500 italic">Upload your Durga Idol logo here. This will update the logo on all pages.</p>
            </div>
          </div>
          <div className="relative">
            <input 
              type="file" 
              id="logo-upload" 
              className="hidden" 
              accept="image/*"
              onChange={handleLogoUpload}
              disabled={logoUploadLoading}
            />
            <label 
              htmlFor="logo-upload"
              className={`flex items-center gap-2 px-6 py-3 rounded-xl font-bold cursor-pointer transition-all shadow-sm ${
                logoUploadLoading 
                ? 'bg-stone-200 text-stone-500' 
                : 'bg-heritage-gold text-heritage-ink hover:bg-heritage-gold/80'
              }`}
            >
              {logoUploadLoading ? (
                <Loader2 size={20} className="animate-spin" />
              ) : (
                <ImageIcon size={20} />
              )}
              {logoUploadLoading 
                ? `Uploading ${uploadProgress || 0}%` 
                : 'Update Village Logo'
              }
            </label>
            {uploadProgress !== null && (
              <div className="absolute -bottom-4 left-0 right-0 h-1 bg-stone-200 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-heritage-accent transition-all duration-300" 
                  style={{ width: `${uploadProgress}%` }}
                />
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Stats Bar */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-12">
        {[
          { label: 'Total Posts', value: posts.length, icon: FileText, color: 'text-stone-900' },
          { label: 'Published', value: posts.filter(p => p.published).length, icon: Eye, color: 'text-green-600' },
          { label: 'Drafts', value: posts.filter(p => !p.published).length, icon: EyeOff, color: 'text-amber-600' },
        ].map((stat, i) => (
          <motion.div 
            key={i}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="bg-white p-6 rounded-2xl border border-stone-200 shadow-sm"
          >
            <div className="flex items-center justify-between mb-2">
              <stat.icon size={20} className={stat.color} />
              <span className="text-xs font-bold uppercase tracking-widest text-stone-400">Stat</span>
            </div>
            <p className="text-3xl font-serif font-bold text-stone-900">{stat.value}</p>
            <p className="text-stone-500 text-sm font-medium">{stat.label}</p>
          </motion.div>
        ))}
      </div>

      {/* Table Section */}
      <div className="bg-white rounded-2xl border border-stone-200 shadow-sm overflow-hidden">
        <div className="p-6 border-b border-stone-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="relative max-w-sm w-full">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-stone-400" size={18} />
            <input 
              type="text" 
              placeholder="Search stories..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-stone-50 border-none rounded-lg focus:ring-2 focus:ring-stone-200 font-medium text-stone-700 outline-none"
            />
          </div>
          <div className="flex items-center gap-2 text-xs font-bold text-stone-400 uppercase tracking-widest">
            <MoreHorizontal size={18} /> Actions
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-stone-50/50 text-xs font-bold text-stone-500 uppercase tracking-widest">
                <th className="px-6 py-4">Title</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4">Date</th>
                <th className="px-6 py-4 text-right">Settings</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100">
              {loading ? (
                <tr>
                  <td colSpan={4} className="px-6 py-12 text-center text-stone-400 italic">Loading your library...</td>
                </tr>
              ) : filteredPosts.length === 0 ? (
                <tr>
                  <td colSpan={4} className="px-6 py-12 text-center text-stone-400">No stories found matching your criteria.</td>
                </tr>
              ) : (
                filteredPosts.map((post) => (
                  <tr key={post.id} className="hover:bg-stone-50/50 transition-colors group">
                    <td className="px-6 py-4">
                      <div className="flex flex-col">
                        <Link to={`/post/${post.id}`} className="text-stone-900 font-bold hover:text-amber-800 transition-colors">
                          {post.title}
                        </Link>
                        <span className="text-xs text-stone-400 font-medium">{post.authorName}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <button 
                        onClick={() => togglePublished(post.id, post.published)}
                        className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold transition-all ${
                          post.published 
                          ? 'bg-green-100 text-green-700 hover:bg-green-200' 
                          : 'bg-amber-100 text-amber-700 hover:bg-amber-200'
                        }`}
                      >
                        {post.published ? <Eye size={12} /> : <EyeOff size={12} />}
                        {post.published ? 'Published' : 'Draft'}
                      </button>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-sm text-stone-500 font-medium">
                        {post.createdAt ? format(post.createdAt.toDate(), 'MMM d, yyyy') : '-'}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <Link 
                          to={`/admin/edit/${post.id}`} 
                          className="p-2 text-stone-600 hover:bg-stone-100 rounded-lg transition-colors"
                          title="Edit"
                        >
                          <Edit3 size={18} />
                        </Link>
                        <button 
                          onClick={() => deletePost(post.id)}
                          className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                          title="Delete"
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
