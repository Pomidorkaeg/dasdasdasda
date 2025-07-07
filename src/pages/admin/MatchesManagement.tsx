import React, { useState, useEffect } from 'react';
import { matchesApi, teamsApi } from '@/api/api';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Plus, Pencil, Trash2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Match, Team } from '@/types/models';
import { Table, TableBody, TableCell, TableHeader, TableHead, TableRow } from '@/components/ui/table';

const MatchesManagement = () => {
  const { toast } = useToast();
  const [matches, setMatches] = useState<Match[]>([]);
  const [teams, setTeams] = useState<Team[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingMatch, setEditingMatch] = useState<Match | null>(null);
  const [formData, setFormData] = useState({
    opponent: '',
    date: '',
    time: '',
    venue: '',
    competition: '',
    score: { home: 0, away: 0 },
    status: 'scheduled' as 'scheduled' | 'live' | 'completed' | 'cancelled'
  });

  useEffect(() => {
    loadMatches();
    loadTeams();
  }, []);

  const loadMatches = async () => {
    try {
      const data = await matchesApi.getAll();
      if (data && Array.isArray(data)) {
        const normalized = data.map((m: any) => ({
          id: m.id,
          date: m.date ? new Date(m.date) : new Date(),
          time: m.startTime || '',
          opponent: m.opponent || '',
          venue: m.location || '',
          competition: m.competition || '',
          score: typeof m.score === 'string' ? JSON.parse(m.score) : (m.score || { home: 0, away: 0 }),
          status: m.status || 'scheduled',
          stats: m.stats || {
            possession: 0,
            shots: 0,
            shotsOnTarget: 0,
            corners: 0,
            fouls: 0,
            yellowCards: 0,
            redCards: 0
          },
          highlights: typeof m.highlights === 'string' ? JSON.parse(m.highlights) : (m.highlights || []),
          created_at: m.created_at,
          updated_at: m.updated_at
        }));
        setMatches(normalized);
      } else {
        setMatches([]);
        console.error('Полученные данные не являются массивом:', data);
      }
    } catch (error) {
      console.error('Ошибка при загрузке матчей:', error);
      setMatches([]);
      toast({
        variant: "destructive",
        title: "Ошибка",
        description: "Ошибка при загрузке матчей"
      });
    }
  };

  const loadTeams = async () => {
    try {
      const data = await teamsApi.getAll();
      if (data && Array.isArray(data)) {
        setTeams(data);
      } else {
        setTeams([]);
        console.error('Полученные данные не являются массивом:', data);
      }
    } catch (error) {
      console.error('Ошибка при загрузке команд:', error);
      setTeams([]);
      toast({
        variant: "destructive",
        title: "Ошибка",
        description: "Ошибка при загрузке команд"
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const matchData = {
        ...formData,
        date: new Date(formData.date),
        score: formData.score,
        highlights: []
      };

      if (editingMatch) {
        await matchesApi.update(editingMatch.id, matchData);
        toast({
          title: "Успех",
          description: "Матч успешно обновлен"
        });
      } else {
        await matchesApi.create(matchData);
        toast({
          title: "Успех",
          description: "Матч успешно создан"
        });
      }

      setIsDialogOpen(false);
      setEditingMatch(null);
      setFormData({
        opponent: '',
        date: '',
        time: '',
        venue: '',
        competition: '',
        score: { home: 0, away: 0 },
        status: 'scheduled'
      });
      loadMatches();
    } catch (error) {
      console.error('Error saving match:', error);
      toast({
        variant: "destructive",
        title: "Ошибка",
        description: "Не удалось сохранить матч"
      });
    }
  };

  const handleEdit = (match: Match) => {
    setEditingMatch(match);
    setFormData({
      opponent: match.opponent,
      date: match.date.toISOString().split('T')[0],
      time: match.time,
      venue: match.venue,
      competition: match.competition || '',
      score: match.score,
      status: match.status
    });
    setIsDialogOpen(true);
  };

  const handleDelete = async (id: string) => {
    try {
      await matchesApi.delete(id);
      toast({
        title: "Успех",
        description: "Матч успешно удален"
      });
      loadMatches();
    } catch (error) {
      console.error('Error deleting match:', error);
      toast({
        variant: "destructive",
        title: "Ошибка",
        description: "Не удалось удалить матч"
      });
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-3xl font-bold">Управление матчами</h2>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => setIsDialogOpen(false)}>
              <Plus className="w-4 h-4 mr-2" />
              Добавить матч
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{editingMatch ? 'Редактировать матч' : 'Новый матч'}</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label>Хозяева</label>
                  <Select
                    value={formData.opponent}
                    onValueChange={(value) => setFormData({ ...formData, opponent: value })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Выберите команду" />
                    </SelectTrigger>
                    <SelectContent>
                      {teams.map((team) => (
                        <SelectItem key={team.id} value={team.name}>
                          {team.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <label>Дата матча</label>
                  <Input
                    type="date"
                    value={formData.date}
                    onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label>Время матча</label>
                  <Input
                    type="time"
                    value={formData.time}
                    onChange={(e) => setFormData({ ...formData, time: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <label>Место проведения</label>
                  <Input
                    value={formData.venue}
                    onChange={(e) => setFormData({ ...formData, venue: e.target.value })}
                  />
                </div>
              </div>
              <div className="space-y-2">
                <label>Соревнование</label>
                <Input
                  value={formData.competition}
                  onChange={(e) => setFormData({ ...formData, competition: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <label>Счет</label>
                <Input
                  type="text"
                  value={`${formData.score.home} - ${formData.score.away}`}
                  onChange={(e) => setFormData({ ...formData, score: { home: parseInt(e.target.value.split(' - ')[0]), away: parseInt(e.target.value.split(' - ')[1]) } })}
                />
              </div>
              <div className="space-y-2">
                <label>Статус</label>
                <Select
                  value={formData.status}
                  onValueChange={(value) => setFormData({ ...formData, status: value as 'scheduled' | 'live' | 'completed' | 'cancelled' })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Выберите статус" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="scheduled">Запланирован</SelectItem>
                    <SelectItem value="live">В прямом эфире</SelectItem>
                    <SelectItem value="completed">Завершен</SelectItem>
                    <SelectItem value="cancelled">Отменен</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="flex justify-end space-x-2">
                <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                  Отмена
                </Button>
                <Button type="submit">
                  {editingMatch ? 'Сохранить' : 'Создать'}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Дата</TableHead>
            <TableHead>Время</TableHead>
            <TableHead>Соперник</TableHead>
            <TableHead>Место</TableHead>
            <TableHead>Счет</TableHead>
            <TableHead>Статус</TableHead>
            <TableHead>Действия</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {matches.map((match) => (
            <TableRow key={match.id}>
              <TableCell>{new Date(match.date).toLocaleDateString()}</TableCell>
              <TableCell>{match.time}</TableCell>
              <TableCell>{match.opponent}</TableCell>
              <TableCell>{match.venue}</TableCell>
              <TableCell>{`${match.score.home} - ${match.score.away}`}</TableCell>
              <TableCell>
                <span className={`px-2 py-1 rounded-full text-xs ${
                  match.status === 'completed' ? 'bg-green-100 text-green-800' :
                  match.status === 'live' ? 'bg-red-100 text-red-800' :
                  match.status === 'cancelled' ? 'bg-gray-100 text-gray-800' :
                  'bg-blue-100 text-blue-800'
                }`}>
                  {match.status === 'completed' ? 'Завершен' :
                   match.status === 'live' ? 'В прямом эфире' :
                   match.status === 'cancelled' ? 'Отменен' :
                   'Запланирован'}
                </span>
              </TableCell>
              <TableCell>
                <div className="flex space-x-2">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleEdit(match)}
                  >
                    <Pencil className="w-4 h-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleDelete(match.id)}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default MatchesManagement; 