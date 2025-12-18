import PageContainer from '@/components/PageContainer';
import Link from 'next/link';

export default function TrainingPage() {
  return (
    <PageContainer
      title="Training & Certification"
      subtitle="Professional instruction for all skill levels"
    >
      <div className="bg-white rounded-lg shadow-md p-8 mb-8">
        <p className="text-gray-600 mb-4">
          Our certified instructors offer comprehensive training programs from basic safety 
          to advanced tactical skills. Whether you're a first-time shooter or an experienced 
          competitor, we have courses to help you develop your skills.
        </p>
        <Link
          href="/training/online-registration"
          className="inline-block bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-semibold transition"
        >
          Online Course Registration
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-xl font-bold mb-3">Certification Programs</h3>
          <ul className="space-y-2">
            <li>
              <Link href="/training/certification/action-range-process" className="text-blue-600 hover:text-blue-800">
                Action Range Certification Process
              </Link>
            </li>
            <li>
              <Link href="/training/certification/action-range" className="text-blue-600 hover:text-blue-800">
                Action Range Certification
              </Link>
            </li>
            <li>
              <Link href="/training/certification/practical-rifle-orientation" className="text-blue-600 hover:text-blue-800">
                Practical Rifle Orientation
              </Link>
            </li>
          </ul>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-xl font-bold mb-3">Pistol Training</h3>
          <ul className="space-y-2">
            <li>
              <Link href="/training/pistol/action-shooting-fundamentals" className="text-blue-600 hover:text-blue-800">
                Action Shooting Fundamentals
              </Link>
            </li>
            <li>
              <Link href="/training/pistol/concealed-carry" className="text-blue-600 hover:text-blue-800">
                Concealed Carry - Multi-State
              </Link>
            </li>
          </ul>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-xl font-bold mb-3">Rifle & Shotgun</h3>
          <ul className="space-y-2">
            <li>
              <Link href="/training/rifle" className="text-blue-600 hover:text-blue-800">
                Rifle Training
              </Link>
            </li>
            <li>
              <Link href="/training/shotgun-fundamentals" className="text-blue-600 hover:text-blue-800">
                Shotgun Key & Fundamentals
              </Link>
            </li>
          </ul>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-xl font-bold mb-3">Special Programs</h3>
          <ul className="space-y-2">
            <li>
              <Link href="/training/oregon-hunters-education" className="text-blue-600 hover:text-blue-800">
                Oregon Hunters Education
              </Link>
            </li>
            <li>
              <Link href="/training/youth-series-rifle" className="text-blue-600 hover:text-blue-800">
                Youth Series Training: Introduction to Rifle
              </Link>
            </li>
          </ul>
        </div>
      </div>
    </PageContainer>
  );
}
