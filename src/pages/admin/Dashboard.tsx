import React from 'react';
import { Link, Outlet } from 'react-router-dom';
import { Users, Trophy, Settings, LogOut, Users2, Shield, Calendar, Newspaper, Image as ImageIcon, LayoutDashboard } from 'lucide-react';

const AdminDashboard = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Admin Header */}
      <header className="bg-gradient-to-r from-fc-darkGreen to-fc-green shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center">
              <Shield className="w-8 h-8 text-white mr-2" />
              <span className="text-white font-bold text-xl">Админ панель</span>
            </div>
            <div>
              <Link 
                to="/" 
                className="text-white hover:text-gray-200 text-sm flex items-center bg-white/10 px-4 py-2 rounded-full transition-all hover:bg-white/20"
              >
                <span>Вернуться на сайт</span>
              </Link>
            </div>
          </div>
        </div>
      </header>

      <div className="flex">
        {/* Sidebar */}
        <aside className="w-72 bg-white shadow-lg rounded-tr-xl rounded-br-xl overflow-hidden m-4 mr-0">
          <div className="p-6 border-b border-gray-100">
            <h2 className="text-lg font-bold text-gray-800">Панель управления</h2>
          </div>
          <nav className="p-4">
            <div className="mb-6">
              <h3 className="text-xs uppercase tracking-wider text-gray-500 font-semibold mb-3 pl-4">Основное</h3>
              <ul className="space-y-1">
                <li>
                  <Link
                    to="/admin"
                    className="block px-4 py-2.5 rounded-lg hover:bg-gradient-to-r hover:from-fc-green/10 hover:to-fc-lightGreen/10 text-gray-700 font-medium flex items-center transition-all"
                  >
                    <LayoutDashboard className="mr-3 h-5 w-5 text-fc-green" />
                    Обзор
                  </Link>
                </li>
                <li>
                  <Link
                    to="/admin/teams"
                    className="block px-4 py-2.5 rounded-lg hover:bg-gradient-to-r hover:from-fc-green/10 hover:to-fc-lightGreen/10 text-gray-700 font-medium flex items-center transition-all"
                  >
                    <Shield className="mr-3 h-5 w-5 text-fc-green" />
                    Команды
                  </Link>
                </li>
                <li>
                  <Link
                    to="/admin/players"
                    className="block px-4 py-2.5 rounded-lg hover:bg-gradient-to-r hover:from-fc-green/10 hover:to-fc-lightGreen/10 text-gray-700 font-medium flex items-center transition-all"
                  >
                    <Users className="mr-3 h-5 w-5 text-fc-green" />
                    Игроки
                  </Link>
                </li>
                <li>
                  <Link
                    to="/admin/coaches2"
                    className="block px-4 py-2.5 rounded-lg hover:bg-gradient-to-r hover:from-fc-green/10 hover:to-fc-lightGreen/10 text-gray-700 font-medium flex items-center transition-all"
                  >
                    <Users2 className="mr-3 h-5 w-5 text-fc-green" />
                    Тренера2
                  </Link>
                </li>
              </ul>
            </div>

            <div className="mb-6">
              <h3 className="text-xs uppercase tracking-wider text-gray-500 font-semibold mb-3 pl-4">Соревнования</h3>
              <ul className="space-y-1">
                <li>
                  <Link
                    to="/admin/tournaments"
                    className="block px-4 py-2.5 rounded-lg hover:bg-gradient-to-r hover:from-fc-yellow/10 hover:to-amber-400/10 text-gray-700 font-medium flex items-center transition-all"
                  >
                    <Trophy className="mr-3 h-5 w-5 text-fc-yellow" />
                    Турниры
                  </Link>
                </li>
                <li>
                  <Link
                    to="/admin/matches"
                    className="block px-4 py-2.5 rounded-lg hover:bg-gradient-to-r hover:from-fc-yellow/10 hover:to-amber-400/10 text-gray-700 font-medium flex items-center transition-all"
                  >
                    <Calendar className="mr-3 h-5 w-5 text-fc-yellow" />
                    Матчи
                  </Link>
                </li>
              </ul>
            </div>

            <div className="mb-6">
              <h3 className="text-xs uppercase tracking-wider text-gray-500 font-semibold mb-3 pl-4">Контент</h3>
              <ul className="space-y-1">
                <li>
                  <Link
                    to="/admin/news"
                    className="block px-4 py-2.5 rounded-lg hover:bg-gradient-to-r hover:from-blue-500/10 hover:to-blue-400/10 text-gray-700 font-medium flex items-center transition-all"
                  >
                    <Newspaper className="mr-3 h-5 w-5 text-blue-500" />
                    Новости
                  </Link>
                </li>
              </ul>
            </div>

            <div className="pt-4 border-t border-gray-200 mt-4">
              <button 
                className="w-full px-4 py-2.5 rounded-lg bg-gradient-to-r from-fc-red/10 to-red-600/10 text-fc-red font-medium flex items-center hover:from-fc-red/20 hover:to-red-600/20 transition-all"
                onClick={() => { alert('Выход из системы'); window.location.href = '/'; }}
              >
                <LogOut className="mr-3 h-5 w-5" />
                Выйти
              </button>
            </div>
          </nav>
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AdminDashboard;
