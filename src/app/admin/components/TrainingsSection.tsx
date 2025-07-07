'use client';

import { useState, useEffect } from 'react';
import type { Training, Player } from '@/types/models';
import { db } from '@/lib/db';
import { Plus, Edit, Trash2 } from 'lucide-react';

const TrainingsSection = () => {
  const [trainings, setTrainings] = useState<Training[]>([]);
  const [players, setPlayers] = useState<Player[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTraining, setEditingTraining] = useState<Training | null>(null);
  const [formData, setFormData] = useState({
    date: new Date().toISOString().split('T')[0],
    type: '',
    description: '',
    location: '',
    participants: [] as string[],
  });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    const [trainingsData, playersData] = await Promise.all([
      db.getTrainings(),
      db.getPlayers()
    ]);
    setTrainings(trainingsData);
    setPlayers(playersData);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const trainingData = {
        ...formData,
        date: new Date(formData.date),
      };

      if (editingTraining) {
        await db.updateTraining(editingTraining.id, trainingData);
      } else {
        await db.createTraining(trainingData);
      }
      setIsModalOpen(false);
      setEditingTraining(null);
      setFormData({
        date: new Date().toISOString().split('T')[0],
        type: '',
        description: '',
        location: '',
        participants: [],
      });
      loadData();
    } catch (error) {
      console.error('Error saving training:', error);
    }
  };

  const handleEdit = (training: Training) => {
    setEditingTraining(training);
    setFormData({
      date: training.date.toISOString().split('T')[0],
      type: training.type,
      description: training.description,
      location: training.location,
      participants: training.participants,
    });
    setIsModalOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Вы уверены, что хотите удалить эту тренировку?')) {
      try {
        await db.deleteTraining(id);
        loadData();
      } catch (error) {
        console.error('Error deleting training:', error);
      }
    }
  };

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString('ru-RU', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    });
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Управление тренировками</h2>
        <button
          onClick={() => setIsModalOpen(true)}
          className="bg-blue-500 text-white px-4 py-2 rounded-lg flex items-center"
        >
          <Plus className="w-5 h-5 mr-2" />
          Добавить тренировку
        </button>
      </div>

      {/* Trainings Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {trainings.map((training) => (
          <div key={training.id} className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-xl font-semibold">{training.type}</h3>
                <p className="text-sm text-gray-500">{formatDate(training.date)}</p>
              </div>
              <div className="flex space-x-2">
                <button
                  onClick={() => handleEdit(training)}
                  className="text-blue-500 hover:text-blue-700"
                >
                  <Edit className="w-5 h-5" />
                </button>
                <button
                  onClick={() => handleDelete(training.id)}
                  className="text-red-500 hover:text-red-700"
                >
                  <Trash2 className="w-5 h-5" />
                </button>
              </div>
            </div>
            <div className="text-sm text-gray-600 space-y-2">
              <p>{training.description}</p>
              <p>Место проведения: {training.location}</p>
              <div className="border-t pt-2">
                <h4 className="font-medium mb-1">Участники:</h4>
                <ul className="text-xs list-disc list-inside">
                  {training.participants.map((playerId) => {
                    const player = players.find(p => p.id === playerId);
                    return (
                      <li key={playerId}>
                        {player ? `${player.name} (№${player.number})` : 'Неизвестный игрок'}
                      </li>
                    );
                  })}
                </ul>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white rounded-lg p-6 w-full max-w-2xl">
            <h3 className="text-xl font-bold mb-4">
              {editingTraining ? 'Редактировать тренировку' : 'Добавить тренировку'}
            </h3>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Дата</label>
                  <input
                    type="date"
                    value={formData.date}
                    onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Тип тренировки</label>
                  <select
                    value={formData.type}
                    onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    required
                  >
                    <option value="">Выберите тип</option>
                    <option value="Общая физическая подготовка">Общая физическая подготовка</option>
                    <option value="Техническая">Техническая</option>
                    <option value="Тактическая">Тактическая</option>
                    <option value="Восстановительная">Восстановительная</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Описание</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  rows={4}
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Место проведения</label>
                <input
                  type="text"
                  value={formData.location}
                  onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Участники</label>
                <select
                  multiple
                  value={formData.participants}
                  onChange={(e) => {
                    const selectedOptions = Array.from(e.target.selectedOptions, option => option.value);
                    setFormData({ ...formData, participants: selectedOptions });
                  }}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  size={5}
                >
                  {players.map((player) => (
                    <option key={player.id} value={player.id}>
                      {player.name} (№{player.number})
                    </option>
                  ))}
                </select>
                <p className="mt-1 text-xs text-gray-500">
                  Удерживайте Ctrl (Cmd на Mac) для выбора нескольких игроков
                </p>
              </div>

              <div className="flex justify-end space-x-4 mt-6">
                <button
                  type="button"
                  onClick={() => {
                    setIsModalOpen(false);
                    setEditingTraining(null);
                    setFormData({
                      date: new Date().toISOString().split('T')[0],
                      type: '',
                      description: '',
                      location: '',
                      participants: [],
                    });
                  }}
                  className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200"
                >
                  Отмена
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-white bg-blue-500 rounded-lg hover:bg-blue-600"
                >
                  {editingTraining ? 'Сохранить' : 'Добавить'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default TrainingsSection; 