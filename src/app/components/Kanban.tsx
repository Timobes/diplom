import { useState } from 'react';
import { useStore } from '../store/useStore';
import { User, GripVertical } from 'lucide-react';

export function Kanban() {
  const contacts = useStore((state) => state.contacts);
  const funnels = useStore((state) => state.funnels);
  const updateContact = useStore((state) => state.updateContact);

  const [selectedFunnelId, setSelectedFunnelId] = useState(funnels[0]?.id || '');
  const [dragOverStage, setDragOverStage] = useState<string | null>(null);

  const funnel = funnels.find((f) => f.id === selectedFunnelId) || funnels[0];

  if (!funnel) {
    return (
      <div className="p-6">
        <h1 className="text-3xl font-bold text-gray-900">Канбан</h1>
        <p className="text-gray-500 mt-4">
          Нет воронок. Создайте воронку продаж на вкладке «Воронки».
        </p>
      </div>
    );
  }

  const contactsAtStage = (stageId: string) =>
    contacts.filter((c) => c.funnelId === funnel.id && c.funnelStage === stageId);

  const handleDrop = (stageId: string, e: React.DragEvent) => {
    e.preventDefault();
    const contactId = e.dataTransfer.getData('text/plain');
    if (contactId) {
      updateContact(contactId, { funnelId: funnel.id, funnelStage: stageId });
    }
    setDragOverStage(null);
  };

  return (
    <div className="p-6 space-y-6 h-full flex flex-col">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Канбан</h1>
          <p className="text-gray-600 mt-1">
            Перетаскивайте клиентов между этапами воронки
          </p>
        </div>
        {funnels.length > 1 && (
          <div className="flex gap-2 flex-wrap">
            {funnels.map((f) => (
              <button
                key={f.id}
                onClick={() => setSelectedFunnelId(f.id)}
                className={`px-4 py-2 rounded-lg ${
                  f.id === funnel.id
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {f.name}
              </button>
            ))}
          </div>
        )}
      </div>

      <div className="flex-1 overflow-x-auto pb-2">
        <div className="flex gap-4 h-full" style={{ minWidth: 'min-content' }}>
          {funnel.stages.map((stage) => {
            const stageContacts = contactsAtStage(stage.id);
            const isOver = dragOverStage === stage.id;
            return (
              <div
                key={stage.id}
                onDragOver={(e) => {
                  e.preventDefault();
                  setDragOverStage(stage.id);
                }}
                onDragLeave={(e) => {
                  if (!e.currentTarget.contains(e.relatedTarget as Node)) {
                    setDragOverStage(null);
                  }
                }}
                onDrop={(e) => handleDrop(stage.id, e)}
                className={`w-72 flex-shrink-0 rounded-xl p-3 flex flex-col transition-colors ${
                  isOver ? 'bg-blue-100 ring-2 ring-blue-400' : 'bg-gray-100'
                }`}
              >
                <div className="flex items-center justify-between mb-3 px-1">
                  <div>
                    <h3 className="font-semibold text-gray-900">{stage.name}</h3>
                    {stage.trigger && (
                      <p className="text-xs text-gray-500">{stage.trigger}</p>
                    )}
                  </div>
                  <span className="w-7 h-7 bg-white rounded-full text-sm flex items-center justify-center text-gray-700 font-semibold flex-shrink-0">
                    {stageContacts.length}
                  </span>
                </div>

                <div className="space-y-2 flex-1 overflow-y-auto min-h-[120px]">
                  {stageContacts.map((contact) => (
                    <div
                      key={contact.id}
                      draggable
                      onDragStart={(e) =>
                        e.dataTransfer.setData('text/plain', contact.id)
                      }
                      className="group bg-white rounded-lg shadow-sm p-3 cursor-grab active:cursor-grabbing hover:shadow-md transition-shadow"
                    >
                      <div className="flex items-center gap-2">
                        <GripVertical className="w-4 h-4 text-gray-300 group-hover:text-gray-400 flex-shrink-0" />
                        <div className="w-9 h-9 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center text-white text-sm font-semibold flex-shrink-0">
                          {contact.firstName[0]}
                          {contact.lastName[0]}
                        </div>
                        <div className="min-w-0">
                          <p className="font-medium text-gray-900 truncate">
                            {contact.firstName} {contact.lastName}
                          </p>
                          {contact.company && (
                            <p className="text-xs text-gray-500 truncate">
                              {contact.company}
                            </p>
                          )}
                        </div>
                      </div>
                      <div className="flex items-center gap-1 mt-2 text-xs text-gray-400">
                        <User className="w-3 h-3 flex-shrink-0" />
                        <span className="truncate">{contact.responsibleManager}</span>
                      </div>
                    </div>
                  ))}
                  {stageContacts.length === 0 && (
                    <div className="text-center text-gray-400 text-sm py-8 border-2 border-dashed border-gray-200 rounded-lg">
                      Перетащите клиента сюда
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
