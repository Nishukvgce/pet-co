import React from 'react';
import { Link } from 'react-router-dom';
import Header from '../../components/ui/Header';
import Footer from '../homepage/components/Footer';

const amounts = [50,100,150,250,500,1000];

const PetCoFoundation = () => {
  return (
    <div className="min-h-screen bg-white">
      <Header />

      {/* Top banner for Foundation initiatives (content begins below global header) */}
      <div className="bg-white border-b mt-6">
        <div className="container mx-auto px-4 py-8 text-center">
          <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-4">PET&CO Foundation</h1>
          <p className="max-w-2xl mx-auto text-muted-foreground">Every day for the last 6 years, PET&CO Foundation has partnered with NGOs and community caregivers to bridge the gap between urban animals and people. Through initiatives such as feeding drives, water-bowl programs, adoption support and community education, we work to create a kinder city for street animals.</p>
          <h2 className="text-2xl font-semibold mt-8">Our Initiatives</h2>
        </div>
      </div>

      <main className="container mx-auto px-4 py-12">
        <section className="grid gap-8 lg:grid-cols-2">
          <div className="bg-white shadow rounded-lg p-6">
            <h2 className="text-2xl font-semibold mb-3">Feed A Dog In Need</h2>
            <p className="text-muted-foreground mb-4">Help make a difference, share the love. Your contribution provides food and essential care to street animals in need.</p>

            <div className="mb-4">
              <div className="flex flex-wrap gap-3">
                {amounts.map(a => (
                  <button key={a} className="px-4 py-2 border rounded text-sm font-medium hover:bg-primary/10">₹{a}</button>
                ))}
              </div>
            </div>

            <div className="flex items-center gap-4">
              <button className="bg-primary text-white px-5 py-2 rounded font-semibold">Donate Now</button>
              <div className="text-sm text-muted-foreground">Receive tax benefits by donating to this cause.</div>
            </div>

            <p className="mt-4 text-sm text-muted-foreground">We accept all major payment methods.</p>

            <p className="mt-4 text-sm text-muted-foreground">Your contributions can positively impact the lives of numerous street animals. Kindly make a donation to support those in need.</p>
          </div>

          <div className="bg-white shadow rounded-lg p-6">
            <h2 className="text-2xl font-semibold mb-3">Become a member of PET&CO Tribe</h2>
            <p className="text-muted-foreground mb-4">Become a part of the PET&CO Tribe, a community of dedicated animal enthusiasts! As a member you help sustain initiatives and get access to volunteering opportunities, events and updates.</p>

            <div className="mb-4">
              <div className="text-sm">One-time Registration Fee.</div>
              <div className="text-3xl font-bold mt-1">Regular price Rs. 99.00</div>
            </div>

            <Link to="/join-petco" className="inline-block bg-secondary text-white px-5 py-2 rounded font-semibold">Join Now</Link>

            <div className="mt-6">
              <h3 className="text-lg font-medium mb-2">EXTRA HELP YOU CAN COUNT ON</h3>
              <p className="text-sm text-muted-foreground">Just like it takes a village to raise a child, it takes a community to care for its animals. Our Foundation Directory lists NGOs, ambulances and more, so you can get help where you need it.</p>
              <Link to="/foundation-directory" className="text-primary text-sm mt-2 inline-block">View More →</Link>
            </div>
          </div>
        </section>

        <section className="mt-12">
          <h2 className="text-2xl font-semibold mb-4">In The Media</h2>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            <article className="bg-white p-4 rounded shadow">
              <h4 className="font-semibold">PET&CO Foundation advocates for female street dogs’ survival.</h4>
              <p className="text-sm text-muted-foreground mt-2">Stories and coverage of our campaigns and field work.</p>
            </article>
            <article className="bg-white p-4 rounded shadow">
              <h4 className="font-semibold">PKL 9: Kabaddi Players Spend Quality Time With Rehabilitated Animals.</h4>
            </article>
            <article className="bg-white p-4 rounded shadow">
              <h4 className="font-semibold">PET&CO Foundation and Water For Voiceless join hands to solve the clean water crisis for community animals in India.</h4>
            </article>
          </div>
        </section>

        <section className="mt-12 grid gap-8 lg:grid-cols-2">
          <div>
            <h2 className="text-2xl font-semibold mb-3">Founder’s Note</h2>
            <p className="text-muted-foreground">We started the PET&CO Foundation to promote peaceful co-existence between people and urban animals. We believe the best way to do that is by understanding these animals better and by caring for their needs. Through continuous efforts in the form of our Feed A Dog In Need initiative, reflective collar drives, adoption drives, water bowl initiatives, and more, we hope to make this world a better place for our wonderful streeties.</p>
            <p className="mt-4 font-semibold">— Rashi</p>
          </div>

          <div>
            <h2 className="text-2xl font-semibold mb-3">Our Blogs</h2>
            <ul className="space-y-3">
              <li className="bg-white p-4 rounded shadow">
                <h4 className="font-medium">Streeties Ki Mann Ki Baat</h4>
                <p className="text-sm text-muted-foreground mt-1">Time to listen to the voices we are choosing to silence…</p>
                <Link to="/blog/streeties-ki-mann-ki-baat" className="text-primary text-sm mt-2 inline-block">Read more →</Link>
              </li>
              <li className="bg-white p-4 rounded shadow">
                <h4 className="font-medium">Street Dogs Are Adapting. Are We?</h4>
                <p className="text-sm text-muted-foreground mt-1">A reflection by PET&CO Foundation.</p>
                <Link to="/blog/street-dogs-are-adapting" className="text-primary text-sm mt-2 inline-block">Read more →</Link>
              </li>
              <li className="bg-white p-4 rounded shadow">
                <h4 className="font-medium">Adopt Joy: India's First Organised Directory For Pets In Need.</h4>
                <p className="text-sm text-muted-foreground mt-1">Every day, we scroll past countless adoption appeals...</p>
                <Link to="/blog/adopt-joy" className="text-primary text-sm mt-2 inline-block">Read more →</Link>
              </li>
            </ul>
          </div>
        </section>

        <section className="mt-12 text-center">
          <h3 className="text-xl font-semibold">Happiness is a wet nose and a wagging tail!</h3>
          <p className="text-muted-foreground mt-2">Join us in making a real difference for community animals.</p>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default PetCoFoundation;
