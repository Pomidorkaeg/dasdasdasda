import React, { useState, useCallback } from 'react';
import { RefreshCw, AlertTriangle, Trophy, Star } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useToast } from '@/components/ui/use-toast';

interface TournamentTableProps {
  tournamentId: string;
  source: string;
}

const TournamentTable: React.FC<TournamentTableProps> = React.memo(({ 
  tournamentId,
  source
}) => {
  const [activeTab, setActiveTab] = useState('teams');
  const { toast } = useToast();
  
  const handleRefresh = useCallback(() => {
    toast({
      title: "Обновление данных",
      description: "Данные турнирной таблицы обновляются",
    });
  }, [toast]);

  const handleTabChange = useCallback((tab: string) => {
    setActiveTab(tab);
  }, []);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Турнирная таблица</h2>
        <button
          onClick={handleRefresh}
          className="inline-flex items-center px-4 py-2 text-sm font-medium text-primary hover:text-primary/90"
        >
          <RefreshCw className="h-4 w-4 mr-2" />
          Обновить
        </button>
      </div>

      <div className="flex space-x-4 border-b">
        <button
          onClick={() => handleTabChange('teams')}
          className={cn(
            "px-4 py-2 text-sm font-medium",
            activeTab === 'teams' ? "text-primary border-b-2 border-primary" : "text-muted-foreground"
          )}
        >
          <Trophy className="h-4 w-4 inline mr-2" />
          Команды
        </button>
        <button
          onClick={() => handleTabChange('scorers')}
          className={cn(
            "px-4 py-2 text-sm font-medium",
            activeTab === 'scorers' ? "text-primary border-b-2 border-primary" : "text-muted-foreground"
          )}
        >
          <Star className="h-4 w-4 inline mr-2" />
          Бомбардиры
        </button>
        <button
          onClick={() => handleTabChange('warnings')}
          className={cn(
            "px-4 py-2 text-sm font-medium",
            activeTab === 'warnings' ? "text-primary border-b-2 border-primary" : "text-muted-foreground"
          )}
        >
          <AlertTriangle className="h-4 w-4 inline mr-2" />
          Предупреждения
        </button>
      </div>

      <div className="mt-4">
        {activeTab === 'teams' && (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="px-4 py-2 text-left">Поз</th>
                  <th className="px-4 py-2 text-left">Команда</th>
                  <th className="px-4 py-2 text-center">И</th>
                  <th className="px-4 py-2 text-center">В</th>
                  <th className="px-4 py-2 text-center">Н</th>
                  <th className="px-4 py-2 text-center">П</th>
                  <th className="px-4 py-2 text-center">З</th>
                  <th className="px-4 py-2 text-center">П</th>
                  <th className="px-4 py-2 text-center">Р</th>
                  <th className="px-4 py-2 text-center">О</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b hover:bg-muted/50">
                  <td className="px-4 py-2 text-center" colSpan={10}>
                    Нет данных
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        )}

        {activeTab === 'scorers' && (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="px-4 py-2 text-left">Поз</th>
                  <th className="px-4 py-2 text-left">Игрок</th>
                  <th className="px-4 py-2 text-left">Команда</th>
                  <th className="px-4 py-2 text-center">Голы</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b hover:bg-muted/50">
                  <td className="px-4 py-2 text-center" colSpan={4}>
                    Нет данных
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        )}

        {activeTab === 'warnings' && (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="px-4 py-2 text-left">Поз</th>
                  <th className="px-4 py-2 text-left">Игрок</th>
                  <th className="px-4 py-2 text-left">Команда</th>
                  <th className="px-4 py-2 text-center">Предупреждения</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b hover:bg-muted/50">
                  <td className="px-4 py-2 text-center" colSpan={4}>
                    Нет данных
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
});

TournamentTable.displayName = 'TournamentTable';

export default TournamentTable;
