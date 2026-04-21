import { useEffect, useState } from 'react';
import { collection, query, where, orderBy, getDocs, limit, doc, getDoc } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { Link } from 'react-router-dom';
import { motion } from 'motion/react';
import { Calendar, User, ArrowRight } from 'lucide-react';
import { format } from 'date-fns';
import CountdownTimer from '../components/CountdownTimer';

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
  const [nextPostAt, setNextPostAt] = useState<Date | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch posts
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

        // Fetch settings for countdown
        const settingsSnap = await getDoc(doc(db, 'settings', 'site'));
        if (settingsSnap.exists()) {
          const data = settingsSnap.data();
          if (data.nextPostAt) {
            setNextPostAt(data.nextPostAt.toDate());
          }
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
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
      <section className="relative min-h-[60vh] lg:min-h-[75vh] flex items-center overflow-hidden bg-heritage-ink text-white py-16 lg:py-0">
        <div className="absolute inset-0 opacity-40 lg:opacity-50">
          <img 
            src="https://picsum.photos/seed/bengali-festival/1920/1080" 
            alt="Traditional Durga Puja in Jamgram" 
            className="w-full h-full object-cover sepia-[0.2] scale-105"
            referrerPolicy="no-referrer"
          />
        </div>
        <div className="absolute inset-0 bg-gradient-to-t from-heritage-ink via-transparent to-heritage-ink/40" />
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, ease: "easeOut" }}
            className="max-w-4xl"
          >
            <span className="uppercase tracking-[0.4em] lg:tracking-[0.6em] text-[10px] font-bold text-heritage-gold mb-6 block border-l-2 border-heritage-gold pl-4 opacity-90">
              Est. 18th Century / Hooghly, West Bengal
            </span>
            <h1 className="text-4xl sm:text-6xl lg:text-7xl xl:text-8xl font-serif font-bold leading-[1.1] mb-8 lg:mb-12">
              Jamgram <span className="font-sans font-normal text-3xl sm:text-5xl lg:text-6xl xl:text-7xl block sm:inline mt-2 sm:mt-0 text-heritage-gold/80 italic">জামগ্রাম</span> Ghoshbari
            </h1>
            <p className="text-base sm:text-lg lg:text-xl xl:text-2xl text-stone-200 leading-relaxed mb-10 max-w-2xl font-serif italic opacity-90">
              "Jamgram is a small village in the Hooghly district. In this village, two Durga pujas are held, one of the Ghosh Family—the oldest, spanning over 250 years of tradition at the historic Durga Dalan."
            </p>
          </motion.div>
        </div>
      </section>

      {/* Main Content */}
      <section id="archives" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-12 lg:-mt-24 relative z-10 pb-20">
        {posts.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 lg:gap-12">
            {posts.map((post, index) => (
              <motion.div
                key={post.id}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1, duration: 0.6 }}
              >
                <Link to={`/post/${post.id}`} className="group block bg-[#fdfaf3] rounded-sm overflow-hidden shadow-sm hover:shadow-2xl transition-all duration-700 border border-heritage-gold/20 p-2 h-full flex flex-col">
                  <div className="relative h-60 lg:h-72 overflow-hidden rounded-sm">
                    <img 
                      src={post.imageUrl || `https://picsum.photos/seed/${post.id}/800/600`}
                      alt={post.title}
                      className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110 sepia-[0.1]"
                      referrerPolicy="no-referrer"
                    />
                    <div className="absolute inset-0 bg-heritage-accent/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                  </div>
                  <div className="p-6 lg:p-10 flex-grow flex flex-col">
                    <div className="flex flex-wrap items-center gap-3 lg:gap-6 text-[10px] text-heritage-gold mb-6 uppercase tracking-[0.2em] font-bold border-b border-heritage-gold/10 pb-4">
                      <span className="flex items-center gap-2">
                        <Calendar size={12} />
                        {post.createdAt ? format(post.createdAt.toDate(), 'MMM d, yyyy') : 'Recently'}
                      </span>
                      <span className="flex items-center gap-2">
                        <User size={12} />
                        {post.authorName}
                      </span>
                    </div>
                    <h3 className="text-xl lg:text-3xl font-serif font-bold mb-6 group-hover:text-heritage-accent transition-colors leading-tight">
                      {post.title}
                    </h3>
                    <p className="text-heritage-ink/70 line-clamp-3 leading-relaxed mb-8 flex-grow text-sm lg:text-base italic font-serif opacity-80">
                      {post.summary}
                    </p>
                    <div className="flex items-center justify-between items-center gap-2 text-heritage-blue font-bold uppercase tracking-widest text-[10px] group/btn pt-6 border-t border-heritage-gold/10">
                      <span>Read Chronicle</span>
                      <ArrowRight size={14} className="transition-transform group-hover/btn:translate-x-2" />
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-2xl p-10 md:p-20 text-center shadow-sm border border-stone-100">
            <p className="text-stone-400 text-lg">No stories have been shared yet. Check back soon.</p>
          </div>
        )}
      </section>

      {/* Countdown Section */}
      {nextPostAt && nextPostAt > new Date() && (
        <CountdownTimer targetDate={nextPostAt} />
      )}
    </div>
  );
}
