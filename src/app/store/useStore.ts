import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface Contact {
  id: string;
  photo?: string;
  firstName: string;
  lastName: string;
  middleName?: string;
  age?: number;
  phone: string;
  email: string;
  country?: string;
  city?: string;
  company?: string;
  position?: string;
  comment?: string;
  responsibleManager: string;
  createdAt: string;
  funnelId?: string;
  funnelStage?: string;
  comments: Comment[];
}

export interface Comment {
  id: string;
  text: string;
  author: string;
  createdAt: string;
}

export interface FunnelStage {
  id: string;
  name: string;
  trigger: string;
}

export interface Funnel {
  id: string;
  name: string;
  description: string;
  stages: FunnelStage[];
  createdAt: string;
}

export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: 'admin' | 'manager' | 'supervisor';
  status: 'working' | 'break' | 'day_end';
  supervisorId?: string;
}

export interface Event {
  id: string;
  title: string;
  description: string;
  startDate: string;
  endDate: string;
  contactIds: string[];
  managerId: string;
  createdAt: string;
}

export interface ChatMessage {
  id: string;
  contactId: string;
  text: string;
  sender: 'manager' | 'client';
  managerId: string;
  createdAt: string;
}

export interface MessageTemplate {
  id: string;
  name: string;
  content: string;
}

interface StoreState {
  // Auth
  currentUser: User | null;
  users: User[];
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  setUserStatus: (status: 'working' | 'break' | 'day_end') => void;

  // Contacts
  contacts: Contact[];
  addContact: (contact: Omit<Contact, 'id' | 'createdAt' | 'comments'>) => void;
  updateContact: (id: string, contact: Partial<Contact>) => void;
  deleteContact: (id: string) => void;
  addContactComment: (contactId: string, text: string) => void;

  // Funnels
  funnels: Funnel[];
  addFunnel: (funnel: Omit<Funnel, 'id' | 'createdAt'>) => void;
  updateFunnel: (id: string, funnel: Partial<Funnel>) => void;
  deleteFunnel: (id: string) => void;

  // Events
  events: Event[];
  addEvent: (event: Omit<Event, 'id' | 'createdAt'>) => void;
  updateEvent: (id: string, event: Partial<Event>) => void;
  deleteEvent: (id: string) => void;

  // Chat
  chatMessages: ChatMessage[];
  messageTemplates: MessageTemplate[];
  sendMessage: (contactId: string, text: string) => void;
  addMessageTemplate: (template: Omit<MessageTemplate, 'id'>) => void;

  // Users Management
  addUser: (user: Omit<User, 'id'>) => void;
  updateUser: (id: string, user: Partial<User>) => void;
  deleteUser: (id: string) => void;
}

