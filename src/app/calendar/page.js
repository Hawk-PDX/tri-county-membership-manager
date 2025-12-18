import PageContainer from '@/components/PageContainer';

export default function CalendarPage() {
  return (
    <PageContainer
      title="Event Calendar"
      subtitle="Events, competitions, and activities"
    >
      <div className="bg-white rounded-lg shadow-md p-8">
        <p className="text-gray-600 mb-6">
          Event calendar coming soon.
        </p>
        
        <div className="border-t pt-6">
          <h2 className="text-2xl font-bold mb-4">Upcoming Events</h2>
          <p className="text-gray-600">
            Calendar integration coming soon. Contact the club office for current event schedules.
          </p>
        </div>
      </div>
    </PageContainer>
  );
}
