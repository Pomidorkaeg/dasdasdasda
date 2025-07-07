'use client';

import { useState } from 'react';
import { 
  Users, 
  Calendar, 
  Newspaper, 
  Trophy,
  Settings
} from 'lucide-react';
import Coaches2Management from '@/pages/admin/Coaches2Management';
import TeamsSection from './components/TeamsSection';
import PlayersSection from './components/PlayersSection';
import MatchesSection from './components/MatchesSection';
import NewsSection from './components/NewsSection';

const AdminPanel = () => {
  const [activeSection, setActiveSection] = useState('teams');

  return (
    <div className="h-screen bg-gray-100 p-8">
      {activeSection === 'teams' && <TeamsSection />}
      {activeSection === 'players' && <PlayersSection />}
      {activeSection === 'matches' && <MatchesSection />}
      {activeSection === 'news' && <NewsSection />}
      {activeSection === 'settings' && <SettingsSection />}
      {activeSection === 'coaches2' && <Coaches2Management />}
    </div>
  );
};

// Временный компонент настроек
const SettingsSection = () => {
  return (
    <div>
      <h2 className="text-2xl font-bold mb-6">Настройки</h2>
      <p className="text-gray-600">Раздел настроек находится в разработке.</p>
    </div>
  );
};

export default AdminPanel; 