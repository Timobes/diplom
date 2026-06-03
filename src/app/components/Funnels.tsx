import { useState } from 'react';
import { useStore, Funnel, FunnelStage } from '../store/useStore';
import { Plus, Edit, Trash2, ChevronRight } from 'lucide-react';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import IconButton from '@mui/material/IconButton';

export function Funnels() {
  const funnels = useStore((state) => state.funnels);
  const addFunnel = useStore((state) => state.addFunnel);
  const updateFunnel = useStore((state) => state.updateFunnel);
  const deleteFunnel = useStore((state) => state.deleteFunnel);

  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingFunnel, setEditingFunnel] = useState<Funnel | null>(null);
  const [funnelName, setFunnelName] = useState('');
  const [funnelDescription, setFunnelDescription] = useState('');
  const [stages, setStages] = useState<FunnelStage[]>([
    { id: '1', name: '', trigger: '' },
  ]);

  const handleOpenDialog = (funnel?: Funnel) => {
    if (funnel) {
      setEditingFunnel(funnel);
      setFunnelName(funnel.name);
      setFunnelDescription(funnel.description);
      setStages(funnel.stages);
    } else {
      setEditingFunnel(null);
      setFunnelName('');
      setFunnelDescription('');
      setStages([{ id: '1', name: '', trigger: '' }]);
    }
    setDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setDialogOpen(false);
    setEditingFunnel(null);
  };

  const handleAddStage = () => {
    setStages([...stages, { id: Date.now().toString(), name: '', trigger: '' }]);
  };

  const handleRemoveStage = (id: string) => {
    setStages(stages.filter((s) => s.id !== id));
  };

  const handleStageChange = (id: string, field: 'name' | 'trigger', value: string) => {
    setStages(stages.map((s) => (s.id === id ? { ...s, [field]: value } : s)));
  };

  const handleSave = () => {
    if (!funnelName.trim() || stages.some((s) => !s.name.trim())) {
      alert('Заполните все обязательные поля');
      return;
    }

    if (editingFunnel) {
      updateFunnel(editingFunnel.id, {
        name: funnelName,
        description: funnelDescription,
        stages,
      });
    } else {
      addFunnel({
        name: funnelName,
        description: funnelDescription,
        stages,
      });
    }
    handleCloseDialog();
  };

  const handleDelete = (id: string) => {
    if (confirm('Вы уверены, что хотите удалить эту воронку?')) {
      deleteFunnel(id);
    }
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Воронки продаж</h1>
          <p className="text-gray-600 mt-1">
            Управление воронками для разных бизнес-идей
          </p>
        </div>
        <button
          onClick={() => handleOpenDialog()}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center gap-2"
        >
          <Plus className="w-5 h-5" />
          Создать воронку
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {funnels.map((funnel) => (
          <div key={funnel.id} className="bg-white rounded-lg shadow-lg p-6">
            <div className="flex items-start justify-between mb-4">
              <div className="flex-1">
                <h3 className="text-xl font-semibold text-gray-900">{funnel.name}</h3>
                <p className="text-sm text-gray-600 mt-1">{funnel.description}</p>
              </div>
              <div className="flex gap-2">
                <IconButton size="small" onClick={() => handleOpenDialog(funnel)}>
                  <Edit className="w-4 h-4" />
                </IconButton>
                <IconButton size="small" onClick={() => handleDelete(funnel.id)}>
                  <Trash2 className="w-4 h-4 text-red-600" />
                </IconButton>
              </div>
            </div>

            <div className="space-y-3">
              {funnel.stages.map((stage, index) => (
                <div key={stage.id} className="flex items-start gap-3">
                  <div className="flex items-center gap-2 flex-shrink-0">
                    <div className="w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center text-sm font-medium">
                      {index + 1}
                    </div>
                    {index < funnel.stages.length - 1 && (
                      <ChevronRight className="w-4 h-4 text-gray-400" />
                    )}
                  </div>
                  <div className="flex-1">
                    <p className="font-medium text-gray-900">{stage.name}</p>
                    <p className="text-sm text-gray-600">{stage.trigger}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-4 pt-4 border-t border-gray-200 text-sm text-gray-500">
              {funnel.stages.length} этапов
            </div>
          </div>
        ))}
      </div>

      {funnels.length === 0 && (
        <div className="text-center py-12 bg-white rounded-lg shadow">
          <p className="text-gray-500">
            Нет воронок. Создайте первую воронку продаж.
          </p>
        </div>
      )}

      <Dialog open={dialogOpen} onClose={handleCloseDialog} maxWidth="md" fullWidth>
        <DialogTitle>
          {editingFunnel ? 'Редактировать воронку' : 'Создать воронку'}
        </DialogTitle>
        <DialogContent>
          <div className="space-y-4 pt-2">
            <TextField
              label="Название воронки"
              fullWidth
              value={funnelName}
              onChange={(e) => setFunnelName(e.target.value)}
              required
            />
            <TextField
              label="Описание"
              fullWidth
              multiline
              rows={2}
              value={funnelDescription}
              onChange={(e) => setFunnelDescription(e.target.value)}
            />

            <div className="border-t border-gray-200 pt-4">
              <div className="flex items-center justify-between mb-4">
                <h4 className="font-medium text-gray-900">Этапы воронки</h4>
                <Button
                  startIcon={<Plus className="w-4 h-4" />}
                  onClick={handleAddStage}
                  size="small"
                >
                  Добавить этап
                </Button>
              </div>

              <div className="space-y-4">
                {stages.map((stage, index) => (
                  <div
                    key={stage.id}
                    className="p-4 border border-gray-200 rounded-lg space-y-3"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium text-gray-700">
                        Этап {index + 1}
                      </span>
                      {stages.length > 1 && (
                        <IconButton
                          size="small"
                          onClick={() => handleRemoveStage(stage.id)}
                        >
                          <Trash2 className="w-4 h-4 text-red-600" />
                        </IconButton>
                      )}
                    </div>
                    <TextField
                      label="Название этапа"
                      fullWidth
                      size="small"
                      value={stage.name}
                      onChange={(e) =>
                        handleStageChange(stage.id, 'name', e.target.value)
                      }
                      required
                    />
                    <TextField
                      label="Триггер (критерий перехода)"
                      fullWidth
                      size="small"
                      value={stage.trigger}
                      onChange={(e) =>
                        handleStageChange(stage.id, 'trigger', e.target.value)
                      }
                      placeholder="Например: Клиент заинтересован"
                    />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Отмена</Button>
          <Button onClick={handleSave} variant="contained">
            {editingFunnel ? 'Сохранить' : 'Создать'}
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}
