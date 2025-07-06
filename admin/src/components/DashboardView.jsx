import StatCard from "./StatCard";
import EventsList from "./EventsList";
import QuickActions from "./QuickActions";

const DashboardView = ({ stats, events, loading }) => {
  return (
    <div className="min-h-full p-6 space-y-6">
      <div className="bg-gradient-to-r from-indigo-600 to-purple-600 rounded-xl p-6 text-white">
        <h2 className="text-2xl font-bold mb-2">
          Welcome to Voice of God Admin Panel
        </h2>
        <p className="text-indigo-100">
          Manage your ministry with faith and excellence
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
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

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 h-[32rem] overflow-y-auto bg-white rounded-xl shadow p-4">
          <EventsList events={events} />
        </div>
        <div className="h-[32rem] overflow-y-auto bg-white rounded-xl shadow p-4">
          <QuickActions />
        </div>
      </div>
    </div>
  );
};

export default DashboardView;
