'use client';

import { useState, useEffect } from 'react';
import type { Match } from '@/types/models';
import { db } from '@/lib/db';
import { Plus, Edit, Trash2 } from 'lucide-react';

const MatchesSection = () => {
  const [matches, setMatches] = useState<Match[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingMatch, setEditingMatch] = useState<Match | null>(null);
  const [formData, setFormData] = useState<Omit<Match, 'id' | 'created_at' | 'updated_at'>>({
    date: new Date(),
    time: '19:00',
    opponent: '',
    venue: 'home' as const,
    competition: '',
    score: {
      home: 0,
      away: 0,
    },
    status: 'scheduled' as const,
    stats: {
      possession: 50,
      shots: 0,
      shotsOnTarget: 0,
      corners: 0,
      fouls: 0,
      yellowCards: 0,
      redCards: 0,
    },
    highlights: [],
  });

  useEffect(() => {
    loadMatches();
  }, []);

  const loadMatches = async () => {
    const matchesData = await db.getMatches();
    setMatches(matchesData);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingMatch) {
        await db.updateMatch(editingMatch.id, formData);
      } else {
        await db.createMatch(formData);
      }
      setIsModalOpen(false);
      setEditingMatch(null);
      setFormData({
        date: new Date(),
        time: '19:00',
        opponent: '',
        venue: 'home' as const,
        competition: '',
        score: {
          home: 0,
          away: 0,
        },
        status: 'scheduled' as const,
        stats: {
          possession: 50,
          shots: 0,
          shotsOnTarget: 0,
          corners: 0,
          fouls: 0,
          yellowCards: 0,
          redCards: 0,
        },
        highlights: [],
      });
      loadMatches();
    } catch (error) {
      console.error('Error saving match:', error);
    }
  };

  const handleEdit = (match: Match) => {
    setEditingMatch(match);
    setFormData({
      date: match.date,
      time: match.time,
      opponent: match.opponent,
      venue: match.venue,
      competition: match.competition,
      status: match.status,
      score: match.score,
      stats: match.stats,
      highlights: match.highlights,
    });
    setIsModalOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Вы уверены, что хотите удалить этот матч?')) {
      try {
        await db.deleteMatch(id);
        loadMatches();
      } catch (error) {
        console.error('Error deleting match:', error);
      }
    }
  };

  const getStatusColor = (status: Match['status']) => {
    switch (status) {
      case 'scheduled':
        return 'bg-blue-100 text-blue-800';
      case 'live':
        return 'bg-green-100 text-green-800';
      case 'completed':
        return 'bg-gray-100 text-gray-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status: Match['status']) => {
    switch (status) {
      case 'scheduled':
        return 'Запланирован';
      case 'live':
        return 'В прямом эфире';
      case 'completed':
        return 'Завершен';
      case 'cancelled':
        return 'Отменен';
      default:
        return status;
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Управление матчами</h2>
        <button
          onClick={() => setIsModalOpen(true)}
          className="bg-blue-500 text-white px-4 py-2 rounded-lg flex items-center"
        >
          <Plus className="w-5 h-5 mr-2" />
          Добавить матч
        </button>
      </div>

      {/* Matches Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {matches.map((match) => (
          <div key={match.id} className="bg-white rounded-lg shadow-md p-6">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h3 className="text-xl font-semibold">{match.opponent}</h3>
                <p className="text-sm text-gray-500">
                  {new Date(match.date).toLocaleDateString()} • {match.time}
                </p>
                <p className="text-sm text-gray-500">{match.competition}</p>
              </div>
              <div className="flex space-x-2">
                <button
                  onClick={() => handleEdit(match)}
                  className="text-blue-500 hover:text-blue-700"
                >
                  <Edit className="w-5 h-5" />
                </button>
                <button
                  onClick={() => handleDelete(match.id)}
                  className="text-red-500 hover:text-red-700"
                >
                  <Trash2 className="w-5 h-5" />
                </button>
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Статус:</span>
                <span className={`px-2 py-1 rounded-full text-xs ${getStatusColor(match.status)}`}>
                  {getStatusText(match.status)}
                </span>
              </div>

              {match.status === 'completed' && (
                <div className="bg-gray-50 p-4 rounded-lg">
                  <div className="flex justify-between items-center mb-2">
                    <span className="font-medium">Счет:</span>
                    <span className="text-xl font-bold">
                      {match.score.home} - {match.score.away}
                    </span>
                  </div>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <p className="text-gray-600">Владение мячом:</p>
                      <p className="font-medium">{match.stats.possession}%</p>
                    </div>
                    <div>
                      <p className="text-gray-600">Удары:</p>
                      <p className="font-medium">{match.stats.shots} ({match.stats.shotsOnTarget} в створ)</p>
                    </div>
                    <div>
                      <p className="text-gray-600">Угловые:</p>
                      <p className="font-medium">{match.stats.corners}</p>
                    </div>
                    <div>
                      <p className="text-gray-600">Фолы:</p>
                      <p className="font-medium">{match.stats.fouls}</p>
                    </div>
                  </div>
                </div>
              )}

              {match.highlights.length > 0 && (
                <div>
                  <h4 className="text-sm font-medium mb-2">Основные моменты:</h4>
                  <ul className="text-sm text-gray-600 space-y-1">
                    {match.highlights.map((highlight, index) => (
                      <li key={index}>• {highlight}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white rounded-lg p-6 w-full max-w-2xl">
            <h3 className="text-xl font-bold mb-4">
              {editingMatch ? 'Редактировать матч' : 'Добавить матч'}
            </h3>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Соперник</label>
                  <input
                    type="text"
                    value={formData.opponent}
                    onChange={(e) => setFormData({ ...formData, opponent: e.target.value })}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Турнир</label>
                  <input
                    type="text"
                    value={formData.competition}
                    onChange={(e) => setFormData({ ...formData, competition: e.target.value })}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Дата</label>
                  <input
                    type="date"
                    value={formData.date.toISOString().split('T')[0]}
                    onChange={(e) => setFormData({ ...formData, date: new Date(e.target.value) })}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Время</label>
                  <input
                    type="time"
                    value={formData.time}
                    onChange={(e) => setFormData({ ...formData, time: e.target.value })}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Место проведения</label>
                  <select
                    value={formData.venue}
                    onChange={(e) => setFormData({ ...formData, venue: e.target.value as 'home' | 'away' })}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    required
                  >
                    <option value="home">Домашний матч</option>
                    <option value="away">Выездной матч</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Статус</label>
                  <select
                    value={formData.status}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value as Match['status'] })}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    required
                  >
                    <option value="scheduled">Запланирован</option>
                    <option value="live">В прямом эфире</option>
                    <option value="completed">Завершен</option>
                    <option value="cancelled">Отменен</option>
                  </select>
                </div>
              </div>

              {formData.status === 'completed' && (
                <>
                  <div>
                    <h4 className="text-sm font-medium text-gray-700 mb-2">Счет</h4>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm text-gray-600">Наши голы</label>
                        <input
                          type="number"
                          min="0"
                          value={formData.score.home}
                          onChange={(e) => setFormData({
                            ...formData,
                            score: { ...formData.score, home: parseInt(e.target.value) }
                          })}
                          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-sm text-gray-600">Голы соперника</label>
                        <input
                          type="number"
                          min="0"
                          value={formData.score.away}
                          onChange={(e) => setFormData({
                            ...formData,
                            score: { ...formData.score, away: parseInt(e.target.value) }
                          })}
                          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                          required
                        />
                      </div>
                    </div>
                  </div>

                  <div>
                    <h4 className="text-sm font-medium text-gray-700 mb-2">Статистика</h4>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm text-gray-600">Владение мячом (%)</label>
                        <input
                          type="number"
                          min="0"
                          max="100"
                          value={formData.stats.possession}
                          onChange={(e) => setFormData({
                            ...formData,
                            stats: { ...formData.stats, possession: parseInt(e.target.value) }
                          })}
                          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-sm text-gray-600">Удары</label>
                        <input
                          type="number"
                          min="0"
                          value={formData.stats.shots}
                          onChange={(e) => setFormData({
                            ...formData,
                            stats: { ...formData.stats, shots: parseInt(e.target.value) }
                          })}
                          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-sm text-gray-600">Удары в створ</label>
                        <input
                          type="number"
                          min="0"
                          value={formData.stats.shotsOnTarget}
                          onChange={(e) => setFormData({
                            ...formData,
                            stats: { ...formData.stats, shotsOnTarget: parseInt(e.target.value) }
                          })}
                          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-sm text-gray-600">Угловые</label>
                        <input
                          type="number"
                          min="0"
                          value={formData.stats.corners}
                          onChange={(e) => setFormData({
                            ...formData,
                            stats: { ...formData.stats, corners: parseInt(e.target.value) }
                          })}
                          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-sm text-gray-600">Фолы</label>
                        <input
                          type="number"
                          min="0"
                          value={formData.stats.fouls}
                          onChange={(e) => setFormData({
                            ...formData,
                            stats: { ...formData.stats, fouls: parseInt(e.target.value) }
                          })}
                          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-sm text-gray-600">Желтые карточки</label>
                        <input
                          type="number"
                          min="0"
                          value={formData.stats.yellowCards}
                          onChange={(e) => setFormData({
                            ...formData,
                            stats: { ...formData.stats, yellowCards: parseInt(e.target.value) }
                          })}
                          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-sm text-gray-600">Красные карточки</label>
                        <input
                          type="number"
                          min="0"
                          value={formData.stats.redCards}
                          onChange={(e) => setFormData({
                            ...formData,
                            stats: { ...formData.stats, redCards: parseInt(e.target.value) }
                          })}
                          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                          required
                        />
                      </div>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700">Основные моменты</label>
                    <textarea
                      value={formData.highlights.join('\n')}
                      onChange={(e) => setFormData({
                        ...formData,
                        highlights: e.target.value.split('\n').filter(line => line.trim())
                      })}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                      rows={4}
                      placeholder="Введите каждый момент с новой строки"
                    />
                  </div>
                </>
              )}

              <div className="flex justify-end space-x-4 mt-6">
                <button
                  type="button"
                  onClick={() => {
                    setIsModalOpen(false);
                    setEditingMatch(null);
                    setFormData({
                      date: new Date(),
                      time: '19:00',
                      opponent: '',
                      venue: 'home' as const,
                      competition: '',
                      score: {
                        home: 0,
                        away: 0,
                      },
                      status: 'scheduled' as const,
                      stats: {
                        possession: 50,
                        shots: 0,
                        shotsOnTarget: 0,
                        corners: 0,
                        fouls: 0,
                        yellowCards: 0,
                        redCards: 0,
                      },
                      highlights: [],
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
                  {editingMatch ? 'Сохранить' : 'Добавить'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default MatchesSection; 