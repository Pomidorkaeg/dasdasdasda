
import React from 'react';
import { Player } from '@/types/player';
import PlayerEditor from '@/components/admin/players/editor/PlayerEditor';

interface PlayerEditorPageProps {
  player: Player;
  onSave: (player: Player) => void;
  onCancel: () => void;
}

const PlayerEditorPage: React.FC<PlayerEditorPageProps> = ({ player, onSave, onCancel }) => {
  return (
    <PlayerEditor 
      player={player} 
      onSave={onSave} 
      onCancel={onCancel}
    />
  );
};

export default PlayerEditorPage;
