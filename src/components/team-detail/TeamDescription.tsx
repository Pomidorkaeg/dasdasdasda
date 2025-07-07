
import React from 'react';
import { Team } from '@/types/team';

interface TeamDescriptionProps {
  team: Team;
}

const TeamDescription: React.FC<TeamDescriptionProps> = ({ team }) => {
  return (
    <div 
      className="bg-white p-6 rounded-xl shadow-md border-t-4"
      style={{ borderTopColor: team.primaryColor }}
    >
      <h2 className="text-2xl font-bold mb-4" style={{ color: team.primaryColor }}>О команде</h2>
      <p className="text-gray-700 leading-relaxed mb-6">{team.description}</p>
      
      <h3 className="text-xl font-bold mb-3" style={{ color: team.primaryColor }}>История</h3>
      <p className="text-gray-700 leading-relaxed mb-4">
        Команда «Гудаута» Новосибирск создана в 2008 г.р. За годы своего существования клуб добился множества значимых успехов на региональном и городском уровнях, став одним из заметных участников футбольной жизни Новосибирска.
      </p>
    </div>
  );
};

export default TeamDescription;
