import React, { useEffect, useState } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Calendar, Filter, ChevronDown, MapPin, ChevronLeft, ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';
import { db } from '../lib/db';
import { Match } from '../types/models';

const Matches = () => {
  const [matches, setMatches] = useState<Match[]>([]);

  useEffect(() => {
    loadMatches();
  }, []);

  const loadMatches = async () => {
    const data = await db.getMatches();
    setMatches(data);
  };

  // Показываем все матчи
  const filteredMatches = matches;
  
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow pt-16 page-transition">
        {/* Header */}
        <div className="relative bg-fc-green text-white py-16">
          <div 
            className="absolute inset-0 bg-gradient-to-r from-fc-green/90 to-fc-darkGreen/80"
            style={{ 
              backgroundImage: `url('https://images.unsplash.com/photo-1518091043644-c1d4457512c6?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2069&q=80')`,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              backgroundBlendMode: 'overlay'
            }}
          ></div>
          <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col items-center text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-white/10 backdrop-blur-sm mb-6">
                <Calendar className="w-8 h-8" />
              </div>
              <h1 className="text-4xl font-bold mb-4">Матчи</h1>
              <p className="max-w-2xl text-white/80 text-lg">
                Расписание прошедших и предстоящих матчей ФК Сибирь
              </p>
            </div>
          </div>
        </div>
        {/* Matches List */}
        <section className="py-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
          {filteredMatches.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-500 mb-4">Нет матчей</p>
            </div>
          ) :
            <div className="space-y-6">
              {filteredMatches.map((match) => {
                // Автоматическое определение статуса матча
                let matchStatus = '';
                let matchDateTime: Date;
                if (match.date) {
                  const dateStr = typeof match.date === 'string' ? match.date : match.date.toISOString();
                  matchDateTime = new Date(dateStr);
                  if (match.time) {
                    // Если есть время, добавляем его к дате
                    const [hours, minutes] = match.time.split(':');
                    matchDateTime.setHours(Number(hours), Number(minutes), 0, 0);
                  }
                  const now = new Date();
                  const matchEnd = new Date(matchDateTime.getTime() + 2 * 60 * 60 * 1000); // 2 часа на матч
                  if (now < matchDateTime) {
                    matchStatus = 'upcoming';
                  } else if (now >= matchDateTime && now <= matchEnd) {
                    matchStatus = 'live';
                  } else {
                    matchStatus = 'completed';
                  }
                }
                return (
                  <div 
                    key={match.id} 
                    className="bg-white rounded-xl overflow-hidden shadow-sm border border-gray-200 card-hover"
                  >
                    <div className="p-4 border-b border-gray-100 bg-fc-green/5 flex justify-between items-center">
                      <div className="flex items-center">
                        <span className="px-3 py-1 bg-white rounded-full text-sm font-medium text-fc-green">
                          {match.opponent}
                        </span>
                      </div>
                      <div className="flex items-center space-x-1 text-gray-500 text-sm">
                        <Calendar size={14} />
                        <span>{match.date ? new Date(match.date).toLocaleDateString('ru-RU') : ''}{match.time ? `, ${match.time}` : ''}</span>
                      </div>
                    </div>
                    <div className="p-6">
                      <div className="flex justify-between items-center mb-6">
                        <div className="text-center flex-1">
                          <div className="font-bold text-xl mb-1">Домашняя команда</div>
                          <div className="text-sm text-gray-500">{match.venue || 'Хозяева'}</div>
                        </div>
                        <div className="flex-shrink-0 px-4">
                          {match.status === 'completed' ? (
                            <div className="text-2xl font-bold">
                              {match.score?.home} - {match.score?.away}
                            </div>
                          ) : (
                            <div className="text-2xl font-bold text-gray-400">VS</div>
                          )}
                        </div>
                        <div className="text-center flex-1">
                          <div className="font-bold text-xl mb-1">{match.opponent}</div>
                          <div className="text-sm text-gray-500">Гости</div>
                        </div>
                      </div>
                      <div className="flex justify-between text-sm text-gray-500 pt-4 border-t border-gray-100">
                        <div className="flex items-center">
                          <MapPin size={16} className="mr-1" />
                          <span>{match.venue || ''}</span>
                        </div>
                        {matchStatus === 'completed' && (
                          <div className="px-3 py-1 bg-fc-green/10 text-fc-green rounded-full text-xs font-medium">
                            Матч завершён
                          </div>
                        )}
                        {matchStatus === 'upcoming' && (
                          <div className="px-3 py-1 bg-fc-yellow/10 text-fc-yellow rounded-full text-xs font-medium">
                            Предстоящий матч
                          </div>
                        )}
                        {matchStatus === 'live' && (
                          <div className="px-3 py-1 bg-fc-orange-400/10 text-fc-orange-400 rounded-full text-xs font-medium">
                            Матч в процессе
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          }
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default Matches;
