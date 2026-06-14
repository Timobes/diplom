import { useState } from 'react';
import { useStore, Event } from '../store/useStore';
import { Plus, Calendar as CalendarIcon, Clock, User, Edit, Trash2 } from 'lucide-react';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import MenuItem from '@mui/material/MenuItem';
import IconButton from '@mui/material/IconButton';
import Checkbox from '@mui/material/Checkbox';
import FormControlLabel from '@mui/material/FormControlLabel';

export function Calendar() {
  const events = useStore((state) => state.events);
  const addEvent = useStore((state) => state.addEvent);
  const updateEvent = useStore((state) => state.updateEvent);
  const deleteEvent = useStore((state) => state.deleteEvent);
  const contacts = useStore((state) => state.contacts);
  const users = useStore((state) => state.users);
  const currentUser = useStore((state) => state.currentUser);

  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    startDate: '',
    endDate: '',
    contactIds: [] as string[],
    managerId: currentUser?.id || '',
  });

  const handleOpenDialog = (event?: Event) => {
    if (event) {
      setSelectedEvent(event);
      setFormData({
        title: event.title,
        description: event.description,
        startDate: event.startDate.slice(0, 16),
        endDate: event.endDate.slice(0, 16),
        contactIds: event.contactIds,
        managerId: event.managerId,
      });
    } else {
      setSelectedEvent(null);
      setFormData({
        title: '',
        description: '',
        startDate: '',
        endDate: '',
        contactIds: [],
        managerId: currentUser?.id || '',
      });
    }
    setDialogOpen(true);
  };

  const handleSave = () => {
    if (!formData.title || !formData.startDate || !formData.endDate) {
      alert('Заполните все обязательные поля');
      return;
    }

    const eventData = {
      ...formData,
      startDate: new Date(formData.startDate).toISOString(),
      endDate: new Date(formData.endDate).toISOString(),
    };

    if (selectedEvent) {
      updateEvent(selectedEvent.id, eventData);
    } else {
      addEvent(eventData);
    }
    setDialogOpen(false);
  };

  const handleDelete = (id: string) => {
    if (confirm('Вы уверены, что хотите удалить это событие?')) {
      deleteEvent(id);
    }
  };

  const toggleContact = (contactId: string) => {
    setFormData({
      ...formData,
      contactIds: formData.contactIds.includes(contactId)
        ? formData.contactIds.filter((id) => id !== contactId)
        : [...formData.contactIds, contactId],
    });
  };

  const sortedEvents = [...events].sort(
    (a, b) => new Date(a.startDate).getTime() - new Date(b.startDate).getTime()
  );

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Календарь событий</h1>
          <p className="text-gray-600 mt-1">Планирование встреч и активностей</p>
        </div>
        <button
          onClick={() => handleOpenDialog()}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center gap-2"
        >
          <Plus className="w-5 h-5" />
          Создать событие
        </button>
      </div>

      <div className="space-y-4">
        {sortedEvents.map((event) => {
          const manager = users.find((u) => u.id === event.managerId);
          const eventContacts = contacts.filter((c) =>
            event.contactIds.includes(c.id)
          );

          return (
            <div
              key={event.id}
              className="bg-white rounded-lg shadow-lg p-6 hover:shadow-xl transition-shadow"
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">
                    {event.title}
                  </h3>
                  <p className="text-gray-600 mb-4">{event.description}</p>

                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <CalendarIcon className="w-4 h-4" />
                      {new Date(event.startDate).toLocaleDateString('ru-RU')}
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <Clock className="w-4 h-4" />
                      {new Date(event.startDate).toLocaleTimeString('ru-RU', {
                        hour: '2-digit',
                        minute: '2-digit',
                      })}{' '}
                      -{' '}
                      {new Date(event.endDate).toLocaleTimeString('ru-RU', {
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </div>
                    {manager && (
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <User className="w-4 h-4" />
                        {manager.firstName} {manager.lastName}
                      </div>
                    )}
                  </div>

                  {eventContacts.length > 0 && (
                    <div className="mt-4 pt-4 border-t border-gray-200">
                      <p className="text-sm font-medium text-gray-700 mb-2">
                        Участники:
                      </p>
                      <div className="flex flex-wrap gap-2">
                        {eventContacts.map((contact) => (
                          <span
                            key={contact.id}
                            className="px-3 py-1 bg-blue-50 text-blue-700 rounded-full text-sm"
                          >
                            {contact.firstName} {contact.lastName}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                <div className="flex gap-2">
                  <IconButton size="small" onClick={() => handleOpenDialog(event)}>
                    <Edit className="w-4 h-4" />
                  </IconButton>
                  <IconButton size="small" onClick={() => handleDelete(event.id)}>
                    <Trash2 className="w-4 h-4 text-red-600" />
                  </IconButton>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {events.length === 0 && (
        <div className="text-center py-12 bg-white rounded-lg shadow">
          <p className="text-gray-500">Нет запланированных событий</p>
        </div>
      )}

      <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>
          {selectedEvent ? 'Редактировать событие' : 'Создать событие'}
        </DialogTitle>
        <DialogContent>
          <div className="space-y-4 pt-2 flex flex-col gap-y-[20px]">
            <TextField
              label="Название события *"
              fullWidth
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            />
            <TextField
              label="Описание"
              fullWidth
              multiline
              rows={3}
              value={formData.description}
              onChange={(e) =>
                setFormData({ ...formData, description: e.target.value })
              }
            />
            <TextField
              label="Дата и время начала *"
              fullWidth
              type="datetime-local"
              InputLabelProps={{ shrink: true }}
              value={formData.startDate}
              onChange={(e) =>
                setFormData({ ...formData, startDate: e.target.value })
              }
            />
            <TextField
              label="Дата и время окончания *"
              fullWidth
              type="datetime-local"
              InputLabelProps={{ shrink: true }}
              value={formData.endDate}
              onChange={(e) =>
                setFormData({ ...formData, endDate: e.target.value })
              }
            />
            <TextField
              label="Ответственный менеджер"
              fullWidth
              select
              value={formData.managerId}
              onChange={(e) =>
                setFormData({ ...formData, managerId: e.target.value })
              }
            >
              {users
                .filter((u) => u.role !== 'admin')
                .map((user) => (
                  <MenuItem key={user.id} value={user.id}>
                    {user.firstName} {user.lastName} ({user.role === 'manager' ? 'Менеджер' : 'Руководитель'})
                  </MenuItem>
                ))}
            </TextField>

            <div>
              <p className="text-sm font-medium text-gray-700 mb-2">
                Выберите клиентов:
              </p>
              <div className="max-h-48 overflow-y-auto border border-gray-200 rounded-lg p-2">
                {contacts.map((contact) => (
                  <FormControlLabel
                    key={contact.id}
                    control={
                      <Checkbox
                        checked={formData.contactIds.includes(contact.id)}
                        onChange={() => toggleContact(contact.id)}
                      />
                    }
                    label={`${contact.firstName} ${contact.lastName} (${contact.email})`}
                  />
                ))}
                {contacts.length === 0 && (
                  <p className="text-sm text-gray-500 p-2">Нет доступных клиентов</p>
                )}
              </div>
            </div>
          </div>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDialogOpen(false)}>Отмена</Button>
          <Button onClick={handleSave} variant="contained">
            {selectedEvent ? 'Сохранить' : 'Создать'}
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}
