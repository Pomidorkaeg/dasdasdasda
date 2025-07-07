import React, { useEffect, useState } from 'react';
import { Player, Team } from '@/types/models';
import { Coach } from '@/types/coach';
import { db } from '@/lib/db';
import { Button } from './ui/button';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from './ui/table';
import { cn } from '@/lib/utils';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { ScrollArea } from './ui/scroll-area';
import PlayerCard from './players/PlayerCard';

const Team = React.memo(() => {
  const [players, setPlayers] = useState<Player[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedTeam, setSelectedTeam] = useState<string | null>(null);
  const [teams, setTeams] = useState<Team[]>([]);
  const [coaches, setCoaches] = useState<Coach[]>([]);
  const [isCoachModalOpen, setIsCoachModalOpen] = useState(false);
  const [editingCoach, setEditingCoach] = useState<Coach | null>(null);
  const [coachForm, setCoachForm] = useState({
    name: '',
    team_id: '',
    photo: '',
    nationality: '',
    age: '',
    experience: '',
    achievements: '',
  });

  useEffect(() => {
    loadData();
    loadCoaches();
  }, []);

  const loadData = async () => {
    try {
      setIsLoading(true);
      // Загружаем команды из базы данных
      const teamsData = await db.getTeams();
      setTeams(teamsData);
      
      // Загружаем игроков
      const playersData = await db.getPlayers();
      setPlayers(playersData);
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const loadCoaches = async () => {
    const data = await db.getCoaches();
    setCoaches(data);
  };

  const handleCoachSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const coachData = {
        ...coachForm,
        age: coachForm.age ? Number(coachForm.age) : undefined,
        experience: coachForm.experience ? Number(coachForm.experience) : undefined,
      };
      if (editingCoach) {
        await db.updateCoach(editingCoach.id, coachData);
      } else {
        await db.createCoach(coachData);
      }
      setIsCoachModalOpen(false);
      setEditingCoach(null);
      setCoachForm({
        name: '',
        team_id: '',
        photo: '',
        nationality: '',
        age: '',
        experience: '',
        achievements: '',
      });
      loadCoaches();
    } catch (error) {
      console.error('Error saving coach:', error);
    }
  };

  const handleEditCoach = (coach: Coach) => {
    setEditingCoach(coach);
    setCoachForm({
      name: coach.name,
      team_id: coach.team_id,
      photo: coach.photo || '',
      nationality: coach.nationality || '',
      age: coach.age ? String(coach.age) : '',
      experience: coach.experience ? String(coach.experience) : '',
      achievements: coach.achievements || '',
    });
    setIsCoachModalOpen(true);
  };

  const handleDeleteCoach = async (id: string) => {
    if (window.confirm('Вы уверены, что хотите удалить этого тренера?')) {
      try {
        await db.deleteCoach(id);
        loadCoaches();
      } catch (error) {
        console.error('Error deleting coach:', error);
      }
    }
  };

  const filteredPlayers = selectedTeam
    ? players.filter(player => player.team_id === selectedTeam)
    : players;

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString('ru-RU', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    });
  };

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <Card>
        <CardHeader>
          <CardTitle>Команда</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2 mb-6">
            <Button
              variant={selectedTeam === null ? "default" : "outline"}
              onClick={() => setSelectedTeam(null)}
            >
              Все команды
            </Button>
            {teams.map(team => (
              <Button
                key={team.id}
                variant={selectedTeam === team.id ? "default" : "outline"}
                onClick={() => setSelectedTeam(team.id)}
              >
                {team.name}
              </Button>
            ))}
          </div>
          {filteredPlayers.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-500 text-lg">Нет данных</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {filteredPlayers.map((player) => (
                <PlayerCard
                  key={player.id}
                  player={player}
                  primaryColor={
                    teams.find(t => t.id === player.team_id)?.primaryColor || '#222'
                  }
                />
              ))}
            </div>
          )}
          <div className="my-12 border-t border-gray-200 pt-8">
            <h2 className="text-2xl font-bold mb-6">Тренеры</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {coaches.filter(coach => !selectedTeam || coach.team_id === selectedTeam).length === 0 ? (
                <div className="text-center py-12 col-span-full">
                  <p className="text-gray-500 text-lg">Нет тренеров</p>
                </div>
              ) : (
                coaches
                  .filter(coach => !selectedTeam || coach.team_id === selectedTeam)
                  .map((coach) => (
                    <div key={coach.id} className="bg-white rounded-lg shadow-md p-6 flex flex-col items-center">
                      {coach.photo && <img src={coach.photo} alt={coach.name} className="w-24 h-24 rounded-full object-cover mb-4" />}
                      <h3 className="text-xl font-semibold mb-1">{coach.name}</h3>
                      <p className="text-gray-500 text-sm mb-2">{coach.nationality}</p>
                      <p className="text-gray-500 text-sm mb-2">Возраст: {coach.age || '-'}</p>
                      <p className="text-gray-500 text-sm mb-2">Опыт: {coach.experience || '-'} лет</p>
                      {coach.achievements && <p className="text-gray-700 text-xs mb-2">{coach.achievements}</p>}
                    </div>
                  ))
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
});

Team.displayName = 'Team';

export default Team; 