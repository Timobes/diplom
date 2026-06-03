import { useStore } from '../store/useStore';
import { TrendingUp, Users, CalendarDays, MessageSquare } from 'lucide-react';
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';

export function Dashboard() {
  const contacts = useStore((state) => state.contacts);
  const funnels = useStore((state) => state.funnels);
  const events = useStore((state) => state.events);
  const chatMessages = useStore((state) => state.chatMessages);
  const currentUser = useStore((state) => state.currentUser);

  const getContactsOverTime = () => {
    const data = [];
    const now = new Date();

    for (let i = 6; i >= 0; i--) {
      const date = new Date(now);
      date.setDate(date.getDate() - i);
      const dateStr = date.toISOString().split('T')[0];

      const count = contacts.filter((c) => {
        const createdDate = new Date(c.createdAt).toISOString().split('T')[0];
        return createdDate === dateStr;
      }).length;

      data.push({
        date: date.toLocaleDateString('ru-RU', { day: 'numeric', month: 'short' }),
        contacts: count,
      });
    }

    return data;
  };

  const getContactsByFunnel = () => {
    return funnels.map((funnel) => ({
      name: funnel.name,
      count: contacts.filter((c) => c.funnelId === funnel.id).length,
    }));
  };

  const upcomingEvents = events
    .filter((e) => new Date(e.startDate) > new Date())
    .sort((a, b) => new Date(a.startDate).getTime() - new Date(b.startDate).getTime())
    .slice(0, 5);

  const recentMessages = chatMessages
    .slice(-5)
    .reverse();

  const timelineData = getContactsOverTime();
  const funnelData = getContactsByFunnel();

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">
          Добро пожаловать, {currentUser?.firstName}!
        </h1>
        <p className="text-gray-600 mt-1">Вот обзор вашей CRM системы</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Всего клиентов</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">{contacts.length}</p>
            </div>
            <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
              <Users className="w-6 h-6 text-blue-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Воронок продаж</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">{funnels.length}</p>
            </div>
            <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
              <TrendingUp className="w-6 h-6 text-purple-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Событий</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">{events.length}</p>
            </div>
            <div className="w-12 h-12 bg-pink-100 rounded-full flex items-center justify-center">
              <CalendarDays className="w-6 h-6 text-pink-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Сообщений</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">
                {chatMessages.length}
              </p>
            </div>
            <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
              <MessageSquare className="w-6 h-6 text-green-600" />
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">
            Новые клиенты за неделю
          </h2>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={timelineData}>
              <CartesianGrid strokeDasharray="3 3" key="grid-dashboard" />
              <XAxis dataKey="date" key="xaxis-dashboard" />
              <YAxis key="yaxis-dashboard" />
              <Tooltip key="tooltip-dashboard" />
              <Legend key="legend-dashboard" />
              <Line
                type="monotone"
                dataKey="contacts"
                stroke="#3b82f6"
                strokeWidth={2}
                name="Клиенты"
                key="line-contacts-dashboard"
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">
            Клиенты по воронкам
          </h2>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={funnelData}>
              <CartesianGrid strokeDasharray="3 3" key="grid-funnel" />
              <XAxis dataKey="name" key="xaxis-funnel" />
              <YAxis key="yaxis-funnel" />
              <Tooltip key="tooltip-funnel" />
              <Legend key="legend-funnel" />
              <Bar dataKey="count" fill="#8b5cf6" name="Клиенты" key="bar-funnel" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">
            Предстоящие события
          </h2>
          <div className="space-y-3">
            {upcomingEvents.map((event) => (
              <div
                key={event.id}
                className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg"
              >
                <CalendarDays className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                <div className="flex-1">
                  <p className="font-medium text-gray-900">{event.title}</p>
                  <p className="text-sm text-gray-600">
                    {new Date(event.startDate).toLocaleString('ru-RU')}
                  </p>
                </div>
              </div>
            ))}
            {upcomingEvents.length === 0 && (
              <p className="text-center text-gray-500 py-8">
                Нет предстоящих событий
              </p>
            )}
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">
            Последние сообщения
          </h2>
          <div className="space-y-3">
            {recentMessages.map((message) => {
              const contact = contacts.find((c) => c.id === message.contactId);
              return (
                <div
                  key={message.id}
                  className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg"
                >
                  <MessageSquare className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                  <div className="flex-1">
                    <p className="font-medium text-gray-900">
                      {contact
                        ? `${contact.firstName} ${contact.lastName}`
                        : 'Клиент'}
                    </p>
                    <p className="text-sm text-gray-600 truncate">{message.text}</p>
                  </div>
                </div>
              );
            })}
            {recentMessages.length === 0 && (
              <p className="text-center text-gray-500 py-8">Нет сообщений</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
