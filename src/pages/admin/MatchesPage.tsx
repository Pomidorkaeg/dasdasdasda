import React, { useEffect, useState } from 'react';
import { EntityForm, FormField } from '../../components/admin/EntityForm';
import { db } from '../../lib/db';
import { Match } from '../../types/models';

export const MatchesPage: React.FC = () => {
  const [matches, setMatches] = useState<Match[]>([]);
  const [selectedMatch, setSelectedMatch] = useState<Match | null>(null);
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    loadMatches();
  }, []);

  const loadMatches = async () => {
    const data = await db.getMatches();
    setMatches(data);
  };

  const handleSubmit = async (data: any) => {
    try {
      if (selectedMatch) {
        await db.updateMatch(selectedMatch.id, data);
      } else {
        await db.createMatch(data);
      }
      await loadMatches();
      setIsEditing(false);
      setSelectedMatch(null);
    } catch (error) {
      console.error('Error saving match:', error);
    }
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Вы уверены, что хотите удалить этот матч?')) {
      try {
        await db.deleteMatch(id);
        await loadMatches();
      } catch (error) {
        console.error('Error deleting match:', error);
      }
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Управление матчами</h1>
        <button
          onClick={() => {
            setSelectedMatch(null);
            setIsEditing(true);
          }}
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          Добавить матч
        </button>
      </div>

      {isEditing ? (
        <EntityForm
          title={selectedMatch ? 'Редактировать матч' : 'Добавить матч'}
          onSubmit={handleSubmit}
          initialData={selectedMatch}
        >
          <FormField label="Дата" name="date" type="date" required defaultValue={selectedMatch?.date as any} />
          <FormField label="Время начала" name="startTime" type="time" required defaultValue={selectedMatch?.startTime} />
          <FormField label="Соперник" name="opponent" required defaultValue={selectedMatch?.opponent} />
          <FormField label="Локация" name="location" required defaultValue={selectedMatch?.location} />
          <FormField label="Счет (дом)" name="score.home" type="number" defaultValue={selectedMatch?.score?.home} />
          <FormField label="Счет (гости)" name="score.away" type="number" defaultValue={selectedMatch?.score?.away} />
          <FormField label="Статус" name="status" required defaultValue={selectedMatch?.status || 'upcoming'} />
        </EntityForm>
      ) :
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {matches.map((match) => (
            <div key={match.id} className="bg-white p-4 rounded-lg shadow">
              <h3 className="text-xl font-semibold">{match.opponent}</h3>
              <p className="text-gray-600">Дата: {String(match.date)}{match.startTime ? `, ${match.startTime}` : ''}</p>
              <p className="text-gray-600">Локация: {match.location}</p>
              <p className="text-gray-600">Счет: {match.score?.home} : {match.score?.away}</p>
              <p className="text-gray-600">Статус: {match.status}</p>
              <div className="mt-4 flex space-x-2">
                <button
                  onClick={() => {
                    setSelectedMatch(match);
                    setIsEditing(true);
                  }}
                  className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600"
                >
                  Редактировать
                </button>
                <button
                  onClick={() => handleDelete(match.id)}
                  className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600"
                >
                  Удалить
                </button>
              </div>
            </div>
          ))}
        </div>
      }
    </div>
  );
}; 