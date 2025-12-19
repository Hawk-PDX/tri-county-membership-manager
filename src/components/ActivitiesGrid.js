import Image from 'next/image';
import Link from 'next/link';

const activities = [
  {
    id: 1,
    title: 'Training & Safety',
    description: 'Professional instruction for all skill levels',
    image: '/images/activities/training.png',
    link: '/training',
    bgColor: 'bg-[#009f1e]'
  },
  {
    id: 2,
    title: 'Competitions',
    description: 'USPSA, IDPA, and more competitive events',
    image: '/images/activities/competition.png',
    link: '/activities',
    bgColor: 'bg-[#238213]'
  },
  {
    id: 3,
    title: 'Range Facilities',
    description: 'Indoor pistol to 600-yard rifle ranges',
    image: '/images/misc/location-map.png',
    link: '/facilities',
    bgColor: 'bg-[#47963a]'
  }
];

export default function ActivitiesGrid() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {activities.map((activity) => (
        <Link
          key={activity.id}
          href={activity.link}
          className="group relative overflow-hidden rounded-lg shadow-xl hover:shadow-2xl transition-all"
        >
          <div className="relative h-64">
            <Image
              src={activity.image}
              alt={activity.title}
              fill
              className="object-cover transition-transform group-hover:scale-110"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />
          </div>
          <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
            <h3 className="text-2xl font-bold mb-2">{activity.title}</h3>
            <p className="text-gray-200">{activity.description}</p>
          </div>
        </Link>
      ))}
    </div>
  );
}
