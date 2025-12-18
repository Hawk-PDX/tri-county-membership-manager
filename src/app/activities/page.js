import PageContainer from '@/components/PageContainer';
import Link from 'next/link';

export default function ActivitiesPage() {
  const activities = [
    { name: '2 Gun Defense', href: '/activities/2-gun-defense' },
    { name: '22 Rimfire Benchrest 100-200 yard', href: '/activities/22-rimfire-benchrest' },
    { name: '600-Yard Prone/Bench', href: '/activities/600-yard-prone-bench' },
    { name: 'Archery', href: '/activities/archery' },
    { name: 'Black Powder Cartridge, Pistol Caliber Lever Rifle, Smallbore Silhouette', href: '/activities/black-powder-cartridge' },
    { name: 'Cowboy Action Shooting', href: '/activities/cowboy-action-shooting' },
    { name: 'Everyday Carry (EDC)', href: '/activities/everyday-carry' },
    { name: 'International Defensive Pistol Association (IDPA)', href: '/activities/idpa' },
    { name: 'Junior Air Pistol/Air Rifle', href: '/activities/junior-air-pistol-rifle' },
    { name: 'Junior Smallbore', href: '/activities/junior-smallbore' },
    { name: 'Multi-Gun', href: '/activities/multi-gun' },
    { name: 'Muzzle Loader', href: '/activities/muzzle-loader' },
    { name: 'Police Pistol Combat', href: '/activities/police-pistol-combat' },
    { name: 'Practical Rifle', href: '/activities/practical-rifle' },
    { name: 'Precision Pistol (formerly Conventional Pistol)', href: '/activities/precision-pistol' },
    { name: 'Rimfire Sporter', href: '/activities/rimfire-sporter' },
    { name: 'Senior Smallbore', href: '/activities/senior-smallbore' },
    { name: 'Skeet', href: '/activities/skeet' },
    { name: 'Speed Steel', href: '/activities/speed-steel' },
    { name: 'Sporter Highpower', href: '/activities/sporter-highpower' },
    { name: 'Sporting Clays', href: '/activities/sporting-clays' },
    { name: 'Sunday Clays', href: '/activities/sunday-clays' },
    { name: 'Tactical', href: '/activities/tactical' },
    { name: 'Trap', href: '/activities/trap' },
    { name: 'USPSA', href: '/activities/uspsa' },
    { name: 'Vintage Military Rifle/Pistol', href: '/activities/vintage-military' },
  ];

  return (
    <PageContainer
      title="Activities & Disciplines"
      subtitle="Explore our wide range of shooting sports and competitions"
    >
      <div className="bg-white rounded-lg shadow-md p-8">
        <p className="text-gray-600 mb-8">
          We run activities and competitions for various shooting disciplines throughout the year.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {activities.map((activity, index) => (
            <Link
              key={index}
              href={activity.href}
              className="p-4 border border-gray-200 rounded-lg hover:border-blue-500 hover:shadow-md transition"
            >
              <h3 className="font-semibold text-gray-900 hover:text-blue-600">
                {activity.name}
              </h3>
            </Link>
          ))}
        </div>
      </div>
    </PageContainer>
  );
}
