import React, { useEffect, useState } from 'react';
import { AdminLayout } from '../../components/admin/AdminLayout';
import { EntityForm, FormField } from '../../components/admin/EntityForm';
import { db } from '../../lib/db';
import { Player } from '../../types/models';

export const PlayersPage: React.FC = () => {
  const [players, setPlayers] = useState<Player[]>([]);
  const [selectedPlayer, setSelectedPlayer] = useState<Player | null>(null);
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    loadPlayers();
  }, []);

  const loadPlayers = async () => {
    const data = await db.getPlayers();
    setPlayers(data);
  };

  const handleSubmit = async (data: any) => {
    try {
      if (selectedPlayer) {
        await db.updatePlayer(selectedPlayer.id, data);
      } else {
        await db.createPlayer(data);
      }
      await loadPlayers();
      setIsEditing(false);
      setSelectedPlayer(null);
    } catch (error) {
      console.error('Error saving player:', error);
    }
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this player?')) {
      try {
        await db.deletePlayer(id);
        await loadPlayers();
      } catch (error) {
        console.error('Error deleting player:', error);
      }
    }
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold">Players Management</h1>
          <button
            onClick={() => {
              setSelectedPlayer(null);
              setIsEditing(true);
            }}
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            Add New Player
          </button>
        </div>

        {isEditing ? (
          <EntityForm
            title={selectedPlayer ? 'Edit Player' : 'Add New Player'}
            onSubmit={handleSubmit}
            initialData={selectedPlayer}
          >
            <FormField label="Name" name="name" required defaultValue={selectedPlayer?.name} />
            <FormField label="Position" name="position" required defaultValue={selectedPlayer?.position} />
            <FormField label="Number" name="number" type="number" required defaultValue={selectedPlayer?.number} />
            <FormField label="Age" name="age" type="number" required defaultValue={selectedPlayer?.age} />
            <FormField label="Photo URL" name="photo" defaultValue={selectedPlayer?.photo} />
            <FormField label="Bio" name="bio" defaultValue={selectedPlayer?.bio} />
          </EntityForm>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {players.map((player) => (
              <div key={player.id} className="bg-white p-4 rounded-lg shadow">
                <img
                  src={player.photo}
                  alt={player.name}
                  className="w-full h-48 object-cover rounded mb-4"
                />
                <h3 className="text-xl font-semibold">{player.name}</h3>
                <p className="text-gray-600">Position: {player.position}</p>
                <p className="text-gray-600">Number: {player.number}</p>
                <div className="mt-4 flex space-x-2">
                  <button
                    onClick={() => {
                      setSelectedPlayer(player);
                      setIsEditing(true);
                    }}
                    className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(player.id)}
                    className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </AdminLayout>
  );
}; 