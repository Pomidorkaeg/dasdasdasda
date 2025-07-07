import React from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Player } from '@/types/models';

interface PlayerMatchStatsFormProps {
  formData: Omit<Player, 'id'>;
  handleChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => void;
}

const PlayerMatchStatsForm: React.FC<PlayerMatchStatsFormProps> = ({ formData, handleChange }) => {
  const handleStatChange = (statName: string, value: string) => {
    // Create a new stats object with the updated value
    const newStats = {
      ...formData.stats,
      [statName]: parseInt(value) || 0
    };

    // Create a synthetic event for the stats update
    const event = {
      target: {
        name: 'stats',
        value: newStats
      }
    } as React.ChangeEvent<HTMLInputElement>;

    handleChange(event);
  };

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-medium">Статистика матчей</h3>
      
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="games">Игр сыграно</Label>
          <Input
            id="games"
            type="number"
            min="0"
            value={formData.stats?.games || 0}
            onChange={(e) => handleStatChange('games', e.target.value)}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="goals">Голов</Label>
          <Input
            id="goals"
            type="number"
            min="0"
            value={formData.stats?.goals || 0}
            onChange={(e) => handleStatChange('goals', e.target.value)}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="assists">Голевых передач</Label>
          <Input
            id="assists"
            type="number"
            min="0"
            value={formData.stats?.assists || 0}
            onChange={(e) => handleStatChange('assists', e.target.value)}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="yellowCards">Жёлтых карточек</Label>
          <Input
            id="yellowCards"
            type="number"
            min="0"
            value={formData.stats?.yellowCards || 0}
            onChange={(e) => handleStatChange('yellowCards', e.target.value)}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="redCards">Красных карточек</Label>
          <Input
            id="redCards"
            type="number"
            min="0"
            value={formData.stats?.redCards || 0}
            onChange={(e) => handleStatChange('redCards', e.target.value)}
          />
        </div>
      </div>
    </div>
  );
};

export default PlayerMatchStatsForm;
