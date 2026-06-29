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

const BookingModal = ({ isOpen, onClose, services, selectedService }) => {
  const [step, setStep] = useState(selectedService ? 2 : 1);
  const [selected, setSelected] = useState(selectedService ? [selectedService] : []);
  const [status, setStatus] = useState(null);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-[#0A1D2F]/80 backdrop-blur-sm">
      <div className="bg-[#FDFBF5] w-full max-w-lg rounded-3xl p-8 relative">
        <button onClick={onClose} className="absolute top-4 right-4"><X /></button>
        <h2 className="text-xl font-bold mb-4">Book Appointment</h2>
        <button onClick={onClose} className="w-full bg-[#0A1D2F] text-white p-3 rounded-xl">Close</button>
      </div>
    </div>
  );
};

export default function App() {
  const [view, setView] = useState('home');
  const [isBookingOpen, setIsBookingOpen] = useState(false);
  const [servicesOpen, setServicesOpen] = useState(false);

  const servicesRef = useRef(null);
  const aboutRef = useRef(null);
  const contactRef = useRef(null);
  
  const scrollToSection = (ref) => ref.current?.scrollIntoView({ behavior: 'smooth' });
  const openBooking = () => setIsBookingOpen(true);

  return (
    <div className="min-h-screen bg-[#FDFBF5] text-[#0A1D2F]">
      <header className="sticky top-0 z-50 bg-[#FDFBF5]/80 backdrop-blur-md px-6 py-4">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div className="text-3xl font-serif font-bold cursor-pointer" onClick={() => window.location.reload()}>BONI</div>
          
          <nav className="hidden md:flex items-center gap-1 bg-white border rounded-full px-3 py-2 shadow-sm">
            
            {/* FIXED HOVER/CLICK CONTAINER */}
            <div 
              className="relative" 
              onMouseEnter={() => setServicesOpen(true)} 
              onMouseLeave={() => setServicesOpen(false)}
            >
              <button 
                onClick={() => setServicesOpen(!servicesOpen)}
                className="px-5 py-2 text-sm font-medium rounded-full hover:bg-[#0A1D2F] hover:text-white transition"
              >
                Services ▾
              </button>
              
              {servicesOpen && (
                <div className="absolute top-full left-0 pt-2 z-[9999]">
                  {/* Invisible Bridge: A small padding-top above ensures the menu stays open */}
                  <div className="w-56 bg-white rounded-2xl shadow-xl border overflow-hidden">
                    {Object.keys(servicesData).map(service => (
                      <button
                        key={service}
                        onClick={() => { setServicesOpen(false); alert(`Selected: ${service}`); }}
                        className="block w-full text-left px-5 py-3 text-sm hover:bg-[#C8B87B]/20"
                      >
                        {service}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <button onClick={() => scrollToSection(aboutRef)} className="px-5 py-2 text-sm rounded-full hover:bg-[#0A1D2F] hover:text-white transition">About</button>
            <button onClick={() => scrollToSection(contactRef)} className="px-5 py-2 text-sm rounded-full hover:bg-[#0A1D2F] hover:text-white transition">Contact</button>
          </nav>
          
          <button onClick={openBooking} className="bg-[#0A1D2F] text-white px-7 py-3 rounded-full text-sm font-bold">Book Now</button>
        </div>
      </header>

      <section className="p-20 text-center"><h1 className="text-6xl font-serif">Welcome</h1></section>
      <div ref={aboutRef} className="h-96 bg-gray-100 p-20 text-center">About</div>
      <div ref={contactRef} className="h-96 bg-gray-200 p-20 text-center">Contact</div>

      <BookingModal isOpen={isBookingOpen} onClose={() => setIsBookingOpen(false)} />
    </div>
  );
}
