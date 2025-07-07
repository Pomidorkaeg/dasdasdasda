import React, { useState } from 'react';
import { Pencil, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Player } from '@/types/models';
import { DeletePlayerDialog } from '@/components/DeletePlayerDialog';
import { db } from '@/lib/db';
import { toast } from '@/components/ui/use-toast';

interface PlayersListProps {
  players: Player[];
  onEdit: (player: Player) => void;
  onPlayersChange: () => void;
}

const PlayersList: React.FC<PlayersListProps> = ({ players, onEdit, onPlayersChange }) => {
  const [deletingPlayer, setDeletingPlayer] = useState<Player | null>(null);

  const handleDelete = async (id: string) => {
    try {
      await db.deletePlayer(id);
      toast({
        title: 'Успех',
        description: 'Игрок успешно удален'
      });
      onPlayersChange();
    } catch (error) {
      console.error('Error deleting player:', error);
      toast({
        title: 'Ошибка',
        description: 'Не удалось удалить игрока',
        variant: 'destructive'
      });
    }
  };

  return (
    <>
      <div className="bg-white rounded-lg shadow">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-50 border-b">
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Игрок</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Позиция</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Номер</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Возраст</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Национальность</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Действия</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {players.map((player) => (
                <tr key={player.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="h-10 w-10 flex-shrink-0">
                        <img
                          className="h-10 w-10 rounded-full object-cover"
                          src={player.photo || '/default-player.png'}
                          alt={player.name}
                        />
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">{player.name}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{player.position}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{player.number}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{player.age}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{player.nationality}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <div className="flex justify-end space-x-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => onEdit(player)}
                        className="text-gray-600 hover:text-gray-900"
                      >
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setDeletingPlayer(player)}
                        className="text-red-600 hover:text-red-900"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <DeletePlayerDialog
        player={deletingPlayer}
        onClose={() => setDeletingPlayer(null)}
        onConfirm={() => handleDelete(deletingPlayer?.id || '')}
      />
    </>
  );
};

export default PlayersList;
