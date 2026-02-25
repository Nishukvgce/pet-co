import React, { useState } from 'react';
import Header from '../../components/ui/Header';
import Footer from '../homepage/components/Footer';
import BirthdayForm from './BirthdayForm';

export default function BirthdayClubPage() {
  const [showFormModal, setShowFormModal] = useState(false);

  return (
    <div className="min-h-screen bg-neutral-50 flex flex-col">
      <Header />

      <section className="w-full">
        <div className="container mx-auto px-4">
          <div className="rounded-lg overflow-hidden mt-6 shadow-lg">
            <img src="/assets/images/birthday/birthday.jpeg" alt="Birthday banner" className="w-full h-auto object-contain max-h-[520px] bg-gray-100" />
          </div>

        
        </div>
      </section>

      <main className="flex-1 py-12">
        <div className="container mx-auto px-4">
          <div id="details" className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
            <div className="bg-white rounded-lg p-6 shadow">
              <h3 className="font-semibold mb-2">Themed Decor</h3>
              <p className="text-sm text-muted-foreground">Balloon arrangements, banners and a themed setup to match your pet’s personality.</p>
            </div>
            <div className="bg-white rounded-lg p-6 shadow">
              <h3 className="font-semibold mb-2">Treats & Cake</h3>
              <p className="text-sm text-muted-foreground">Delicious pet-safe cakes and treat boxes for your furry guests.</p>
            </div>
            <div className="bg-white rounded-lg p-6 shadow">
              <h3 className="font-semibold mb-2">Photo & Pamper</h3>
              <p className="text-sm text-muted-foreground">A short photoshoot and grooming/pamper add-ons to capture memories.</p>
            </div>
          </div>

          <div className="max-w-4xl mx-auto text-center mb-12">
            <h2 className="text-2xl font-bold">How it works</h2>
            <p className="mt-3 text-muted-foreground">Pick a date, choose a package, and we'll take care of the rest — or customise your own experience.</p>
          </div>

          <div className="text-center">
            <button onClick={() => setShowFormModal(true)} className="bg-orange-500 text-white px-6 py-3 rounded font-semibold">Book A Celebration</button>
          </div>
        </div>
      </main>

      <Footer />

      {/* Modal: Booking form */}
      {showFormModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="absolute inset-0 bg-black/50" onClick={() => setShowFormModal(false)} />
          <div className="relative w-full max-w-3xl mx-4">
            <div className="bg-white rounded-lg shadow-lg overflow-auto max-h-[90vh]">
              <div className="flex items-center justify-between px-4 py-3 border-b">
                <h3 className="text-lg font-semibold">Book Birthday Celebration</h3>
                <button onClick={() => setShowFormModal(false)} className="text-gray-600 hover:text-gray-900">✕</button>
              </div>
              <div className="p-6">
                <BirthdayForm onSuccess={() => setShowFormModal(false)} />
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
