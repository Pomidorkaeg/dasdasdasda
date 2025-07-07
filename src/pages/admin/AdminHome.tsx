
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Users, Calendar, Trophy } from 'lucide-react';

const AdminHome = () => {
  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Панель управления</h1>
      
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg font-medium">Игроки</CardTitle>
            <CardDescription>Управление игроками команды</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Users className="h-10 w-10 text-fc-green" />
                <span className="text-2xl font-bold">6</span>
              </div>
              <div className="text-sm text-gray-500">
                3 активных, 3 в запасе
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg font-medium">Турниры</CardTitle>
            <CardDescription>Управление турнирами</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Trophy className="h-10 w-10 text-fc-green" />
                <span className="text-2xl font-bold">5</span>
              </div>
              <div className="text-sm text-gray-500">
                2 актуальных, 3 завершены
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg font-medium">Следующий матч</CardTitle>
            <CardDescription>Дата ближайшего матча</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Calendar className="h-10 w-10 text-fc-green" />
                <span className="text-lg font-bold">12.08.2024</span>
              </div>
              <div className="text-sm text-gray-500">
                ФК Сибирь - ФК Спартак
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AdminHome;
