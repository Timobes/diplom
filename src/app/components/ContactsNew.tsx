import { useState } from 'react';
import { useStore, Contact } from '../store/useStore';
import {
  Plus,
  Search,
  Edit,
  Trash2,
  Mail,
  Phone,
  Building2,
  MessageSquare,
  User,
} from 'lucide-react';
import { Modal, PrimaryButton, SecondaryButton, Label, inputCls } from './ui-kit';

export function ContactsNew() {
  const contacts = useStore((state) => state.contacts);
  const addContact = useStore((state) => state.addContact);
  const updateContact = useStore((state) => state.updateContact);
  const deleteContact = useStore((state) => state.deleteContact);
  const addContactComment = useStore((state) => state.addContactComment);
  const currentUser = useStore((state) => state.currentUser);
  const funnels = useStore((state) => state.funnels);

  const [dialogOpen, setDialogOpen] = useState(false);
  const [commentsDialogOpen, setCommentsDialogOpen] = useState(false);
  const [selectedContact, setSelectedContact] = useState<Contact | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [newComment, setNewComment] = useState('');

  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    middleName: '',
    age: '',
    phone: '',
    email: '',
    country: '',
    city: '',
    company: '',
    position: '',
    comment: '',
    funnelId: '',
    funnelStage: '',
  });

  const handleOpenDialog = (contact?: Contact) => {
    if (contact) {
      setSelectedContact(contact);
      setFormData({
        firstName: contact.firstName,
        lastName: contact.lastName,
        middleName: contact.middleName || '',
        age: contact.age?.toString() || '',
        phone: contact.phone,
        email: contact.email,
        country: contact.country || '',
        city: contact.city || '',
        company: contact.company || '',
        position: contact.position || '',
        comment: contact.comment || '',
        funnelId: contact.funnelId || '',
        funnelStage: contact.funnelStage || '',
      });
    } else {
      setSelectedContact(null);
      setFormData({
        firstName: '',
        lastName: '',
        middleName: '',
        age: '',
        phone: '',
        email: '',
        country: '',
        city: '',
        company: '',
        position: '',
        comment: '',
        funnelId: '',
        funnelStage: '',
      });
    }
    setDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setDialogOpen(false);
    setSelectedContact(null);
  };

  const handleSave = () => {
    if (!formData.firstName || !formData.lastName || !formData.phone || !formData.email) {
      alert('Заполните все обязательные поля');
      return;
    }

    const contactData = {
      ...formData,
      age: formData.age ? parseInt(formData.age) : undefined,
      responsibleManager: currentUser
        ? `${currentUser.firstName} ${currentUser.lastName}`
        : 'Не назначен',
    };

    if (selectedContact) {
      updateContact(selectedContact.id, contactData);
    } else {
      addContact(contactData);
    }
    handleCloseDialog();
  };

  const handleDelete = (id: string) => {
    if (confirm('Вы уверены, что хотите удалить этот контакт?')) {
      deleteContact(id);
    }
  };

  const handleOpenComments = (contact: Contact) => {
    setSelectedContact(contact);
    setCommentsDialogOpen(true);
  };

  const handleAddComment = () => {
    if (newComment.trim() && selectedContact) {
      addContactComment(selectedContact.id, newComment);
      setNewComment('');
    }
  };

  const filteredContacts = contacts.filter(
    (contact) =>
      contact.firstName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      contact.lastName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      contact.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      contact.company?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const selectedFunnel = funnels.find((f) => f.id === formData.funnelId);

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Карточки клиентов</h1>
          <p className="text-gray-600 mt-1">Управление базой клиентов</p>
        </div>
        <button
          onClick={() => handleOpenDialog()}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center gap-2"
        >
          <Plus className="w-5 h-5" />
          Добавить клиента
        </button>
      </div>

      <div className="bg-white rounded-lg shadow p-4">
        <div className="relative">
          <Search className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Поиск клиентов..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredContacts.map((contact) => (
          <div key={contact.id} className="bg-white rounded-lg shadow-lg p-6">
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center text-white font-semibold text-lg">
                  {contact.firstName[0]}
                  {contact.lastName[0]}
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">
                    {contact.firstName} {contact.lastName}
                  </h3>
                  {contact.middleName && (
                    <p className="text-sm text-gray-600">{contact.middleName}</p>
                  )}
                </div>
              </div>
              <div className="flex gap-1">
                <button
                  onClick={() => handleOpenDialog(contact)}
                  className="p-1.5 rounded-lg text-gray-500 hover:bg-gray-100 transition-colors"
                >
                  <Edit className="w-4 h-4" />
                </button>
                <button
                  onClick={() => handleDelete(contact.id)}
                  className="p-1.5 rounded-lg text-red-600 hover:bg-red-50 transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>

            <div className="space-y-2 mb-4">
              {contact.position && (
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <User className="w-4 h-4" />
                  {contact.position}
                </div>
              )}
              {contact.company && (
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Building2 className="w-4 h-4" />
                  {contact.company}
                </div>
              )}
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <Mail className="w-4 h-4" />
                {contact.email}
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <Phone className="w-4 h-4" />
                {contact.phone}
              </div>
            </div>

            <div className="pt-4 border-t border-gray-200 space-y-2">
              <p className="text-xs text-gray-500">
                Ответственный: {contact.responsibleManager}
              </p>
              {contact.funnelId && (
                <p className="text-xs text-gray-500">
                  Воронка:{' '}
                  {funnels.find((f) => f.id === contact.funnelId)?.name ||
                    'Не указана'}
                </p>
              )}
              <button
                onClick={() => handleOpenComments(contact)}
                className="w-full mt-2 flex items-center justify-center gap-2 px-3 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg text-sm"
              >
                <MessageSquare className="w-4 h-4" />
                Комментарии ({contact.comments.length})
              </button>
            </div>
          </div>
        ))}
      </div>

      {filteredContacts.length === 0 && (
        <div className="text-center py-12 bg-white rounded-lg shadow">
          <p className="text-gray-500">Нет клиентов</p>
        </div>
      )}

      <Modal
        open={dialogOpen}
        onClose={handleCloseDialog}
        maxWidth="max-w-2xl"
        title={selectedContact ? 'Редактировать клиента' : 'Добавить клиента'}
        footer={
          <>
            <SecondaryButton onClick={handleCloseDialog}>Отмена</SecondaryButton>
            <PrimaryButton onClick={handleSave}>
              {selectedContact ? 'Сохранить' : 'Создать'}
            </PrimaryButton>
          </>
        }
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label>Имя *</Label>
            <input className={inputCls} value={formData.firstName}
              onChange={(e) => setFormData({ ...formData, firstName: e.target.value })} />
          </div>
          <div>
            <Label>Фамилия *</Label>
            <input className={inputCls} value={formData.lastName}
              onChange={(e) => setFormData({ ...formData, lastName: e.target.value })} />
          </div>
          <div>
            <Label>Отчество</Label>
            <input className={inputCls} value={formData.middleName}
              onChange={(e) => setFormData({ ...formData, middleName: e.target.value })} />
          </div>
          <div>
            <Label>Возраст</Label>
            <input className={inputCls} type="number" value={formData.age}
              onChange={(e) => setFormData({ ...formData, age: e.target.value })} />
          </div>
          <div>
            <Label>Телефон *</Label>
            <input className={inputCls} value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })} />
          </div>
          <div>
            <Label>Email *</Label>
            <input className={inputCls} type="email" value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })} />
          </div>
          <div>
            <Label>Страна</Label>
            <input className={inputCls} value={formData.country}
              onChange={(e) => setFormData({ ...formData, country: e.target.value })} />
          </div>
          <div>
            <Label>Город</Label>
            <input className={inputCls} value={formData.city}
              onChange={(e) => setFormData({ ...formData, city: e.target.value })} />
          </div>
          <div>
            <Label>Компания</Label>
            <input className={inputCls} value={formData.company}
              onChange={(e) => setFormData({ ...formData, company: e.target.value })} />
          </div>
          <div>
            <Label>Должность</Label>
            <input className={inputCls} value={formData.position}
              onChange={(e) => setFormData({ ...formData, position: e.target.value })} />
          </div>
          <div>
            <Label>Воронка</Label>
            <select className={inputCls} value={formData.funnelId}
              onChange={(e) => setFormData({ ...formData, funnelId: e.target.value, funnelStage: '' })}>
              <option value="">Не выбрана</option>
              {funnels.map((funnel) => (
                <option key={funnel.id} value={funnel.id}>{funnel.name}</option>
              ))}
            </select>
          </div>
          {selectedFunnel && (
            <div>
              <Label>Этап воронки</Label>
              <select className={inputCls} value={formData.funnelStage}
                onChange={(e) => setFormData({ ...formData, funnelStage: e.target.value })}>
                <option value="">Не выбран</option>
                {selectedFunnel.stages.map((stage) => (
                  <option key={stage.id} value={stage.id}>{stage.name}</option>
                ))}
              </select>
            </div>
          )}
          <div className="md:col-span-2">
            <Label>Комментарий</Label>
            <textarea className={inputCls} rows={3} value={formData.comment}
              onChange={(e) => setFormData({ ...formData, comment: e.target.value })} />
          </div>
        </div>
      </Modal>

      <Modal
        open={commentsDialogOpen}
        onClose={() => setCommentsDialogOpen(false)}
        title={
          selectedContact
            ? `Комментарии — ${selectedContact.firstName} ${selectedContact.lastName}`
            : 'Комментарии'
        }
        footer={
          <SecondaryButton onClick={() => setCommentsDialogOpen(false)}>
            Закрыть
          </SecondaryButton>
        }
      >
        <div className="space-y-4">
          {selectedContact?.comments.map((comment) => (
            <div key={comment.id} className="p-3 bg-gray-50 rounded-lg">
              <div className="flex items-center justify-between mb-1">
                <span className="text-sm font-medium text-gray-900">
                  {comment.author}
                </span>
                <span className="text-xs text-gray-500">
                  {new Date(comment.createdAt).toLocaleString('ru-RU')}
                </span>
              </div>
              <p className="text-sm text-gray-700">{comment.text}</p>
            </div>
          ))}
          {selectedContact?.comments.length === 0 && (
            <p className="text-center text-gray-500 py-4">Нет комментариев</p>
          )}

          <div className="pt-4 border-t border-gray-200">
            <Label>Новый комментарий</Label>
            <textarea
              className={inputCls}
              rows={3}
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
            />
            <PrimaryButton
              className="w-full mt-2"
              onClick={handleAddComment}
              disabled={!newComment.trim()}
            >
              Добавить комментарий
            </PrimaryButton>
          </div>
        </div>
      </Modal>
    </div>
  );
}
