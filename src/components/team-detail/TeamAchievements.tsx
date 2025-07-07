import React from 'react';
import { Trophy } from 'lucide-react';
import { Team } from '@/types/team';

interface TeamAchievementsProps {
  team: Team;
}

const TeamAchievements: React.FC<TeamAchievementsProps> = ({ team }) => {
  return (
    <div className="bg-white p-6 rounded-xl shadow-md">
      <h2 className="text-2xl font-bold mb-4" style={{ color: team.primaryColor }}>Достижения</h2>
      <ul className="space-y-4">
        {(team.achievements || []).map((achievement, index) => (
          <li key={index} className="flex items-start p-3 border-l-4 rounded bg-gray-50" style={{borderLeftColor: team.primaryColor}}>
            <Trophy className="h-6 w-6 mr-3 flex-shrink-0 mt-0.5" style={{ color: team.primaryColor }} />
            <span className="text-gray-700">{achievement}</span>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default TeamAchievements;
