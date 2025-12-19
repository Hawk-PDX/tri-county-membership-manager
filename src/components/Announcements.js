import Image from 'next/image';
import Link from 'next/link';

const announcements = [
  {
    id: 1,
    title: 'Winter Hours in Effect',
    description: 'Please note our updated winter operating hours. Check the schedule for details.',
    image: '/images/announcements/winter-hours.png',
    link: '/about/hours-directions',
    linkText: 'View Hours'
  },
  {
    id: 2,
    title: '200/300 Yard Range Available',
    description: 'Our long-range facility is perfect for precision rifle shooting and competitions.',
    image: '/images/announcements/benchrest-promo.jpg',
    link: '/facilities',
    linkText: 'Learn More'
  }
];

export default function Announcements() {
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3 mb-8">
        <div className="text-4xl">📣</div>
        <h2 className="text-3xl md:text-4xl font-bold text-white">
          Announcements
        </h2>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {announcements.map((announcement) => (
          <div
            key={announcement.id}
            className="group bg-gray-800 rounded-xl shadow-xl shadow-black/50 overflow-hidden hover:shadow-[#009f1e]/30 transition-all hover:-translate-y-1 border-t-4 border-[#009f1e]"
          >
            <div className="relative h-48 overflow-hidden">
              <Image
                src={announcement.image}
                alt={announcement.title}
                fill
                className="object-cover group-hover:scale-105 transition-transform duration-300"
              />
            </div>
            <div className="p-6">
              <h3 className="text-2xl font-bold text-white mb-3">
                {announcement.title}
              </h3>
              <p className="text-gray-400 mb-6 leading-relaxed">
                {announcement.description}
              </p>
              <Link
                href={announcement.link}
                className="inline-block bg-[#009f1e] hover:bg-[#238213] text-white font-bold px-6 py-3 rounded-lg transition-all hover:scale-105 hover:shadow-lg"
              >
                {announcement.linkText} →
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
