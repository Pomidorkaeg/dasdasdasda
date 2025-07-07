import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Plus, Search, Pencil, Trash, Briefcase, Calendar, Award } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import CoachEditor from './CoachEditor';
import { getTeamById } from '@/utils/teamsData';
import { Coach } from '@/types/coach';
import { toast } from '@/components/ui/use-toast';
import { Card, CardHeader, CardTitle } from '@/components/ui/card';
import { db } from '@/lib/db';

const CoachesManagement = () => {
  const [searchParams] = useSearchParams();
  const teamId = searchParams.get('team') || 'gudauta';
  
  const [coaches, setCoaches] = useState<Coach[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [editMode, setEditMode] = useState(false);
  const [currentCoach, setCurrentCoach] = useState<Coach | null>(null);
  
  const team = getTeamById(teamId);
  
  useEffect(() => {
    const fetchCoaches = async () => {
      const allCoaches = await db.getCoaches();
      setCoaches(allCoaches.filter(c => c.team_id === teamId));
    };
    fetchCoaches();
  }, [teamId]);
  
  const filteredCoaches = coaches.filter(coach => 
    coach.name.toLowerCase().includes(searchTerm.toLowerCase())
  );
  
  const handleEdit = (coach: Coach) => {
    setCurrentCoach(coach);
    setEditMode(true);
  };
  
  const handleDelete = async (coachId: string) => {
    if (window.confirm('Вы уверены, что хотите удалить этого тренера?')) {
      try {
        await db.deleteCoach(coachId);
        const allCoaches = await db.getCoaches();
        setCoaches(allCoaches.filter(c => c.team_id === teamId));
        toast({
          title: "Тренер удален",
          description: "Тренер был успешно удален из системы",
        });
      } catch (error) {
        toast({
          variant: "destructive",
          title: "Ошибка",
          description: "Не удалось удалить тренера",
        });
      }
    }
  };
  
  const handleAddNew = () => {
    const newCoach: Coach = {
      id: '',
      name: '',
      team_id: teamId,
      photo: '',
      nationality: '',
      age: undefined,
      experience: undefined,
      achievements: ''
    };
    setCurrentCoach(newCoach);
    setEditMode(true);
  };
  
  const handleSave = async (updatedCoach: Coach) => {
    try {
      if (updatedCoach.id) {
        await db.updateCoach(updatedCoach.id, updatedCoach);
        toast({
          title: "Тренер обновлен",
          description: "Информация о тренере успешно обновлена",
        });
      } else {
        await db.createCoach(updatedCoach);
        toast({
          title: "Тренер добавлен",
          description: "Новый тренер успешно добавлен в систему",
        });
      }
      const allCoaches = await db.getCoaches();
      setCoaches(allCoaches.filter(c => c.team_id === teamId));
      setEditMode(false);
      setCurrentCoach(null);
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Ошибка",
        description: "Не удалось сохранить изменения",
      });
    }
  };
  
  const handleCancel = () => {
    setEditMode(false);
    setCurrentCoach(null);
  };
  
  return (
    <div>
      <Card className="mb-8 bg-gradient-to-br from-white to-gray-50">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>
            <div className="flex items-center">
              <div 
                className="w-8 h-8 rounded-full mr-3 flex items-center justify-center"
                style={{ backgroundColor: team?.primaryColor || '#2e7d32' }}
              >
                <Briefcase className="h-4 w-4 text-white" />
              </div>
              <span>Управление тренерами: {team?.name || 'Команда'}</span>
            </div>
          </CardTitle>
          <Button onClick={handleAddNew} className="bg-fc-green hover:bg-fc-darkGreen">
            <Plus className="mr-2 h-4 w-4" /> Добавить тренера
          </Button>
        </CardHeader>
      </Card>
      
      {editMode && currentCoach ? (
        <div className="bg-white p-6 rounded-lg shadow-md mb-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold">
              {currentCoach.id.includes('coach-') && !coaches.some(c => c.id === currentCoach.id) 
                ? 'Добавить нового тренера' 
                : 'Редактировать тренера'
              }
            </h2>
          </div>
          
          <CoachEditor 
            coach={currentCoach} 
            onSave={handleSave} 
            onCancel={handleCancel} 
          />
        </div>
      ) : (
        <>
          <div className="relative mb-6">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <Input
              className="pl-10"
              placeholder="Поиск тренеров по имени или должности..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredCoaches.map((coach) => (
              <div 
                key={coach.id} 
                className="bg-white rounded-xl overflow-hidden shadow-sm border border-gray-200 hover:shadow-md transition-all"
              >
                <div className="relative h-48 flex items-center justify-center bg-gray-100">
                  {coach.photo ? (
                    <img 
                      src={coach.photo} 
                      alt={coach.name} 
                      className="w-32 h-32 object-cover rounded-full border shadow mx-auto mt-6" 
                      onError={e => (e.currentTarget.style.display = 'none')}
                    />
                  ) : (
                    <div className="w-32 h-32 rounded-full bg-gray-300 flex items-center justify-center text-gray-500 text-4xl mx-auto mt-6">
                      ?
                    </div>
                  )}
                  <div className="absolute bottom-4 left-0 right-0 flex flex-col items-center">
                    <h3 className="text-xl font-bold text-white drop-shadow">{coach.name}</h3>
                  </div>
                </div>
                <div className="p-4">
                  <div className="flex justify-between items-center mb-4">
                    <div className="flex items-center text-gray-500">
                      <Award className="h-4 w-4 text-amber-500 mr-1" />
                      <span className="text-sm">{coach.experience ? `${coach.experience} лет опыта` : 'Опыт не указан'}</span>
                    </div>
                    {coach.nationality && (
                      <span className="text-xs text-gray-400">{coach.nationality}</span>
                    )}
                  </div>
                  {coach.achievements && (
                    <p className="text-sm text-gray-600 line-clamp-2 mb-4">
                      {coach.achievements}
                    </p>
                  )}
                  <div className="flex justify-end space-x-2 mt-auto">
                    <Button 
                      variant="ghost" 
                      size="sm"
                      onClick={() => handleEdit(coach)}
                      className="text-blue-600 hover:text-blue-900"
                    >
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <Button 
                      variant="ghost" 
                      size="sm"
                      onClick={() => handleDelete(coach.id)}
                      className="text-red-600 hover:text-red-900"
                    >
                      <Trash className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
            ))}
            
            {filteredCoaches.length === 0 && (
              <div className="col-span-full text-center py-12 bg-gray-50 rounded-lg">
                <div className="text-gray-500">
                  Тренеры не найдены. Добавьте первого тренера!
                </div>
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default CoachesManagement;
