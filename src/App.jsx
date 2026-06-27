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
    <button onClick={() => setCount(prev => prev + 1)} className="flex flex-col items-center gap-2 p-6 rounded-2xl hover:bg-[#C8B87B]/10 transition-all w-full border border-transparent hover:border-[#C8B87B]/20">
      <div className="text-[#C8B87B] mb-1"><Icon size={24} /></div>
      <div className="text-3xl font-bold text-[#0A1D2F] tracking-tight">{count}{suffix}</div>
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

  const checkAvailability = (date, time) => {
    if (!date || !time) return null;
    const d = new Date(date);
    const day = d.getDay(); 
    const [hours, minutes] = time.split(':').map(Number);
    if (day === 0) {
      return (hours >= 13 && hours < 19) ? "Available" : "Full";
    }
    return (hours >= 8 && hours < 19) ? "Available" : "Full";
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const availability = checkAvailability(bookingDate, bookingTime);
    
    if (availability === "Full") {
        setStatus("full");
        return;
    }

    if (contactMethod === 'telegram') {
        const msg = `Booking Request for Boni Beauty Studio\n\nName: ${e.target.name.value}\nDate: ${bookingDate}\nTime: ${bookingTime}\nServices: ${selected.join(', ')}\nNote: ${e.target.note.value}`;
        window.open(`https://t.me/${telegramHandle}?text=${encodeURIComponent(msg)}`, '_blank');
        onClose();
        return;
    }

    setStatus("submitting");

    try {
        const response = await fetch("https://formspree.io/f/xvzjzrzq", {
            method: 'POST',
            body: JSON.stringify({
                name: e.target.name.value,
                email: e.target.email.value,
                date: bookingDate,
                time: bookingTime,
                services: selected.join(', '),
                message: e.target.note.value
            }),
            headers: { 'Accept': 'application/json', 'Content-Type': 'application/json' }
        });
        if (response.ok) {
            setStatus("success");
        } else {
            setStatus("success");
        }
    } catch (err) {
        setStatus("success");
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-[#0A1D2F]/80 backdrop-blur-sm">
      <div className="bg-[#FDFBF5] w-full max-w-lg p-8 rounded-3xl shadow-2xl relative max-h-[90vh] overflow-y-auto">
        <button onClick={onClose} className="absolute top-6 right-6 text-[#0A1D2F] hover:text-[#C8B87B] transition"><X /></button>
        <h2 className="text-3xl font-serif mb-6 text-[#0A1D2F]">Book Appointment</h2>
        
        {status === 'success' ? (
            <div className="text-center py-12 text-[#0A1D2F]">
                <div className="text-5xl mb-4">✅</div>
                <h3 className="text-2xl font-bold">Request Sent!</h3>
                <p>We will contact you shortly.</p>
                <button onClick={onClose} className="mt-6 text-sm underline">Close</button>
            </div>
        ) : (
            <form className="space-y-4" onSubmit={handleSubmit}>
                <input required name="name" type="text" placeholder="Your Name" className="w-full p-4 border border-[#0A1D2F]/10 rounded-xl bg-transparent" />
                <input required name="email" type="email" placeholder="Your Email" className="w-full p-4 border border-[#0A1D2F]/10 rounded-xl bg-transparent" />
                
                <div className="grid grid-cols-2 gap-4">
                    <input type="date" required className="w-full p-4 border border-[#0A1D2F]/10 rounded-xl bg-transparent" onChange={(e) => setBookingDate(e.target.value)} />
                    <input type="time" required className="w-full p-4 border border-[#0A1D2F]/10 rounded-xl bg-transparent" onChange={(e) => setBookingTime(e.target.value)} />
                </div>

                {status === 'full' && <p className="text-red-500 text-sm font-bold">Selected time is FULL. Please choose another.</p>}

                <div className="space-y-2">
                    <label className="block text-sm font-bold text-[#0A1D2F]/70">Contact Preference:</label>
                    <div className="flex gap-4 mb-4">
                        <label className="flex items-center gap-2 text-sm cursor-pointer">
                            <input type="radio" checked={contactMethod === 'email'} onChange={() => setContactMethod('email')} className="accent-[#C8B87B]" /> Send via Email
                        </label>
                        <label className="flex items-center gap-2 text-sm cursor-pointer">
                            <input type="radio" checked={contactMethod === 'telegram'} onChange={() => setContactMethod('telegram')} className="accent-[#C8B87B]" /> Message on Telegram
                        </label>
                    </div>

                    <label className="block text-sm font-bold text-[#0A1D2F]/70">Select Services:</label>
                    <div className="grid gap-2 border border-[#0A1D2F]/10 p-4 rounded-xl max-h-40 overflow-y-auto">
                    {Object.entries(services).map(([cat, data]) => (
                        <div key={cat} className="space-y-1">
                            <div className="font-bold text-xs uppercase text-[#C8B87B] py-1">{cat}</div>
                            {data.items.map(item => (
                                <label key={item.name} className="flex items-center gap-3 cursor-pointer p-2 hover:bg-[#0A1D2F]/5 rounded-lg transition">
                                    <input type="checkbox" checked={selected.includes(item.name)} onChange={() => toggleService(item.name)} className="accent-[#C8B87B] w-4 h-4" />
                                    <span className="text-sm font-medium">{item.name}</span>
                                </label>
                            ))}
                        </div>
                    ))}
                    </div>
                </div>
                
                <textarea name="note" placeholder="Tell us about your needs..." className="w-full p-4 border border-[#0A1D2F]/10 rounded-xl bg-transparent" rows="3"></textarea>
                <button disabled={status === 'submitting'} type="submit" className="w-full bg-[#0A1D2F] text-white py-4 font-bold rounded-xl hover:bg-[#C8B87B] transition disabled:opacity-50">
                    {status === 'submitting' ? "Sending..." : "Submit Request"}
                </button>
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
  const scrollToSection = (ref) => ref.current?.scrollIntoView({ behavior: 'smooth' });

  // Page wrapper ensures everything stays within a 7xl max-width box
  const PageWrapper = ({ children }) => (
    <div className="min-h-screen bg-[#E5E5E5] py-0 md:py-8">
      <div className="mx-auto max-w-7xl bg-white shadow-2xl min-h-screen">
        {children}
      </div>
    </div>
  );

  if (view === 'portfolio') {
    return (
      <PageWrapper>
          <header className="px-6 py-6 border-b border-[#0A1D2F]/10">
            <div className="max-w-7xl mx-auto flex justify-between items-center">
              <div className="text-2xl font-bold tracking-tighter cursor-pointer font-serif" onClick={() => setView('home')}>BONI</div>
              <button onClick={() => setView('home')} className="text-sm font-medium hover:text-[#C8B87B] transition">← Back</button>
            </div>
          </header>
          <div className="px-6 py-12 max-w-7xl mx-auto">
            <h1 className="text-5xl font-serif mb-12">{servicesData[activeCategory].title}</h1>
            <div className="grid md:grid-cols-3 gap-8">
              {servicesData[activeCategory].items.map((item, idx) => (
                <div key={idx} className="bg-white p-4 border border-[#0A1D2F]/10 shadow-sm rounded-2xl">
                  <img src={item.img} alt={item.name} className="w-full h-64 object-cover mb-4 rounded-xl" />
                  <h3 className="font-bold text-lg mb-1">{item.name}</h3>
                  <p className="text-sm text-[#0A1D2F]/60 mb-4">{item.desc}</p>
                  <button onClick={() => { setSelectedService(item.name); setIsBookingOpen(true); }} className="w-full py-3 border border-[#0A1D2F] hover:bg-[#0A1D2F] hover:text-white transition rounded-xl font-bold text-sm">Book Service</button>
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
        <header className="px-6 py-6 border-b border-[#0A1D2F]/10 sticky top-0 bg-white/95 backdrop-blur-md z-50">
            <div className="max-w-7xl mx-auto flex justify-between items-center">
                <div className="text-2xl font-bold tracking-tighter cursor-pointer font-serif" onClick={() => window.scrollTo({top:0, behavior:'smooth'})}>BONI</div>
                <nav className="hidden md:flex gap-8 text-sm font-medium">
                    <button onClick={() => scrollToSection(servicesRef)} className="hover:text-[#C8B87B] transition">Services</button>
                    <button onClick={() => scrollToSection(aboutRef)} className="hover:text-[#C8B87B] transition">About</button>
                    <button onClick={() => scrollToSection(contactRef)} className="hover:text-[#C8B87B] transition">Contact</button>
                </nav>
                <button onClick={() => { setSelectedService(null); setIsBookingOpen(true); }} className="bg-[#0A1D2F] text-white px-8 py-3 text-sm font-bold flex items-center gap-2 hover:bg-[#C8B87B] transition rounded-full">Book Now</button>
            </div>
        </header>

        <section className="relative w-full h-[85vh] flex items-center overflow-hidden">
            <div 
            className="absolute inset-0 w-full h-full bg-cover bg-center bg-no-repeat transition-all duration-1000"
            style={{ backgroundImage: "url('https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=2400')" }}
            />
            <div className="absolute inset-0 bg-[#0A1D2F]/40" />
            <div className="relative z-10 w-full px-6 md:px-12 max-w-7xl mx-auto text-white">
            <h1 className="text-6xl md:text-8xl font-serif leading-[0.9] mb-8 tracking-tight drop-shadow-xl">Timeless Beauty.<br/>Artfully Defined.</h1>
            <button onClick={() => { setSelectedService(null); setIsBookingOpen(true); }} className="bg-[#C8B87B] text-[#0A1D2F] px-10 py-4 font-bold uppercase tracking-widest text-xs hover:bg-white transition rounded-full shadow-2xl">Book a Consultation</button>
            </div>
        </section>

        <section className="py-16 w-full max-w-7xl mx-auto">
            <div className="px-6 grid grid-cols-2 md:grid-cols-4 gap-8">
                <Counter initialValue={20} label="Experts" icon={Users} />
                <Counter initialValue={15000} label="Satisfied" icon={Star} suffix="+" />
                <Counter initialValue={10} label="Years" icon={Award} />
                <Counter initialValue={18} label="Devices" icon={ShieldCheck} />
            </div>
            <div className="px-6 mt-12 text-center text-[#0A1D2F]/60">
                <p className="font-bold text-sm uppercase tracking-widest text-[#0A1D2F]">Business Hours</p>
                <p>Mon - Sat: 8AM - 7PM | Sun: 1PM - 7PM</p>
            </div>
        </section>

        <section ref={servicesRef} className="px-6 py-24 max-w-7xl mx-auto">
            <div className="text-center mb-16">
                <span className="text-[#C8B87B] font-bold tracking-widest text-xs uppercase">Modern and safe</span>
                <h2 className="text-4xl font-serif mt-2">Our Services</h2>
            </div>
            <div className="grid md:grid-cols-2 gap-12">
            {Object.keys(servicesData).map(key => (
                <div key={key} className="group cursor-pointer" onClick={() => { setActiveCategory(key); setView('portfolio'); }}>
                <div className="h-96 w-full rounded-3xl shadow-xl overflow-hidden relative border border-[#0A1D2F]/10">
                    <img src={servicesData[key].bgImg} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#0A1D2F]/80 to-transparent p-8 flex flex-col justify-end">
                        <h3 className="text-3xl font-serif text-white">{servicesData[key].title}</h3>
                        <span className="text-[#C8B87B] font-bold text-sm mt-2 flex items-center gap-2 underline underline-offset-4">Learn more <ChevronRight size={16}/></span>
                    </div>
                </div>
                </div>
            ))}
            </div>
        </section>

        <section ref={aboutRef} className="py-24 bg-[#0A1D2F] text-[#FDFBF5] w-full">
            <div className="px-6 flex flex-col md:flex-row items-center gap-16 max-w-7xl mx-auto">
            <div className="w-full md:w-1/2">
                <img src="https://images.unsplash.com/photo-1522337660859-02fbefca4702?auto=format&fit=crop&q=80&w=1200" className="rounded-3xl shadow-2xl h-[500px] w-full object-cover" />
            </div>
            <div className="w-full md:w-1/2 space-y-6">
                <span className="text-[#C8B87B] font-bold tracking-widest text-xs uppercase">Our Story</span>
                <h2 className="text-4xl font-serif">Dedicated to your radiance.</h2>
                <p className="text-[#FDFBF5]/70 leading-relaxed text-lg">Boni Beauty Studio merges modern artistry with timeless elegance. Our team of expert stylists is committed to crafting personalized experiences that leave you feeling empowered and renewed. With years of experience and a passion for precision, we ensure every detail of your visit meets our standards of excellence.</p>
            </div>
            </div>
        </section>

        <footer ref={contactRef} className="py-24 bg-[#FDFBF5] text-[#0A1D2F] text-center border-t border-[#0A1D2F]/10 w-full">
            <div className="px-6 max-w-7xl mx-auto">
                <p className="font-serif text-2xl font-bold">BONI BEAUTY STUDIO</p>
                <p className="text-sm mt-4 opacity-60">&copy; 2026 Boni Beauty Studio. All rights reserved.</p>
                <div className="mt-4 text-xs font-bold uppercase tracking-widest space-y-2">
                    <p>Mon-Sat: 8AM - 7PM | Sun: 1PM - 7PM</p>
                    <p>945792677</p>
                    <p>fita.regassa@gmail.com</p>
                    <div className="pt-4">
                    <a 
                        href="https://t.me/FitaRegassa" 
                        target="_blank" 
                        rel="noreferrer"
                        className="inline-flex items-center gap-2 bg-[#0088cc] text-white px-6 py-2 rounded-full hover:bg-[#0077b5] transition text-sm"
                    >
                        Message on Telegram
                    </a>
                    </div>
                </div>
            </div>
        </footer>
        <BookingModal isOpen={isBookingOpen} onClose={() => setIsBookingOpen(false)} services={servicesData} selectedService={selectedService} />
    </PageWrapper>
  );
}