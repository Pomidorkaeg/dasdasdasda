import React from 'react';
import { Link } from 'react-router-dom';
import { Instagram, Facebook, Twitter, MapPin, Phone, Mail } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-fc-green text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          <div>
            <h3 className="text-xl font-bold mb-4">ФК ГУДАУТА</h3>
            <p className="text-white/80 mb-4">
              Футбольный клуб с богатой историей и традициями, стремящийся к новым победам и достижениям.
            </p>
          </div>
          
          <div>
            <h3 className="text-xl font-bold mb-4">Страницы</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/" className="text-white/80 hover:text-white transition-colors duration-300">Главная</Link>
              </li>
              <li>
                <Link to="/team" className="text-white/80 hover:text-white transition-colors duration-300">Команда</Link>
              </li>
              <li>
                <Link to="/news" className="text-white/80 hover:text-white transition-colors duration-300">Новости</Link>
              </li>
              <li>
                <Link to="/matches" className="text-white/80 hover:text-white transition-colors duration-300">Матчи</Link>
              </li>
              <li>
                <Link to="/tournaments" className="text-white/80 hover:text-white transition-colors duration-300">Соревнования</Link>
              </li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-xl font-bold mb-4">Контакты</h3>
            <ul className="space-y-4">
              <li className="flex items-start space-x-3">
                <MapPin size={20} className="shrink-0 mt-1" />
                <span className="text-white/80">Гудаута, ул. Спортивная, 20</span>
              </li>
              <li className="flex items-center space-x-3">
                <Phone size={20} className="shrink-0" />
                <span className="text-white/80">+7 (940) 123-45-67</span>
              </li>
              <li className="flex items-center space-x-3">
                <Mail size={20} className="shrink-0" />
                <span className="text-white/80">info@fcgudauta.com</span>
              </li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-white/20 mt-12 pt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-white/80">© {new Date().getFullYear()} ФК Гудаута. Все права защищены.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
