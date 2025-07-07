import React from 'react';
import { Flag, Calendar } from 'lucide-react';
import { Player } from '@/types/models';

interface PlayerDetailProps {
  player: Player;
  primaryColor: string;
  secondaryColor: string;
}

const PlayerDetail: React.FC<PlayerDetailProps> = ({ 
  player, 
  primaryColor, 
  secondaryColor 
}) => {
  return (
    <div className="mt-12 bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden animate-fade-in">
      <div 
        className="p-6 border-b"
        style={{ borderColor: `${primaryColor}30` }}
      >
        <h2 className="text-2xl font-bold text-gray-900">Информация об игроке</h2>
      </div>
      
      <div className="flex flex-col md:flex-row">
        <div className="md:w-1/3 relative">
          <img 
            src={player.photo} 
            alt={player.name} 
            className="w-full h-full object-cover aspect-square md:aspect-auto"
          />
          <div 
            className="absolute top-4 left-4 w-16 h-16 flex items-center justify-center rounded-full font-bold text-3xl text-white shadow-lg"
            style={{ 
              background: `linear-gradient(135deg, ${primaryColor}, ${secondaryColor})` 
            }}
          >
            {player.number}
          </div>
        </div>
        
        <div className="md:w-2/3 p-6">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
            <div>
              <div 
                className="inline-block px-3 py-1 rounded-full text-sm font-medium mb-2"
                style={{ 
                  backgroundColor: `${primaryColor}10`,
                  color: primaryColor
                }}
              >
                {player.position}
              </div>
              <h3 className="text-2xl font-bold mb-1">{player.name}</h3>
              <div className="flex items-center text-gray-500">
                <Flag size={16} className="mr-1" />
                <span>{player.nationality}</span>
              </div>
              <div className="flex items-center text-gray-500 mt-1">
                <Calendar size={16} className="mr-1" />
                <span>Возраст: {player.age} лет</span>
              </div>
              {player.team_name && (
                <div className="flex items-center text-gray-500 mt-1">
                  <span className="font-medium">Команда:</span>
                  <span className="ml-2">{player.team_name}</span>
                </div>
              )}
            </div>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            <div className="bg-gray-50 p-3 rounded-lg">
              <div className="text-xs text-gray-500 mb-1">Возраст</div>
              <div className="font-medium">{player.age} лет</div>
            </div>
            
            <div className="bg-gray-50 p-3 rounded-lg">
              <div className="text-xs text-gray-500 mb-1">Рост</div>
              <div className="font-medium">{player.height} см</div>
            </div>
            
            <div className="bg-gray-50 p-3 rounded-lg">
              <div className="text-xs text-gray-500 mb-1">Вес</div>
              <div className="font-medium">{player.weight} кг</div>
            </div>
          </div>
          
          <div className="bg-gray-50 p-3 rounded-lg mb-8">
            <div className="text-xs text-gray-500 mb-1">Матчи</div>
            <div className="font-medium">{player.stats.games}</div>
          </div>
          
          <h4 className="text-lg font-bold mb-4">Статистика</h4>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="relative p-6 rounded-lg text-center overflow-hidden" style={{ 
              background: `linear-gradient(135deg, ${primaryColor}20, ${primaryColor}05)`,
              borderLeft: `4px solid ${primaryColor}`
            }}>
              <div className="relative z-10">
                <div className="text-3xl font-bold mb-1" style={{ color: primaryColor }}>{player.stats.goals}</div>
                <div className="text-xs text-gray-500">Голы</div>
              </div>
            </div>
            
            <div className="relative p-6 rounded-lg text-center overflow-hidden" style={{ 
              background: `linear-gradient(135deg, ${primaryColor}20, ${primaryColor}05)`,
              borderLeft: `4px solid ${primaryColor}`
            }}>
              <div className="relative z-10">
                <div className="text-3xl font-bold mb-1" style={{ color: primaryColor }}>{player.stats.assists}</div>
                <div className="text-xs text-gray-500">Передачи</div>
              </div>
            </div>
            
            <div className="relative p-6 rounded-lg text-center overflow-hidden" style={{ 
              background: 'linear-gradient(135deg, rgba(251, 191, 36, 0.2), rgba(251, 191, 36, 0.05))',
              borderLeft: '4px solid #f59e0b'
            }}>
              <div className="relative z-10">
                <div className="text-3xl font-bold mb-1 text-amber-500">{player.stats.yellowCards}</div>
                <div className="text-xs text-gray-500">Жёлтые карточки</div>
              </div>
            </div>
            
            <div className="relative p-6 rounded-lg text-center overflow-hidden" style={{ 
              background: 'linear-gradient(135deg, rgba(239, 68, 68, 0.2), rgba(239, 68, 68, 0.05))',
              borderLeft: '4px solid #ef4444'
            }}>
              <div className="relative z-10">
                <div className="text-3xl font-bold mb-1 text-red-500">{player.stats.redCards}</div>
                <div className="text-xs text-gray-500">Красные карточки</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PlayerDetail;
