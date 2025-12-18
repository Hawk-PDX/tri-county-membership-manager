import PageContainer from '@/components/PageContainer';
import Link from 'next/link';

export default function AboutPage() {
  const aboutLinks = [
    { name: 'TCGC Tour', href: '/about/tour', description: 'Take a virtual tour of our facilities' },
    { name: 'How to Join the Club', href: '/about/join', description: 'Membership application and requirements' },
    { name: 'Hours and Directions', href: '/about/hours-directions', description: 'Find us and plan your visit' },
    { name: 'Membership', href: '/about/membership', description: 'Membership benefits and options' },
    { name: 'Member Support', href: '/about/member-support', description: 'Resources and assistance for members' },
    { name: 'Safety and Range Rules', href: '/about/safety-rules', description: 'Essential safety guidelines' },
    { name: 'Proshop/FFL', href: '/about/proshop', description: 'On-site pro shop and FFL services' },
    { name: 'Contact Us', href: '/about/contact', description: 'Get in touch with us' },
  ];

  return (
    <PageContainer
      title="About Tri-County Gun Club"
      subtitle="Oregon's premier shooting sports facility"
    >
      <div className="bg-white rounded-lg shadow-md p-8 mb-8">
        <h2 className="text-2xl font-bold mb-4">Welcome to Our Club</h2>
        <p className="text-gray-600 mb-4">
          Tri-County Gun Club is dedicated to promoting safe, responsible shooting sports 
          and providing world-class facilities for our members and guests. With a rich history 
          and commitment to excellence, we serve shooters of all skill levels.
        </p>
        <p className="text-gray-600">
          Whether you're interested in competitive shooting, recreational practice, or 
          professional training, our facilities and programs are designed to meet your needs.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {aboutLinks.map((link, index) => (
          <Link
            key={index}
            href={link.href}
            className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition"
          >
            <h3 className="text-xl font-bold mb-2 text-gray-900 hover:text-blue-600">
              {link.name}
            </h3>
            <p className="text-gray-600">{link.description}</p>
          </Link>
        ))}
      </div>
    </PageContainer>
  );
}
