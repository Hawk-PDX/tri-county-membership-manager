import Link from 'next/link';
import Image from 'next/image';
import FeaturedCarousel from '@/components/FeaturedCarousel';
import UpcomingEvents from '@/components/UpcomingEvents';
import Announcements from '@/components/Announcements';

export default function Home() {
  return (
    <div className="bg-gray-900">
      {/* Welcome Section */}
      <section className="relative bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 py-16 overflow-hidden">
        {/* Subtle grid pattern overlay */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(0,159,30,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(0,159,30,0.03)_1px,transparent_1px)] bg-[size:50px_50px]" />
        
        <div className="container mx-auto px-4 relative z-10">
          {/* Logo & Welcome */}
          <div className="text-center mb-12">
            <div className="flex justify-center mb-6">
              <div className="bg-gray-700 rounded-xl px-8 py-6 shadow-2xl border-4 border-[#009f1e]/30 backdrop-blur-sm">
                <Image
                  src="/tri-county-logo.png"
                  alt="Tri-County Gun Club"
                  width={600}
                  height={112}
                  className="h-28 w-auto"
                  style={{ filter: 'drop-shadow(0 0 3px white) drop-shadow(0 0 3px white) drop-shadow(0 0 8px white) drop-shadow(0 3px 10px rgba(0,0,0,0.9))' }}
                  quality={100}
                  priority
                />
              </div>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold mb-4 text-[#009f1e]" style={{ textShadow: '0 0 30px rgba(0,159,30,0.3), 2px 2px 4px rgba(0,0,0,0.5)' }}>
              Welcome to Tri-County Gun Club
            </h1>
            <p className="text-xl md:text-2xl text-gray-300 mb-8 font-medium">
              A Private Club Open to Members and Guests
            </p>
            <div className="flex gap-4 justify-center flex-wrap mb-12">
              <Link
                href="/about/join"
                className="bg-[#009f1e] hover:bg-[#238213] text-white px-8 py-4 rounded-lg font-bold text-lg transition-all hover:scale-105 shadow-lg shadow-[#009f1e]/30 hover:shadow-[#009f1e]/50"
              >
                Become a Member
              </Link>
              <Link
                href="/about/tour"
                className="bg-gray-800 hover:bg-gray-700 text-[#009f1e] border-2 border-[#009f1e] px-8 py-4 rounded-lg font-bold text-lg transition-all hover:scale-105 shadow-lg"
              >
                Schedule a Tour
              </Link>
            </div>
          </div>

          {/* Featured Carousel */}
          <FeaturedCarousel />
        </div>
      </section>

      {/* Announcements & Events Section */}
      <section className="relative bg-gradient-to-br from-gray-800 via-gray-900 to-gray-800 py-20 overflow-hidden">
        {/* Decorative accent line */}
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-[#009f1e] to-transparent" />
        
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-4xl md:text-5xl font-bold mb-4 text-[#009f1e]" style={{ textShadow: '0 0 20px rgba(0,159,30,0.3)' }}>News & Events</h2>
            <p className="text-gray-400 text-lg max-w-2xl mx-auto">
              Stay updated with the latest club announcements and upcoming activities
            </p>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Announcements - Takes 2 columns */}
            <div className="lg:col-span-2">
              <Announcements />
            </div>
            {/* Upcoming Events - Takes 1 column */}
            <div>
              <UpcomingEvents />
            </div>
          </div>
        </div>
      </section>

      <section className="bg-gradient-to-b from-gray-800 via-gray-700 to-gray-800 py-20">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl md:text-5xl font-bold text-center mb-4 text-white">Our Facilities</h2>
          <p className="text-center text-gray-300 text-lg mb-12 max-w-2xl mx-auto">
            World-class shooting ranges and training facilities for every discipline
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="group bg-gray-800 hover:bg-gray-750 p-8 rounded-xl shadow-xl shadow-black/50 hover:shadow-[#009f1e]/30 transition-all hover:-translate-y-2 border-t-4 border-[#009f1e]">
              <div className="text-4xl mb-4">🎯</div>
              <h3 className="text-2xl font-bold mb-3 text-white">Multiple Ranges</h3>
              <p className="text-gray-400 mb-6 leading-relaxed">
                Indoor pistol to 600-yard rifle ranges and everything in between.
              </p>
              <Link href="/facilities" className="inline-flex items-center text-[#009f1e] hover:text-[#47963a] font-bold text-lg group-hover:gap-2 transition-all">
                Explore Facilities <span className="ml-1">→</span>
              </Link>
            </div>

            <div className="group bg-gray-800 hover:bg-gray-750 p-8 rounded-xl shadow-xl shadow-black/50 hover:shadow-[#238213]/30 transition-all hover:-translate-y-2 border-t-4 border-[#238213]">
              <div className="text-4xl mb-4">🎓</div>
              <h3 className="text-2xl font-bold mb-3 text-white">Training</h3>
              <p className="text-gray-400 mb-6 leading-relaxed">
                Professional courses for beginners through advanced shooters.
              </p>
              <Link href="/training" className="inline-flex items-center text-[#009f1e] hover:text-[#47963a] font-bold text-lg group-hover:gap-2 transition-all">
                View Training <span className="ml-1">→</span>
              </Link>
            </div>

            <div className="group bg-gray-800 hover:bg-gray-750 p-8 rounded-xl shadow-xl shadow-black/50 hover:shadow-[#47963a]/30 transition-all hover:-translate-y-2 border-t-4 border-[#47963a]">
              <div className="text-4xl mb-4">🏆</div>
              <h3 className="text-2xl font-bold mb-3 text-white">Activities</h3>
              <p className="text-gray-400 mb-6 leading-relaxed">
                Competitive shooting, cowboy action, IDPA, USPSA, and more.
              </p>
              <Link href="/activities" className="inline-flex items-center text-[#009f1e] hover:text-[#47963a] font-bold text-lg group-hover:gap-2 transition-all">
                See Activities <span className="ml-1">→</span>
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="relative bg-gradient-to-b from-gray-900 via-gray-800 to-gray-900 py-20">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl md:text-5xl font-bold text-center mb-4 text-[#009f1e]" style={{ textShadow: '0 0 20px rgba(0,159,30,0.3)' }}>Getting Started</h2>
          <p className="text-center text-gray-400 text-lg mb-12 max-w-2xl mx-auto">
            Everything you need to know before your visit
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Link
              href="/calendar"
              className="group bg-gray-800 hover:bg-gray-750 p-8 rounded-xl shadow-lg shadow-black/50 hover:shadow-[#009f1e]/20 transition-all text-center hover:-translate-y-1 border-b-4 border-[#009f1e]">
              <div className="text-5xl mb-4">📅</div>
              <h3 className="text-xl font-bold mb-3 text-white">Event Calendar</h3>
              <p className="text-gray-400 leading-relaxed">View upcoming events and activities</p>
            </Link>

            <Link
              href="/about/hours-directions"
              className="group bg-gray-800 hover:bg-gray-750 p-8 rounded-xl shadow-lg shadow-black/50 hover:shadow-[#238213]/20 transition-all text-center hover:-translate-y-1 border-b-4 border-[#238213]">
              <div className="text-5xl mb-4">🗺️</div>
              <h3 className="text-xl font-bold mb-3 text-white">Hours & Directions</h3>
              <p className="text-gray-400 leading-relaxed">Find us and plan your visit</p>
            </Link>

            <Link
              href="/about/safety-rules"
              className="group bg-gray-800 hover:bg-gray-750 p-8 rounded-xl shadow-lg shadow-black/50 hover:shadow-[#47963a]/20 transition-all text-center hover:-translate-y-1 border-b-4 border-[#47963a]">
              <div className="text-5xl mb-4">🛡️</div>
              <h3 className="text-xl font-bold mb-3 text-white">Safety Rules</h3>
              <p className="text-gray-400 leading-relaxed">Review our safety guidelines</p>
            </Link>

            <Link
              href="/members/portal"
              className="group bg-gray-800 hover:bg-gray-750 p-8 rounded-xl shadow-lg shadow-black/50 hover:shadow-[#009f1e]/20 transition-all text-center hover:-translate-y-1 border-b-4 border-[#009f1e]">
              <div className="text-5xl mb-4">👤</div>
              <h3 className="text-xl font-bold mb-3 text-white">Member Portal</h3>
              <p className="text-gray-400 leading-relaxed">Access member resources</p>
            </Link>
          </div>
        </div>
      </section>

      <section className="relative bg-gradient-to-r from-[#009f1e] via-[#238213] to-[#009f1e] text-white py-20 overflow-hidden">
        {/* Decorative Elements */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -translate-y-32 translate-x-32" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-black/10 rounded-full translate-y-48 -translate-x-48" />
        
        <div className="container mx-auto px-4 text-center relative z-10">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">Ready to Join Our Community?</h2>
          <p className="text-xl md:text-2xl mb-10 max-w-2xl mx-auto opacity-95">
            Become a member and gain access to our world-class facilities and training programs
          </p>
          <div className="flex gap-4 justify-center flex-wrap">
            <Link
              href="/about/membership"
              className="bg-white text-[#009f1e] hover:bg-gray-100 px-10 py-4 rounded-lg font-bold text-lg transition-all hover:scale-105 hover:shadow-2xl inline-block"
            >
              View Membership Options
            </Link>
            <Link
              href="/about/contact"
              className="bg-transparent border-3 border-white text-white hover:bg-white hover:text-[#009f1e] px-10 py-4 rounded-lg font-bold text-lg transition-all hover:scale-105 inline-block"
            >
              Contact Us
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
