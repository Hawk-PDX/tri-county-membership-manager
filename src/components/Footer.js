import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-white mt-auto">
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h3 className="text-xl font-bold mb-4">Tri-County Gun Club</h3>
            <p className="text-gray-400 mb-2">
              Oregon shooting sports facility
            </p>
          </div>

          <div>
            <h3 className="text-xl font-bold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/about/join" className="text-gray-400 hover:text-white transition">
                  Join the Club
                </Link>
              </li>
              <li>
                <Link href="/about/hours-directions" className="text-gray-400 hover:text-white transition">
                  Hours & Directions
                </Link>
              </li>
              <li>
                <Link href="/about/safety-rules" className="text-gray-400 hover:text-white transition">
                  Safety Rules
                </Link>
              </li>
              <li>
                <Link href="/about/contact" className="text-gray-400 hover:text-white transition">
                  Contact Us
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-xl font-bold mb-4">Member Resources</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/members/portal" className="text-gray-400 hover:text-white transition">
                  Member Portal
                </Link>
              </li>
              <li>
                <Link href="/members/documents" className="text-gray-400 hover:text-white transition">
                  Official Documents
                </Link>
              </li>
              <li>
                <Link href="/training" className="text-gray-400 hover:text-white transition">
                  Training
                </Link>
              </li>
              <li>
                <Link href="/calendar" className="text-gray-400 hover:text-white transition">
                  Event Calendar
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-8 pt-6 text-center text-gray-400">
          <p>&copy; {new Date().getFullYear()} Tri-County Gun Club. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
