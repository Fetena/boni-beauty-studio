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
    <button onClick={() => setCount(prev => prev + 1)} className="flex flex-col items-center gap-2 p-4 md:p-6 rounded-2xl hover:bg-[#C8B87B]/10 transition-all w-full border border-transparent hover:border-[#C8B87B]/20">
      <div className="text-[#C8B87B] mb-1"><Icon size={20} className="md:w-6 md:h-6" /></div>
      <div className="text-2xl md:text-3xl font-bold text-[#0A1D2F] tracking-tight">{count}{suffix}</div>
      <div className="text-[9px] md:text-[10px] font-bold uppercase tracking-widest text-[#0A1D2F]/50">{label}</div>
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
  const businessEmail = "fita.regassa@gmail.com";

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

    const customerName = e.target.name.value;
    const customerEmail = e.target.email.value;
    const customerNote = e.target.note.value;

    if (contactMethod === 'telegram') {
        const msg = `Booking Request for Boni Beauty Studio\n\nName: ${customerName}\nDate: ${bookingDate}\nTime: ${bookingTime}\nServices: ${selected.join(', ')}\nNote: ${customerNote}`;
        window.open(`https://t.me/${telegramHandle}?text=${encodeURIComponent(msg)}`, '_blank');
        onClose();
        return;
    }

    if (contactMethod === 'email') {
        // Opens the customer's default mail app (Outlook/Mail/Gmail webmail, etc.)
        // pre-addressed to the business, with the booking details and the
        // customer's own email included in the body so it's captured as soon
        // as they submit. mailto: links work the same way on desktop browsers
        // and on phones (iOS/Android hand off to the installed mail app).
        const subject = `Booking Request - ${customerName}`;
        const body =
            `Name: ${customerName}\n` +
            `Customer Email: ${customerEmail}\n` +
            `Date: ${bookingDate}\n` +
            `Time: ${bookingTime}\n` +
            `Services: ${selected.join(', ')}\n` +
            `Note: ${customerNote}`;

        const mailtoLink = `mailto:${businessEmail}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;

        // Still log the request to Formspree in the background so you have a
        // record even if the customer's device has no mail client configured.
        try {
            fetch("https://formspree.io/f/xvzjzrzq", {
                method: 'POST',
                body: JSON.stringify({
                    name: customerName,
                    email: customerEmail,
                    date: bookingDate,
                    time: bookingTime,
                    services: selected.join(', '),
                    message: customerNote
                }),
                headers: { 'Accept': 'application/json', 'Content-Type': 'application/json' }
            });
        } catch (err) {
            // Non-blocking: mailto is the primary path for this contact method.
        }

        window.location.href = mailtoLink;
        setStatus("success");
        return;
    }

    setStatus("submitting");

    try {
        const response = await fetch("https://formspree.io/f/xvzjzrzq", {
            method: 'POST',
            body: JSON.stringify({
                name: customerName,
                email: customerEmail,
                date: bookingDate,
                time: bookingTime,
                services: selected.join(', '),
                message: customerNote
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
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-[#0A1D2F]/80 backdrop-blur-sm overflow-y-auto">
      <div className="bg-[#FDFBF5] w-full max-w-lg p-6 md:p-8 rounded-3xl shadow-2xl relative my-auto">
        <button onClick={onClose} className="absolute top-4 right-4 md:top-6 md:right-6 text-[#0A1D2F] hover:text-[#C8B87B] transition"><X /></button>
        <h2 className="text-2xl md:text-3xl font-serif mb-6 text-[#0A1D2F]">Book Appointment</h2>
        
        {status === 'success' ? (
            <div className="text-center py-12 text-[#0A1D2F]">
                <div className="text-5xl mb-4">✅</div>
                <h3 className="text-2xl font-bold">Request Sent!</h3>
                <p>We will contact you shortly.</p>
                <button onClick={onClose} className="mt-6 text-sm underline">Close</button>
            </div>
        ) : (
            <form className="space-y-4" onSubmit={handleSubmit}>
                <input required name="name" type="text" placeholder="Your Name" className="w-full p-3 md:p-4 border border-[#0A1D2F]/10 rounded-xl bg-transparent" />
                <input required name="email" type="email" placeholder="Your Email" className="w-full p-3 md:p-4 border border-[#0A1D2F]/10 rounded-xl bg-transparent" />
                
                <div className="grid grid-cols-2 gap-4">
                    <input type="date" required className="w-full p-3 md:p-4 border border-[#0A1D2F]/10 rounded-xl bg-transparent" onChange={(e) => setBookingDate(e.target.value)} />
                    <input type="time" required className="w-full p-3 md:p-4 border border-[#0A1D2F]/10 rounded-xl bg-transparent" onChange={(e) => setBookingTime(e.target.value)} />
                </div>

                {status === 'full' && <p className="text-red-500 text-sm font-bold">Selected time is FULL. Please choose another.</p>}

                <div className="space-y-2">
                    <label className="block text-xs font-bold text-[#0A1D2F]/70 uppercase">Contact Preference:</label>
                    <div className="flex gap-4 mb-4 text-sm">
                        <label className="flex items-center gap-2 cursor-pointer">
                            <input type="radio" checked={contactMethod === 'email'} onChange={() => setContactMethod('email')} className="accent-[#C8B87B]" /> Email
                        </label>
                        <label className="flex items-center gap-2 cursor-pointer">
                            <input type="radio" checked={contactMethod === 'telegram'} onChange={() => setContactMethod('telegram')} className="accent-[#C8B87B]" /> Telegram
                        </label>
                    </div>

                    <label className="block text-xs font-bold text-[#0A1D2F]/70 uppercase">Select Services:</label>
                    <div className="grid gap-2 border border-[#0A1D2F]/10 p-3 rounded-xl max-h-40 overflow-y-auto">
                    {Object.entries(services).map(([cat, data]) => (
                        <div key={cat} className="space-y-1">
                            <div className="font-bold text-[10px] uppercase text-[#C8B87B] py-1">{cat}</div>
                            {data.items.map(item => (
                                <label key={item.name} className="flex items-center gap-3 cursor-pointer p-1.5 hover:bg-[#0A1D2F]/5 rounded-lg transition">
                                    <input type="checkbox" checked={selected.includes(item.name)} onChange={() => toggleService(item.name)} className="accent-[#C8B87B] w-4 h-4" />
                                    <span className="text-xs font-medium">{item.name}</span>
                                </label>
                            ))}
                        </div>
                    ))}
                    </div>
                </div>
                
                <textarea name="note" placeholder="Any special needs?" className="w-full p-3 md:p-4 border border-[#0A1D2F]/10 rounded-xl bg-transparent" rows="2"></textarea>
                <button disabled={status === 'submitting'} type="submit" className="w-full bg-[#0A1D2F] text-white py-4 font-bold rounded-xl hover:bg-[#C8B87B] transition disabled:opacity-50">
                    {status === 'submitting' ? "Sending..." : contactMethod === 'email' ? "Send Email Request" : "Submit Request"}
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
  const [servicesOpen, setServicesOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const servicesRef = useRef(null);
  const aboutRef = useRef(null);
  const contactRef = useRef(null);
  const scrollToSection = (ref) => ref.current?.scrollIntoView({ behavior: 'smooth' });

  if (view === 'portfolio') {
    const data = servicesData[activeCategory];
    return (
      <div className="min-h-screen bg-[#FDFBF5] text-[#0A1D2F]">
        <header className="px-6 py-6 border-b border-[#0A1D2F]/10">
          <div className="max-w-7xl mx-auto flex justify-between items-center">
            <div className="text-2xl font-bold tracking-tighter cursor-pointer font-serif" onClick={() => setView('home')}>BONI</div>
            <button onClick={() => setView('home')} className="text-sm font-medium hover:text-[#C8B87B] transition">← Back</button>
          </div>
        </header>
        <div className="max-w-7xl mx-auto px-6 py-12">
          <h1 className="text-4xl md:text-5xl font-serif mb-12">{data.title}</h1>
          <div className="grid md:grid-cols-3 gap-8">
            {data.items.map((item, idx) => (
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
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FDFBF5] text-[#0A1D2F] font-sans md:flex">

      {/* DESKTOP SIDEBAR */}
      <aside className="
        hidden md:flex md:flex-col
        fixed top-0 left-0 h-screen w-20
        border-r border-[#0A1D2F]/10
        bg-[#FDFBF5]
        items-center
        py-8
        z-50
      ">
        <div
          className="font-serif font-bold text-xl tracking-tight text-[#0A1D2F] cursor-pointer mb-12"
          style={{ writingMode: 'vertical-rl' }}
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
        >
          BONI
        </div>

        <nav className="flex flex-col items-center gap-6 flex-1">
          <div className="relative">
            <button
              onClick={() => setServicesOpen(prev => !prev)}
              onMouseEnter={() => setServicesOpen(true)}
              className="text-[10px] font-bold uppercase tracking-widest text-[#0A1D2F]/60 hover:text-[#C8B87B] transition"
              style={{ writingMode: 'vertical-rl' }}
            >
              Services
            </button>

            {servicesOpen && (
              <div
                onMouseLeave={() => setServicesOpen(false)}
                className="absolute left-full top-0 ml-3 w-56 bg-white rounded-2xl shadow-xl border border-[#0A1D2F]/10 overflow-hidden"
              >
                {Object.keys(servicesData).map(service => (
                  <button
                    key={service}
                    onClick={() => {
                      setActiveCategory(service);
                      setView("portfolio");
                      setServicesOpen(false);
                    }}
                    className="block w-full text-left px-5 py-3 text-sm hover:bg-[#C8B87B]/20 transition"
                  >
                    {service}
                  </button>
                ))}
              </div>
            )}
          </div>

          <button
            onClick={() => scrollToSection(aboutRef)}
            className="text-[10px] font-bold uppercase tracking-widest text-[#0A1D2F]/60 hover:text-[#C8B87B] transition"
            style={{ writingMode: 'vertical-rl' }}
          >
            About
          </button>

          <button
            onClick={() => scrollToSection(contactRef)}
            className="text-[10px] font-bold uppercase tracking-widest text-[#0A1D2F]/60 hover:text-[#C8B87B] transition"
            style={{ writingMode: 'vertical-rl' }}
          >
            Contact
          </button>
        </nav>

        <button
          onClick={() => { setSelectedService(null); setIsBookingOpen(true); }}
          className="bg-[#0A1D2F] text-white text-[10px] font-bold uppercase tracking-widest px-3 py-4 rounded-full hover:bg-[#C8B87B] hover:text-[#0A1D2F] transition shadow-lg"
          style={{ writingMode: 'vertical-rl' }}
        >
          Book Now
        </button>
      </aside>

      {/* MOBILE TOP BAR */}
      <header className="md:hidden sticky top-0 z-50 bg-[#FDFBF5]/90 backdrop-blur-md px-6 py-4 border-b border-[#0A1D2F]/10">
        <div className="flex items-center justify-between">
          <div
            className="text-2xl font-serif font-bold tracking-tight text-[#0A1D2F] cursor-pointer"
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          >
            BONI
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={() => { setSelectedService(null); setIsBookingOpen(true); }}
              className="bg-[#0A1D2F] text-white px-5 py-2.5 rounded-full text-xs font-bold hover:bg-[#C8B87B] hover:text-[#0A1D2F] transition shadow-lg"
            >
              Book Now
            </button>
            <button
              onClick={() => setMobileMenuOpen(prev => !prev)}
              className="w-10 h-10 flex items-center justify-center rounded-full border border-[#0A1D2F]/10"
              aria-label="Menu"
            >
              <div className="space-y-1.5">
                <span className="block w-5 h-0.5 bg-[#0A1D2F]"></span>
                <span className="block w-5 h-0.5 bg-[#0A1D2F]"></span>
                <span className="block w-5 h-0.5 bg-[#0A1D2F]"></span>
              </div>
            </button>
          </div>
        </div>

        {mobileMenuOpen && (
          <div className="mt-4 flex flex-col gap-1 pb-2">
            {Object.keys(servicesData).map(service => (
              <button
                key={service}
                onClick={() => { setActiveCategory(service); setView("portfolio"); setMobileMenuOpen(false); }}
                className="text-left px-4 py-3 text-sm rounded-xl hover:bg-[#C8B87B]/20 transition"
              >
                {service}
              </button>
            ))}
            <button
              onClick={() => { scrollToSection(aboutRef); setMobileMenuOpen(false); }}
              className="text-left px-4 py-3 text-sm rounded-xl hover:bg-[#C8B87B]/20 transition"
            >
              About
            </button>
            <button
              onClick={() => { scrollToSection(contactRef); setMobileMenuOpen(false); }}
              className="text-left px-4 py-3 text-sm rounded-xl hover:bg-[#C8B87B]/20 transition"
            >
              Contact
            </button>
          </div>
        )}
      </header>

      {/* PAGE CONTENT (shifted right of sidebar on desktop) */}
      <div className="flex-1 md:ml-20 min-w-0">

      <section className="relative w-full h-[70vh] md:h-[85vh] flex items-center overflow-hidden">
        <div 
          className="absolute inset-0 w-full h-full bg-cover bg-center bg-no-repeat transition-all duration-1000"
          style={{ backgroundImage: "url('https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=2400')" }}
        />
        <div className="absolute inset-0 bg-[#0A1D2F]/40" />
        <div className="relative z-10 px-6 md:px-24 text-white max-w-4xl w-full">
          <h1 className="text-5xl md:text-8xl font-serif leading-[0.9] mb-8 tracking-tight drop-shadow-xl">Timeless Beauty.<br/>Artfully Defined.</h1>
          <button onClick={() => { setSelectedService(null); setIsBookingOpen(true); }} className="bg-[#C8B87B] text-[#0A1D2F] px-8 md:px-10 py-3 md:py-4 font-bold uppercase tracking-widest text-[10px] md:text-xs hover:bg-white transition rounded-full shadow-2xl">Book a Consultation</button>
        </div>
      </section>

      <section className="py-12 md:py-16">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-8">
            <Counter initialValue={20} label="Experts" icon={Users} />
            <Counter initialValue={15000} label="Satisfied" icon={Star} suffix="+" />
            <Counter initialValue={10} label="Years" icon={Award} />
            <Counter initialValue={18} label="Devices" icon={ShieldCheck} />
        </div>
        <div className="max-w-7xl mx-auto px-6 mt-8 md:mt-12 text-center text-[#0A1D2F]/60">
            <p className="font-bold text-[10px] md:text-sm uppercase tracking-widest text-[#0A1D2F]">Business Hours</p>
            <p className="text-sm">Mon - Sat: 8AM - 7PM | Sun: 1PM - 7PM</p>
        </div>
      </section>

      <section ref={servicesRef} className="max-w-7xl mx-auto px-6 py-16 md:py-24">
        <div className="text-center mb-12 md:mb-16">
            <span className="text-[#C8B87B] font-bold tracking-widest text-[10px] uppercase">Modern and safe</span>
            <h2 className="text-4xl font-serif mt-2">Our Services</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12">
          {Object.keys(servicesData).map(key => (
            <div key={key} className="group cursor-pointer" onClick={() => { setActiveCategory(key); setView('portfolio'); }}>
              <div className="h-72 md:h-96 w-full rounded-3xl shadow-xl overflow-hidden relative border border-[#0A1D2F]/10">
                <img src={servicesData[key].bgImg} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0A1D2F]/80 to-transparent p-6 md:p-8 flex flex-col justify-end">
                    <h3 className="text-2xl md:text-3xl font-serif text-white">{servicesData[key].title}</h3>
                    <span className="text-[#C8B87B] font-bold text-xs md:text-sm mt-2 flex items-center gap-2 underline underline-offset-4">Learn more <ChevronRight size={16}/></span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section ref={aboutRef} className="py-16 md:py-24 bg-[#0A1D2F] text-[#FDFBF5]">
        <div className="max-w-5xl mx-auto px-6 flex flex-col md:flex-row items-center gap-8 md:gap-16">
           <div className="w-full md:w-1/2">
              <img src="https://images.unsplash.com/photo-1522337660859-02fbefca4702?auto=format&fit=crop&q=80&w=1200" className="rounded-3xl shadow-2xl h-[300px] md:h-[500px] w-full object-cover" />
           </div>
           <div className="w-full md:w-1/2 space-y-4 md:space-y-6">
              <span className="text-[#C8B87B] font-bold tracking-widest text-[10px] uppercase">Our Story</span>
              <h2 className="text-3xl md:text-4xl font-serif">Dedicated to your radiance.</h2>
              <p className="text-[#FDFBF5]/70 leading-relaxed text-sm md:text-lg">Boni Beauty Studio merges modern artistry with timeless elegance. Our team of expert stylists is committed to crafting personalized experiences that leave you feeling empowered and renewed. With years of experience and a passion for precision, we ensure every detail of your visit meets our standards of excellence.</p>
           </div>
        </div>
      </section>

      <footer ref={contactRef} className="py-16 md:py-24 bg-[#FDFBF5] text-[#0A1D2F] text-center border-t border-[#0A1D2F]/10">
         <p className="font-serif text-2xl font-bold">BONI BEAUTY STUDIO</p>
         <p className="text-xs md:text-sm mt-4 opacity-60">&copy; 2026 Boni Beauty Studio. All rights reserved.</p>
         <div className="mt-4 text-[10px] md:text-xs font-bold uppercase tracking-widest space-y-2">
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
      </footer>
      </div>

      <BookingModal isOpen={isBookingOpen} onClose={() => setIsBookingOpen(false)} services={servicesData} selectedService={selectedService} />
    </div>
  );
}