export const useStore = create<StoreState>()(
  persist(
    (set, get) => ({
      // Initial state
      currentUser: null,
      users: [
        {
          id: '1',
          email: 'admin@crm.com',
          firstName: 'Админ',
          lastName: 'Система',
          role: 'admin',
          status: 'working',
        },
        {
          id: '2',
          email: 'manager@crm.com',
          firstName: 'Иван',
          lastName: 'Петров',
          role: 'manager',
          status: 'working',
        },
      ],
      contacts: [],
      funnels: [
        {
          id: '1',
          name: 'Основная воронка продаж',
          description: 'Воронка для работы с новыми клиентами',
          createdAt: new Date().toISOString(),
          stages: [
            { id: '1', name: 'Новый лид', trigger: 'Первый контакт с клиентом' },
            { id: '2', name: 'Квалификация', trigger: 'Клиент заинтересован' },
            { id: '3', name: 'Предложение', trigger: 'Отправлено коммерческое предложение' },
            { id: '4', name: 'Переговоры', trigger: 'Обсуждение условий' },
            { id: '5', name: 'Закрыто успешно', trigger: 'Подписан договор' },
          ],
        },
      ],
      events: [],
      chatMessages: [],
      messageTemplates: [
        { id: '1', name: 'Приветствие', content: 'Здравствуйте! Благодарим за обращение в нашу компанию.' },
        { id: '2', name: 'Запрос информации', content: 'Можете предоставить дополнительную информацию по вашему запросу?' },
      ],

      // Auth actions
      login: async (email: string, password: string) => {
        const user = get().users.find((u) => u.email === email);
        if (user) {
          set({ currentUser: user });
          return true;
        }
        return false;
      },

      logout: () => set({ currentUser: null }),

      setUserStatus: (status) => {
        const currentUser = get().currentUser;
        if (currentUser) {
          const updatedUser = { ...currentUser, status };
          set({
            currentUser: updatedUser,
            users: get().users.map((u) => (u.id === currentUser.id ? updatedUser : u)),
          });
        }
      },

      // Contact actions
      addContact: (contact) => {
        const newContact: Contact = {
          ...contact,
          id: Date.now().toString(),
          createdAt: new Date().toISOString(),
          comments: [],
        };
        set({ contacts: [...get().contacts, newContact] });
      },

      updateContact: (id, contact) => {
        set({
          contacts: get().contacts.map((c) => (c.id === id ? { ...c, ...contact } : c)),
        });
      },

      deleteContact: (id) => {
        set({ contacts: get().contacts.filter((c) => c.id !== id) });
      },

      addContactComment: (contactId, text) => {
        const currentUser = get().currentUser;
        if (!currentUser) return;

        const comment: Comment = {
          id: Date.now().toString(),
          text,
          author: `${currentUser.firstName} ${currentUser.lastName}`,
          createdAt: new Date().toISOString(),
        };

        set({
          contacts: get().contacts.map((c) =>
            c.id === contactId ? { ...c, comments: [...c.comments, comment] } : c
          ),
        });
      },

      // Funnel actions
      addFunnel: (funnel) => {
        const newFunnel: Funnel = {
          ...funnel,
          id: Date.now().toString(),
          createdAt: new Date().toISOString(),
        };
        set({ funnels: [...get().funnels, newFunnel] });
      },

      updateFunnel: (id, funnel) => {
        set({
          funnels: get().funnels.map((f) => (f.id === id ? { ...f, ...funnel } : f)),
        });
      },

      deleteFunnel: (id) => {
        set({ funnels: get().funnels.filter((f) => f.id !== id) });
      },

      // Event actions
      addEvent: (event) => {
        const newEvent: Event = {
          ...event,
          id: Date.now().toString(),
          createdAt: new Date().toISOString(),
        };
        set({ events: [...get().events, newEvent] });
      },

      updateEvent: (id, event) => {
        set({
          events: get().events.map((e) => (e.id === id ? { ...e, ...event } : e)),
        });
      },

      deleteEvent: (id) => {
        set({ events: get().events.filter((e) => e.id !== id) });
      },

      // Chat actions
      sendMessage: (contactId, text) => {
        const currentUser = get().currentUser;
        if (!currentUser) return;

        const message: ChatMessage = {
          id: Date.now().toString(),
          contactId,
          text,
          sender: 'manager',
          managerId: currentUser.id,
          createdAt: new Date().toISOString(),
        };

        set({ chatMessages: [...get().chatMessages, message] });
      },

      addMessageTemplate: (template) => {
        const newTemplate: MessageTemplate = {
          ...template,
          id: Date.now().toString(),
        };
        set({ messageTemplates: [...get().messageTemplates, newTemplate] });
      },

      // User management actions
      addUser: (user) => {
        const newUser: User = {
          ...user,
          id: Date.now().toString(),
        };
        set({ users: [...get().users, newUser] });
      },

      updateUser: (id, user) => {
        set({
          users: get().users.map((u) => (u.id === id ? { ...u, ...user } : u)),
        });
      },

      deleteUser: (id) => {
        set({ users: get().users.filter((u) => u.id !== id) });
      },
    }),
    {
      name: 'crm-storage',
    }
  )
);
