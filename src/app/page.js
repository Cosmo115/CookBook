'use client'
import { useState, useEffect } from 'react';
import { Coffee } from 'lucide-react';
import Link from 'next/link';

export default function MenuApp() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <div className="flex flex-col items-center min-h-screen bg-gradient-to-b from-amber-50 to-orange-100 py-12 font-sans">
      <div className="w-full max-w-3xl px-4">
        {/* Title card with horizontal line */}
        <div className="relative mb-16 px-4">
          <div className="absolute w-full border-t-2 border-amber-800 top-1/2"></div>
          <div className="relative text-center">
            <span className="px-6 py-2 bg-gradient-to-r from-amber-50 via-orange-50 to-amber-50 text-3xl font-bold text-amber-900 tracking-wide">Gourmet Menu</span>
          </div>
        </div>

        {/* Single button */}
        <div className={`flex flex-col items-center gap-8 transition-opacity duration-1000 ${mounted ? 'opacity-100' : 'opacity-0'}`}>
          <Link href="/Breakfast" className="relative w-72 py-4 border-2 border-amber-600 rounded-full text-center bg-gradient-to-r from-yellow-100 to-amber-200 text-amber-900 font-medium shadow-md transform transition duration-300 hover:scale-105 hover:shadow-lg hover:from-yellow-200 hover:to-amber-300 focus:outline-none focus:ring focus:ring-amber-300">
            <Coffee size={20} className="inline-block mr-2" />
            <span>Check it out</span>
            <div className="absolute -top-1 -right-1 w-8 h-3 border-t-2 border-r-2 border-amber-600 rounded-tr-lg bg-amber-200"></div>
            <div className="absolute -bottom-1 -right-1 w-8 h-3 border-b-2 border-r-2 border-amber-600 rounded-br-lg bg-amber-200"></div>
          </Link>
        </div>
      </div>
    </div>
  );
}