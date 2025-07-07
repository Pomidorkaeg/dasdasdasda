
import React, { useState, useEffect } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import TournamentCard from '@/components/TournamentCard';
import LazyTournamentTable from '@/components/LazyTournamentTable';
import { Filter, Search, ChevronDown, Trophy } from 'lucide-react';
import { getTournamentsList, Tournament } from '@/utils/api';

const Tournaments = () => {
  const [tournaments, setTournaments] = useState<Tournament[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedTournament, setSelectedTournament] = useState<Tournament | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [filter, setFilter] = useState('all');
  
  useEffect(() => {
    const fetchTournaments = async () => {
      try {
        const data = await getTournamentsList();
        setTournaments(data);
        setSelectedTournament(data[0]); // Select the first tournament by default
        setLoading(false);
      } catch (error) {
        console.error("Error fetching tournaments:", error);
        setLoading(false);
      }
    };
    
    fetchTournaments();
  }, []);
  
  const handleTournamentSelect = (tournament: Tournament) => {
    setSelectedTournament(tournament);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };
  
  const filteredTournaments = tournaments
    .filter((tournament) => {
      // Apply search filter
      if (searchQuery) {
        return tournament.title.toLowerCase().includes(searchQuery.toLowerCase());
      }
      return true;
    })
    .filter((tournament) => {
      // Apply category filter
      if (filter === 'all') return true;
      if (filter === 'featured') return tournament.featured;
      return tournament.type.toLowerCase().includes(filter.toLowerCase());
    });
  
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-grow pt-16 page-transition">
        {/* Header */}
        <div className="relative bg-amber-500 text-gray-900 py-16">
          <div 
            className="absolute inset-0 bg-gradient-to-r from-amber-500/90 to-amber-600/80"
            style={{ 
              backgroundImage: `url('https://images.unsplash.com/photo-1459865264687-595d652de67e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80')`,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              backgroundBlendMode: 'overlay'
            }}
          ></div>
          
          <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col items-center text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gray-900/10 backdrop-blur-sm mb-6">
                <Trophy className="w-8 h-8" />
              </div>
              
              <h1 className="text-4xl font-bold mb-4">Турниры и соревнования</h1>
              <p className="max-w-2xl text-gray-900/80 text-lg">
                Следите за актуальными турнирными таблицами и результатами всех соревнований с участием нашего клуба
              </p>
            </div>
          </div>
        </div>
        
        {/* Selected Tournament Table */}
        {selectedTournament && (
          <section className="py-10 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
            <LazyTournamentTable 
              tournamentId={selectedTournament.id} 
              source={selectedTournament.source} 
            />
          </section>
        )}
        
        {/* Tournament List */}
        <section className="py-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between gap-4 mb-8">
            <h2 className="text-2xl font-bold text-gray-900">Все турниры</h2>
            
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                <input
                  type="text"
                  placeholder="Поиск турнира..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 pr-4 py-2 border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500/50 w-full"
                />
              </div>
              
              <div className="relative">
                <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                <select
                  value={filter}
                  onChange={(e) => setFilter(e.target.value)}
                  className="pl-10 pr-10 py-2 border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500/50 appearance-none w-full"
                >
                  <option value="all">Все категории</option>
                  <option value="featured">Популярные</option>
                  <option value="регулярный">Регулярные</option>
                  <option value="кубковый">Кубковые</option>
                  <option value="городской">Городские</option>
                  <option value="региональный">Региональные</option>
                </select>
                <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
              </div>
            </div>
          </div>
          
          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {Array(6).fill(0).map((_, index) => (
                <div key={index} className="h-72 rounded-xl bg-gray-100 animate-pulse"></div>
              ))}
            </div>
          ) : filteredTournaments.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-500 mb-4">По вашему запросу не найдено турниров</p>
              <button
                onClick={() => { setSearchQuery(''); setFilter('all'); }}
                className="px-4 py-2 bg-amber-500 text-gray-900 rounded-md hover:bg-amber-600 transition-colors"
              >
                Сбросить фильтры
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredTournaments.map((tournament: any) => (
                <div 
                  key={tournament.id} 
                  onClick={() => handleTournamentSelect(tournament)}
                  className="cursor-pointer"
                >
                  <TournamentCard
                    id={tournament.id}
                    title={tournament.title}
                    type={tournament.type}
                    season={tournament.season}
                    teams={tournament.teams}
                    source={tournament.source}
                    featured={tournament.featured}
                  />
                </div>
              ))}
            </div>
          )}
        </section>
      </main>
      
      <Footer />
    </div>
  );
};

export default Tournaments;
