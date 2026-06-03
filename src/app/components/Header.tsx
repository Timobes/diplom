import { useState } from 'react';
import { useStore } from '../store/useStore';
import { LogOut, Circle } from 'lucide-react';
import { Modal, SecondaryButton } from './ui-kit';

export function Header() {
  const currentUser = useStore((state) => state.currentUser);
  const logout = useStore((state) => state.logout);
  const setUserStatus = useStore((state) => state.setUserStatus);
  const [statusDialogOpen, setStatusDialogOpen] = useState(false);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'working':
        return 'text-green-600';
      case 'break':
        return 'text-orange-600';
      case 'day_end':
        return 'text-gray-600';
      default:
        return 'text-gray-600';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'working':
        return 'Работаю';
      case 'break':
        return 'Перерыв';
      case 'day_end':
        return 'Конец дня';
      default:
        return '';
    }
  };

  const handleStatusChange = (status: 'working' | 'break' | 'day_end') => {
    setUserStatus(status);
    setStatusDialogOpen(false);
  };

  const getRoleText = (role: string) => {
    switch (role) {
      case 'admin':
        return 'Администратор';
      case 'supervisor':
        return 'Руководитель';
      case 'manager':
        return 'Менеджер';
      default:
        return '';
    }
  };

  if (!currentUser) return null;

  return (
    <>
      <header className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-semibold text-gray-900">
              Добро пожаловать, {currentUser.firstName}!
            </h2>
            <p className="text-sm text-gray-600">{getRoleText(currentUser.role)}</p>
          </div>

          <div className="flex items-center gap-4">
            <button
              onClick={() => setStatusDialogOpen(true)}
              className="flex items-center gap-2 px-4 py-2 rounded-lg border border-gray-300 hover:bg-gray-50"
            >
              <Circle className={`w-3 h-3 fill-current ${getStatusColor(currentUser.status)}`} />
              <span className="text-sm">{getStatusText(currentUser.status)}</span>
            </button>

            <button
              onClick={logout}
              className="flex items-center gap-2 px-4 py-2 rounded-lg bg-red-600 hover:bg-red-700 text-white"
            >
              <LogOut className="w-4 h-4" />
              Выйти
            </button>
          </div>
        </div>
      </header>

      <Modal
        open={statusDialogOpen}
        onClose={() => setStatusDialogOpen(false)}
        title="Изменить статус"
        maxWidth="max-w-sm"
        footer={
          <SecondaryButton onClick={() => setStatusDialogOpen(false)}>
            Отмена
          </SecondaryButton>
        }
      >
        <div className="space-y-3">
          {(['working', 'break', 'day_end'] as const).map((status) => (
            <button
              key={status}
              onClick={() => handleStatusChange(status)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg border-2 transition-all ${
                currentUser.status === status
                  ? 'border-blue-600 bg-blue-50'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              <Circle className={`w-3 h-3 fill-current ${getStatusColor(status)}`} />
              <span className="font-medium">{getStatusText(status)}</span>
            </button>
          ))}
        </div>
      </Modal>
    </>
  );
}
