import React, { useState, useRef } from 'react';
import { ChevronRight, Users, Star, Award, ShieldCheck, X, Clock, Check, ChevronLeft, MapPin, Instagram, Phone } from 'lucide-react';

const servicesData = {
  "Editorial & Bridal": {
    title: "Editorial & Bridal",
    desc: "Our signature bridal service is designed to make you feel radiant and timeless.",
    items: [
      { name: "Classic Elegance", duration: "90 min", priceFrom: "2,200 ETB", img: "https://images.unsplash.com/photo-1595802521946-b60586e3f140?auto=format&fit=crop&q=80&w=800" },
      { name: "Boho Chic", duration: "75 min", priceFrom: "1,900 ETB", img: "https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&q=80&w=800" },
      { name: "Modern Glam", duration: "100 min", priceFrom: "2,500 ETB", img: "https://images.unsplash.com/photo-1560066984-138dadb4c0d5?auto=format&fit=crop&q=80&w=800" }
    ]
  },
  "Signature Styling": {
    title: "Signature Styling",
    desc: "Precision cutting and master-level color theory designed for your lifestyle.",
    items: [
      { name: "Custom Hair Color", duration: "120 min", priceFrom: "1,800 ETB", img: "https://images.unsplash.com/photo-1562322140-8baeecece3df?auto=format&fit=crop&q=80&w=800" },
      { name: "Precision Cutting", duration: "45 min", priceFrom: "700 ETB", img: "https://images.unsplash.com/photo-1580618672591-eb180b1a973f?auto=format&fit=crop&q=80&w=800" },
      { name: "Styling & Extensions", duration: "60 min", priceFrom: "1,200 ETB", img: "https://images.unsplash.com/photo-1560066984-138dadb4c0d5?auto=format&fit=crop&q=80&w=800" }
    ]
  }
};

const BookingModal = ({ isOpen, onClose, services, selectedService }) => {
  const [step, setStep] = useState(selectedService ? 2 : 1);
  const [selected, setSelected] = useState(selectedService ? [selectedService] : []);
  // ... [Keep your original booking logic here]
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
      <div className="bg-white w-full max-w-lg rounded-none shadow-2xl p-8 relative">
        <button onClick={onClose} className="absolute top-4 right-4"><X size={20} /></button>
        <h2 className="text-2xl font-serif mb-6">Book Appointment</h2>
        {/* Render your steps and form here as per original */}
      </div>
    </div>
  );
};

export default function App() {
  const [isBookingOpen, setIsBookingOpen] = useState(false);
  const [selectedService, setSelectedService] = useState(null);

  return (
    <div className="min-h-screen bg-[#FAFAFA] text-[#1A1A1A] font-sans">
      <nav className="fixed w-full z-50 px-8 py-6 flex justify-between items-center bg-white/90 backdrop-blur-md">
        <div className="text-2xl font-serif font-bold tracking-tight uppercase">Boni Beauty</div>
        <div className="hidden md:flex gap-8 text-sm font-medium uppercase tracking-widest">
          <a href="#services" className="hover:text-[#C8B87B] transition">Services</a>
          <a href="#about" className="hover:text-[#C8B87B] transition">About</a>
        </div>
        <button 
          onClick={() => setIsBookingOpen(true)}
          className="px-6 py-2 border border-[#1A1A1A] text-sm hover:bg-[#1A1A1A] hover:text-white transition"
        >
          Book Appointment
        </button>
      </nav>

      <header className="relative h-screen flex flex-col justify-center items-center text-center px-6">
        <img src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=2400" className="absolute inset-0 w-full h-full object-cover" />
        <div className="absolute inset-0 bg-black/30" />
        <div className="relative z-10 text-white space-y-6">
          <h1 className="text-6xl md:text-8xl font-serif">Artfully Defined.</h1>
          <p className="text-lg md:text-xl font-light italic">Timeless beauty for the modern woman.</p>
        </div>
      </header>

      <section id="services" className="py-24 max-w-6xl mx-auto px-6">
        <h2 className="text-4xl font-serif mb-16 text-center">Curated Services</h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-12">
          {Object.entries(servicesData).flatMap(([_, category]) => 
            category.items.map((item, i) => (
              <div key={i} className="group cursor-pointer">
                <div className="h-96 overflow-hidden mb-4 bg-gray-200">
                  <img src={item.img} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
                </div>
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="text-xl font-bold">{item.name}</h3>
                    <p className="text-sm opacity-60 mt-1">{item.duration}</p>
                  </div>
                  <span className="font-bold tracking-tighter">{item.priceFrom}</span>
                </div>
              </div>
            ))
          )}
        </div>
      </section>

      <BookingModal isOpen={isBookingOpen} onClose={() => setIsBookingOpen(false)} services={servicesData} selectedService={selectedService} />
    </div>
  );
}
