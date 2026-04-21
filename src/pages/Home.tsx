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
      <section className="relative min-h-[85vh] lg:min-h-[90vh] flex items-start pt-6 lg:pt-10 overflow-hidden bg-heritage-ink text-white">
        <div className="absolute inset-0 opacity-40 lg:opacity-50">
          <img 
            src="https://picsum.photos/seed/bengali-festival/1920/1080" 
            alt="Traditional Durga Puja in Jamgram" 
            className="w-full h-full object-cover sepia-[0.2] scale-105"
            referrerPolicy="no-referrer"
          />
        </div>
        <div className="absolute inset-0 bg-gradient-to-t from-heritage-ink via-transparent/20 to-heritage-ink/60" />
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.2, ease: "easeOut" }}
            className="max-w-4xl"
          >
            <span className="uppercase tracking-[0.4em] lg:tracking-[0.6em] text-[10px] font-bold text-heritage-gold mb-4 block border-l-2 border-heritage-gold pl-4 opacity-90">
              Est. 18th Century / Hooghly, West Bengal
            </span>
            <h1 className="text-5xl sm:text-6xl lg:text-7xl xl:text-8xl font-serif font-bold leading-tight mb-8">
              Jamgram Ghoshbari
            </h1>
            <div className="space-y-6 text-sm sm:text-base lg:text-lg text-stone-200 leading-relaxed font-serif italic opacity-95 bg-heritage-ink/40 backdrop-blur-sm p-6 lg:p-8 rounded-2xl border border-white/10 shadow-2xl">
              <p>
                হুগলী আর বর্ধমান যেখানে গিয়ে মিশেছে, সেই অফুরান মাঠের ধারে একটা ছোট্ট তিরতির করে বয়ে চলা বেহুলা নদী। সেই নদীর ধার ঘেঁষেই একটা গ্রাম। নাম জামগ্রাম। এই জামগ্রামেই আজ ৩০০ বছর ধরে হয়ে আসছে ঘোষ আর নন্দীদের বাড়ির পুজো।
              </p>
              <p>
                ৩০০ বছর। তখনও সুবে বাংলা ইংরেজদের করায়ত্ত হয় নি। তখনও রামমোহন রায়ের দীপ্ত আলোকবর্তিকা বাংলার ঘরে ঘরে প্রবেশ করে নি। সেই সময় থেকে একই পারম্পর্যে এই পুজো চলে আসছে।
              </p>
              <p>
                মজার ব্যাপার হচ্ছে ঘোষ আর নন্দীদের মধ্যে আত্মীয়র সম্পর্ক নেই। কিন্তু দুই বাড়ির দুই ঠাকুরের মধ্যে আছে। আমাদের অর্থাৎ ঘোষ বাড়িরটি দিদি। আর নন্দী বাড়িরটি বোন। পুজো সময়-নির্ঘন্ট মেনে চললেও দিদির পুজো বা সন্ধেবেলার আরতি আগে শুরু হয় তারপর বোনের। এ বাড়ি থেকে প্রসাদ ও বাড়ি যায়, ও বাড়ি থেকে এ বাড়ি এসে।
              </p>
              <p>
                বিসর্জনের সময় ঘোষ বাড়ির ঠাকুরটি আমাদের কাঁধে চেপে নন্দী বাড়ির বোনটিকে ডেকে নিয়ে আসে। তারপর দুই বোনের একসাথে ভাসান হয়ে তালপুকুরে। আশপাশের গ্রাম থেকে বহু মানুষ আসেন এসে সমবেত হন এই সৌহার্দ্য ও আনন্দের মিলনক্ষেত্র জামগ্রামে।
              </p>
              <p>
                বাঙালির বারো মাসে তেরো পাবন। বাদ যায় না জামগ্রামের ঘোষ বাড়িও। দোল-চড়ক-দুর্গোৎসব-কালীপুজো-মাঘী পূর্ণিমা লেগেই থেকে। একেক পুজোতে একেক রকমের অনুভূতি একেক রকমের মজা।
              </p>
              <p>
                শহুরে ও কর্মক্ষেত্রের জটিলতার আবর্ত থেকে বেরিয়ে এসে এই গ্রাম বাংলার প্রাচীন পুজো এক নির্মল আনন্দ দেয়।
              </p>
            </div>
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
