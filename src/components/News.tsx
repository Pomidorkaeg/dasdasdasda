import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Calendar, Clock, User } from 'lucide-react';
import { db } from '@/lib/db';
import { News as NewsType } from '@/types/models';

const News = React.memo(() => {
  const [news, setNews] = useState<NewsType[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchNews = async () => {
      try {
        const newsData = await db.getNews();
        setNews(newsData);
      } catch (error) {
        console.error('Error fetching news:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchNews();
  }, []);

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8">Новости</h1>
        <div className="text-center">Загрузка...</div>
      </div>
    );
  }

  if (news.length === 0) {
    return (
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8">Новости</h1>
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="p-4">
            <h2 className="text-xl font-semibold mb-2">Нет новостей</h2>
            <p className="text-gray-600 mb-4">
              В данный момент нет доступных новостей
            </p>
            <div className="flex items-center text-sm text-gray-500">
              <Calendar className="h-4 w-4 mr-1" />
              <span className="mr-4">--</span>
              <Clock className="h-4 w-4 mr-1" />
              <span className="mr-4">--</span>
              <User className="h-4 w-4 mr-1" />
              <span>--</span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Новости</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {news.map((item) => (
          <Link
            key={item.id}
            to={`/news/${item.id}`}
            className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300"
          >
            {item.image && (
              <div className="aspect-video overflow-hidden">
                <img
                  src={item.image}
                  alt={item.title}
                  className="w-full h-full object-cover"
                />
              </div>
            )}
            <div className="p-4">
              <h2 className="text-xl font-semibold mb-2 line-clamp-2">{item.title}</h2>
              <p className="text-gray-600 mb-4 line-clamp-3">{item.content}</p>
              <div className="flex items-center text-sm text-gray-500">
                <Calendar className="h-4 w-4 mr-1" />
                <span className="mr-4">{new Date(item.date).toLocaleDateString()}</span>
                <User className="h-4 w-4 mr-1" />
                <span>{item.author}</span>
              </div>
              {item.tags && item.tags.length > 0 && (
                <div className="mt-4 flex flex-wrap gap-2">
                  {item.tags.map((tag, index) => (
                    <span
                      key={index}
                      className="px-2 py-1 bg-gray-100 text-gray-700 rounded-full text-xs"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              )}
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
});

News.displayName = 'News';

export default News; 