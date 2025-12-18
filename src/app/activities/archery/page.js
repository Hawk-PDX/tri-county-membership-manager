import DynamicPage from '@/components/DynamicPage';

export default function ArcheryPage() {
  return (
    <DynamicPage
      title="Archery"
      subtitle="Indoor and outdoor archery ranges for all skill levels"
      content={
        <>
          <h2 className="text-2xl font-bold mb-4">Archery Ranges</h2>
          <p className="text-gray-600 mb-4">
            Indoor and outdoor archery ranges for target practice and competition.
          </p>

          <h3 className="text-xl font-bold mb-3 mt-6">What We Have</h3>
          <ul className="list-disc list-inside text-gray-600 mb-4 space-y-2">
            <li>Indoor range</li>
            <li>Outdoor field course</li>
            <li>Various target distances</li>
            <li>Equipment rentals</li>
          </ul>

          <p className="text-gray-600 mt-6">
            Check the calendar for range times and events.
          </p>
        </>
      }
    />
  );
}
