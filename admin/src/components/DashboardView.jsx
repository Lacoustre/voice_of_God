import StatCard from "./StatCard";
import EventsList from "./EventsList";
import QuickActions from "./QuickActions";
import RecentAnnouncements from "./RecentAnnouncements";
import UpcomingServices from "./UpcomingServices";
import MessagePreview from "./MessagePreview";

const DashboardView = ({ stats, events, loading }) => {
  return (
    <div className="h-[calc(100vh-120px)] p-6 flex flex-col gap-4">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, index) => (
          <StatCard
            key={index}
            title={stat.title}
            value={stat.value}
            icon={stat.icon}
            color={stat.color}
            loading={loading}
          />
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 flex-1 min-h-0">
        <div className="lg:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-4 h-full">
          <div className="bg-white rounded-xl shadow p-4 flex flex-col h-full" style={{borderColor: 'rgb(217, 143, 53)', borderWidth: '1px', borderStyle: 'solid'}}>
            <EventsList events={events} />
          </div>
          <div className="space-y-4 flex flex-col h-full">
            <div className="flex-1">
              <RecentAnnouncements />
            </div>
            <div className="flex-1">
              <UpcomingServices />
            </div>
          </div>
        </div>
        <div className="space-y-4 flex flex-col h-full">
          <div className="bg-white rounded-xl shadow p-4" style={{borderColor: 'rgb(217, 143, 53)', borderWidth: '1px', borderStyle: 'solid'}}>
            <QuickActions />
          </div>
          <div className="bg-white rounded-xl shadow p-4 flex-1" style={{borderColor: 'rgb(217, 143, 53)', borderWidth: '1px', borderStyle: 'solid'}}>
            <MessagePreview />
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardView;
