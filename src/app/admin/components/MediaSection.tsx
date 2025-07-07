'use client';

import { useState, useEffect } from 'react';
import type { Media } from '@/types/models';
import { db } from '@/lib/db';
import { Plus, Edit, Trash2, Image, Video } from 'lucide-react';

const MediaSection = () => {
  const [media, setMedia] = useState<Media[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingMedia, setEditingMedia] = useState<Media | null>(null);
  const [formData, setFormData] = useState({
    title: '',
    type: 'image' as 'image' | 'video',
    file_url: '',
    description: '',
  });

  useEffect(() => {
    loadMedia();
  }, []);

  const loadMedia = async () => {
    const mediaData = await db.getMedia();
    setMedia(mediaData);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingMedia) {
        await db.updateMedia(editingMedia.id, formData);
      } else {
        await db.createMedia(formData);
      }
      setIsModalOpen(false);
      setEditingMedia(null);
      setFormData({
        title: '',
        type: 'image',
        file_url: '',
        description: '',
      });
      loadMedia();
    } catch (error) {
      console.error('Error saving media:', error);
    }
  };

  const handleEdit = (media: Media) => {
    setEditingMedia(media);
    setFormData({
      title: media.title,
      type: media.type,
      file_url: media.file_url,
      description: media.description || '',
    });
    setIsModalOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Вы уверены, что хотите удалить этот медиафайл?')) {
      try {
        await db.deleteMedia(id);
        loadMedia();
      } catch (error) {
        console.error('Error deleting media:', error);
      }
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('ru-RU', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    });
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Управление медиафайлами</h2>
        <button
          onClick={() => setIsModalOpen(true)}
          className="bg-blue-500 text-white px-4 py-2 rounded-lg flex items-center"
        >
          <Plus className="w-5 h-5 mr-2" />
          Добавить медиафайл
        </button>
      </div>

      {/* Media Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {media.map((item) => (
          <div key={item.id} className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-xl font-semibold">{item.title}</h3>
                <p className="text-sm text-gray-500">
                  {item.type === 'image' ? (
                    <span className="flex items-center">
                      <Image className="w-4 h-4 mr-1" />
                      Изображение
                    </span>
                  ) : (
                    <span className="flex items-center">
                      <Video className="w-4 h-4 mr-1" />
                      Видео
                    </span>
                  )}
                </p>
              </div>
              <div className="flex space-x-2">
                <button
                  onClick={() => handleEdit(item)}
                  className="text-blue-500 hover:text-blue-700"
                >
                  <Edit className="w-5 h-5" />
                </button>
                <button
                  onClick={() => handleDelete(item.id)}
                  className="text-red-500 hover:text-red-700"
                >
                  <Trash2 className="w-5 h-5" />
                </button>
              </div>
            </div>
            <div className="text-sm text-gray-600 space-y-2">
              {item.type === 'image' ? (
                <img
                  src={item.file_url}
                  alt={item.title}
                  className="w-full h-48 object-cover rounded-lg"
                />
              ) : (
                <video
                  src={item.file_url}
                  controls
                  className="w-full h-48 object-cover rounded-lg"
                />
              )}
              {item.description && (
                <p className="mt-2">{item.description}</p>
              )}
              <div className="text-xs text-gray-500">
                <p>Добавлено: {formatDate(item.created_at)}</p>
                <p>Обновлено: {formatDate(item.updated_at)}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white rounded-lg p-6 w-full max-w-2xl">
            <h3 className="text-xl font-bold mb-4">
              {editingMedia ? 'Редактировать медиафайл' : 'Добавить медиафайл'}
            </h3>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Название</label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Тип</label>
                <select
                  value={formData.type}
                  onChange={(e) => setFormData({
                    ...formData,
                    type: e.target.value as 'image' | 'video'
                  })}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  required
                >
                  <option value="image">Изображение</option>
                  <option value="video">Видео</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">URL файла</label>
                <input
                  type="text"
                  value={formData.file_url}
                  onChange={(e) => setFormData({ ...formData, file_url: e.target.value })}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Описание</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  rows={4}
                />
              </div>

              <div className="flex justify-end space-x-4 mt-6">
                <button
                  type="button"
                  onClick={() => {
                    setIsModalOpen(false);
                    setEditingMedia(null);
                    setFormData({
                      title: '',
                      type: 'image',
                      file_url: '',
                      description: '',
                    });
                  }}
                  className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200"
                >
                  Отмена
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-white bg-blue-500 rounded-lg hover:bg-blue-600"
                >
                  {editingMedia ? 'Сохранить' : 'Добавить'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default MediaSection; 