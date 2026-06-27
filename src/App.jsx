import React, { useState, useRef } from 'react';
import { ChevronRight, Users, Star, Award, ShieldCheck, X } from 'lucide-react';

const servicesData = {
  "Editorial & Bridal": {
    title: "Editorial & Bridal",
    bgImg: "https://images.unsplash.com/photo-1596462502278-27bfdc403348?auto=format&fit=crop&q=80&w=1600",
    desc: "Our signature bridal service is designed to make you feel radiant and timeless.",
    items: [
      { name: "Classic Elegance", img: "https://images.unsplash.com/photo-1595802521946-b60586e3f140?auto=format&fit=crop&q=80&w=800", desc: "Timeless and sophisticated look." },
      { name: "Boho Chic", img: "https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&q=80&w=800", desc: "Soft, romantic styles." },
      { name: "Modern Glam", img: "https://images.unsplash.com/photo-1560066984-138dadb4c0d5?auto=format&fit=crop&q=80&w=800", desc: "Bold, trendy, high-fashion." }
    ]
  },
  "Signature Styling": {
    title: "Signature Styling",
    bgImg: "https://images.unsplash.com/photo-1620916566398-39f1143ab7be?auto=format&fit=crop&q=80&w=1600",
    desc: "Precision cutting and master-level color theory designed for your lifestyle.",
    items: [
      { name: "Custom Hair Color", img: "https://images.unsplash.com/photo-1562322140-8baeecece3df?auto=format&fit=crop&q=80&w=800", desc: "Customized color treatments." },
      { name: "Precision Cutting", img: "https://images.unsplash.com/photo-1580618672591-eb180b1a973f?auto=format&fit=crop&q=80&w=800", desc: "Sharp, clean lines." },
      { name: "Styling & Extensions", img: "https://images.unsplash.com/photo-1560066984-138dadb4c0d5?auto=format&fit=crop&q=80&w=800", desc: "Fullness and length." }
    ]
  }
};

const Counter = ({ initialValue, label, icon: Icon, suffix = "" }) => {
  const [count, setCount] = useState(initialValue);
  return (
    <button onClick={() => setCount(prev => prev + 1)} className="flex flex-col items-center gap-2 p-4 rounded-2xl hover:bg-[#C8B87B]/10 transition-all w-full border border-transparent hover:border-[#C8B87B]/20">
      <div className="text-[#C8B87B] mb-1"><Icon size={24} /></div>
      <div className="text-2xl font-bold text-[#0A1D2F] tracking-tight">{count}{suffix}</div>
      <div className="text-[10px] font-bold uppercase tracking-widest text-[#0A1D2F]/50">{label}</div>
    </button>
  );
};

