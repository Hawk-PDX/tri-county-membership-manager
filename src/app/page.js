import Link from 'next/link';
import Image from 'next/image';

export default function Home() {
  return (
    <div className="bg-gray-50">
      <section className="bg-gradient-to-r from-gray-900 to-gray-800 text-white py-20">
        <div className="container mx-auto px-4 text-center">
          <div className="flex justify-center mb-6">
            <div className="bg-white/95 backdrop-blur-sm rounded-lg px-8 py-4 shadow-2xl">
            <Image
              src="/tri-county-logo.png"
              alt="Tri-County Gun Club"
              width={1266}
              height={238}
              className="h-40 w-auto"
              quality={100}
              priority
            />
            </div>
          </div>
          <p className="text-xl mb-8">
            Shooting ranges | Training | Competitive Events
          </p>
          <div className="flex gap-4 justify-center flex-wrap">
            <Link
              href="/about/join"
              className="bg-blue-600 hover:bg-blue-700 px-8 py-3 rounded-lg font-semibold transition"
            >
              Join Today
            </Link>
            <Link
              href="/about/tour"
              className="bg-gray-700 hover:bg-gray-600 px-8 py-3 rounded-lg font-semibold transition"
            >
              Take a Tour
            </Link>
          </div>
        </div>
      </section>

      <section className="bg-gray-700 py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl font-bold text-center mb-12 text-white">Our Facilities</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white backdrop-blur-sm p-6 rounded-lg shadow-xl hover:shadow-2xl transition-all">
              <h3 className="text-2xl font-bold mb-3 text-gray-900 border-b-2 border-green-600 pb-2">Multiple Ranges</h3>
              <p className="text-gray-600 mb-4">
                Indoor pistol to 600-yard rifle ranges and everything in between.
              </p>
              <Link href="/facilities" className="text-blue-600 hover:text-blue-800 font-semibold">
                Explore Facilities →
              </Link>
            </div>

            <div className="bg-white backdrop-blur-sm p-6 rounded-lg shadow-xl hover:shadow-2xl transition-all">
              <h3 className="text-2xl font-bold mb-3 text-gray-900 border-b-2 border-blue-600 pb-2">Training</h3>
              <p className="text-gray-600 mb-4">
                Courses for beginners through advanced shooters.
              </p>
              <Link href="/training" className="text-blue-600 hover:text-blue-800 font-semibold">
                View Training →
              </Link>
            </div>

            <div className="bg-white backdrop-blur-sm p-6 rounded-lg shadow-xl hover:shadow-2xl transition-all">
              <h3 className="text-2xl font-bold mb-3 text-gray-900 border-b-2 border-orange-600 pb-2">Activities</h3>
              <p className="text-gray-600 mb-4">
                Competitive shooting, cowboy action, IDPA, USPSA, and more.
              </p>
              <Link href="/activities" className="text-blue-600 hover:text-blue-800 font-semibold">
                See Activities →
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-gray-600 py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl font-bold text-center mb-12 text-white">Getting Started</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Link
              href="/calendar"
              className="bg-white backdrop-blur-sm p-6 rounded-lg shadow-xl hover:shadow-2xl transition-all text-center">
              <div className="text-3xl mb-3">📅</div>
              <h3 className="text-xl font-bold mb-2 text-gray-900">Event Calendar</h3>
              <p className="text-gray-600">View upcoming events and activities</p>
            </Link>

            <Link
              href="/about/hours-directions"
              className="bg-white backdrop-blur-sm p-6 rounded-lg shadow-xl hover:shadow-2xl transition-all text-center">
              <div className="text-3xl mb-3">🗺️</div>
              <h3 className="text-xl font-bold mb-2 text-gray-900">Hours & Directions</h3>
              <p className="text-gray-600">Find us and plan your visit</p>
            </Link>

            <Link
              href="/about/safety-rules"
              className="bg-white backdrop-blur-sm p-6 rounded-lg shadow-xl hover:shadow-2xl transition-all text-center">
              <div className="text-3xl mb-3">🛡️</div>
              <h3 className="text-xl font-bold mb-2 text-gray-900">Safety Rules</h3>
              <p className="text-gray-600">Review our safety guidelines</p>
            </Link>

            <Link
              href="/members/portal"
              className="bg-white backdrop-blur-sm p-6 rounded-lg shadow-xl hover:shadow-2xl transition-all text-center">
              <div className="text-3xl mb-3">👤</div>
              <h3 className="text-xl font-bold mb-2 text-gray-900">Member Portal</h3>
              <p className="text-gray-600">Access member resources</p>
            </Link>
          </div>
        </div>
      </section>

      <section className="bg-blue-600 text-white py-16">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-4xl font-bold text-center mb-4">Ready to Join?</h2>
          <p className="text-xl mb-8">
            Membership info and applications
          </p>
          <Link
            href="/about/membership"
            className="bg-white text-blue-600 hover:bg-gray-100 px-8 py-3 rounded-lg font-semibold transition inline-block"
          >
            Learn About Membership
          </Link>
        </div>
      </section>
    </div>
  );
}
