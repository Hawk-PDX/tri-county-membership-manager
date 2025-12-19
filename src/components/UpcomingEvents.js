import Link from 'next/link';

const upcomingEvents = [
  {
    id: 1,
    date: 'Dec 20',
    time: '9:00 AM',
    title: 'Basic Pistol Class',
    location: 'Indoor Range'
  },
  {
    id: 2,
    date: 'Dec 21',
    time: '10:00 AM',
    title: 'High Power Rifle Match',
    location: '200/300 Range'
  },
  {
    id: 3,
    date: 'Dec 27',
    time: '1:00 PM',
    title: 'USPSA Match',
    location: 'Action Bay'
  },
  {
    id: 4,
    date: 'Jan 3',
    time: '9:00 AM',
    title: 'Concealed Carry Permit Class',
    location: 'Training Room'
  },
  {
    id: 5,
    date: 'Jan 5',
    time: '8:00 AM',
    title: 'IDPA Match',
    location: 'Action Bay'
  }
];

export default function UpcomingEvents() {
  return (
    <div className="bg-gray-800 rounded-xl shadow-xl shadow-black/50 overflow-hidden hover:shadow-[#009f1e]/30 transition-all border-t-4 border-[#009f1e]">
      <div className="p-8">
        <div className="flex items-center gap-3 mb-6">
          <div className="text-4xl">📅</div>
          <h3 className="text-3xl font-bold text-white">Upcoming Events</h3>
        </div>
        
        <div className="space-y-3">
          {upcomingEvents.map((event) => (
            <div
              key={event.id}
              className="group p-4 rounded-lg bg-gray-900 hover:bg-gray-700 transition-all border-l-4 border-[#009f1e]"
            >
              <div className="flex items-start gap-3">
                <div className="flex-shrink-0">
                  <div className="bg-[#009f1e] text-white px-3 py-2 rounded-lg text-center min-w-[60px]">
                    <div className="text-xs font-bold">{event.date.split(' ')[0]}</div>
                    <div className="text-lg font-bold">{event.date.split(' ')[1]}</div>
                  </div>
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="font-bold text-white mb-1 group-hover:text-[#009f1e] transition-colors">{event.title}</h4>
                  <div className="flex flex-col gap-1 text-sm text-gray-400">
                    <span className="flex items-center gap-1">
                      <span>🕐</span> {event.time}
                    </span>
                    <span className="flex items-center gap-1">
                      <span>📍</span> {event.location}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
        
        <div className="mt-8 text-center">
          <Link
            href="/calendar"
            className="inline-block bg-[#009f1e] hover:bg-[#238213] text-white font-bold px-8 py-3 rounded-lg transition-all hover:scale-105 hover:shadow-lg"
          >
            View Full Calendar →
          </Link>
        </div>
      </div>
    </div>
  );
}
