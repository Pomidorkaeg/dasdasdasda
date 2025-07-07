import React, { useEffect, useState } from 'react';
import { EntityForm, FormField } from '../../components/admin/EntityForm';
import { db } from '../../lib/db';
import { News } from '../../types/models';

export const NewsPage: React.FC = () => {
  const [news, setNews] = useState<News[]>([]);
  const [selectedNews, setSelectedNews] = useState<News | null>(null);
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    loadNews();
  }, []);

  const loadNews = async () => {
    const data = await db.getNews();
    setNews(data);
  };

  const handleSubmit = async (data: any) => {
    try {
      if (selectedNews) {
        await db.updateNews(selectedNews.id, data);
      } else {
        await db.createNews(data);
      }
      await loadNews();
      setIsEditing(false);
      setSelectedNews(null);
    } catch (error) {
      console.error('Error saving news:', error);
    }
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Вы уверены, что хотите удалить эту новость?')) {
      try {
        await db.deleteNews(id);
        await loadNews();
      } catch (error) {
        console.error('Error deleting news:', error);
      }
    }
  };

  const handleDeleteAll = async () => {
    if (window.confirm('Удалить все новости?')) {
      try {
        await db.deleteAllNews();
        await loadNews();
      } catch (error) {
        console.error('Error deleting all news:', error);
      }
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Управление новостями</h1>
        <div className="flex gap-2">
          <button
            onClick={() => {
              setSelectedNews(null);
              setIsEditing(true);
            }}
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            Добавить новость
          </button>
          <button
            onClick={handleDeleteAll}
            className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
          >
            Удалить все
          </button>
        </div>
      </div>

      {isEditing ? (
        <EntityForm
          title={selectedNews ? 'Редактировать новость' : 'Добавить новость'}
          onSubmit={data => {
            // Преобразуем теги и дату, добавляем категорию
            const tags = data.tags ? String(data.tags).split(',').map((t: string) => t.trim()).filter(Boolean) : [];
            const date = data.date ? new Date(data.date) : new Date();
            const category = data.category || 'club';
            const payload = { ...data, tags, date, category };
            handleSubmit(payload);
          }}
          initialData={selectedNews}
        >
          <FormField label="Заголовок" name="title" required defaultValue={selectedNews?.title} />
          <FormField label="Текст" name="content" required defaultValue={selectedNews?.content} />
          <FormField label="Изображение (URL)" name="image" defaultValue={selectedNews?.image} />
          <FormField label="Дата" name="date" type="date" required defaultValue={selectedNews?.date ? new Date(selectedNews.date).toISOString().slice(0,10) : undefined} />
          <FormField label="Автор" name="author" required defaultValue={selectedNews?.author} />
          <FormField label="Теги (через запятую)" name="tags" defaultValue={selectedNews?.tags?.join(', ')} />
          <div className="space-y-2">
            <label htmlFor="category" className="block text-sm font-medium text-gray-700">Категория</label>
            <select
              id="category"
              name="category"
              defaultValue={selectedNews?.category || 'club'}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            >
              <option value="club">Клуб</option>
              <option value="matches">Матчи</option>
            </select>
          </div>
        </EntityForm>
      ) :
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {news.map((item) => (
            <div key={item.id} className="bg-white p-4 rounded-lg shadow">
              <img src={item.image} alt={item.title} className="w-full h-40 object-cover rounded mb-4" />
              <h3 className="text-xl font-semibold">{item.title}</h3>
              <p className="text-gray-600">{item.content?.slice(0, 80)}...</p>
              <p className="text-gray-500 text-sm mt-2">{String(item.date)} | {item.author}</p>
              <div className="mt-4 flex space-x-2">
                <button
                  onClick={() => {
                    setSelectedNews(item);
                    setIsEditing(true);
                  }}
                  className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600"
                >
                  Редактировать
                </button>
                <button
                  onClick={() => handleDelete(item.id)}
                  className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600"
                >
                  Удалить
                </button>
              </div>
            </div>
          ))}
        </div>
      }
    </div>
  );
}; 