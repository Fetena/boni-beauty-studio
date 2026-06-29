import React, { useState, useRef } from 'react';
import { ChevronRight, Users, Star, Award, ShieldCheck, X, Clock, Check, ChevronLeft } from 'lucide-react';

const servicesData = {
  "Editorial & Bridal": {
    title: "Editorial & Bridal",
    bgImg: "https://images.unsplash.com/photo-1596462502278-27bfdc403348?auto=format&fit=crop&q=80&w=1600",
    desc: "Our signature bridal service is designed to make you feel radiant and timeless.",
    items: [
      { name: "Classic Elegance", img: "https://images.unsplash.com/photo-1595802521946-b60586e3f140?auto=format&fit=crop&q=80&w=800", desc: "Timeless and sophisticated look.", duration: "90 min", priceFrom: "2,200 ETB" },
      { name: "Boho Chic", img: "https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&q=80&w=800", desc: "Soft, romantic styles.", duration: "75 min", priceFrom: "1,900 ETB" },
      { name: "Modern Glam", img: "https://images.unsplash.com/photo-1560066984-138dadb4c0d5?auto=format&fit=crop&q=80&w=800", desc: "Bold, trendy, high-fashion.", duration: "100 min", priceFrom: "2,500 ETB" }
    ]
  },
  "Signature Styling": {
    title: "Signature Styling",
    bgImg: "https://images.unsplash.com/photo-1620916566398-39f1143ab7be?auto=format&fit=crop&q=80&w=1600",
    desc: "Precision cutting and master-level color theory designed for your lifestyle.",
    items: [
      { name: "Custom Hair Color", img: "https://images.unsplash.com/photo-1562322140-8baeecece3df?auto=format&fit=crop&q=80&w=800", desc: "Customized color treatments.", duration: "120 min", priceFrom: "1,800 ETB" },
      { name: "Precision Cutting", img: "https://images.unsplash.com/photo-1580618672591-eb180b1a973f?auto=format&fit=crop&q=80&w=800", desc: "Sharp, clean lines.", duration: "45 min", priceFrom: "700 ETB" },
      { name: "Styling & Extensions", img: "https://images.unsplash.com/photo-1560066984-138dadb4c0d5?auto=format&fit=crop&q=80&w=800", desc: "Fullness and length.", duration: "60 min", priceFrom: "1,200 ETB" }
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
  const [step, setStep] = useState(selectedService ? 2 : 1);
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
    const [hours] = time.split(':').map(Number);
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
      const msg = `Booking Request for BONI BEAUTY SALON\n\nName: ${customerName}\nDate: ${bookingDate}\nTime: ${bookingTime}\nServices: ${selected.join(', ')}\nNote: ${customerNote}`;
      window.open(`https://t.me/${telegramHandle}?text=${encodeURIComponent(msg)}`, '_blank');
      onClose();
      return;
    }

    if (contactMethod === 'email') {
      const subject = `Booking Request - ${customerName}`;
      const body =
        `Name: ${customerName}\n` +
        `Customer Email: ${customerEmail}\n` +
        `Date: ${bookingDate}\n` +
        `Time: ${bookingTime}\n` +
        `Services: ${selected.join(', ')}\n` +
        `Note: ${customerNote}`;

      const mailtoLink = `mailto:${businessEmail}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;

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
      } catch (err) {}

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
      setStatus("success");
    } catch (err) {
      setStatus("success");
    }
  };

  const steps = ["Service", "Date & Time", "Your Details"];

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-[#0A1D2F]/80 backdrop-blur-sm overflow-y-auto">
      <div className="bg-[#FDFBF5] w-full max-w-lg rounded-3xl shadow-2xl relative my-auto overflow-hidden">

        {/* HEADER */}
        <div className="px-6 md:px-8 pt-6 pb-4 border-b border-[#0A1D2F]/10">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl md:text-2xl font-serif text-[#0A1D2F]">Book Appointment</h2>
            <button onClick={onClose} className="text-[#0A1D2F] hover:text-[#C8B87B] transition"><X /></button>
          </div>

          {status !== 'success' && (
            <div className="flex items-center gap-2">
              {steps.map((label, idx) => {
                const n = idx + 1;
                const isActive = step === n;
                const isDone = step > n;
                return (
                  <React.Fragment key={label}>
                    <div className="flex items-center gap-2">
                      <div className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold transition ${isDone ? 'bg-[#C8B87B] text-[#0A1D2F]' : isActive ? 'bg-[#0A1D2F] text-white' : 'bg-[#0A1D2F]/10 text-[#0A1D2F]/40'}`}>
                        {isDone ? <Check size={12} /> : n}
                      </div>
                      <span className={`text-[10px] font-bold uppercase tracking-widest hidden sm:inline ${isActive ? 'text-[#0A1D2F]' : 'text-[#0A1D2F]/40'}`}>{label}</span>
                    </div>
                    {n < steps.length && <div className={`flex-1 h-px ${step > n ? 'bg-[#C8B87B]' : 'bg-[#0A1D2F]/10'}`} />}
                  </React.Fragment>
                );
              })}
            </div>
          )}
        </div>

        <div className="px-6 md:px-8 py-6">
          {status === 'success' ? (
            <div className="text-center py-8 text-[#0A1D2F]">
              <div className="w-16 h-16 rounded-full bg-[#C8B87B]/20 flex items-center justify-center mx-auto mb-4">
                <Check className="text-[#C8B87B]" size={28} />
              </div>
              <h3 className="text-2xl font-serif mb-2">Request Sent</h3>
              <p className="text-sm text-[#0A1D2F]/60">We'll confirm your appointment shortly.</p>
              <button onClick={onClose} className="mt-6 text-sm font-bold underline">Close</button>
            </div>
          ) : (
            <form onSubmit={handleSubmit}>

              {/* STEP 1: SERVICES */}
              {step === 1 && (
                <div className="space-y-4">
                  <p className="text-xs font-bold uppercase tracking-widest text-[#0A1D2F]/50">Select one or more services</p>
                  <div className="grid gap-2 max-h-72 overflow-y-auto pr-1">
                    {Object.entries(services).map(([cat, data]) => (
                      <div key={cat} className="space-y-1">
                        <div className="font-bold text-[10px] uppercase text-[#C8B87B] py-1 sticky top-0 bg-[#FDFBF5]">{cat}</div>
                        {data.items.map(item => {
                          const isChecked = selected.includes(item.name);
                          return (
                            <label key={item.name} className={`flex items-center justify-between gap-3 cursor-pointer p-3 rounded-xl border transition ${isChecked ? 'border-[#C8B87B] bg-[#C8B87B]/10' : 'border-[#0A1D2F]/10 hover:bg-[#0A1D2F]/5'}`}>
                              <div className="flex items-center gap-3">
                                <input type="checkbox" checked={isChecked} onChange={() => toggleService(item.name)} className="accent-[#C8B87B] w-4 h-4" />
                                <div>
                                  <div className="text-sm font-bold text-[#0A1D2F]">{item.name}</div>
                                  <div className="flex items-center gap-1 text-[11px] text-[#0A1D2F]/50"><Clock size={11} /> {item.duration}</div>
                                </div>
                              </div>
                              <span className="text-xs font-bold text-[#0A1D2F]/70 whitespace-nowrap">from {item.priceFrom}</span>
                            </label>
                          );
                        })}
                      </div>
                    ))}
                  </div>
                  <button
                    type="button"
                    disabled={selected.length === 0}
                    onClick={() => setStep(2)}
                    className="w-full bg-[#0A1D2F] text-white py-4 font-bold rounded-xl hover:bg-[#C8B87B] hover:text-[#0A1D2F] transition disabled:opacity-30 disabled:cursor-not-allowed"
                  >
                    Continue {selected.length > 0 && `(${selected.length} selected)`}
                  </button>
                </div>
              )}

              {/* STEP 2: DATE & TIME */}
              {step === 2 && (
                <div className="space-y-4">
                  <div className="flex flex-wrap gap-2">
                    {selected.map(s => (
                      <span key={s} className="text-[11px] font-bold bg-[#C8B87B]/20 text-[#0A1D2F] px-3 py-1.5 rounded-full">{s}</span>
                    ))}
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-[#0A1D2F]/70 uppercase mb-2">Date</label>
                      <input type="date" required value={bookingDate} className="w-full p-3 md:p-4 border border-[#0A1D2F]/10 rounded-xl bg-transparent" onChange={(e) => setBookingDate(e.target.value)} />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-[#0A1D2F]/70 uppercase mb-2">Time</label>
                      <input type="time" required value={bookingTime} className="w-full p-3 md:p-4 border border-[#0A1D2F]/10 rounded-xl bg-transparent" onChange={(e) => setBookingTime(e.target.value)} />
                    </div>
                  </div>
                  {status === 'full' && <p className="text-red-500 text-sm font-bold">Selected time is full. Please choose another.</p>}
                  <p className="text-[11px] text-[#0A1D2F]/50">Open Mon–Sat 8AM–7PM, Sun 1PM–7PM.</p>
                  <div className="flex gap-3">
                    <button type="button" onClick={() => setStep(1)} className="flex items-center gap-1 px-5 py-4 font-bold rounded-xl border border-[#0A1D2F]/10 hover:bg-[#0A1D2F]/5 transition text-sm">
                      <ChevronLeft size={16} /> Back
                    </button>
                    <button
                      type="button"
                      disabled={!bookingDate || !bookingTime}
                      onClick={() => { setStatus(null); setStep(3); }}
                      className="flex-1 bg-[#0A1D2F] text-white py-4 font-bold rounded-xl hover:bg-[#C8B87B] hover:text-[#0A1D2F] transition disabled:opacity-30"
                    >
                      Continue
                    </button>
                  </div>
                </div>
              )}

              {/* STEP 3: DETAILS */}
              {step === 3 && (
                <div className="space-y-4">
                  <input required name="name" type="text" placeholder="Your Name" className="w-full p-3 md:p-4 border border-[#0A1D2F]/10 rounded-xl bg-transparent" />
                  <input required name="email" type="email" placeholder="Your Email" className="w-full p-3 md:p-4 border border-[#0A1D2F]/10 rounded-xl bg-transparent" />

                  <div>
                    <label className="block text-xs font-bold text-[#0A1D2F]/70 uppercase mb-2">Contact Preference</label>
                    <div className="flex gap-3">
                      <label className={`flex-1 flex items-center justify-center gap-2 cursor-pointer p-3 rounded-xl border text-sm font-bold transition ${contactMethod === 'email' ? 'border-[#C8B87B] bg-[#C8B87B]/10' : 'border-[#0A1D2F]/10'}`}>
                        <input type="radio" className="hidden" checked={contactMethod === 'email'} onChange={() => setContactMethod('email')} /> Email
                      </label>
                      <label className={`flex-1 flex items-center justify-center gap-2 cursor-pointer p-3 rounded-xl border text-sm font-bold transition ${contactMethod === 'telegram' ? 'border-[#C8B87B] bg-[#C8B87B]/10' : 'border-[#0A1D2F]/10'}`}>
                        <input type="radio" className="hidden" checked={contactMethod === 'telegram'} onChange={() => setContactMethod('telegram')} /> Telegram
                      </label>
                    </div>
                  </div>

                  <textarea name="note" placeholder="Any special requests?" className="w-full p-3 md:p-4 border border-[#0A1D2F]/10 rounded-xl bg-transparent" rows="2"></textarea>

                  <div className="flex gap-3">
                    <button type="button" onClick={() => setStep(2)} className="flex items-center gap-1 px-5 py-4 font-bold rounded-xl border border-[#0A1D2F]/10 hover:bg-[#0A1D2F]/5 transition text-sm">
                      <ChevronLeft size={16} /> Back
                    </button>
                    <button disabled={status === 'submitting'} type="submit" className="flex-1 bg-[#0A1D2F] text-white py-4 font-bold rounded-xl hover:bg-[#C8B87B] hover:text-[#0A1D2F] transition disabled:opacity-50">
                      {status === 'submitting' ? "Sending..." : contactMethod === 'email' ? "Send Email Request" : "Submit via Telegram"}
                    </button>
                  </div>
                </div>
              )}
            </form>
          )}
        </div>
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
  const [mobileServicesOpen, setMobileServicesOpen] = useState(false);

  const servicesRef = useRef(null);
  const aboutRef = useRef(null);
  const contactRef = useRef(null);
  const scrollToSection = (ref) => ref.current?.scrollIntoView({ behavior: 'smooth' });

  const openBooking = (serviceName = null) => {
    setSelectedService(serviceName);
    setIsBookingOpen(true);
  };

  if (view === 'portfolio') {
    const data = servicesData[activeCategory];
    return (
      <div className="min-h-screen bg-[#FDFBF5] text-[#0A1D2F] pb-24 md:pb-0">
        <header className="px-6 py-6 border-b border-[#0A1D2F]/10">
          <div className="max-w-7xl mx-auto flex justify-between items-center">
            <div className="text-2xl font-bold tracking-tighter cursor-pointer font-serif" onClick={() => setView('home')}>BONI BEAUTY SALON</div>
            <button onClick={() => setView('home')} className="text-sm font-medium hover:text-[#C8B87B] transition">← Back</button>
          </div>
        </header>
        <div className="max-w-7xl mx-auto px-6 py-12">
          <h1 className="text-4xl md:text-5xl font-serif mb-2">{data.title}</h1>
          <p className="text-[#0A1D2F]/60 mb-12 max-w-xl">{data.desc}</p>
          <div className="grid md:grid-cols-3 gap-8">
            {data.items.map((item, idx) => (
              <div key={idx} className="bg-white border border-[#0A1D2F]/10 shadow-sm rounded-2xl overflow-hidden flex flex-col">
                <img src={item.img} alt={item.name} className="w-full h-56 object-cover" />
                <div className="p-5 flex flex-col flex-1">
                  <div className="flex items-start justify-between gap-2 mb-1">
                    <h3 className="font-bold text-lg">{item.name}</h3>
                    <span className="text-xs font-bold text-[#C8B87B] whitespace-nowrap">from {item.priceFrom}</span>
                  </div>
                  <div className="flex items-center gap-1 text-xs text-[#0A1D2F]/50 mb-3"><Clock size={12} /> {item.duration}</div>
                  <p className="text-sm text-[#0A1D2F]/60 mb-4 flex-1">{item.desc}</p>
                  <button onClick={() => openBooking(item.name)} className="w-full py-3 border border-[#0A1D2F] hover:bg-[#0A1D2F] hover:text-white transition rounded-xl font-bold text-sm">Book Service</button>
                </div>
              </div>
            ))}
          </div>
        </div>
        <BookingModal isOpen={isBookingOpen} onClose={() => setIsBookingOpen(false)} services={servicesData} selectedService={selectedService} />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FDFBF5] text-[#0A1D2F] font-sans pb-24 md:pb-0">
      <header className="sticky top-0 z-50 bg-[#FDFBF5]/80 backdrop-blur-md px-4 sm:px-6 py-3 sm:py-4">
        <div className="max-w-6xl mx-auto flex items-center justify-between gap-3">

          <div
            className="text-2xl sm:text-3xl font-serif font-bold tracking-tight text-[#0A1D2F] cursor-pointer"
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          >
            BONI BEAUTY SALON
          </div>

          {/* DESKTOP NAV */}
          <nav className="hidden md:flex items-center gap-1 bg-white border border-[#0A1D2F]/10 rounded-full px-3 py-2 shadow-md">
            <div className="relative" onMouseEnter={() => setServicesOpen(true)} onMouseLeave={() => setServicesOpen(false)}>
              <button
                onClick={() => setServicesOpen(prev => !prev)}
                className="px-5 py-2 text-sm font-medium rounded-full hover:bg-[#0A1D2F] hover:text-white transition whitespace-nowrap"
              >
                Services ▾
              </button>
              {servicesOpen && (
                <div className="absolute top-full left-0 mt-3 w-56 bg-white rounded-2xl shadow-xl border border-[#0A1D2F]/10 overflow-hidden z-50">
                  {Object.keys(servicesData).map(service => (
                    <button
                      key={service}
                      onClick={() => { setActiveCategory(service); setView("portfolio"); setServicesOpen(false); }}
                      className="block w-full text-left px-5 py-3 text-sm hover:bg-[#C8B87B]/20 transition"
                    >
                      {service}
                    </button>
                  ))}
                </div>
              )}
            </div>

            <button onClick={() => scrollToSection(aboutRef)} className="px-5 py-2 text-sm rounded-full hover:bg-[#0A1D2F] hover:text-white transition whitespace-nowrap">
              About
            </button>

            <button onClick={() => scrollToSection(contactRef)} className="px-5 py-2 text-sm rounded-full hover:bg-[#0A1D2F] hover:text-white transition whitespace-nowrap">
              Contact
            </button>
          </nav>

          <div className="flex items-center gap-2">
            <button
              onClick={() => openBooking()}
              className="bg-[#0A1D2F] text-white px-4 sm:px-7 py-2.5 sm:py-3 rounded-full text-xs sm:text-sm font-bold hover:bg-[#C8B87B] hover:text-[#0A1D2F] transition shadow-lg whitespace-nowrap"
            >
              Book Now
            </button>

            {/* MOBILE MENU TRIGGER */}
            <button
              onClick={() => setMobileMenuOpen(true)}
              className="md:hidden w-10 h-10 flex items-center justify-center rounded-full border border-[#0A1D2F]/10 bg-white shadow-sm shrink-0"
              aria-label="Open menu"
            >
              <div className="space-y-1.5">
                <span className="block w-5 h-0.5 bg-[#0A1D2F]"></span>
                <span className="block w-5 h-0.5 bg-[#0A1D2F]"></span>
                <span className="block w-5 h-0.5 bg-[#0A1D2F]"></span>
              </div>
            </button>
          </div>
        </div>
      </header>

      {/* MOBILE SLIDE-IN DRAWER */}
      {mobileMenuOpen && (
        <div className="md:hidden fixed inset-0 z-[100]">
          <div
            className="absolute inset-0 bg-[#0A1D2F]/50 backdrop-blur-sm"
            onClick={() => { setMobileMenuOpen(false); setMobileServicesOpen(false); }}
          />
          <div className="absolute top-0 right-0 h-full w-72 max-w-[80%] bg-[#FDFBF5] shadow-2xl flex flex-col">
            <div className="flex items-center justify-between px-6 py-5 border-b border-[#0A1D2F]/10">
              <span className="text-xl font-serif font-bold text-[#0A1D2F]">BONI BEAUTY SALON</span>
              <button
                onClick={() => { setMobileMenuOpen(false); setMobileServicesOpen(false); }}
                className="text-[#0A1D2F] hover:text-[#C8B87B] transition"
                aria-label="Close menu"
              >
                <X />
              </button>
            </div>

            <nav className="flex-1 px-4 py-4 flex flex-col gap-1 overflow-y-auto">
              <div>
                <button
                  onClick={() => setMobileServicesOpen(prev => !prev)}
                  className="w-full flex items-center justify-between px-4 py-3 text-sm font-bold rounded-xl hover:bg-[#C8B87B]/15 transition"
                >
                  Services
                  <ChevronRight size={16} className={`transition-transform ${mobileServicesOpen ? 'rotate-90' : ''}`} />
                </button>
                {mobileServicesOpen && (
                  <div className="pl-4 flex flex-col gap-1 mt-1">
                    {Object.keys(servicesData).map(service => (
                      <button
                        key={service}
                        onClick={() => {
                          setActiveCategory(service);
                          setView("portfolio");
                          setMobileMenuOpen(false);
                          setMobileServicesOpen(false);
                        }}
                        className="text-left px-4 py-3 text-sm rounded-xl hover:bg-[#C8B87B]/15 transition text-[#0A1D2F]/80"
                      >
                        {service}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              <button
                onClick={() => { scrollToSection(aboutRef); setMobileMenuOpen(false); }}
                className="text-left px-4 py-3 text-sm font-bold rounded-xl hover:bg-[#C8B87B]/15 transition"
              >
                About
              </button>

              <button
                onClick={() => { scrollToSection(contactRef); setMobileMenuOpen(false); }}
                className="text-left px-4 py-3 text-sm font-bold rounded-xl hover:bg-[#C8B87B]/15 transition"
              >
                Contact
              </button>
            </nav>

            <div className="p-4 border-t border-[#0A1D2F]/10">
              <button
                onClick={() => { setMobileMenuOpen(false); openBooking(); }}
                className="w-full bg-[#0A1D2F] text-white py-3.5 rounded-full text-sm font-bold hover:bg-[#C8B87B] hover:text-[#0A1D2F] transition shadow-lg"
              >
                Book Now
              </button>
            </div>
          </div>
        </div>
      )}

      <section className="relative w-full h-[70vh] md:h-[85vh] flex items-center overflow-hidden">
        <div
          className="absolute inset-0 w-full h-full bg-cover bg-center bg-no-repeat transition-all duration-1000"
          style={{ backgroundImage: "url('https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=2400')" }}
        />
        <div className="absolute inset-0 bg-[#0A1D2F]/40" />
        <div className="relative z-10 px-6 md:px-24 text-white max-w-4xl w-full">
          <div className="flex items-center gap-2 mb-6">
            <div className="flex">
              {[...Array(5)].map((_, i) => <Star key={i} size={14} fill="#C8B87B" className="text-[#C8B87B]" />)}
            </div>
            <span className="text-xs font-bold uppercase tracking-widest text-white/80">4.9 · 15,000+ clients served</span>
          </div>
          <h1 className="text-5xl md:text-8xl font-serif leading-[0.9] mb-8 tracking-tight drop-shadow-xl">Timeless Beauty.<br />Artfully Defined.</h1>
          <button onClick={() => openBooking()} className="bg-[#C8B87B] text-[#0A1D2F] px-8 md:px-10 py-3 md:py-4 font-bold uppercase tracking-widest text-[10px] md:text-xs hover:bg-white transition rounded-full shadow-2xl">Book a Consultation</button>
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

        {/* PLATFORM-STYLE SERVICE CARD GRID */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {Object.entries(servicesData).flatMap(([cat, data]) =>
            data.items.map(item => (
              <div key={item.name} className="bg-white rounded-2xl border border-[#0A1D2F]/10 overflow-hidden shadow-sm hover:shadow-xl transition-shadow group">
                <div className="h-44 overflow-hidden relative">
                  <img src={item.img} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
                  <span className="absolute top-3 left-3 bg-[#0A1D2F]/80 text-white text-[10px] font-bold uppercase tracking-widest px-3 py-1 rounded-full">{cat}</span>
                </div>
                <div className="p-5">
                  <div className="flex items-start justify-between gap-2 mb-1">
                    <h3 className="font-bold text-base">{item.name}</h3>
                  </div>
                  <div className="flex items-center gap-1 text-xs text-[#0A1D2F]/50 mb-3"><Clock size={12} /> {item.duration}</div>
                  <p className="text-sm text-[#0A1D2F]/60 mb-4">{item.desc}</p>
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-bold text-[#0A1D2F]">from <span className="text-[#C8B87B]">{item.priceFrom}</span></span>
                    <button onClick={() => openBooking(item.name)} className="text-xs font-bold uppercase tracking-widest bg-[#0A1D2F] text-white px-4 py-2.5 rounded-full hover:bg-[#C8B87B] hover:text-[#0A1D2F] transition">
                      Book
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        <div className="text-center mt-10">
          <button onClick={() => { setActiveCategory(Object.keys(servicesData)[0]); setView('portfolio'); }} className="inline-flex items-center gap-2 text-sm font-bold text-[#0A1D2F] hover:text-[#C8B87B] transition underline underline-offset-4">
            View all services <ChevronRight size={16} />
          </button>
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
            <p className="text-[#FDFBF5]/70 leading-relaxed text-sm md:text-lg">BONI BEAUTY SALON merges modern artistry with timeless elegance. Our team of expert stylists is committed to crafting personalized experiences that leave you feeling empowered and renewed. With years of experience and a passion for precision, we ensure every detail of your visit meets our standards of excellence.</p>
          </div>
        </div>
      </section>

      <footer ref={contactRef} className="py-16 md:py-24 bg-[#FDFBF5] text-[#0A1D2F] text-center border-t border-[#0A1D2F]/10">
        <p className="font-serif text-2xl font-bold">BONI BEAUTY SALON</p>
        <p className="text-xs md:text-sm mt-4 opacity-60">&copy; 2026 BONI BEAUTY SALON. All rights reserved.</p>
        <div className="mt-4 text-[10px] md:text-xs font-bold uppercase tracking-widest space-y-2">
          <p>Mon-Sat: 8AM - 7PM | Sun: 1PM - 7PM</p>
          <p>9457926</p>
        </div>
      </footer>
      <BookingModal isOpen={isBookingOpen} onClose={() => setIsBookingOpen(false)} services={servicesData} selectedService={selectedService} />
    </div>
  );
}
