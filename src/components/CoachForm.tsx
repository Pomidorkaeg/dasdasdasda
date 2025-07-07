import React, { useState, useEffect } from 'react';
import { Coach } from '../types/coach';
import { Team } from '../types/models';
import { getTeams } from '../api/api';
import { createCoach, updateCoach } from '../api/api';
import { RefreshCw } from 'react-feather';

interface CoachFormProps {
  coach?: Coach;
  onSubmit: (coach: Coach) => void;
  onCancel: () => void;
  isOpen: boolean;
}

export const CoachForm: React.FC<CoachFormProps> = ({ coach, onSubmit, onCancel, isOpen }) => {
  const [teams, setTeams] = useState<Team[]>([]);
  const [loadingTeams, setLoadingTeams] = useState(false);
  const [formData, setFormData] = useState<Partial<Coach>>({
    name: '',
    team_id: '',
    photo: '',
    nationality: '',
    age: undefined,
    experience: undefined,
    achievements: '',
    ...coach
  });

  const fetchTeams = async () => {
    setLoadingTeams(true);
    try {
      const teamsData = await getTeams();
      setTeams(teamsData);
    } catch (error) {
      console.error('Error fetching teams:', error);
    } finally {
      setLoadingTeams(false);
    }
  };

  useEffect(() => {
    if (isOpen) fetchTeams();
  }, [isOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (coach?.id) {
        const updatedCoach = await updateCoach(coach.id, formData);
        onSubmit(updatedCoach);
      } else {
        const newCoach = await createCoach(formData as Omit<Coach, 'id'>);
        onSubmit(newCoach);
      }
    } catch (error) {
      console.error('Error saving coach:', error);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'age' || name === 'experience' ? Number(value) : value
    }));
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label htmlFor="name" className="block text-sm font-medium text-gray-700">
          Имя тренера
        </label>
        <input
          type="text"
          id="name"
          name="name"
          value={formData.name}
          onChange={handleChange}
          required
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
        />
      </div>

      <div>
        <label htmlFor="team_id" className="block text-sm font-medium text-gray-700">
          Команда
        </label>
        <div className="flex items-center space-x-2">
          <select
            id="team_id"
            name="team_id"
            value={formData.team_id}
            onChange={handleChange}
            required
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
          >
            <option value="">Выберите команду</option>
            {teams.map(team => (
              <option key={team.id} value={team.id}>
                {team.name}
              </option>
            ))}
          </select>
          <button
            type="button"
            onClick={fetchTeams}
            title="Обновить список команд"
            className="ml-2 p-2 rounded bg-gray-100 hover:bg-gray-200 border border-gray-300"
            disabled={loadingTeams}
          >
            <RefreshCw className={loadingTeams ? 'animate-spin' : ''} size={18} />
          </button>
        </div>
      </div>

      <div>
        <label htmlFor="photo" className="block text-sm font-medium text-gray-700">
          Фото URL
        </label>
        <input
          type="text"
          id="photo"
          name="photo"
          value={formData.photo}
          onChange={handleChange}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
        />
      </div>

      <div>
        <label htmlFor="nationality" className="block text-sm font-medium text-gray-700">
          Национальность
        </label>
        <input
          type="text"
          id="nationality"
          name="nationality"
          value={formData.nationality}
          onChange={handleChange}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
        />
      </div>

      <div>
        <label htmlFor="age" className="block text-sm font-medium text-gray-700">
          Возраст
        </label>
        <input
          type="number"
          id="age"
          name="age"
          value={formData.age}
          onChange={handleChange}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
        />
      </div>

      <div>
        <label htmlFor="experience" className="block text-sm font-medium text-gray-700">
          Опыт работы (лет)
        </label>
        <input
          type="number"
          id="experience"
          name="experience"
          value={formData.experience}
          onChange={handleChange}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
        />
      </div>

      <div>
        <label htmlFor="achievements" className="block text-sm font-medium text-gray-700">
          Достижения
        </label>
        <textarea
          id="achievements"
          name="achievements"
          value={formData.achievements}
          onChange={handleChange}
          rows={4}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
        />
      </div>

      <div className="flex justify-end space-x-3">
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          Отмена
        </button>
        <button
          type="submit"
          className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 border border-transparent rounded-md shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          {coach ? 'Сохранить' : 'Создать'}
        </button>
      </div>
    </form>
  );
}; 