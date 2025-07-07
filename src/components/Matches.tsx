import React from 'react';
import { Calendar, Clock, MapPin, Trophy } from 'lucide-react';

const Matches = React.memo(() => {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Матчи</h1>
      
      <div className="space-y-6">
        {/* Placeholder for matches */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex flex-col items-center justify-center py-8">
            <Trophy className="h-12 w-12 text-gray-400 mb-4" />
            <h2 className="text-xl font-semibold mb-2">Нет матчей</h2>
            <p className="text-gray-600 text-center">
              В данный момент нет запланированных матчей
            </p>
          </div>
        </div>
      </div>
    </div>
  );
});

Matches.displayName = 'Matches';

export default Matches; 