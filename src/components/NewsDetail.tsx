import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Calendar, User, ArrowLeft } from 'lucide-react';
import { db } from '@/lib/db';
import { News } from '@/types/models';

const NewsDetail = () => {
  const { id } = useParams<{ id: string }>();
  const [news, setNews] = useState<News | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchNews = async () => {
      if (!id) return;
      
      try {
        const newsData = await db.getNewsItem(id);
        if (newsData) {
          setNews(newsData);
        } else {
          setError('Новость не найдена');
        }
      } catch (error) {
        console.error('Error fetching news:', error);
        setError('Ошибка при загрузке новости');
      } finally {
        setLoading(false);
      }
    };

    fetchNews();
  }, [id]);

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">Загрузка...</div>
      </div>
    );
  }

  if (error || !news) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center text-red-500">{error || 'Новость не найдена'}</div>
        <div className="mt-4 text-center">
          <Link to="/news" className="text-blue-500 hover:underline">
            Вернуться к списку новостей
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <Link
        to="/news"
        className="inline-flex items-center text-blue-500 hover:text-blue-700 mb-6"
      >
        <ArrowLeft className="h-4 w-4 mr-2" />
        Назад к новостям
      </Link>

      <article className="bg-white rounded-lg shadow-md overflow-hidden">
        {news.image && (
          <div className="aspect-video overflow-hidden">
            <img
              src={news.image}
              alt={news.title}
              className="w-full h-full object-cover"
            />
          </div>
        )}

        <div className="p-6">
          <h1 className="text-3xl font-bold mb-4">{news.title}</h1>

          <div className="flex items-center text-gray-500 mb-6">
            <div className="flex items-center mr-6">
              <Calendar className="h-4 w-4 mr-2" />
              <span>{new Date(news.date).toLocaleDateString()}</span>
            </div>
            <div className="flex items-center">
              <User className="h-4 w-4 mr-2" />
              <span>{news.author}</span>
            </div>
          </div>

          <div className="prose max-w-none">
            <p className="whitespace-pre-wrap">{news.content}</p>
          </div>

          {news.tags && news.tags.length > 0 && (
            <div className="mt-6 flex flex-wrap gap-2">
              {news.tags.map((tag, index) => (
                <span
                  key={index}
                  className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm"
                >
                  {tag}
                </span>
              ))}
            </div>
          )}
        </div>
      </article>
    </div>
  );
};

export default NewsDetail; 