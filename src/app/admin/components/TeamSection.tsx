'use client';

import { useState, useEffect } from 'react';
import type { Team } from '@/types/models';
import { db } from '@/lib/db';
import { Edit } from 'lucide-react';

const TeamSection = () => {
  const [team, setTeam] = useState<Team | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    shortName: '',
    logo: '',
    backgroundImage: '',
    primaryColor: '#000000',
    secondaryColor: '#ffffff',
    description: '',
    coach: '',
    foundedYear: new Date().getFullYear(),
    stadium: '',
    address: '',
    achievements: [] as string[],
    socialLinks: {
      website: '',
      instagram: '',
      facebook: '',
      twitter: '',
    },
    stats: {
      matches: 0,
      wins: 0,
      draws: 0,
      losses: 0,
      goalsFor: 0,
      goalsAgainst: 0,
      points: 0,
    },
  });

  useEffect(() => {
    loadTeam();
  }, []);

  const loadTeam = async () => {
    const teamData = await db.getTeam('main');
    setTeam(teamData);
    if (teamData) {
      setFormData({
        name: teamData.name,
        shortName: teamData.shortName,
        logo: teamData.logo,
        backgroundImage: teamData.backgroundImage,
        primaryColor: teamData.primaryColor,
        secondaryColor: teamData.secondaryColor,
        description: teamData.description,
        coach: teamData.coach,
        foundedYear: teamData.foundedYear,
        stadium: teamData.stadium,
        address: teamData.address,
        achievements: teamData.achievements,
        socialLinks: {
          website: teamData.socialLinks.website || '',
          instagram: teamData.socialLinks.instagram || '',
          facebook: teamData.socialLinks.facebook || '',
          twitter: teamData.socialLinks.twitter || '',
        },
        stats: teamData.stats,
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (team) {
        await db.updateTeam(team.id, formData);
      } else {
        await db.createTeam(formData);
      }
      setIsModalOpen(false);
      loadTeam();
    } catch (error) {
      console.error('Error saving team:', error);
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Управление командой</h2>
        <button
          onClick={() => setIsModalOpen(true)}
          className="bg-blue-500 text-white px-4 py-2 rounded-lg flex items-center"
        >
          <Edit className="w-5 h-5 mr-2" />
          Редактировать информацию
        </button>
      </div>

      {/* Team Info */}
      {team && (
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center space-x-4 mb-6">
            <img
              src={team.logo}
              alt={team.name}
              className="w-24 h-24 object-contain"
            />
            <div>
              <h3 className="text-2xl font-bold">{team.name}</h3>
              <p className="text-gray-600">{team.shortName}</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h4 className="text-lg font-semibold mb-4">Основная информация</h4>
              <div className="space-y-2">
                <p><span className="font-medium">Тренер:</span> {team.coach}</p>
                <p><span className="font-medium">Год основания:</span> {team.foundedYear}</p>
                <p><span className="font-medium">Стадион:</span> {team.stadium}</p>
                <p><span className="font-medium">Адрес:</span> {team.address}</p>
              </div>
            </div>

            <div>
              <h4 className="text-lg font-semibold mb-4">Статистика</h4>
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-gray-50 p-3 rounded-lg">
                  <p className="text-sm text-gray-600">Матчи</p>
                  <p className="text-xl font-bold">{team.stats.matches}</p>
                </div>
                <div className="bg-gray-50 p-3 rounded-lg">
                  <p className="text-sm text-gray-600">Победы</p>
                  <p className="text-xl font-bold">{team.stats.wins}</p>
                </div>
                <div className="bg-gray-50 p-3 rounded-lg">
                  <p className="text-sm text-gray-600">Ничьи</p>
                  <p className="text-xl font-bold">{team.stats.draws}</p>
                </div>
                <div className="bg-gray-50 p-3 rounded-lg">
                  <p className="text-sm text-gray-600">Поражения</p>
                  <p className="text-xl font-bold">{team.stats.losses}</p>
                </div>
                <div className="bg-gray-50 p-3 rounded-lg">
                  <p className="text-sm text-gray-600">Забито</p>
                  <p className="text-xl font-bold">{team.stats.goalsFor}</p>
                </div>
                <div className="bg-gray-50 p-3 rounded-lg">
                  <p className="text-sm text-gray-600">Пропущено</p>
                  <p className="text-xl font-bold">{team.stats.goalsAgainst}</p>
                </div>
                <div className="bg-gray-50 p-3 rounded-lg col-span-2">
                  <p className="text-sm text-gray-600">Очки</p>
                  <p className="text-xl font-bold">{team.stats.points}</p>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-6">
            <h4 className="text-lg font-semibold mb-4">Достижения</h4>
            <ul className="list-disc list-inside space-y-1">
              {team.achievements.map((achievement, index) => (
                <li key={index} className="text-gray-600">{achievement}</li>
              ))}
            </ul>
          </div>

          <div className="mt-6">
            <h4 className="text-lg font-semibold mb-4">Социальные сети</h4>
            <div className="flex space-x-4">
              {team.socialLinks.website && (
                <a
                  href={team.socialLinks.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-500 hover:text-blue-700"
                >
                  Веб-сайт
                </a>
              )}
              {team.socialLinks.instagram && (
                <a
                  href={team.socialLinks.instagram}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-pink-500 hover:text-pink-700"
                >
                  Instagram
                </a>
              )}
              {team.socialLinks.facebook && (
                <a
                  href={team.socialLinks.facebook}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:text-blue-800"
                >
                  Facebook
                </a>
              )}
              {team.socialLinks.twitter && (
                <a
                  href={team.socialLinks.twitter}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-400 hover:text-blue-600"
                >
                  Twitter
                </a>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white rounded-lg p-6 w-full max-w-4xl max-h-[90vh] overflow-y-auto">
            <h3 className="text-xl font-bold mb-4">
              {team ? 'Редактировать информацию о команде' : 'Добавить информацию о команде'}
            </h3>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Название команды</label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Короткое название</label>
                  <input
                    type="text"
                    value={formData.shortName}
                    onChange={(e) => setFormData({ ...formData, shortName: e.target.value })}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">URL логотипа</label>
                  <input
                    type="text"
                    value={formData.logo}
                    onChange={(e) => setFormData({ ...formData, logo: e.target.value })}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">URL фонового изображения</label>
                  <input
                    type="text"
                    value={formData.backgroundImage}
                    onChange={(e) => setFormData({ ...formData, backgroundImage: e.target.value })}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Основной цвет</label>
                  <input
                    type="color"
                    value={formData.primaryColor}
                    onChange={(e) => setFormData({ ...formData, primaryColor: e.target.value })}
                    className="mt-1 block w-full h-10 rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Дополнительный цвет</label>
                  <input
                    type="color"
                    value={formData.secondaryColor}
                    onChange={(e) => setFormData({ ...formData, secondaryColor: e.target.value })}
                    className="mt-1 block w-full h-10 rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    required
                  />
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

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Тренер</label>
                  <input
                    type="text"
                    value={formData.coach}
                    onChange={(e) => setFormData({ ...formData, coach: e.target.value })}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Год основания</label>
                  <input
                    type="number"
                    min="1800"
                    max={new Date().getFullYear()}
                    value={formData.foundedYear}
                    onChange={(e) => setFormData({ ...formData, foundedYear: parseInt(e.target.value) })}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Стадион</label>
                  <input
                    type="text"
                    value={formData.stadium}
                    onChange={(e) => setFormData({ ...formData, stadium: e.target.value })}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Адрес</label>
                  <input
                    type="text"
                    value={formData.address}
                    onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Достижения</label>
                <textarea
                  value={formData.achievements.join('\n')}
                  onChange={(e) => setFormData({
                    ...formData,
                    achievements: e.target.value.split('\n').filter(Boolean)
                  })}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  rows={4}
                  placeholder="Введите каждое достижение с новой строки"
                />
              </div>

              <div>
                <h4 className="text-sm font-medium text-gray-700 mb-2">Социальные сети</h4>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm text-gray-600">Веб-сайт</label>
                    <input
                      type="url"
                      value={formData.socialLinks.website}
                      onChange={(e) => setFormData({
                        ...formData,
                        socialLinks: { ...formData.socialLinks, website: e.target.value }
                      })}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm text-gray-600">Instagram</label>
                    <input
                      type="url"
                      value={formData.socialLinks.instagram}
                      onChange={(e) => setFormData({
                        ...formData,
                        socialLinks: { ...formData.socialLinks, instagram: e.target.value }
                      })}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm text-gray-600">Facebook</label>
                    <input
                      type="url"
                      value={formData.socialLinks.facebook}
                      onChange={(e) => setFormData({
                        ...formData,
                        socialLinks: { ...formData.socialLinks, facebook: e.target.value }
                      })}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm text-gray-600">Twitter</label>
                    <input
                      type="url"
                      value={formData.socialLinks.twitter}
                      onChange={(e) => setFormData({
                        ...formData,
                        socialLinks: { ...formData.socialLinks, twitter: e.target.value }
                      })}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    />
                  </div>
                </div>
              </div>

              <div>
                <h4 className="text-sm font-medium text-gray-700 mb-2">Статистика</h4>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm text-gray-600">Матчи</label>
                    <input
                      type="number"
                      min="0"
                      value={formData.stats.matches}
                      onChange={(e) => setFormData({
                        ...formData,
                        stats: { ...formData.stats, matches: parseInt(e.target.value) }
                      })}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm text-gray-600">Победы</label>
                    <input
                      type="number"
                      min="0"
                      value={formData.stats.wins}
                      onChange={(e) => setFormData({
                        ...formData,
                        stats: { ...formData.stats, wins: parseInt(e.target.value) }
                      })}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm text-gray-600">Ничьи</label>
                    <input
                      type="number"
                      min="0"
                      value={formData.stats.draws}
                      onChange={(e) => setFormData({
                        ...formData,
                        stats: { ...formData.stats, draws: parseInt(e.target.value) }
                      })}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm text-gray-600">Поражения</label>
                    <input
                      type="number"
                      min="0"
                      value={formData.stats.losses}
                      onChange={(e) => setFormData({
                        ...formData,
                        stats: { ...formData.stats, losses: parseInt(e.target.value) }
                      })}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm text-gray-600">Забито</label>
                    <input
                      type="number"
                      min="0"
                      value={formData.stats.goalsFor}
                      onChange={(e) => setFormData({
                        ...formData,
                        stats: { ...formData.stats, goalsFor: parseInt(e.target.value) }
                      })}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm text-gray-600">Пропущено</label>
                    <input
                      type="number"
                      min="0"
                      value={formData.stats.goalsAgainst}
                      onChange={(e) => setFormData({
                        ...formData,
                        stats: { ...formData.stats, goalsAgainst: parseInt(e.target.value) }
                      })}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm text-gray-600">Очки</label>
                    <input
                      type="number"
                      min="0"
                      value={formData.stats.points}
                      onChange={(e) => setFormData({
                        ...formData,
                        stats: { ...formData.stats, points: parseInt(e.target.value) }
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
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200"
                >
                  Отмена
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-white bg-blue-500 rounded-lg hover:bg-blue-600"
                >
                  Сохранить
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default TeamSection; 