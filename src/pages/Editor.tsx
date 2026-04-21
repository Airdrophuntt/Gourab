import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { doc, getDoc, setDoc, addDoc, collection, serverTimestamp, updateDoc } from 'firebase/firestore';
import { ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';
import { db, storage, auth } from '../lib/firebase';
import { motion } from 'motion/react';
import { Save, ArrowLeft, Image as ImageIcon, Eye, Edit2, Loader2, X, UploadCloud } from 'lucide-react';
import ReactMarkdown from 'react-markdown';

export default function Editor() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(!!id);
  const [view, setView] = useState<'edit' | 'preview'>('edit');
  
  const [title, setTitle] = useState('');
  const [summary, setSummary] = useState('');
  const [content, setContent] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [published, setPublished] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState<number | null>(null);

  useEffect(() => {
    const fetchPost = async () => {
      if (!id) return;
      try {
        const snap = await getDoc(doc(db, 'posts', id));
        if (snap.exists()) {
          const data = snap.data();
          setTitle(data.title);
          setSummary(data.summary || '');
          setContent(data.content);
          setImageUrl(data.imageUrl || '');
          setPublished(data.published);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setInitialLoading(false);
      }
    };
    fetchPost();
  }, [id]);

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Limit file size (max 8MB for posts)
    if (file.size > 8 * 1024 * 1024) {
      alert("Image is too large. Please select a photo smaller than 8MB.");
      return;
    }

    setUploading(true);
    setUploadProgress(0);
    
    try {
      const imgbbKey = import.meta.env.VITE_IMGBB_API_KEY;
      
      if (imgbbKey) {
        // USE IMGBB (Free alternative)
        const formData = new FormData();
        formData.append('image', file);
        
        const response = await fetch(`https://api.imgbb.com/1/upload?key=${imgbbKey}`, {
          method: 'POST',
          body: formData
        });
        
        const result = await response.json();
        if (result.success) {
          setImageUrl(result.data.url);
          setUploading(false);
          setUploadProgress(null);
        } else {
          throw new Error(result.error?.message || "ImgBB upload failed");
        }
      } else {
        // USE FIREBASE STORAGE (Default)
        const fileName = `${Date.now()}_${file.name.replace(/[^a-zA-Z0-9.-]/g, '_')}`;
        const storageRef = ref(storage, `blog-images/${fileName}`);
        const uploadTask = uploadBytesResumable(storageRef, file);

        uploadTask.on('state_changed', 
          (snapshot) => {
            const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
            setUploadProgress(Math.round(progress));
          }, 
          (error) => {
            console.error("Upload error:", error);
            let msg = "Failed to upload image.";
            if (error.code === 'storage/unauthorized') {
              msg = "Firebase Storage Error: Permission denied. Try using ImgBB for a free alternative.";
            }
            alert(msg);
            setUploading(false);
            setUploadProgress(null);
          }, 
          async () => {
            const url = await getDownloadURL(uploadTask.snapshot.ref);
            setImageUrl(url);
            setUploading(false);
            setUploadProgress(null);
          }
        );
      }
    } catch (err: any) {
      console.error(err);
      alert(err.message || "An error occurred during upload.");
      setUploading(false);
      setUploadProgress(null);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !content) {
      alert("Title and Content are required.");
      return;
    }

    setLoading(true);
    try {
      const postData = {
        title,
        summary,
        content,
        imageUrl,
        published,
        updatedAt: serverTimestamp()
      };

      if (id) {
        await updateDoc(doc(db, 'posts', id), postData);
      } else {
        await addDoc(collection(db, 'posts'), {
          ...postData,
          authorId: auth.currentUser?.uid,
          authorName: auth.currentUser?.displayName || auth.currentUser?.email || 'Admin',
          createdAt: serverTimestamp()
        });
      }
      navigate('/admin');
    } catch (err) {
      console.error(err);
      alert("Failed to save post.");
    } finally {
      setLoading(false);
    }
  };

  if (initialLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-stone-50">
        <div className="text-stone-500 font-serif italic text-xl">Loading your draft...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-stone-50 pb-20">
      <form onSubmit={handleSubmit}>
        {/* Editor Toolbar */}
        <div className="bg-white border-b border-stone-200 sticky top-20 z-40 transition-all">
          <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
            <button 
              type="button"
              onClick={() => navigate('/admin')}
              className="flex items-center gap-2 text-stone-500 hover:text-stone-900 font-medium transition-colors"
            >
              <ArrowLeft size={18} /> Exit
            </button>

            <div className="flex items-center bg-stone-100 p-1 rounded-lg">
              <button 
                type="button"
                onClick={() => setView('edit')}
                className={`flex items-center gap-2 px-4 py-1.5 rounded-md text-sm font-bold transition-all ${view === 'edit' ? 'bg-white shadow-sm text-stone-900' : 'text-stone-500 hover:text-stone-700'}`}
              >
                <Edit2 size={14} /> Write
              </button>
              <button 
                type="button"
                onClick={() => setView('preview')}
                className={`flex items-center gap-2 px-4 py-1.5 rounded-md text-sm font-bold transition-all ${view === 'preview' ? 'bg-white shadow-sm text-stone-900' : 'text-stone-500 hover:text-stone-700'}`}
              >
                <Eye size={14} /> Preview
              </button>
            </div>

            <div className="flex items-center gap-4">
              <label className="flex items-center gap-2 text-sm font-bold text-stone-600 cursor-pointer select-none">
                <input 
                  type="checkbox" 
                  checked={published} 
                  onChange={(e) => setPublished(e.target.checked)}
                  className="w-4 h-4 rounded border-stone-300 text-stone-900 focus:ring-stone-200"
                />
                Published
              </label>
              <button 
                type="submit"
                disabled={loading}
                className="flex items-center gap-2 bg-stone-900 text-white px-6 py-2 rounded-lg font-bold hover:bg-stone-800 disabled:bg-stone-400 transition-all shadow-lg shadow-stone-200"
              >
                {loading ? <Loader2 size={18} className="animate-spin" /> : <Save size={18} />}
                Save Story
              </button>
            </div>
          </div>
        </div>

        <div className="max-w-4xl mx-auto px-4 py-12">
          {view === 'edit' ? (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-8">
              {/* Image Upload Area */}
              <div className="relative group">
                {imageUrl ? (
                  <div className="relative aspect-[21/9] rounded-3xl overflow-hidden shadow-md group">
                    <img src={imageUrl} alt="Cover" className="w-full h-full object-cover transition-transform group-hover:scale-105" />
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors flex items-center justify-center opacity-0 group-hover:opacity-100">
                      <button 
                        type="button"
                        onClick={() => setImageUrl('')}
                        className="bg-red-500 text-white p-2 rounded-full hover:bg-red-600 transition-colors"
                      >
                        <X size={20} />
                      </button>
                    </div>
                  </div>
                ) : (
                  <label className="flex flex-col items-center justify-center aspect-[21/9] rounded-3xl border-2 border-dashed border-stone-200 bg-stone-50 hover:bg-stone-100 hover:border-stone-300 cursor-pointer transition-all group">
                    {uploading ? (
                      <div className="flex flex-col items-center">
                        <Loader2 className="animate-spin text-heritage-gold mb-4" size={32} />
                        <span className="text-heritage-accent font-serif italic text-lg font-bold">Uploading {uploadProgress}%</span>
                        {uploadProgress !== null && (
                          <div className="mt-4 w-48 h-1.5 bg-stone-200 rounded-full overflow-hidden">
                            <div 
                              className="h-full bg-heritage-gold transition-all duration-300" 
                              style={{ width: `${uploadProgress}%` }}
                            />
                          </div>
                        )}
                      </div>
                    ) : (
                      <>
                        <ImageIcon className="text-stone-400 mb-4 group-hover:text-stone-600 transition-colors" size={32} />
                        <span className="text-stone-500 font-medium">Add featured image</span>
                      </>
                    )}
                    <input type="file" className="hidden" accept="image/*" onChange={handleImageUpload} disabled={uploading} />
                  </label>
                )}
              </div>

              <input 
                type="text" 
                placeholder="The narrative title..." 
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full text-5xl md:text-6xl font-serif font-bold bg-transparent border-none outline-none placeholder:text-stone-200"
              />

              <div className="space-y-2">
                <label className="text-xs font-bold text-stone-400 uppercase tracking-widest px-1">Short Summary</label>
                <textarea 
                  placeholder="A compelling hook for the home page..." 
                  value={summary}
                  onChange={(e) => setSummary(e.target.value)}
                  className="w-full text-xl text-stone-600 bg-transparent border-stone-100 focus:border-stone-300 rounded-lg outline-none resize-none transition-colors border-b py-2"
                  rows={2}
                />
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold text-stone-400 uppercase tracking-widest px-1">Story Content (Markdown)</label>
                <textarea 
                  placeholder="Tell your story here..." 
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  className="w-full min-h-[500px] text-lg leading-relaxed text-stone-800 bg-transparent border-none outline-none resize-none font-sans"
                />
              </div>
            </motion.div>
          ) : (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <div className="max-w-3xl mx-auto">
                <h1 className="text-5xl md:text-6xl font-serif font-bold mb-10 leading-tight">{title || 'Untitled Story'}</h1>
                {imageUrl && (
                  <img src={imageUrl} alt="Cover" className="w-full h-auto rounded-3xl mb-12 shadow-xl" referrerPolicy="no-referrer" />
                )}
                <div className="markdown-body">
                  <ReactMarkdown>{content || '*No content yet.*'}</ReactMarkdown>
                </div>
              </div>
            </motion.div>
          )}
        </div>
      </form>
    </div>
  );
}
