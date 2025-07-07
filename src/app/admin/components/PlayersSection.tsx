'use client';

import { useState, useEffect } from 'react';
import type { Player } from '@/types/models';
import type { Team } from '@/types/models';
import { db } from '@/lib/db';
import { Plus, Edit, Trash2 } from 'lucide-react';
import { DeletePlayerDialog } from '@/components/DeletePlayerDialog';

const PlayersSection = () => {
  const [players, setPlayers] = useState<Player[]>([]);
  const [teams, setTeams] = useState<Team[]>([]);
  const [selectedTeamId, setSelectedTeamId] = useState<string>('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingPlayer, setEditingPlayer] = useState<Player | null>(null);
  const [deletingPlayer, setDeletingPlayer] = useState<Player | null>(null);
  const [formData, setFormData] = useState<Omit<Player, 'id'>>({
    name: '',
    position: '',
    number: 0,
    team_id: '',
    team_name: '',
    nationality: '',
    age: 0,
    height: 0,
    weight: 0,
    photo: '',
    stats: {
      games: 0,
      goals: 0,
      assists: 0,
      yellowCards: 0,
      redCards: 0
    }
  });

  useEffect(() => {
    loadTeams();
    loadPlayers(''); // Load all players initially
  }, []);

  const loadTeams = async () => {
    try {
      const teamsData = await db.getTeams();
      setTeams(teamsData);
    } catch (error) {
      console.error('Error loading teams:', error);
    }
  };

  const loadPlayers = async (teamId?: string) => {
    try {
      const playersData = teamId ? await db.getPlayersByTeam(teamId) : await db.getPlayers();
      setPlayers(playersData);
    } catch (error) {
      console.error('Error loading players:', error);
    }
  };

  const handleTeamChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newTeamId = e.target.value;
    setSelectedTeamId(newTeamId);
    loadPlayers(newTeamId);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Handling form submission with formData:', formData);
    try {
      if (editingPlayer) {
        console.log('Attempting to update player with ID:', editingPlayer.id, 'and data:', formData);
        await db.updatePlayer(editingPlayer.id, formData);
        console.log('Player updated successfully.');
      } else {
        console.log('Attempting to create new player with data:', formData);
        await db.createPlayer(formData);
        console.log('Player created successfully.');
      }
      setIsModalOpen(false);
      setEditingPlayer(null);
      setFormData({
        name: '',
        position: '',
        number: 0,
        team_id: '',
        team_name: '',
        nationality: '',
        age: 0,
        height: 0,
        weight: 0,
        photo: '',
        stats: {
          games: 0,
          goals: 0,
          assists: 0,
          yellowCards: 0,
          redCards: 0
        }
      });
      loadPlayers(selectedTeamId);
    } catch (error) {
      console.error('Error saving player:', error);
    }
  };

  const handleEdit = (player: Player) => {
    setEditingPlayer(player);
    setFormData({
      name: player.name,
      position: player.position,
      number: player.number,
      team_id: player.team_id,
      team_name: player.team_name,
      nationality: player.nationality,
      age: player.age,
      height: player.height,
      weight: player.weight,
      photo: player.photo,
      stats: player.stats
    });
    setIsModalOpen(true);
  };

  const handleDelete = async (id: string) => {
    try {
      await db.deletePlayer(id);
      loadPlayers(selectedTeamId);
      setDeletingPlayer(null);
    } catch (error) {
      console.error('Error deleting player:', error);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Управление игроками</h2>
        <button
          onClick={() => {
            setEditingPlayer(null);
            setFormData({
              name: '',
              position: '',
              number: 0,
              team_id: '',
              team_name: '',
              nationality: '',
              age: 0,
              height: 0,
              weight: 0,
              photo: '',
              stats: {
                games: 0,
                goals: 0,
                assists: 0,
                yellowCards: 0,
                redCards: 0
              }
            });
            setIsModalOpen(true);
          }}
          className="bg-blue-500 text-white px-4 py-2 rounded-lg flex items-center"
        >
          <Plus className="w-5 h-5 mr-2" />
          Добавить игрока
        </button>
      </div>

      {/* Team Filter Buttons */}
      <div className="flex space-x-4 mb-6">
        <button
          onClick={() => handleTeamChange({ target: { value: '' } } as React.ChangeEvent<HTMLSelectElement>)}
          className={`px-4 py-2 rounded-lg ${selectedTeamId === '' ? 'bg-green-700 text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}`}
        >
          Все команды
        </button>
        {teams.map(team => (
          <button
            key={team.id}
            onClick={() => handleTeamChange({ target: { value: team.id } } as React.ChangeEvent<HTMLSelectElement>)}
            className={`px-4 py-2 rounded-lg ${selectedTeamId === team.id ? 'bg-green-700 text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}`}
          >
            {team.name}
          </button>
        ))}
      </div>

      {/* Players Table */}
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200 shadow overflow-hidden border-b border-gray-200 sm:rounded-lg">
          <thead className="bg-gray-50">
            <tr>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Имя</th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Команда</th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Позиция</th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Национальность</th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Возраст</th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Рост (см)</th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Вес (кг)</th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Игры</th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Голы</th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Передачи</th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Желтые карточки</th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Красные карточки</th>
              <th scope="col" className="relative px-6 py-3">
                <span className="sr-only">Edit</span>
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {players.map((player) => (
              <tr key={player.id}>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <div className="flex-shrink-0 h-10 w-10">
                      <img className="h-10 w-10 rounded-full" src={player.photo || '/default-player.png'} alt={player.name} />
                    </div>
                    <div className="ml-4">
                      <div className="text-sm font-medium text-gray-900">{player.name}</div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">{player.team_name || '-'}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">{player.position}</div>
                </td>
                 <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {player.nationality || '-'}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {player.age || '-'}
                </td>
                 <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {player.height || '-'}
                </td>
                 <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {player.weight || '-'}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {player.stats?.games ?? 0}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {player.stats?.goals ?? 0}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {player.stats?.assists ?? 0}
                </td>
                 <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {player.stats?.yellowCards ?? 0}
                </td>
                 <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {player.stats?.redCards ?? 0}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <button
                    onClick={() => handleEdit(player)}
                    className="text-blue-600 hover:text-blue-900 mr-4"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => setDeletingPlayer(player)}
                    className="text-red-600 hover:text-red-900"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white rounded-lg p-6 w-full max-w-2xl">
            <h3 className="text-xl font-bold mb-4">
              {editingPlayer ? 'Редактировать игрока' : 'Добавить игрока'}
            </h3>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Имя</label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Позиция</label>
                  <select
                    value={formData.position}
                    onChange={(e) => setFormData({ ...formData, position: e.target.value })}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    required
                  >
                    <option value="">Выберите позицию</option>
                    <option value="Вратарь">Вратарь</option>
                    <option value="Защитник">Защитник</option>
                    <option value="Полузащитник">Полузащитник</option>
                    <option value="Нападающий">Нападающий</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Номер</label>
                  <input
                    type="number"
                    min="1"
                    max="99"
                    value={formData.number}
                    onChange={(e) => setFormData({ ...formData, number: parseInt(e.target.value) })}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Возраст</label>
                  <input
                    type="number"
                    min="16"
                    max="50"
                    value={formData.age}
                    onChange={(e) => setFormData({ ...formData, age: parseInt(e.target.value) })}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">URL фото</label>
                <input
                  type="text"
                  value={formData.photo}
                  onChange={(e) => setFormData({ ...formData, photo: e.target.value })}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  required
                />
              </div>

              {/* Add dropdown for Team selection in the modal */}
              <div>
                <label className="block text-sm font-medium text-gray-700">Команда</label>
                <select
                  value={formData.team_id}
                  onChange={(e) => {
                    const selectedTeam = teams.find(team => team.id === e.target.value);
                    setFormData({
                      ...formData,
                      team_id: e.target.value,
                      team_name: selectedTeam?.name || ''
                    });
                  }}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  required
                >
                  <option value="">Выберите команду</option>
                  {teams.map(team => (
                    <option key={team.id} value={team.id}>{team.name}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Национальность</label>
                <input
                  type="text"
                  value={formData.nationality}
                  onChange={(e) => setFormData({ ...formData, nationality: e.target.value })}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Рост (см)</label>
                  <input
                    type="number"
                    min="0"
                    value={formData.height}
                    onChange={(e) => setFormData({ ...formData, height: parseInt(e.target.value) })}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Вес (кг)</label>
                  <input
                    type="number"
                    min="0"
                    value={formData.weight}
                    onChange={(e) => setFormData({ ...formData, weight: parseInt(e.target.value) })}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  />
                </div>
              </div>


              <div>
                <h4 className="text-sm font-medium text-gray-700 mb-2">Статистика</h4>
                <div className="grid grid-cols-5 gap-4">
                  <div>
                    <label className="block text-sm text-gray-600">Игры</label>
                    <input
                      type="number"
                      min="0"
                      value={formData.stats.games}
                      onChange={(e) => setFormData({
                        ...formData,
                        stats: { ...formData.stats, games: parseInt(e.target.value) }
                      })}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm text-gray-600">Голы</label>
                    <input
                      type="number"
                      min="0"
                      value={formData.stats.goals}
                      onChange={(e) => setFormData({
                        ...formData,
                        stats: { ...formData.stats, goals: parseInt(e.target.value) }
                      })}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm text-gray-600">Передачи</label>
                    <input
                      type="number"
                      min="0"
                      value={formData.stats.assists}
                      onChange={(e) => setFormData({
                        ...formData,
                        stats: { ...formData.stats, assists: parseInt(e.target.value) }
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

              <div className="flex justify-end space-x-4 mt-6">
                <button
                  type="button"
                  onClick={() => {
                    setIsModalOpen(false);
                    setEditingPlayer(null);
                    setFormData({
                      name: '',
                      position: '',
                      number: 0,
                      team_id: '',
                      team_name: '',
                      nationality: '',
                      age: 0,
                      height: 0,
                      weight: 0,
                      photo: '',
                      stats: {
                        games: 0,
                        goals: 0,
                        assists: 0,
                        yellowCards: 0,
                        redCards: 0
                      }
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
                  {editingPlayer ? 'Сохранить' : 'Добавить'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <DeletePlayerDialog
        player={deletingPlayer}
        onClose={() => setDeletingPlayer(null)}
        onConfirm={() => handleDelete(deletingPlayer?.id || '')}
      />
    </div>
  );
};

export default PlayersSection; 