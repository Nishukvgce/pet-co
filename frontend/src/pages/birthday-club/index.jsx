import React from 'react';
import Header from '../../components/ui/Header';
import Footer from '../homepage/components/Footer';
import BirthdayForm from './BirthdayForm';

export default function BirthdayClubPage() {
  return (
    <div className="min-h-screen bg-neutral-50 flex flex-col">
      <Header />

      <section className="w-full bg-gradient-to-r from-yellow-400 via-orange-300 to-yellow-200">
        <div className="container mx-auto px-4 py-14 grid grid-cols-1 lg:grid-cols-2 gap-6 items-center">
          <div>
            <h1 className="text-3xl sm:text-4xl font-bold">Join our Birthday Club</h1>
            <p className="mt-3 text-gray-800 max-w-2xl">Make your pet's birthday unforgettable — book a celebration package or customise one with treats, decorations and a pamper session.</p>
            <a href="#birthday-form" className="inline-block mt-6 bg-white text-orange-500 px-5 py-3 rounded shadow font-semibold">Book Now</a>
          </div>

          <div className="flex justify-center lg:justify-end">
            <div className="w-44 h-44 bg-white rounded-full flex items-center justify-center shadow-xl">
              <span className="text-5xl">🐾</span>
            </div>
          </div>
        </div>
      </section>

      <main className="flex-1 py-12">
        <div className="container mx-auto px-4">
          <div id="birthday-form" className="bg-white rounded-lg shadow-md p-8 max-w-3xl mx-auto">
            <BirthdayForm />
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
