import { useState } from 'react';
import {
  LayoutDashboard,
  Users,
  TrendingUp,
  KanbanSquare,
  MessageSquare,
  CalendarDays,
  BarChart3,
  Shield,
  Building2,
  Menu,
  X,
} from 'lucide-react';
import { useStore } from './store/useStore';
import { Login } from './components/Login';
import { Header } from './components/Header';
import { Dashboard } from './components/Dashboard';
import { ContactsNew } from './components/ContactsNew';
import { Funnels } from './components/Funnels';
import { Kanban } from './components/Kanban';
import { Calendar } from './components/Calendar';
import { Chat } from './components/Chat';
import { Statistics } from './components/Statistics';
import { AdminPanel } from './components/AdminPanel';

type ViewType =
  | 'dashboard'
  | 'contacts'
  | 'funnels'
  | 'kanban'
  | 'calendar'
  | 'chat'
  | 'statistics'
  | 'admin';

export default function App() {
  const currentUser = useStore((state) => state.currentUser);
  const [currentView, setCurrentView] = useState<ViewType>('dashboard');
  const [sidebarOpen, setSidebarOpen] = useState(true);

  if (!currentUser) {
    return <Login />;
  }

  const navigation = [
    { name: 'Дашборд', icon: LayoutDashboard, view: 'dashboard' as ViewType, roles: ['admin', 'manager', 'supervisor'] },
    { name: 'Клиенты', icon: Users, view: 'contacts' as ViewType, roles: ['admin', 'manager', 'supervisor'] },
    { name: 'Воронки', icon: TrendingUp, view: 'funnels' as ViewType, roles: ['admin', 'manager', 'supervisor'] },
    { name: 'Канбан', icon: KanbanSquare, view: 'kanban' as ViewType, roles: ['admin', 'manager', 'supervisor'] },
    { name: 'Календарь', icon: CalendarDays, view: 'calendar' as ViewType, roles: ['admin', 'manager', 'supervisor'] },
    { name: 'Чат', icon: MessageSquare, view: 'chat' as ViewType, roles: ['manager', 'supervisor'] },
    { name: 'Статистика', icon: BarChart3, view: 'statistics' as ViewType, roles: ['admin', 'manager', 'supervisor'] },
    { name: 'Админ панель', icon: Shield, view: 'admin' as ViewType, roles: ['admin'] },
  ];

  const availableNavigation = navigation.filter((item) =>
    item.roles.includes(currentUser.role)
  );

  const renderView = () => {
    switch (currentView) {
      case 'dashboard':
        return <Dashboard />;
      case 'contacts':
        return <ContactsNew />;
      case 'funnels':
        return <Funnels />;
      case 'kanban':
        return <Kanban />;
      case 'calendar':
        return <Calendar />;
      case 'chat':
        return <Chat />;
      case 'statistics':
        return <Statistics />;
      case 'admin':
        return <AdminPanel />;
      default:
        return <Dashboard />;
    }
  };

  return (
    <div className="size-full flex bg-gray-50">
      <aside
        className={`${
          sidebarOpen ? 'w-64' : 'w-20'
        } bg-gray-900 text-white flex flex-col transition-all duration-300`}
      >
        <div className="p-4 flex items-center justify-between">
          {sidebarOpen && (
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                <Building2 className="w-5 h-5" />
              </div>
              <span className="font-bold text-lg">CRM Система</span>
            </div>
          )}
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="p-2 hover:bg-gray-800 rounded-lg"
          >
            {sidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>

        <nav className="flex-1 px-2 py-4 space-y-2">
          {availableNavigation.map((item) => {
            const Icon = item.icon;
            const isActive = currentView === item.view;
            return (
              <button
                key={item.name}
                onClick={() => setCurrentView(item.view)}
                className={`w-full flex items-center gap-3 px-3 py-3 rounded-lg transition-colors ${
                  isActive
                    ? 'bg-blue-600 text-white'
                    : 'text-gray-300 hover:bg-gray-800 hover:text-white'
                }`}
              >
                <Icon className="w-5 h-5 flex-shrink-0" />
                {sidebarOpen && <span className="font-medium">{item.name}</span>}
              </button>
            );
          })}
        </nav>

        {sidebarOpen && (
          <div className="p-4 border-t border-gray-800">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white font-semibold">
                {currentUser.firstName[0]}
                {currentUser.lastName[0]}
              </div>
              <div>
                <p className="font-medium">
                  {currentUser.firstName} {currentUser.lastName}
                </p>
                <p className="text-sm text-gray-400">
                  {currentUser.role === 'admin'
                    ? 'Администратор'
                    : currentUser.role === 'supervisor'
                    ? 'Руководитель'
                    : 'Менеджер'}
                </p>
              </div>
            </div>
          </div>
        )}
      </aside>

      <main className="flex-1 flex flex-col overflow-hidden">
        <Header />
        <div className="flex-1 overflow-auto">{renderView()}</div>
      </main>
    </div>
  );
}