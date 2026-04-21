import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../lib/firebase';
import ReactMarkdown from 'react-markdown';
import { motion, AnimatePresence } from 'motion/react';
import { Calendar, User, ArrowLeft, Twitter, Facebook, Linkedin, Link as LinkIcon, Check } from 'lucide-react';
import { format } from 'date-fns';

interface Post {
  title: string;
  content: string;
  imageUrl?: string;
  authorName: string;
  createdAt: any;
  published: boolean;
}

export default function PostView() {
  const { id } = useParams<{ id: string }>();
  const [post, setPost] = useState<Post | null>(null);
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const fetchPost = async () => {
      if (!id) return;
      try {
        const docRef = doc(db, 'posts', id);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          setPost(docSnap.data() as Post);
        }
      } catch (error) {
        console.error("Error fetching post:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchPost();
  }, [id]);

  const handleCopyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const shareLinks = {
    twitter: `https://twitter.com/intent/tweet?text=${encodeURIComponent(post?.title || '')}&url=${encodeURIComponent(window.location.href)}`,
    facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(window.location.href)}`,
    linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(window.location.href)}`
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-stone-50">
        <div className="text-stone-500 font-serif italic text-xl animate-pulse">Turning the pages...</div>
      </div>
    );
  }

  if (!post || (!post.published && !localStorage.getItem('isAdmin'))) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-stone-50 p-4 text-center">
        <h1 className="text-4xl font-serif font-bold mb-4">Post Not Found</h1>
        <p className="text-stone-600 mb-8 max-w-sm">
          The story you're looking for might have been moved or hasn't been published yet.
        </p>
        <Link to="/" className="text-stone-900 font-bold underline underline-offset-4 decoration-stone-300 hover:decoration-stone-900 transition-all">
          Back to Homepage
        </Link>
      </div>
    );
  }

  return (
    <div className="bg-stone-50 pb-32">
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6 }}
      >
        {/* Post Header */}
        <div className="max-w-4xl mx-auto px-4 pt-20">
          <Link to="/" className="inline-flex items-center gap-2 text-stone-500 hover:text-stone-900 transition-colors mb-12 group">
            <ArrowLeft size={18} className="transition-transform group-hover:-translate-x-1" /> Back to explore
          </Link>

          <header className="mb-16">
            <h1 className="text-5xl md:text-7xl font-serif font-bold leading-tight mb-8">
              {post.title}
            </h1>
            
            <div className="flex flex-wrap items-center gap-8 text-sm text-stone-500 border-y border-stone-200 py-6">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-stone-200 flex items-center justify-center overflow-hidden">
                  <User size={20} className="text-stone-500" />
                </div>
                <div>
                  <span className="block text-stone-900 font-bold">{post.authorName}</span>
                  <span className="block text-xs uppercase tracking-wider">Author</span>
                </div>
              </div>
              
              <div className="flex items-center gap-3">
                <Calendar size={20} className="text-stone-400" />
                <div>
                  <span className="block text-stone-900 font-bold">
                    {post.createdAt ? format(post.createdAt.toDate(), 'MMMM d, yyyy') : 'Unknown Date'}
                  </span>
                  <span className="block text-xs uppercase tracking-wider">Published</span>
                </div>
              </div>

              <div className="ml-auto flex items-center gap-2">
                <span className="text-xs uppercase tracking-widest font-bold text-stone-400 mr-2 hidden sm:inline">Share:</span>
                <a 
                  href={shareLinks.twitter} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="bg-stone-100 hover:bg-stone-800 hover:text-white p-2.5 rounded-full transition-all duration-300 text-stone-900"
                  title="Share on Twitter"
                >
                  <Twitter size={18} />
                </a>
                <a 
                  href={shareLinks.facebook} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="bg-stone-100 hover:bg-stone-800 hover:text-white p-2.5 rounded-full transition-all duration-300 text-stone-900"
                  title="Share on Facebook"
                >
                  <Facebook size={18} />
                </a>
                <a 
                  href={shareLinks.linkedin} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="bg-stone-100 hover:bg-stone-800 hover:text-white p-2.5 rounded-full transition-all duration-300 text-stone-900"
                  title="Share on LinkedIn"
                >
                  <Linkedin size={18} />
                </a>
                <button 
                  onClick={handleCopyLink}
                  className="relative bg-stone-100 hover:bg-stone-800 hover:text-white p-2.5 rounded-full transition-all duration-300 text-stone-900"
                  title="Copy link"
                >
                  <AnimatePresence mode="wait">
                    {copied ? (
                      <motion.div
                        key="check"
                        initial={{ scale: 0.5, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        exit={{ scale: 0.5, opacity: 0 }}
                      >
                        <Check size={18} className="text-green-500" />
                      </motion.div>
                    ) : (
                      <motion.div
                        key="copy"
                        initial={{ scale: 0.5, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        exit={{ scale: 0.5, opacity: 0 }}
                      >
                        <LinkIcon size={18} />
                      </motion.div>
                    )}
                  </AnimatePresence>
                </button>
              </div>
            </div>
          </header>
        </div>


        {/* Featured Image */}
        {post.imageUrl && (
          <div className="max-w-6xl mx-auto px-4 mb-20 animate-in fade-in slide-in-from-bottom-4 duration-1000">
            <img 
              src={post.imageUrl} 
              alt={post.title} 
              className="w-full h-auto max-h-[70vh] object-cover rounded-3xl shadow-2xl"
              referrerPolicy="no-referrer"
            />
          </div>
        )}

        {/* Post Body */}
        <div className="max-w-3xl mx-auto px-4">
          <div className="markdown-body prose prose-stone lg:prose-xl max-w-none">
            <ReactMarkdown>{post.content}</ReactMarkdown>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
