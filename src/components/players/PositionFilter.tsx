
import React from 'react';
import { cn } from '@/lib/utils';

interface PositionFilterProps {
  activePosition: string;
  onPositionChange: (position: string) => void;
  primaryColor: string;
}

const PositionFilter: React.FC<PositionFilterProps> = ({ 
  activePosition, 
  onPositionChange, 
  primaryColor 
}) => {
  return (
    <div className="mb-8 flex justify-center">
      <div className="inline-flex p-1 bg-gray-100 rounded-full">
        <button
          onClick={() => onPositionChange('all')}
          className={cn(
            "px-4 py-2 rounded-full text-sm font-medium transition-all duration-300",
            activePosition === 'all' 
              ? "text-white" 
              : "text-gray-700 hover:bg-gray-200"
          )}
          style={{ backgroundColor: activePosition === 'all' ? primaryColor : '' }}
        >
          Все
        </button>
        
        <button
          onClick={() => onPositionChange('Вратарь')}
          className={cn(
            "px-4 py-2 rounded-full text-sm font-medium transition-all duration-300",
            activePosition === 'Вратарь' 
              ? "text-white" 
              : "text-gray-700 hover:bg-gray-200"
          )}
          style={{ backgroundColor: activePosition === 'Вратарь' ? primaryColor : '' }}
        >
          Вратари
        </button>
        
        <button
          onClick={() => onPositionChange('Защитник')}
          className={cn(
            "px-4 py-2 rounded-full text-sm font-medium transition-all duration-300",
            activePosition === 'Защитник' 
              ? "text-white" 
              : "text-gray-700 hover:bg-gray-200"
          )}
          style={{ backgroundColor: activePosition === 'Защитник' ? primaryColor : '' }}
        >
          Защитники
        </button>
        
        <button
          onClick={() => onPositionChange('Полузащитник')}
          className={cn(
            "px-4 py-2 rounded-full text-sm font-medium transition-all duration-300",
            activePosition === 'Полузащитник' 
              ? "text-white" 
              : "text-gray-700 hover:bg-gray-200"
          )}
          style={{ backgroundColor: activePosition === 'Полузащитник' ? primaryColor : '' }}
        >
          Полузащитники
        </button>
        
        <button
          onClick={() => onPositionChange('Нападающий')}
          className={cn(
            "px-4 py-2 rounded-full text-sm font-medium transition-all duration-300",
            activePosition === 'Нападающий' 
              ? "text-white" 
              : "text-gray-700 hover:bg-gray-200"
          )}
          style={{ backgroundColor: activePosition === 'Нападающий' ? primaryColor : '' }}
        >
          Нападающие
        </button>
      </div>
    </div>
  );
};

export default PositionFilter;
