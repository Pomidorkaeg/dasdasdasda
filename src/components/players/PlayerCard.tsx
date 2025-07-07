import React from 'react';
import { Player } from '@/types/models';
import { cn } from '@/lib/utils';

interface PlayerCardProps {
  player: Player;
  primaryColor: string;
}

const PlayerCard: React.FC<PlayerCardProps> = ({ player, primaryColor }) => {
  return (
    <div className="bg-white rounded-lg shadow-lg overflow-hidden">
      {/* Player Image */}
      <div className="relative aspect-[3/4]">
          <img 
          src={player.photo}
            alt={player.name} 
          className="w-full h-full object-cover"
          />
          <div 
          className="absolute inset-0"
          style={{
            background: `linear-gradient(to bottom, transparent 50%, ${primaryColor})`,
            opacity: 0.8
          }}
        />
        <div className="absolute bottom-0 left-0 right-0 p-4">
          <h3 className="text-white text-lg font-bold">{player.name}</h3>
          <p className="text-white/80 text-sm">{player.position}</p>
        </div>
            </div>
            
      {/* Player Stats */}
      <div className="p-4">
        <div className="grid grid-cols-5 gap-2 text-center">
          <div>
            <p className="text-xs text-gray-500 mb-1">Игры</p>
            <p className="font-semibold">{player.stats?.games || 0}</p>
              </div>
          <div>
            <p className="text-xs text-gray-500 mb-1">Голы</p>
            <p className="font-semibold">{player.stats?.goals || 0}</p>
              </div>
          <div>
            <p className="text-xs text-gray-500 mb-1">Передачи</p>
            <p className="font-semibold">{player.stats?.assists || 0}</p>
              </div>
          <div>
            <p className="text-xs text-gray-500 mb-1">ЖК</p>
            <p className="font-semibold">{player.stats?.yellowCards || 0}</p>
            </div>
          <div>
            <p className="text-xs text-gray-500 mb-1">КК</p>
            <p className="font-semibold">{player.stats?.redCards || 0}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PlayerCard;
