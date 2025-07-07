
import React from 'react';
import { Team } from '@/types/team';

interface TeamHeroBannerProps {
  team: Team;
}

const TeamHeroBanner: React.FC<TeamHeroBannerProps> = ({ team }) => {
  return (
    <div 
      className="relative h-80 md:h-96 bg-cover bg-center rounded-xl overflow-hidden mb-8"
      style={{ 
        backgroundImage: `url('${team.backgroundImage}')`,
      }}
    >
      <div 
        className="absolute inset-0" 
        style={{ 
          backgroundColor: `${team.primaryColor}AA`,
          backgroundImage: `linear-gradient(135deg, ${team.primaryColor}DD, ${team.secondaryColor}99)`
        }}
      ></div>
      
      <div className="absolute inset-0 flex flex-col items-center justify-center text-white p-6 text-center">
        <img src={team.logo} alt={team.name} className="h-28 w-28 md:h-36 md:w-36 object-contain mb-4" />
        <h1 className="text-3xl md:text-5xl font-bold drop-shadow-md mb-2">{team.name}</h1>
        <p className="text-lg md:text-xl opacity-85 max-w-2xl drop-shadow-sm">
          Основан в {team.foundedYear} году
        </p>
      </div>
    </div>
  );
};

export default TeamHeroBanner;
