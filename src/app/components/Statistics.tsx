import { useState } from 'react';
import { useStore } from '../store/useStore';
import { TrendingUp, Users, CalendarDays, CheckCircle } from 'lucide-react';
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';

export function Statistics() {
  const contacts = useStore((state) => state.contacts);
  const events = useStore((state) => state.events);
  const funnels = useStore((state) => state.funnels);
  const currentUser = useStore((state) => state.currentUser);
  const users = useStore((state) => state.users);

  const [period, setPeriod] = useState<'week' | 'month' | 'quarter'>('month');

  const getContactsByFunnel = () => {
    return funnels.map((funnel) => ({
      name: funnel.name,
      value: contacts.filter((c) => c.funnelId === funnel.id).length,
      color: `#${Math.floor(Math.random() * 16777215).toString(16)}`,
    }));
  };

  const getContactsOverTime = () => {
    const data = [];
    const now = new Date();
    const periods = period === 'week' ? 7 : period === 'month' ? 30 : 90;

    for (let i = periods - 1; i >= 0; i--) {
      const date = new Date(now);
      date.setDate(date.getDate() - i);
      const dateStr = date.toISOString().split('T')[0];

      const count = contacts.filter((c) => {
        const createdDate = new Date(c.createdAt).toISOString().split('T')[0];
        return createdDate <= dateStr;
      }).length;

      data.push({
        date: date.toLocaleDateString('ru-RU', { day: 'numeric', month: 'short' }),
        contacts: count,
      });
    }

    return data;
  };

  const getEventsByManager = () => {
    const managerCounts = new Map<string, number>();

    users.forEach((user) => {
      if (user.role !== 'admin') {
        const count = events.filter((e) => e.managerId === user.id).length;
        managerCounts.set(`${user.firstName} ${user.lastName}`, count);
      }
    });

    return Array.from(managerCounts.entries()).map(([name, count]) => ({
      name,
      events: count,
    }));
  };

  const totalContacts = contacts.length;
  const totalEvents = events.length;
  const activeManagers = users.filter(
    (u) => u.role === 'manager' && u.status === 'working'
  ).length;
  const completedEventsThisMonth = events.filter((e) => {
    const eventDate = new Date(e.endDate);
    const now = new Date();
    return (
      eventDate < now &&
      eventDate.getMonth() === now.getMonth() &&
      eventDate.getFullYear() === now.getFullYear()
    );
  }).length;

  const funnelData = getContactsByFunnel();
  const timelineData = getContactsOverTime();
  const managerData = getEventsByManager();

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Статистика</h1>
          <p className="text-gray-600 mt-1">Аналитика и показатели эффективности</p>
        </div>
        <div className="flex gap-2">
          {(['week', 'month', 'quarter'] as const).map((p) => (
            <button
              key={p}
              onClick={() => setPeriod(p)}
              className={`px-4 py-2 rounded-lg ${
                period === p
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {p === 'week' ? 'Неделя' : p === 'month' ? 'Месяц' : 'Квартал'}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Всего клиентов</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">{totalContacts}</p>
            </div>
            <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
              <Users className="w-6 h-6 text-blue-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Всего событий</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">{totalEvents}</p>
            </div>
            <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
              <CalendarDays className="w-6 h-6 text-purple-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Активные менеджеры</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">{activeManagers}</p>
            </div>
            <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
              <TrendingUp className="w-6 h-6 text-green-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Завершено за месяц</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">
                {completedEventsThisMonth}
              </p>
            </div>
            <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center">
              <CheckCircle className="w-6 h-6 text-orange-600" />
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">
            Динамика клиентов
          </h2>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={timelineData}>
              <CartesianGrid strokeDasharray="3 3" key="grid-timeline" />
              <XAxis dataKey="date" key="xaxis-timeline" />
              <YAxis key="yaxis-timeline" />
              <Tooltip key="tooltip-timeline" />
              <Legend key="legend-timeline" />
              <Line
                type="monotone"
                dataKey="contacts"
                stroke="#3b82f6"
                strokeWidth={2}
                name="Клиенты"
                key="line-contacts"
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">
            Распределение по воронкам
          </h2>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={funnelData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, value }) => `${name}: ${value}`}
                outerRadius={100}
                fill="#8884d8"
                dataKey="value"
                key="pie-funnels"
              >
                {funnelData.map((entry) => (
                  <Cell key={`cell-${entry.name}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip key="tooltip-pie" />
            </PieChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-white rounded-lg shadow p-6 lg:col-span-2">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">
            События по менеджерам
          </h2>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={managerData}>
              <CartesianGrid strokeDasharray="3 3" key="grid-managers" />
              <XAxis dataKey="name" key="xaxis-managers" />
              <YAxis key="yaxis-managers" />
              <Tooltip key="tooltip-managers" />
              <Legend key="legend-managers" />
              <Bar dataKey="events" fill="#8b5cf6" name="События" key="bar-events" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {currentUser?.role === 'admin' && (
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">
            Общая информация
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 bg-blue-50 rounded-lg">
              <p className="text-sm text-blue-700">Воронок</p>
              <p className="text-2xl font-bold text-blue-900">{funnels.length}</p>
            </div>
            <div className="p-4 bg-purple-50 rounded-lg">
              <p className="text-sm text-purple-700">Пользователей</p>
              <p className="text-2xl font-bold text-purple-900">{users.length}</p>
            </div>
            <div className="p-4 bg-green-50 rounded-lg">
              <p className="text-sm text-green-700">Конверсия</p>
              <p className="text-2xl font-bold text-green-900">
                {totalContacts > 0
                  ? Math.round((completedEventsThisMonth / totalContacts) * 100)
                  : 0}
                %
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