const BookingModal = ({ isOpen, onClose, services, selectedService }) => {
  const [selected, setSelected] = useState(selectedService ? [selectedService] : []);
  const [bookingDate, setBookingDate] = useState('');
  const [bookingTime, setBookingTime] = useState('');
  const [contactMethod, setContactMethod] = useState('email'); 
  const [status, setStatus] = useState(null); 
  const telegramHandle = "FitaRegassa"; 

  if (!isOpen) return null;

  const toggleService = (serviceName) => {
    setSelected(prev => 
      prev.includes(serviceName) ? prev.filter(s => s !== serviceName) : [...prev, serviceName]
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (contactMethod === 'telegram') {
        const msg = `Booking Request for Boni Beauty Studio\n\nName: ${e.target.name.value}\nDate: ${bookingDate}\nTime: ${bookingTime}\nServices: ${selected.join(', ')}\nNote: ${e.target.note.value}`;
        window.open(`https://t.me/${telegramHandle}?text=${encodeURIComponent(msg)}`, '_blank');
        onClose();
        return;
    }
    setStatus("submitting");
    setTimeout(() => setStatus("success"), 1000);
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-[#0A1D2F]/80 backdrop-blur-sm">
      <div className="bg-[#FDFBF5] w-full max-w-md p-6 rounded-3xl shadow-2xl relative max-h-[90vh] overflow-y-auto">
        <button onClick={onClose} className="absolute top-6 right-6 text-[#0A1D2F] hover:text-[#C8B87B] transition"><X /></button>
        <h2 className="text-3xl font-serif mb-6 text-[#0A1D2F]">Book Appointment</h2>
        {status === 'success' ? (
            <div className="text-center py-12 text-[#0A1D2F]"><div className="text-5xl mb-4">✅</div><h3 className="text-2xl font-bold">Request Sent!</h3><p>We will contact you shortly.</p></div>
        ) : (
            <form className="space-y-4" onSubmit={handleSubmit}>
                <input required name="name" type="text" placeholder="Your Name" className="w-full p-4 border border-[#0A1D2F]/10 rounded-xl bg-transparent" />
                <input required name="email" type="email" placeholder="Your Email" className="w-full p-4 border border-[#0A1D2F]/10 rounded-xl bg-transparent" />
                <div className="grid grid-cols-2 gap-4">
                    <input type="date" required className="w-full p-4 border border-[#0A1D2F]/10 rounded-xl bg-transparent" onChange={(e) => setBookingDate(e.target.value)} />
                    <input type="time" required className="w-full p-4 border border-[#0A1D2F]/10 rounded-xl bg-transparent" onChange={(e) => setBookingTime(e.target.value)} />
                </div>
                <button disabled={status === 'submitting'} type="submit" className="w-full bg-[#0A1D2F] text-white py-4 font-bold rounded-xl hover:bg-[#C8B87B] transition">{status === 'submitting' ? "Sending..." : "Submit Request"}</button>
            </form>
        )}
      </div>
    </div>
  );
};

export default function App() {
  const [view, setView] = useState('home');
  const [activeCategory, setActiveCategory] = useState(null);
  const [isBookingOpen, setIsBookingOpen] = useState(false);
  const [selectedService, setSelectedService] = useState(null);
  
  const servicesRef = useRef(null);
  const aboutRef = useRef(null);
  const contactRef = useRef(null);

  const PageWrapper = ({ children }) => (
    <div className="bg-[#ECE9E2] min-h-screen py-8">
      <div className="max-w-[1280px] mx-auto bg-white rounded-3xl shadow-xl overflow-hidden">
        {children}
      </div>
    </div>
  );

  if (view === 'portfolio') {
    return (
      <PageWrapper>
          <header className="px-8 py-4 border-b border-[#0A1D2F]/10 flex justify-between items-center">
            <div className="text-2xl font-bold tracking-tighter cursor-pointer font-serif" onClick={() => setView('home')}>BONI</div>
            <button onClick={() => setView('home')} className="text-sm font-medium hover:text-[#C8B87B]">← Back</button>
          </header>
          <div className="px-8 py-16 max-w-6xl mx-auto">
            <h1 className="text-4xl font-serif mb-12">{servicesData[activeCategory].title}</h1>
            <div className="grid md:grid-cols-3 gap-8">
              {servicesData[activeCategory].items.map((item, idx) => (
                <div key={idx} className="bg-white p-4 border border-[#0A1D2F]/10 shadow-sm rounded-2xl">
                  <img src={item.img} alt={item.name} className="w-full h-52 object-cover mb-4 rounded-xl" />
                  <h3 className="font-bold text-lg mb-1">{item.name}</h3>
                  <button onClick={() => { setSelectedService(item.name); setIsBookingOpen(true); }} className="w-full py-3 border border-[#0A1D2F] hover:bg-[#0A1D2F] hover:text-white transition rounded-xl font-bold text-sm">Book</button>
                </div>
              ))}
            </div>
          </div>
          <BookingModal isOpen={isBookingOpen} onClose={() => setIsBookingOpen(false)} services={servicesData} selectedService={selectedService} />
      </PageWrapper>
    );
  }

  return (
    <PageWrapper>
        <header className="px-8 py-4 border-b border-[#0A1D2F]/10 sticky top-0 bg-white/95 z-50 flex justify-between items-center">
            <div className="text-2xl font-bold tracking-tighter cursor-pointer font-serif" onClick={() => window.scrollTo({top:0, behavior:'smooth'})}>BONI</div>
            <nav className="hidden md:flex gap-8 text-sm font-medium">
                <button onClick={() => servicesRef.current?.scrollIntoView({ behavior: 'smooth' })}>Services</button>
                <button onClick={() => aboutRef.current?.scrollIntoView({ behavior: 'smooth' })}>About</button>
                <button onClick={() => contactRef.current?.scrollIntoView({ behavior: 'smooth' })}>Contact</button>
            </nav>
            <button onClick={() => { setSelectedService(null); setIsBookingOpen(true); }} className="bg-[#0A1D2F] text-white px-6 py-2 text-sm font-bold rounded-full hover:bg-[#C8B87B]">Book Now</button>
        </header>

        <section className="relative h-[65vh] max-h-[620px] flex items-center overflow-hidden">
            <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=2400')] bg-cover bg-center" />
            <div className="absolute inset-0 bg-[#0A1D2F]/40" />
            <div className="relative z-10 w-full px-8 max-w-6xl mx-auto text-white">
                <h1 className="text-4xl md:text-6xl lg:text-7xl font-serif leading-tight mb-8">Timeless Beauty.<br/>Artfully Defined.</h1>
                <button onClick={() => { setSelectedService(null); setIsBookingOpen(true); }} className="bg-[#C8B87B] text-[#0A1D2F] px-8 py-3 font-bold uppercase tracking-widest text-xs hover:bg-white transition rounded-full shadow-lg">Book a Consultation</button>
            </div>
        </section>

        <section className="py-16 w-full max-w-6xl mx-auto px-8">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                <Counter initialValue={20} label="Experts" icon={Users} />
                <Counter initialValue={15000} label="Satisfied" icon={Star} suffix="+" />
                <Counter initialValue={10} label="Years" icon={Award} />
                <Counter initialValue={18} label="Devices" icon={ShieldCheck} />
            </div>
        </section>

        <section ref={servicesRef} className="px-8 py-16 max-w-6xl mx-auto">
            <h2 className="text-4xl font-serif text-center mb-12">Our Services</h2>
            <div className="grid md:grid-cols-2 gap-8">
            {Object.keys(servicesData).map(key => (
                <div key={key} className="group cursor-pointer" onClick={() => { setActiveCategory(key); setView('portfolio'); }}>
                <div className="h-80 w-full rounded-3xl shadow-xl overflow-hidden relative">
                    <img src={servicesData[key].bgImg} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#0A1D2F]/80 to-transparent p-8 flex flex-col justify-end">
                        <h3 className="text-2xl font-serif text-white">{servicesData[key].title}</h3>
                    </div>
                </div>
                </div>
            ))}
            </div>
        </section>

        <section ref={aboutRef} className="py-16 bg-[#0A1D2F] text-[#FDFBF5] w-full">
            <div className="px-8 flex flex-col md:flex-row items-center gap-10 max-w-6xl mx-auto">
                <div className="w-full md:w-1/2">
                    <img src="image_56313c.jpg" alt="Our Story" className="rounded-3xl shadow-2xl h-[400px] w-full object-cover" />
                </div>
                <div className="w-full md:w-1/2 space-y-6">
                    <h2 className="text-4xl font-serif">Dedicated to your radiance.</h2>
                    <p className="text-[#FDFBF5]/70 leading-relaxed">Boni Beauty Studio merges modern artistry with timeless elegance. Our team of expert stylists is committed to crafting personalized experiences.</p>
                </div>
            </div>
        </section>

        <footer ref={contactRef} className="py-14 text-center border-t border-[#0A1D2F]/10 w-full max-w-6xl mx-auto">
            <p className="font-serif text-xl font-bold">BONI BEAUTY STUDIO</p>
            <p className="text-sm mt-2 opacity-60">&copy; 2026 Boni Beauty Studio. All rights reserved.</p>
        </footer>
        <BookingModal isOpen={isBookingOpen} onClose={() => setIsBookingOpen(false)} services={servicesData} selectedService={selectedService} />
    </PageWrapper>
  );
}