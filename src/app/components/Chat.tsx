import { useState } from 'react';
import { useStore } from '../store/useStore';
import { Send, MessageSquare, FileText } from 'lucide-react';
import TextField from '@mui/material/TextField';
import MenuItem from '@mui/material/MenuItem';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import Button from '@mui/material/Button';

export function Chat() {
  const contacts = useStore((state) => state.contacts);
  const chatMessages = useStore((state) => state.chatMessages);
  const messageTemplates = useStore((state) => state.messageTemplates);
  const addMessageTemplate = useStore((state) => state.addMessageTemplate);
  const sendMessage = useStore((state) => state.sendMessage);
  const currentUser = useStore((state) => state.currentUser);

  const [selectedContactId, setSelectedContactId] = useState<string>('');
  const [message, setMessage] = useState('');
  const [templateDialogOpen, setTemplateDialogOpen] = useState(false);
  const [newTemplateName, setNewTemplateName] = useState('');
  const [newTemplateContent, setNewTemplateContent] = useState('');

  const selectedContact = contacts.find((c) => c.id === selectedContactId);
  const contactMessages = chatMessages.filter((m) => m.contactId === selectedContactId);

  const handleSendMessage = () => {
    if (message.trim() && selectedContactId) {
      sendMessage(selectedContactId, message);
      setMessage('');
    }
  };

  const handleUseTemplate = (template: typeof messageTemplates[0]) => {
    setMessage(template.content);
  };

  const handleSaveTemplate = () => {
    if (newTemplateName.trim() && newTemplateContent.trim()) {
      addMessageTemplate({
        name: newTemplateName,
        content: newTemplateContent,
      });
      setNewTemplateName('');
      setNewTemplateContent('');
      setTemplateDialogOpen(false);
    }
  };

  const applyFormatting = (format: 'bold' | 'italic' | 'underline') => {
    const textarea = document.querySelector('textarea');
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selectedText = message.substring(start, end);

    let formattedText = '';
    switch (format) {
      case 'bold':
        formattedText = `**${selectedText}**`;
        break;
      case 'italic':
        formattedText = `*${selectedText}*`;
        break;
      case 'underline':
        formattedText = `__${selectedText}__`;
        break;
    }

    const newMessage =
      message.substring(0, start) + formattedText + message.substring(end);
    setMessage(newMessage);
  };

  const myContacts = currentUser
    ? contacts.filter((c) =>
        c.responsibleManager.includes(currentUser.firstName)
      )
    : [];

  return (
    <div className="p-6 h-full flex flex-col">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Чат с клиентами</h1>
        <p className="text-gray-600 mt-1">Общение с вашими клиентами</p>
      </div>

      <div className="flex-1 grid grid-cols-1 lg:grid-cols-3 gap-6 min-h-0">
        <div className="bg-white rounded-lg shadow p-4 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="font-semibold text-gray-900">Контакты</h2>
            <MessageSquare className="w-5 h-5 text-gray-400" />
          </div>

          <div className="space-y-2 max-h-[600px] overflow-y-auto">
            {myContacts.map((contact) => {
              const unreadCount = chatMessages.filter(
                (m) => m.contactId === contact.id && m.sender === 'client'
              ).length;

              return (
                <button
                  key={contact.id}
                  onClick={() => setSelectedContactId(contact.id)}
                  className={`w-full p-3 rounded-lg text-left transition-colors ${
                    selectedContactId === contact.id
                      ? 'bg-blue-50 border-2 border-blue-500'
                      : 'bg-gray-50 hover:bg-gray-100 border-2 border-transparent'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium text-gray-900">
                        {contact.firstName} {contact.lastName}
                      </p>
                      <p className="text-sm text-gray-600">{contact.email}</p>
                    </div>
                    {unreadCount > 0 && (
                      <span className="w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-xs">
                        {unreadCount}
                      </span>
                    )}
                  </div>
                </button>
              );
            })}
            {myContacts.length === 0 && (
              <p className="text-center text-gray-500 py-8">
                Нет доступных контактов
              </p>
            )}
          </div>
        </div>

        <div className="lg:col-span-2 bg-white rounded-lg shadow flex flex-col">
          {selectedContact ? (
            <>
              <div className="p-4 border-b border-gray-200">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center text-white font-semibold">
                    {selectedContact.firstName[0]}
                    {selectedContact.lastName[0]}
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">
                      {selectedContact.firstName} {selectedContact.lastName}
                    </h3>
                    <p className="text-sm text-gray-600">{selectedContact.email}</p>
                  </div>
                </div>
              </div>

              <div className="flex-1 p-4 space-y-4 overflow-y-auto max-h-[400px]">
                {contactMessages.map((msg) => (
                  <div
                    key={msg.id}
                    className={`flex ${
                      msg.sender === 'manager' ? 'justify-end' : 'justify-start'
                    }`}
                  >
                    <div
                      className={`max-w-[70%] rounded-lg p-3 ${
                        msg.sender === 'manager'
                          ? 'bg-blue-600 text-white'
                          : 'bg-gray-100 text-gray-900'
                      }`}
                    >
                      <p className="text-sm whitespace-pre-wrap">{msg.text}</p>
                      <p
                        className={`text-xs mt-1 ${
                          msg.sender === 'manager'
                            ? 'text-blue-100'
                            : 'text-gray-500'
                        }`}
                      >
                        {new Date(msg.createdAt).toLocaleTimeString('ru-RU', {
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </p>
                    </div>
                  </div>
                ))}
                {contactMessages.length === 0 && (
                  <div className="text-center text-gray-500 py-12">
                    Нет сообщений. Начните разговор!
                  </div>
                )}
              </div>

              <div className="p-4 border-t border-gray-200 space-y-3">
                <div className="flex gap-2">
                  <button
                    onClick={() => applyFormatting('bold')}
                    className="px-3 py-1 bg-gray-100 hover:bg-gray-200 rounded font-bold text-sm"
                    title="Жирный"
                  >
                    B
                  </button>
                  <button
                    onClick={() => applyFormatting('italic')}
                    className="px-3 py-1 bg-gray-100 hover:bg-gray-200 rounded italic text-sm"
                    title="Курсив"
                  >
                    I
                  </button>
                  <button
                    onClick={() => applyFormatting('underline')}
                    className="px-3 py-1 bg-gray-100 hover:bg-gray-200 rounded underline text-sm"
                    title="Подчеркнутый"
                  >
                    U
                  </button>
                  <button
                    onClick={() => setTemplateDialogOpen(true)}
                    className="ml-auto px-3 py-1 bg-gray-100 hover:bg-gray-200 rounded text-sm flex items-center gap-2"
                  >
                    <FileText className="w-4 h-4" />
                    Шаблоны
                  </button>
                </div>

                {messageTemplates.length > 0 && (
                  <div className="flex gap-2 flex-wrap">
                    {messageTemplates.map((template) => (
                      <button
                        key={template.id}
                        onClick={() => handleUseTemplate(template)}
                        className="px-3 py-1 bg-blue-50 hover:bg-blue-100 text-blue-700 rounded text-sm"
                      >
                        {template.name}
                      </button>
                    ))}
                  </div>
                )}

                <div className="flex gap-2">
                  <textarea
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    onKeyPress={(e) => {
                      if (e.key === 'Enter' && !e.shiftKey) {
                        e.preventDefault();
                        handleSendMessage();
                      }
                    }}
                    placeholder="Введите сообщение..."
                    rows={3}
                    className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                  />
                  <button
                    onClick={handleSendMessage}
                    disabled={!message.trim()}
                    className="px-6 bg-blue-600 hover:bg-blue-700 text-white rounded-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
                  >
                    <Send className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </>
          ) : (
            <div className="flex-1 flex items-center justify-center text-gray-500">
              <div className="text-center">
                <MessageSquare className="w-16 h-16 mx-auto mb-4 text-gray-400" />
                <p>Выберите контакт для начала общения</p>
              </div>
            </div>
          )}
        </div>
      </div>

      <Dialog
        open={templateDialogOpen}
        onClose={() => setTemplateDialogOpen(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>Создать шаблон</DialogTitle>
        <DialogContent>
          <div className="space-y-4 pt-2">
            <TextField
              label="Название шаблона"
              fullWidth
              value={newTemplateName}
              onChange={(e) => setNewTemplateName(e.target.value)}
            />
            <TextField
              label="Текст шаблона"
              fullWidth
              multiline
              rows={4}
              value={newTemplateContent}
              onChange={(e) => setNewTemplateContent(e.target.value)}
            />
          </div>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setTemplateDialogOpen(false)}>Отмена</Button>
          <Button onClick={handleSaveTemplate} variant="contained">
            Сохранить
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}
