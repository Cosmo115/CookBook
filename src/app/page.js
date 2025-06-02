'use client'
import { useState, useEffect } from 'react';
import { Coffee, UtensilsCrossed, ChefHat, IceCream, ArrowLeft } from 'lucide-react';
import Link from'next/link'

export default function MenuApp() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    return () => setMounted(false);
  }, []);

  // Main App UI
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

        {/* Meal options */}
        <div className={`flex flex-col items-center gap-8 transition-opacity duration-1000 ${mounted ? 'opacity-100' : 'opacity-0'}`}>
          {/* Breakfast button */}
          <Link href="/Breakfast" className="relative w-72 py-4 border-2 border-amber-600 rounded-full text-center bg-gradient-to-r from-yellow-100 to-amber-200 text-amber-900 font-medium shadow-md transform transition duration-300 hover:scale-105 hover:shadow-lg hover:from-yellow-200 hover:to-amber-300 focus:outline-none focus:ring focus:ring-amber-300">
            <Coffee size={20} className="inline-block mr-2" />
            <span>Breakfast</span>
            <div className="absolute -top-1 -right-1 w-8 h-3 border-t-2 border-r-2 border-amber-600 rounded-tr-lg bg-amber-200"></div>
            <div className="absolute -bottom-1 -right-1 w-8 h-3 border-b-2 border-r-2 border-amber-600 rounded-br-lg bg-amber-200"></div>
          </Link>

          {/* Lunch button */}
          <button className="relative w-72 py-4 border-2 border-red-600 rounded-full text-center bg-gradient-to-r from-orange-100 to-red-200 text-red-900 font-medium shadow-md transform transition duration-300 hover:scale-105 hover:shadow-lg hover:from-orange-200 hover:to-red-300 focus:outline-none focus:ring focus:ring-red-300">
            <UtensilsCrossed size={20} className="inline-block mr-2" />
            <span>Lunch</span>
            <div className="absolute -top-1 -right-1 w-8 h-3 border-t-2 border-r-2 border-red-600 rounded-tr-lg bg-red-200"></div>
            <div className="absolute -bottom-1 -right-1 w-8 h-3 border-b-2 border-r-2 border-red-600 rounded-br-lg bg-red-200"></div>
          </button>

          {/* Dinner button */}
          <button className="relative w-72 py-4 border-2 border-purple-600 rounded-full text-center bg-gradient-to-r from-indigo-100 to-purple-200 text-purple-900 font-medium shadow-md transform transition duration-300 hover:scale-105 hover:shadow-lg hover:from-indigo-200 hover:to-purple-300 focus:outline-none focus:ring focus:ring-purple-300">
            <ChefHat size={20} className="inline-block mr-2" />
            <span>Dinner</span>
            <div className="absolute -top-1 -right-1 w-8 h-3 border-t-2 border-r-2 border-purple-600 rounded-tr-lg bg-purple-200"></div>
            <div className="absolute -bottom-1 -right-1 w-8 h-3 border-b-2 border-r-2 border-purple-600 rounded-br-lg bg-purple-200"></div>
          </button>

          {/* Desert button */}
          <button className="relative w-72 py-4 border-2 border-pink-600 rounded-full text-center bg-gradient-to-r from-rose-100 to-pink-200 text-pink-900 font-medium shadow-md transform transition duration-300 hover:scale-105 hover:shadow-lg hover:from-rose-200 hover:to-pink-300 focus:outline-none focus:ring focus:ring-pink-300">
            <IceCream size={20} className="inline-block mr-2" />
            <span>Desert</span>
            <div className="absolute -top-1 -right-1 w-8 h-3 border-t-2 border-r-2 border-pink-600 rounded-tr-lg bg-pink-200"></div>
            <div className="absolute -bottom-1 -right-1 w-8 h-3 border-b-2 border-r-2 border-pink-600 rounded-br-lg bg-pink-200"></div>
          </button>
        </div>
      </div>
    </div>
  );
}