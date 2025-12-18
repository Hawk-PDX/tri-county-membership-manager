import PageContainer from '@/components/PageContainer';
import Link from 'next/link';

export default function MembersPage() {
  const memberResources = [
    { name: 'Member Portal', href: '/members/portal', description: 'Access your member dashboard' },
    { name: 'Meetings', href: '/members/meetings', description: 'Club meeting schedules and minutes' },
    { name: 'Newsletter', href: '/members/newsletter', description: 'Member newsletters and updates' },
    { name: 'Officials', href: '/members/officials', description: 'Club leadership and contacts' },
    { name: 'Official Documents', href: '/members/documents', description: 'Bylaws, policies, and procedures' },
    { name: 'Policies and Procedures', href: '/members/policies', description: 'Club governance and rules' },
    { name: 'Guest Waiver Release Form', href: '/members/guest-waiver', description: 'Download guest waiver form' },
    { name: 'FFL Firearm Transfer Form', href: '/members/ffl-transfer', description: 'Firearm transfer documentation' },
  ];

  return (
    <PageContainer
      title="Members Only"
      subtitle="Exclusive resources for club members"
    >
      <div className="bg-yellow-50 border-l-4 border-yellow-400 p-6 mb-8">
        <div className="flex">
          <div className="flex-shrink-0">
            <svg className="h-6 w-6 text-yellow-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </div>
          <div className="ml-3">
            <p className="text-sm text-yellow-700">
              <strong>Members Only Area:</strong> Some resources require member authentication. 
              Please log in to access all member benefits.
            </p>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-md p-8 mb-8">
        <h2 className="text-2xl font-bold mb-4">Member Resources</h2>
        <p className="text-gray-600">
          Access exclusive member content, documents, forms, and club information. 
          Stay connected with club activities and leadership.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {memberResources.map((resource, index) => (
          <Link
            key={index}
            href={resource.href}
            className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition"
          >
            <h3 className="text-xl font-bold mb-2 text-gray-900 hover:text-blue-600">
              {resource.name}
            </h3>
            <p className="text-gray-600">{resource.description}</p>
          </Link>
        ))}
      </div>
    </PageContainer>
  );
}
