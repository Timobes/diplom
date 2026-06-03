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
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import MenuItem from '@mui/material/MenuItem';
import IconButton from '@mui/material/IconButton';

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
                <IconButton size="small" onClick={() => handleOpenDialog(contact)}>
                  <Edit className="w-4 h-4" />
                </IconButton>
                <IconButton size="small" onClick={() => handleDelete(contact.id)}>
                  <Trash2 className="w-4 h-4 text-red-600" />
                </IconButton>
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

      <Dialog open={dialogOpen} onClose={handleCloseDialog} maxWidth="md" fullWidth>
        <DialogTitle>
          {selectedContact ? 'Редактировать клиента' : 'Добавить клиента'}
        </DialogTitle>
        <DialogContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
            <TextField
              label="Имя *"
              fullWidth
              value={formData.firstName}
              onChange={(e) =>
                setFormData({ ...formData, firstName: e.target.value })
              }
            />
            <TextField
              label="Фамилия *"
              fullWidth
              value={formData.lastName}
              onChange={(e) =>
                setFormData({ ...formData, lastName: e.target.value })
              }
            />
            <TextField
              label="Отчество"
              fullWidth
              value={formData.middleName}
              onChange={(e) =>
                setFormData({ ...formData, middleName: e.target.value })
              }
            />
            <TextField
              label="Возраст"
              fullWidth
              type="number"
              value={formData.age}
              onChange={(e) => setFormData({ ...formData, age: e.target.value })}
            />
            <TextField
              label="Телефон *"
              fullWidth
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
            />
            <TextField
              label="Email *"
              fullWidth
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            />
            <TextField
              label="Страна"
              fullWidth
              value={formData.country}
              onChange={(e) =>
                setFormData({ ...formData, country: e.target.value })
              }
            />
            <TextField
              label="Город"
              fullWidth
              value={formData.city}
              onChange={(e) => setFormData({ ...formData, city: e.target.value })}
            />
            <TextField
              label="Компания"
              fullWidth
              value={formData.company}
              onChange={(e) =>
                setFormData({ ...formData, company: e.target.value })
              }
            />
            <TextField
              label="Должность"
              fullWidth
              value={formData.position}
              onChange={(e) =>
                setFormData({ ...formData, position: e.target.value })
              }
            />
            <TextField
              label="Воронка"
              fullWidth
              select
              value={formData.funnelId}
              onChange={(e) =>
                setFormData({ ...formData, funnelId: e.target.value, funnelStage: '' })
              }
            >
              <MenuItem value="">Не выбрана</MenuItem>
              {funnels.map((funnel) => (
                <MenuItem key={funnel.id} value={funnel.id}>
                  {funnel.name}
                </MenuItem>
              ))}
            </TextField>
            {selectedFunnel && (
              <TextField
                label="Этап воронки"
                fullWidth
                select
                value={formData.funnelStage}
                onChange={(e) =>
                  setFormData({ ...formData, funnelStage: e.target.value })
                }
              >
                {selectedFunnel.stages.map((stage) => (
                  <MenuItem key={stage.id} value={stage.id}>
                    {stage.name}
                  </MenuItem>
                ))}
              </TextField>
            )}
            <TextField
              label="Комментарий"
              fullWidth
              multiline
              rows={3}
              className="md:col-span-2"
              value={formData.comment}
              onChange={(e) =>
                setFormData({ ...formData, comment: e.target.value })
              }
            />
          </div>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Отмена</Button>
          <Button onClick={handleSave} variant="contained">
            {selectedContact ? 'Сохранить' : 'Создать'}
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog
        open={commentsDialogOpen}
        onClose={() => setCommentsDialogOpen(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>
          Комментарии -{' '}
          {selectedContact &&
            `${selectedContact.firstName} ${selectedContact.lastName}`}
        </DialogTitle>
        <DialogContent>
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
              <TextField
                label="Новый комментарий"
                fullWidth
                multiline
                rows={3}
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
              />
              <Button
                variant="contained"
                fullWidth
                className="mt-2"
                onClick={handleAddComment}
                disabled={!newComment.trim()}
              >
                Добавить комментарий
              </Button>
            </div>
          </div>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setCommentsDialogOpen(false)}>Закрыть</Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}
