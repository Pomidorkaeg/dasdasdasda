import React, { useState, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Player, Team } from '@/types/models';
import { db } from '@/lib/db';

interface PlayerBasicInfoFormProps {
  formData: Omit<Player, 'id'>;
  handleChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => void;
}

const PlayerBasicInfoForm: React.FC<PlayerBasicInfoFormProps> = ({ formData, handleChange }) => {
  const [teams, setTeams] = useState<Team[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadTeams = async () => {
      try {
        const teamsData = await db.getTeams();
        console.log('Loaded teams:', teamsData);
        setTeams(teamsData);
      } catch (error) {
        console.error('Error loading teams:', error);
      } finally {
        setLoading(false);
      }
    };

    loadTeams();
  }, []);

  const handleTeamChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedTeamId = e.target.value;
    const selectedTeam = teams.find(team => team.id === selectedTeamId);
    
    // Create a synthetic event for team_id
    const teamIdEvent = {
      target: {
        name: 'team_id',
        value: selectedTeamId
      }
    } as React.ChangeEvent<HTMLSelectElement>;
    handleChange(teamIdEvent);
    
    // Create a synthetic event for team_name
    const teamNameEvent = {
      target: {
        name: 'team_name',
        value: selectedTeam?.name || ''
      }
    } as React.ChangeEvent<HTMLSelectElement>;
    handleChange(teamNameEvent);
  };

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-medium">Основная информация</h3>
      
      <div className="space-y-2">
        <Label htmlFor="team_id">Команда</Label>
        <select
          id="team_id"
          name="team_id"
          value={formData.team_id}
          onChange={handleTeamChange}
          className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
          required
          disabled={loading}
        >
          <option value="">Выберите команду</option>
          {teams.map((team) => (
            <option key={team.id} value={team.id}>
              {team.name}
            </option>
          ))}
        </select>
      </div>

      <div className="space-y-2">
        <Label htmlFor="name">Имя</Label>
        <Input
          id="name"
          name="name"
          value={formData.name}
          onChange={handleChange}
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="position">Позиция</Label>
        <select
          id="position"
          name="position"
          value={formData.position}
          onChange={handleChange}
          className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
          required
        >
          <option value="">Выберите позицию</option>
          <option value="Вратарь">Вратарь</option>
          <option value="Защитник">Защитник</option>
          <option value="Полузащитник">Полузащитник</option>
          <option value="Нападающий">Нападающий</option>
        </select>
      </div>

      <div className="space-y-2">
        <Label htmlFor="number">Номер</Label>
        <Input
          id="number"
          name="number"
          type="number"
          min="1"
          max="99"
          value={formData.number}
          onChange={handleChange}
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="nationality">Национальность</Label>
        <Input
          id="nationality"
          name="nationality"
          value={formData.nationality}
          onChange={handleChange}
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="age">Возраст</Label>
        <Input
          id="age"
          name="age"
          type="number"
          min="16"
          max="45"
          value={formData.age}
          onChange={handleChange}
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="photo">Фото URL</Label>
        <Input
          id="photo"
          name="photo"
          type="url"
          value={formData.photo}
          onChange={handleChange}
          placeholder="https://example.com/photo.jpg"
        />
      </div>
    </div>
  );
};

export default PlayerBasicInfoForm;
