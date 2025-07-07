import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Save, X } from 'lucide-react';
import { Player } from '@/types/models';
import PlayerBasicInfoForm from './PlayerBasicInfoForm';
import PlayerPhysicalStatsForm from './PlayerPhysicalStatsForm';
import PlayerMatchStatsForm from './PlayerMatchStatsForm';

interface PlayerEditorProps {
  player?: Player;
  onSave: (player: Omit<Player, 'id'>) => void;
  onCancel: () => void;
}

const defaultPlayer: Omit<Player, 'id'> = {
  teamId: '',
  teamName: '',
  name: '',
  position: '',
  number: 0,
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
};

const PlayerEditor: React.FC<PlayerEditorProps> = ({ player, onSave, onCancel }) => {
  const [formData, setFormData] = useState<Omit<Player, 'id'>>(player || defaultPlayer);
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    
    if (name === 'stats') {
      setFormData(prev => ({
        ...prev,
        stats: value as unknown as Player['stats']
      }));
    } else if (name.startsWith('stats.')) {
      const statName = name.split('.')[1];
      setFormData(prev => ({
        ...prev,
        stats: {
          ...prev.stats,
          [statName]: Number(value)
        }
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: name === 'number' || name === 'age' || name === 'height' || name === 'weight' ? Number(value) : value
      }));
    }
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
  };
  
  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-bold">
          {player ? 'Редактировать игрока' : 'Добавить нового игрока'}
        </h2>
        <div className="flex space-x-2">
          <Button type="button" variant="outline" size="sm" onClick={onCancel}>
            <X className="mr-2 h-4 w-4" /> Отмена
          </Button>
          <Button type="submit" size="sm">
            <Save className="mr-2 h-4 w-4" /> Сохранить
          </Button>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-6">
          <PlayerBasicInfoForm formData={formData} handleChange={handleChange} />
          <PlayerPhysicalStatsForm formData={formData} handleChange={handleChange} />
        </div>
        <div>
          <PlayerMatchStatsForm formData={formData} handleChange={handleChange} />
        </div>
      </div>
    </form>
  );
};

export default PlayerEditor;
