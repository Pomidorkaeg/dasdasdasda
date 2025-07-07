import React from 'react';
import { Plus, User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';

interface PlayerManagementHeaderProps {
  onAddClick: () => void;
  searchTerm: string;
  onSearchChange: (value: string) => void;
}

const PlayerManagementHeader: React.FC<PlayerManagementHeaderProps> = ({ 
  onAddClick,
  searchTerm,
  onSearchChange
}) => {
  return (
    <Card className="mb-8 bg-gradient-to-br from-white to-gray-50">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>
          <div className="flex items-center">
            <div className="w-8 h-8 rounded-full mr-3 flex items-center justify-center bg-fc-green">
              <User className="h-4 w-4 text-white" />
            </div>
            <span>Управление игроками</span>
          </div>
        </CardTitle>
        <div className="flex items-center gap-4">
          <Input
            type="text"
            placeholder="Поиск игроков..."
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
            className="w-64"
          />
          <Button onClick={onAddClick} className="bg-fc-green hover:bg-fc-darkGreen">
            <Plus className="mr-2 h-4 w-4" /> Добавить игрока
          </Button>
        </div>
      </CardHeader>
    </Card>
  );
};

export default PlayerManagementHeader;
