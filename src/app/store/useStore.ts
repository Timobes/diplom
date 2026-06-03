import { create } from 'zustand';
import { persist } from 'zustand/middleware';

// Хелпер дат для демо-данных: смещение в днях относительно сегодня
const iso = (daysOffset: number, hour = 10): string => {
  const d = new Date();
  d.setDate(d.getDate() + daysOffset);
  d.setHours(hour, 0, 0, 0);
  return d.toISOString();
};

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
          id: '3',
          email: 'supervisor@crm.com',
          firstName: 'Ольга',
          lastName: 'Смирнова',
          role: 'supervisor',
          status: 'working',
        },
        {
          id: '2',
          email: 'manager@crm.com',
          firstName: 'Иван',
          lastName: 'Петров',
          role: 'manager',
          status: 'working',
          supervisorId: '3',
        },
        {
          id: '4',
          email: 'manager2@crm.com',
          firstName: 'Дмитрий',
          lastName: 'Котов',
          role: 'manager',
          status: 'break',
          supervisorId: '3',
        },
      ],
      contacts: [
        { id: 'c1', firstName: 'Алексей', lastName: 'Воробьёв', middleName: 'Игоревич', age: 41,
          phone: '+7 (915) 234-56-78', email: 'vorobyov@technostroy.ru', country: 'Россия',
          city: 'Москва', company: 'ООО «ТехноСтрой»', position: 'Директор',
          comment: 'Крупный заказчик, подписан договор.', responsibleManager: 'Иван Петров',
          createdAt: iso(-6), funnelId: '1', funnelStage: '5',
          comments: [{ id: 'm1', text: 'Договор подписан, передаём в работу.', author: 'Иван Петров', createdAt: iso(-5) }] },
        { id: 'c2', firstName: 'Мария', lastName: 'Кузнецова', age: 34,
          phone: '+7 (903) 111-22-33', email: 'kuznetsova@mail.ru', country: 'Россия',
          city: 'Санкт-Петербург', company: 'ИП Кузнецова', position: 'Владелец',
          comment: 'Обсуждаем условия.', responsibleManager: 'Иван Петров',
          createdAt: iso(-5), funnelId: '1', funnelStage: '4', comments: [] },
        { id: 'c3', firstName: 'Сергей', lastName: 'Морозов', age: 29,
          phone: '+7 (926) 555-44-11', email: 's.morozov@alfatrade.ru', country: 'Россия',
          city: 'Москва', company: 'ООО «АльфаТрейд»', position: 'Менеджер по закупкам',
          comment: 'Отправлено коммерческое предложение.', responsibleManager: 'Иван Петров',
          createdAt: iso(-4), funnelId: '1', funnelStage: '3', comments: [] },
        { id: 'c4', firstName: 'Елена', lastName: 'Новикова', age: 45,
          phone: '+7 (911) 777-88-99', email: 'novikova@svetlana.ru', country: 'Россия',
          city: 'Казань', company: 'ООО «Светлана»', position: 'Коммерческий директор',
          comment: 'Заинтересована, уточняет детали.', responsibleManager: 'Дмитрий Котов',
          createdAt: iso(-4), funnelId: '1', funnelStage: '2', comments: [] },
        { id: 'c5', firstName: 'Дмитрий', lastName: 'Соколов', age: 38,
          phone: '+7 (905) 333-22-11', email: 'sokolov@promresurs.ru', country: 'Россия',
          city: 'Екатеринбург', company: 'ООО «ПромРесурс»', position: 'Снабженец',
          comment: 'Новый лид с сайта.', responsibleManager: 'Иван Петров',
          createdAt: iso(-3), funnelId: '1', funnelStage: '1', comments: [] },
        { id: 'c6', firstName: 'Анна', lastName: 'Лебедева', age: 31,
          phone: '+7 (917) 444-55-66', email: 'lebedeva@mediagroup.ru', country: 'Россия',
          city: 'Новосибирск', company: 'ООО «МедиаГрупп»', position: 'Маркетолог',
          comment: 'Готовим презентацию.', responsibleManager: 'Дмитрий Котов',
          createdAt: iso(-3), funnelId: '1', funnelStage: '3', comments: [] },
        { id: 'c7', firstName: 'Павел', lastName: 'Захаров', age: 52,
          phone: '+7 (903) 909-80-70', email: 'zakharov@stroymir.ru', country: 'Россия',
          city: 'Москва', company: 'ООО «СтройМир»', position: 'Генеральный директор',
          comment: 'Постоянный клиент, повторная сделка.', responsibleManager: 'Иван Петров',
          createdAt: iso(-2), funnelId: '2', funnelStage: '7', comments: [] },
        { id: 'c8', firstName: 'Ольга', lastName: 'Васильева', age: 27,
          phone: '+7 (965) 121-31-41', email: 'vasileva@gmail.com', country: 'Россия',
          city: 'Самара', company: 'ИП Васильева', position: 'Владелец',
          comment: 'Квалифицирована.', responsibleManager: 'Иван Петров',
          createdAt: iso(-2), funnelId: '1', funnelStage: '2', comments: [] },
        { id: 'c9', firstName: 'Николай', lastName: 'Орлов', age: 36,
          phone: '+7 (927) 656-76-86', email: 'orlov@logisticpro.ru', country: 'Россия',
          city: 'Краснодар', company: 'ООО «ЛогистикПро»', position: 'Логист',
          comment: 'Постоянный клиент.', responsibleManager: 'Дмитрий Котов',
          createdAt: iso(-1), funnelId: '2', funnelStage: '6', comments: [] },
        { id: 'c10', firstName: 'Татьяна', lastName: 'Григорьева', age: 48,
          phone: '+7 (916) 232-42-52', email: 'grigoreva@finconsult.ru', country: 'Россия',
          city: 'Москва', company: 'ООО «ФинКонсалт»', position: 'Финансовый директор',
          comment: 'На этапе переговоров.', responsibleManager: 'Иван Петров',
          createdAt: iso(0), funnelId: '1', funnelStage: '4', comments: [] },
      ],
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
        {
          id: '2',
          name: 'Воронка постоянных клиентов',
          description: 'Работа с повторными продажами',
          createdAt: iso(-30),
          stages: [
            { id: '6', name: 'Повторное обращение', trigger: 'Клиент вернулся' },
            { id: '7', name: 'Допродажа', trigger: 'Предложены дополнительные услуги' },
            { id: '8', name: 'Сделка закрыта', trigger: 'Оплата получена' },
          ],
        },
      ],
      events: [
        { id: 'e1', title: 'Звонок: Алексей Воробьёв', description: 'Обсудить детали договора',
          startDate: iso(1, 11), endDate: iso(1, 12), contactIds: ['c1'], managerId: '2', createdAt: iso(-2) },
        { id: 'e2', title: 'Встреча: Мария Кузнецова', description: 'Презентация условий сотрудничества',
          startDate: iso(2, 14), endDate: iso(2, 15), contactIds: ['c2'], managerId: '2', createdAt: iso(-2) },
        { id: 'e3', title: 'Демонстрация для ООО «АльфаТрейд»', description: 'Показать возможности продукта',
          startDate: iso(3, 10), endDate: iso(3, 11), contactIds: ['c3'], managerId: '2', createdAt: iso(-1) },
        { id: 'e4', title: 'Переговоры: ООО «МедиаГрупп»', description: 'Согласование бюджета',
          startDate: iso(4, 16), endDate: iso(4, 17), contactIds: ['c6'], managerId: '4', createdAt: iso(-1) },
        { id: 'e5', title: 'Звонок: Дмитрий Соколов', description: 'Первичная консультация',
          startDate: iso(-3, 10), endDate: iso(-3, 11), contactIds: ['c5'], managerId: '2', createdAt: iso(-4) },
        { id: 'e6', title: 'Встреча: ООО «Светлана»', description: 'Подписание документов',
          startDate: iso(-2, 13), endDate: iso(-2, 14), contactIds: ['c4'], managerId: '4', createdAt: iso(-3) },
      ],
      chatMessages: [
        { id: 'h1', contactId: 'c1', text: 'Здравствуйте! Подскажите статус по нашему договору.', sender: 'client', managerId: '2', createdAt: iso(-1, 9) },
        { id: 'h2', contactId: 'c1', text: 'Добрый день! Договор подписан, передаём проект в работу.', sender: 'manager', managerId: '2', createdAt: iso(-1, 10) },
        { id: 'h3', contactId: 'c1', text: 'Отлично, спасибо!', sender: 'client', managerId: '2', createdAt: iso(-1, 10) },
        { id: 'h4', contactId: 'c2', text: 'Добрый день! Когда можно обсудить условия?', sender: 'client', managerId: '2', createdAt: iso(0, 11) },
        { id: 'h5', contactId: 'c2', text: 'Здравствуйте! Давайте созвонимся завтра в 14:00.', sender: 'manager', managerId: '2', createdAt: iso(0, 11) },
        { id: 'h6', contactId: 'c3', text: 'Получили ваше коммерческое предложение, изучаем.', sender: 'client', managerId: '2', createdAt: iso(0, 12) },
      ],
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
      name: 'crm-storage-v2',
      version: 2,
    }
  )
);
