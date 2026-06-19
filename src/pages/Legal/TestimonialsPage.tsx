import React, { useState, useEffect } from 'react';
import { mockDb } from '../../services/mockDb';
import type { Testimonial } from '../../services/mockDb';
import { Star, MessageSquare, Plus, ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';

export const TestimonialsPage: React.FC = () => {
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [name, setName] = useState('');
  const [location, setLocation] = useState('');
  const [review, setReview] = useState('');
  const [rating, setRating] = useState(5);
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    setTestimonials(mockDb.getTestimonials());
  }, []);

  const handleReviewSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !location || !review) return;
    
    const newTestimonial: Testimonial = {
      id: `t-${Math.random().toString(36).substr(2, 9)}`,
      name,
      location,
      review,
      rating,
      image: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&h=150&fit=crop' // default generic avatar
    };

    // Append to local storage table
    const current = mockDb.getTestimonials();
    current.push(newTestimonial);
    localStorage.setItem('nsmf_testimonials', JSON.stringify(current));
    
    // Refresh page state
    setTestimonials(current);
    setSubmitted(true);
    setTimeout(() => {
      setName('');
      setLocation('');
      setReview('');
      setRating(5);
      setSubmitted(false);
      setModalOpen(false);
    }, 2000);
  };

  return (
    <div className="w-full flex flex-col font-sans">
      
      {/* Header Banner */}
      <section className="bg-primary text-white py-16 px-4 sm:px-8 text-center relative overflow-hidden">
        <div className="absolute inset-0 bg-slate-950/20 z-0" />
        <div className="max-w-4xl mx-auto space-y-4 relative z-10">
          <span className="text-secondary text-xs font-bold uppercase tracking-widest bg-white/10 px-4 py-1 rounded-full">
            Success Stories
          </span>
          <h1 className="font-display font-extrabold text-3xl sm:text-5xl text-white">
            Client Success Testimonials
          </h1>
          <p className="text-slate-300 text-sm max-w-xl mx-auto leading-relaxed">
            Read stories of transformation, resilience, and growth. We are proud to have supported over 15,000 farmers, women entrepreneurs, and MSME business owners across India.
          </p>
        </div>
      </section>

      {/* Grid List */}
      <section className="py-24 px-4 sm:px-8 bg-white text-slate-800">
        <div className="max-w-7xl mx-auto space-y-12">
          
          <div className="flex justify-between items-center border-b pb-6">
            <Link to="/" className="text-primary hover:text-secondary font-bold text-xs flex items-center gap-1">
              <ArrowLeft className="w-4 h-4" /> Back to Home
            </Link>
            <button 
              onClick={() => setModalOpen(true)}
              className="bg-primary hover:bg-navy-dark text-white font-bold text-xs px-4 py-2.5 rounded-xl shadow-md flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <Plus className="w-4 h-4 text-secondary" /> Share Your Story
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {testimonials.map((item, idx) => (
              <motion.div 
                key={item.id}
                initial={{ opacity: 0, y: 15 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: idx * 0.05 }}
                className="bg-slate-50 border border-slate-200 p-6 rounded-3xl flex flex-col justify-between hover:shadow-md transition-shadow text-left"
              >
                <p className="text-slate-600 text-xs sm:text-sm italic leading-relaxed mb-6">
                  "{item.review}"
                </p>
                <div className="flex items-center gap-3 pt-4 border-t border-slate-200/50">
                  <img src={item.image} alt="" className="w-10 h-10 rounded-full object-cover border-2 border-secondary" />
                  <div>
                    <h4 className="font-display font-bold text-xs text-primary">{item.name}</h4>
                    <span className="text-[9px] text-slate-400 font-bold uppercase tracking-wider block mt-0.5">{item.location}</span>
                  </div>
                  <div className="ml-auto flex gap-0.5 text-secondary">
                    {Array.from({ length: item.rating }).map((_, i) => (
                      <Star key={i} className="w-3 h-3 fill-current" />
                    ))}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

        </div>
      </section>

      {/* Write review Modal */}
      <AnimatePresence>
        {modalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.6 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-navy-dark"
              onClick={() => setModalOpen(false)}
            />
            
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="bg-white rounded-3xl shadow-2xl p-6 sm:p-8 w-full max-w-md relative z-50 text-left"
            >
              <h3 className="font-display font-extrabold text-lg text-primary mb-2 flex items-center gap-2">
                <MessageSquare className="w-5 h-5 text-secondary" /> Share Your Experience
              </h3>
              <p className="text-xs text-slate-400 mb-6">
                Tell us how Nayak Sairam helped you achieve your dreams.
              </p>

              {submitted ? (
                <div className="p-8 text-center bg-green-50 border border-green-200 rounded-2xl space-y-3">
                  <div className="w-10 h-10 rounded-full bg-green-100 text-green-600 flex items-center justify-center mx-auto shadow-sm">
                    ✓
                  </div>
                  <h4 className="font-bold text-green-800">Review Submitted!</h4>
                  <p className="text-xs text-green-600">
                    Thank you. Your success story helps us improve our services.
                  </p>
                </div>
              ) : (
                <form onSubmit={handleReviewSubmit} className="space-y-4">
                  <div>
                    <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-1.5">Full Name</label>
                    <input 
                      type="text"
                      required
                      placeholder="e.g. Ramesh Kumar"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 focus:border-primary/50 text-slate-800 rounded-xl py-3 px-4 text-xs focus:outline-none"
                    />
                  </div>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-1.5">Location (City, State)</label>
                      <input 
                        type="text"
                        required
                        placeholder="e.g. Madurai, TN"
                        value={location}
                        onChange={(e) => setLocation(e.target.value)}
                        className="w-full bg-slate-50 border border-slate-200 focus:border-primary/50 text-slate-800 rounded-xl py-3 px-4 text-xs focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-1.5">Rating</label>
                      <select 
                        value={rating}
                        onChange={(e) => setRating(Number(e.target.value))}
                        className="w-full bg-slate-50 border border-slate-200 focus:border-primary/50 text-slate-800 rounded-xl py-3 px-4 text-xs focus:outline-none cursor-pointer"
                      >
                        <option value={5}>5 Stars (Excellent)</option>
                        <option value={4}>4 Stars (Very Good)</option>
                        <option value={3}>3 Stars (Average)</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-1.5">Your Review / Story</label>
                    <textarea 
                      required
                      rows={4}
                      placeholder="Describe how the loan or service helped you..."
                      value={review}
                      onChange={(e) => setReview(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 focus:border-primary/50 text-slate-800 rounded-xl py-3 px-4 text-xs focus:outline-none resize-none"
                    />
                  </div>

                  <button 
                    type="submit"
                    className="w-full bg-primary hover:bg-navy-dark text-white font-bold text-xs py-3.5 rounded-xl shadow-md transition-colors cursor-pointer"
                  >
                    Submit Story
                  </button>
                </form>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
};
