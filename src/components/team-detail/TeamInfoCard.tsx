
import React from 'react';
import { Calendar, Trophy, MapPin, User } from 'lucide-react';
import { Team } from '@/types/team';

interface TeamInfoCardProps {
  team: Team;
}

const TeamInfoCard: React.FC<TeamInfoCardProps> = ({ team }) => {
  return (
    <div className="bg-white p-6 rounded-xl shadow-md">
      <h2 className="text-xl font-bold mb-4" style={{ color: team.primaryColor }}>Информация</h2>
      
      <div className="space-y-4">
        <div className="flex items-start">
          <div 
            className="p-2 rounded-full mr-3"
            style={{ backgroundColor: `${team.primaryColor}15` }}
          >
            <Calendar className="h-5 w-5" style={{ color: team.primaryColor }} />
          </div>
          <div>
            <p className="text-sm text-gray-500">Год основания</p>
            <p className="font-medium">{team.foundedYear}</p>
          </div>
        </div>
        
        <div className="flex items-start">
          <div 
            className="p-2 rounded-full mr-3"
            style={{ backgroundColor: `${team.primaryColor}15` }}
          >
            <Trophy className="h-5 w-5" style={{ color: team.primaryColor }} />
          </div>
          <div>
            <p className="text-sm text-gray-500">Стадион</p>
            <p className="font-medium">{team.stadium}</p>
          </div>
        </div>
        
        <div className="flex items-start">
          <div 
            className="p-2 rounded-full mr-3"
            style={{ backgroundColor: `${team.primaryColor}15` }}
          >
            <MapPin className="h-5 w-5" style={{ color: team.primaryColor }} />
          </div>
          <div>
            <p className="text-sm text-gray-500">Адрес</p>
            <p className="font-medium">{team.address}</p>
          </div>
        </div>
        
        <div className="flex items-start">
          <div 
            className="p-2 rounded-full mr-3"
            style={{ backgroundColor: `${team.primaryColor}15` }}
          >
            <User className="h-5 w-5" style={{ color: team.primaryColor }} />
          </div>
          <div>
            <p className="text-sm text-gray-500">Главный тренер</p>
            <p className="font-medium">{team.coach}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TeamInfoCard;
