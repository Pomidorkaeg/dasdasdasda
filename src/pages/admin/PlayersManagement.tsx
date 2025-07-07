import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import PlayerEditor from '@/components/admin/players/editor/PlayerEditor';
import { Player } from '@/types/models';
import { toast } from '@/components/ui/use-toast';
import PlayerManagementHeader from '@/components/admin/players/PlayerManagementHeader';
import PlayersList from '@/components/admin/players/PlayersList';
import { db } from '@/lib/db';

const PlayersManagement = () => {
  const [players, setPlayers] = useState<Player[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [editMode, setEditMode] = useState(false);
  const [currentPlayer, setCurrentPlayer] = useState<Player | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  
  useEffect(() => {
    loadPlayers();
  }, []);

  const loadPlayers = async () => {
    try {
      setIsLoading(true);
      const allPlayers = await db.getPlayers();
      setPlayers(allPlayers);
    } catch (error) {
      console.error('Error loading players:', error);
      toast({
        title: 'Ошибка загрузки',
        description: error instanceof Error ? error.message : 'Не удалось загрузить список игроков',
        variant: 'destructive'
      });
      setPlayers([]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleEdit = (player: Player) => {
    setCurrentPlayer(player);
    setEditMode(true);
  };

  const handleSave = async (playerData: Omit<Player, 'id'>) => {
    try {
      if (currentPlayer) {
        await db.updatePlayer(currentPlayer.id, playerData);
        toast({
          title: 'Успех',
          description: 'Игрок успешно обновлен'
        });
      } else {
        await db.createPlayer(playerData);
        toast({
          title: 'Успех',
          description: 'Игрок успешно создан'
        });
      }
      setEditMode(false);
      setCurrentPlayer(null);
      await loadPlayers();
    } catch (error) {
      console.error('Error saving player:', error);
      toast({
        title: 'Ошибка сохранения',
        description: error instanceof Error ? error.message : 'Не удалось сохранить игрока',
        variant: 'destructive'
      });
    }
  };

  const handleCancel = () => {
    setEditMode(false);
    setCurrentPlayer(null);
  };

  const filteredPlayers = players.filter(player =>
    player.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    player.position.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <PlayerManagementHeader 
        onAddClick={() => setEditMode(true)}
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
      />
      
      {editMode ? (
        <div className="bg-white rounded-lg shadow p-6">
          <PlayerEditor
            player={currentPlayer || undefined}
            onSave={handleSave}
            onCancel={handleCancel}
          />
        </div>
      ) : (
        <>
          {isLoading ? (
            <div className="text-center py-4">Загрузка игроков...</div>
          ) : filteredPlayers.length === 0 ? (
            <div className="text-center py-4 text-gray-500">
              {searchTerm ? 'Игроки не найдены' : 'Нет доступных игроков'}
            </div>
          ) : (
            <PlayersList
              players={filteredPlayers}
              onEdit={handleEdit}
              onPlayersChange={loadPlayers}
            />
          )}
        </>
      )}
    </div>
  );
};

export default PlayersManagement;
