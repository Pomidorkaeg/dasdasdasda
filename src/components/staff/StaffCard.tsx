
import React from 'react';
import { Calendar } from 'lucide-react';
import { Coach } from '@/types/coach';

interface StaffCardProps {
  member: Coach;
  primaryColor: string;
}

const StaffCard: React.FC<StaffCardProps> = ({ member, primaryColor }) => {
  return (
    <div className="bg-white rounded-xl overflow-hidden shadow-md border border-gray-200 flex card-hover animate-fade-in">
      <div className="w-1/3 relative">
        <img 
          src={member.image} 
          alt={member.name} 
          className="w-full h-full object-cover aspect-square"
        />
        <div 
          className="absolute inset-0"
          style={{ background: `linear-gradient(to right, ${primaryColor}90, transparent)` }}
        ></div>
      </div>
      
      <div className="w-2/3 p-6">
        <div 
          className="inline-block px-3 py-1 rounded-full text-sm font-medium mb-2"
          style={{ 
            backgroundColor: `${primaryColor}10`,
            color: primaryColor
          }}
        >
          {member.role}
        </div>
        <h3 className="text-xl font-bold mb-4">{member.name}</h3>
        
        <p className="text-gray-600 mb-4 text-sm">{member.biography}</p>
        
        <div className="flex items-center text-gray-500">
          <Calendar size={16} className="mr-1" />
          <span>В клубе с {member.since} года</span>
        </div>
      </div>
    </div>
  );
};

export default StaffCard;
