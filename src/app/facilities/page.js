import PageContainer from '@/components/PageContainer';
import Link from 'next/link';

export default function FacilitiesPage() {
  const facilities = [
    { name: 'Action Range', href: '/facilities/action-range', description: 'Multi-bay action shooting range' },
    { name: 'Archery Ranges', href: '/facilities/archery-ranges', description: 'Indoor and outdoor archery facilities' },
    { name: 'Black Powder / Silhouette / Rimfire Range', href: '/facilities/black-powder-silhouette-rimfire', description: 'Dedicated ranges for traditional shooting' },
    { name: 'Conventional Pistol Range', href: '/facilities/conventional-pistol-range', description: 'Standard pistol competition range' },
    { name: 'General Purpose Range', href: '/facilities/general-purpose-range', description: 'Versatile range for multiple disciplines' },
    { name: 'Indoor Range', href: '/facilities/indoor-range', description: 'Climate-controlled indoor shooting' },
    { name: 'Shotgun Fields', href: '/facilities/shotgun-fields', description: 'Trap, skeet, and sporting clays fields' },
    { name: 'Short Distance Pistol Range', href: '/facilities/short-distance-pistol-range', description: 'Tactical and defensive pistol training' },
    { name: '200 – 300 Yard Range', href: '/facilities/200-300-yard-range', description: 'Mid-range rifle shooting' },
    { name: '600 Yard Range', href: '/facilities/600-yard-range', description: 'Long-range precision rifle' },
  ];

  return (
    <PageContainer
      title="Facilities"
      subtitle="Ranges for all shooting disciplines"
    >
      <div className="bg-white rounded-lg shadow-md p-8 mb-8">
        <p className="text-gray-600 mb-4">
          Multiple ranges for various shooting sports and skill levels.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {facilities.map((facility, index) => (
          <Link
            key={index}
            href={facility.href}
            className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition"
          >
            <h3 className="text-xl font-bold mb-2 text-gray-900 hover:text-blue-600">
              {facility.name}
            </h3>
            <p className="text-gray-600">{facility.description}</p>
          </Link>
        ))}
      </div>
    </PageContainer>
  );
}
