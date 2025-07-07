import React from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Player } from '@/types/models';

interface PlayerPhysicalStatsFormProps {
  formData: Omit<Player, 'id'>;
  handleChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => void;
}

const PlayerPhysicalStatsForm: React.FC<PlayerPhysicalStatsFormProps> = ({ formData, handleChange }) => {
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-medium">Физические характеристики</h3>
      
      <div className="space-y-2">
        <Label htmlFor="height">Рост (см)</Label>
        <Input
          id="height"
          name="height"
          type="number"
          min="150"
          max="220"
          value={formData.height}
          onChange={handleChange}
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="weight">Вес (кг)</Label>
        <Input
          id="weight"
          name="weight"
          type="number"
          min="50"
          max="120"
          value={formData.weight}
          onChange={handleChange}
          required
        />
      </div>
    </div>
  );
};

export default PlayerPhysicalStatsForm;
