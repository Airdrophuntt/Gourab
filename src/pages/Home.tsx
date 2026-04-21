import { useEffect, useState } from 'react';
import { collection, query, where, orderBy, getDocs, limit } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { Link } from 'react-router-dom';
import { motion } from 'motion/react';
import { Calendar, User, ArrowRight } from 'lucide-react';
import { format } from 'date-fns';

interface Post {
  id: string;
  title: string;
  summary: string;
  imageUrl?: string;
  authorName: string;
  createdAt: any;
  published: boolean;
}

export default function Home() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const q = query(
          collection(db, 'posts'),
          where('published', '==', true),
          orderBy('createdAt', 'desc'),
          limit(10)
        );
        const querySnapshot = await getDocs(q);
        const fetchedPosts = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        } as Post));
        setPosts(fetchedPosts);
      } catch (error) {
        console.error("Error fetching posts:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, []);

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 text-center text-stone-500">
        Discovering stories...
      </div>
    );
  }

  return (
    <div className="pb-20">
      {/* Hero Section */}
      <section className="relative h-[85vh] flex items-center overflow-hidden bg-heritage-ink text-white">
        <div className="absolute inset-0 opacity-50">
          <img 
            src="https://picsum.photos/seed/bengali-festival/1920/1080" 
            alt="Traditional Durga Puja in Jamgram" 
            className="w-full h-full object-cover sepia-[0.2]"
            referrerPolicy="no-referrer"
          />
        </div>
        <div className="absolute inset-0 bg-gradient-to-t from-heritage-ink via-transparent to-heritage-ink/40" />
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="max-w-3xl"
          >
            <span className="uppercase tracking-[0.4em] text-[10px] font-bold text-heritage-gold mb-6 block border-l-2 border-heritage-gold pl-4">
              Est. 18th Century / Hooghly, West Bengal
            </span>
            <h1 className="text-6xl md:text-8xl font-serif font-bold leading-tight mb-8">
              Jamgram Ghoshbari
            </h1>
            <p className="text-xl text-stone-200 leading-relaxed mb-10 max-w-xl font-serif italic">
              "Jamgram is a small village in the Hooghly district. In this village, two Durga pujas are held, one of the Ghosh Family—the oldest, spanning over 250 years of tradition at the historic Durga Dalan."
            </p>
            <div className="flex gap-4">
              <a href="#archives" className="bg-heritage-gold hover:bg-heritage-gold/80 text-heritage-ink px-8 py-4 rounded-full font-bold transition-all flex items-center gap-2 shadow-lg shadow-heritage-gold/20">
                Explore Archives <ArrowRight size={18} />
              </a>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Main Content */}
      <section id="archives" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-20 relative z-10 pb-20">
        {posts.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
            {posts.map((post, index) => (
              <motion.div
                key={post.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Link to={`/post/${post.id}`} className="group block bg-[#fdfaf3] rounded-sm overflow-hidden shadow-sm hover:shadow-2xl transition-all duration-500 border border-heritage-gold/20 p-2">
                  <div className="relative h-72 overflow-hidden rounded-sm">
                    <img 
                      src={post.imageUrl || `https://picsum.photos/seed/${post.id}/800/600`}
                      alt={post.title}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105 sepia-[0.1]"
                      referrerPolicy="no-referrer"
                    />
                    <div className="absolute inset-0 bg-heritage-accent/10 opacity-0 group-hover:opacity-100 transition-opacity" />
                  </div>
                  <div className="p-8">
                    <div className="flex items-center gap-4 text-[10px] text-heritage-gold mb-4 uppercase tracking-[0.2em] font-bold">
                      <span className="flex items-center gap-1">
                        <Calendar size={12} />
                        {post.createdAt ? format(post.createdAt.toDate(), 'MMM d, yyyy') : 'Recently'}
                      </span>
                      <span className="flex items-center gap-1">
                        <User size={12} />
                        {post.authorName}
                      </span>
                    </div>
                    <h3 className="text-2xl font-serif font-bold mb-4 group-hover:text-heritage-accent transition-colors leading-snug">
                      {post.title}
                    </h3>
                    <p className="text-heritage-ink/70 line-clamp-3 leading-relaxed mb-8 text-sm italic font-serif">
                      {post.summary}
                    </p>
                    <div className="flex items-center gap-2 text-heritage-blue font-bold uppercase tracking-widest text-[10px] group/btn border-t border-heritage-gold/10 pt-6">
                      Read Chronicle <ArrowRight size={14} className="transition-transform group-hover/btn:translate-x-1" />
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-2xl p-20 text-center shadow-sm border border-stone-100">
            <p className="text-stone-400 text-lg">No stories have been shared yet. Check back soon.</p>
          </div>
        )}
      </section>
    </div>
  );
}
