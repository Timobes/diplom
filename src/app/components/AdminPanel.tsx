import { useState } from 'react';
import { useStore, User } from '../store/useStore';
import { Plus, Edit, Trash2, Shield, Users as UsersIcon } from 'lucide-react';
import { Modal, PrimaryButton, SecondaryButton, Label, inputCls } from './ui-kit';

export function AdminPanel() {
  const users = useStore((state) => state.users);
  const addUser = useStore((state) => state.addUser);
  const updateUser = useStore((state) => state.updateUser);
  const deleteUser = useStore((state) => state.deleteUser);

  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [activeTab, setActiveTab] = useState(0);
  const [formData, setFormData] = useState({
    email: '',
    firstName: '',
    lastName: '',
    role: 'manager' as 'admin' | 'manager' | 'supervisor',
    supervisorId: '',
  });

  const handleOpenDialog = (user?: User) => {
    if (user) {
      setSelectedUser(user);
      setFormData({
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        role: user.role,
        supervisorId: user.supervisorId || '',
      });
    } else {
      setSelectedUser(null);
      setFormData({
        email: '',
        firstName: '',
        lastName: '',
        role: 'manager',
        supervisorId: '',
      });
    }
    setDialogOpen(true);
  };

  const handleSave = () => {
    if (!formData.email || !formData.firstName || !formData.lastName) {
      alert('Заполните все обязательные поля');
      return;
    }

    const userData = {
      ...formData,
      status: 'working' as const,
    };

    if (selectedUser) {
      updateUser(selectedUser.id, userData);
    } else {
      addUser(userData);
    }
    setDialogOpen(false);
  };

  const handleDelete = (id: string) => {
    if (confirm('Вы уверены, что хотите удалить этого пользователя?')) {
      deleteUser(id);
    }
  };

  const supervisors = users.filter((u) => u.role === 'supervisor');
  const managers = users.filter((u) => u.role === 'manager');

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

  const getRoleBadgeColor = (role: string) => {
    switch (role) {
      case 'admin':
        return 'bg-red-100 text-red-800';
      case 'supervisor':
        return 'bg-purple-100 text-purple-800';
      case 'manager':
        return 'bg-blue-100 text-blue-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const UserCard = ({ user }: { user: User }) => {
    const supervisor = users.find((u) => u.id === user.supervisorId);
    const assignedManagers = users.filter((u) => u.supervisorId === user.id);

    return (
      <div className="bg-white rounded-lg shadow-lg p-6">
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center text-white font-semibold text-lg">
              {user.firstName[0]}
              {user.lastName[0]}
            </div>
            <div>
              <h3 className="font-semibold text-gray-900">
                {user.firstName} {user.lastName}
              </h3>
              <p className="text-sm text-gray-600">{user.email}</p>
            </div>
          </div>
          <div className="flex gap-1">
            <button
              onClick={() => handleOpenDialog(user)}
              className="p-1.5 rounded-lg text-gray-500 hover:bg-gray-100 transition-colors"
            >
              <Edit className="w-4 h-4" />
            </button>
            <button
              onClick={() => handleDelete(user.id)}
              className="p-1.5 rounded-lg text-red-600 hover:bg-red-50 transition-colors"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        </div>

        <div className="space-y-2">
          <span
            className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${getRoleBadgeColor(
              user.role
            )}`}
          >
            {getRoleText(user.role)}
          </span>

          {supervisor && (
            <p className="text-sm text-gray-600">
              Руководитель: {supervisor.firstName} {supervisor.lastName}
            </p>
          )}

          {assignedManagers.length > 0 && (
            <div className="pt-3 border-t border-gray-200">
              <p className="text-sm font-medium text-gray-700 mb-2">
                Менеджеры ({assignedManagers.length}):
              </p>
              <div className="space-y-1">
                {assignedManagers.map((manager) => (
                  <p key={manager.id} className="text-sm text-gray-600">
                    • {manager.firstName} {manager.lastName}
                  </p>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Админ панель</h1>
          <p className="text-gray-600 mt-1">Управление пользователями системы</p>
        </div>
        <button
          onClick={() => handleOpenDialog()}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center gap-2"
        >
          <Plus className="w-5 h-5" />
          Добавить пользователя
        </button>
      </div>

      <div className="bg-white rounded-lg shadow p-1 inline-flex gap-1">
        <button
          onClick={() => setActiveTab(0)}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-colors ${
            activeTab === 0 ? 'bg-blue-600 text-white' : 'text-gray-600 hover:bg-gray-100'
          }`}
        >
          <Shield className="w-4 h-4" />
          Руководители ({supervisors.length})
        </button>
        <button
          onClick={() => setActiveTab(1)}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-colors ${
            activeTab === 1 ? 'bg-blue-600 text-white' : 'text-gray-600 hover:bg-gray-100'
          }`}
        >
          <UsersIcon className="w-4 h-4" />
          Менеджеры ({managers.length})
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {activeTab === 0
          ? supervisors.map((user) => <UserCard key={user.id} user={user} />)
          : managers.map((user) => <UserCard key={user.id} user={user} />)}
      </div>

      {((activeTab === 0 && supervisors.length === 0) ||
        (activeTab === 1 && managers.length === 0)) && (
        <div className="text-center py-12 bg-white rounded-lg shadow">
          <p className="text-gray-500">Нет пользователей в этой категории</p>
        </div>
      )}

      <Modal
        open={dialogOpen}
        onClose={() => setDialogOpen(false)}
        title={selectedUser ? 'Редактировать пользователя' : 'Добавить пользователя'}
        footer={
          <>
            <SecondaryButton onClick={() => setDialogOpen(false)}>Отмена</SecondaryButton>
            <PrimaryButton onClick={handleSave}>
              {selectedUser ? 'Сохранить' : 'Создать'}
            </PrimaryButton>
          </>
        }
      >
        <div className="space-y-4">
          <div>
            <Label>Email *</Label>
            <input
              type="email"
              className={inputCls}
              placeholder="example@crm.com"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label>Имя *</Label>
              <input
                className={inputCls}
                value={formData.firstName}
                onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
              />
            </div>
            <div>
              <Label>Фамилия *</Label>
              <input
                className={inputCls}
                value={formData.lastName}
                onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
              />
            </div>
          </div>
          <div>
            <Label>Роль *</Label>
            <select
              className={inputCls}
              value={formData.role}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  role: e.target.value as 'admin' | 'manager' | 'supervisor',
                })
              }
            >
              <option value="manager">Менеджер</option>
              <option value="supervisor">Руководитель</option>
              <option value="admin">Администратор</option>
            </select>
          </div>
          {formData.role === 'manager' && (
            <div>
              <Label>Руководитель</Label>
              <select
                className={inputCls}
                value={formData.supervisorId}
                onChange={(e) =>
                  setFormData({ ...formData, supervisorId: e.target.value })
                }
              >
                <option value="">Не назначен</option>
                {supervisors.map((supervisor) => (
                  <option key={supervisor.id} value={supervisor.id}>
                    {supervisor.firstName} {supervisor.lastName}
                  </option>
                ))}
              </select>
            </div>
          )}
        </div>
      </Modal>
    </div>
  );
}
