import React, { useState, useEffect } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { ArrowRight, Search, Calendar, ChevronDown, Clock, Eye } from 'lucide-react';
import { Link } from 'react-router-dom';
import { db } from '@/lib/db';

const News = () => {
  const [newsItems, setNewsItems] = useState([]);
  
  useEffect(() => {
    const fetchNews = async () => {
      const news = await db.getNews();
      setNewsItems(news);
    };
    fetchNews();
  }, []);
  
  const filteredNews = newsItems;
  
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-grow pt-16 page-transition">
        {/* Header */}
        <div className="relative bg-fc-green text-white py-16">
          <div 
            className="absolute inset-0 bg-gradient-to-r from-fc-green/90 to-fc-darkGreen/80"
            style={{ 
              backgroundImage: `url('https://images.unsplash.com/photo-1540553016722-983e48a2cd10?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80')`,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              backgroundBlendMode: 'overlay'
            }}
          ></div>
          
          <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col items-center text-center">
              <h1 className="text-4xl font-bold mb-4">Новости</h1>
              <p className="max-w-2xl text-white/80 text-lg">
                Будьте в курсе последних событий из жизни футбольного клуба Сибирь
              </p>
            </div>
          </div>
        </div>
        
        {/* News List */}
        <section className="py-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
          {filteredNews.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-500 mb-4">Нет новостей</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Featured News (first item) */}
              <div className="lg:col-span-2">
                <Link
                  to={`/news/${filteredNews[0].id}`}
                  className="group block rounded-xl overflow-hidden shadow-sm border border-gray-200 card-hover"
                >
                  <div className="relative aspect-video overflow-hidden">
                    <img 
                      src={filteredNews[0].image} 
                      alt={filteredNews[0].title} 
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent opacity-70"></div>
                    <div className="absolute bottom-6 left-6 right-6">
                      <div className="flex items-center text-white text-sm mb-2">
                        <Calendar size={14} className="mr-2" />
                        <span>{filteredNews[0].date ? new Date(filteredNews[0].date).toLocaleDateString() : ''}</span>
                      </div>
                      <h3 className="text-white text-2xl font-bold mb-2">
                        {filteredNews[0].title}
                      </h3>
                      <p className="text-white/80 line-clamp-2 mb-4">
                        {filteredNews[0].content?.slice(0, 120)}
                      </p>
                    </div>
                  </div>
                </Link>
              </div>
              
              {/* Other News Items */}
              <div className="lg:col-span-1 space-y-6">
                {filteredNews.slice(1, 4).map((item) => (
                  <Link
                    key={item.id}
                    to={`/news/${item.id}`}
                    className="group block rounded-xl overflow-hidden shadow-sm border border-gray-200 card-hover"
                  >
                    <div className="flex flex-col sm:flex-row lg:flex-col">
                      <div className="sm:w-1/3 lg:w-full">
                        <div className="relative aspect-video overflow-hidden">
                          <img 
                            src={item.image} 
                            alt={item.title} 
                            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                          />
                        </div>
                      </div>
                      
                      <div className="p-4 sm:w-2/3 lg:w-full">
                        <div className="flex items-center text-gray-500 text-xs mb-2">
                          <Calendar size={12} className="mr-1" />
                          <span>{item.date ? new Date(item.date).toLocaleDateString() : ''}</span>
                        </div>
                        
                        <h3 className="font-bold text-lg mb-2 line-clamp-2 group-hover:text-fc-green transition-colors duration-300">
                          {item.title}
                        </h3>
                        
                        <p className="text-gray-600 text-sm line-clamp-2">
                          {item.content?.slice(0, 80)}
                        </p>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
              
              {/* Remaining News Items */}
              <div className="lg:col-span-3 mt-6">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredNews.slice(4).map((item) => (
                    <Link
                      key={item.id}
                      to={`/news/${item.id}`}
                      className="group block rounded-xl overflow-hidden shadow-sm border border-gray-200 card-hover"
                    >
                      <div className="relative aspect-video overflow-hidden">
                        <img 
                          src={item.image} 
                          alt={item.title} 
                          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                        />
                      </div>
                      
                      <div className="p-4">
                        <div className="flex items-center justify-between text-gray-500 text-xs mb-2">
                          <div className="flex items-center">
                            <Calendar size={12} className="mr-1" />
                            <span>{item.date ? new Date(item.date).toLocaleDateString() : ''}</span>
                          </div>
                        </div>
                        
                        <h3 className="font-bold text-lg mb-2 line-clamp-2 group-hover:text-fc-green transition-colors duration-300">
                          {item.title}
                        </h3>
                        
                        <p className="text-gray-600 text-sm line-clamp-3 mb-4">
                          {item.content?.slice(0, 100)}
                        </p>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            </div>
          )}
        </section>
      </main>
      
      <Footer />
    </div>
  );
};

export default News;
