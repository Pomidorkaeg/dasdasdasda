import React, { useState, useEffect } from 'react';
import { db } from '@/lib/db';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Plus, Pencil, Trash2, Image as ImageIcon, Video } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Media } from '@/types/models';

const MediaManagement = () => {
  const { toast } = useToast();
  const [media, setMedia] = useState<Media[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingMedia, setEditingMedia] = useState<Media | null>(null);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    fileUrl: '',
    type: 'image' as 'image' | 'video',
    tags: [] as string[]
  });

  useEffect(() => {
    loadMedia();
  }, []);

  const loadMedia = async () => {
    try {
      const data = await db.getMedia();
      setMedia(data);
    } catch (error) {
      console.error('Ошибка при загрузке медиа:', error);
      setMedia([]);
      toast({
        variant: "destructive",
        title: "Ошибка",
        description: "Ошибка при загрузке медиа файлов"
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingMedia) {
        await db.updateMedia(editingMedia.id, formData);
        toast({
          title: "Успех",
          description: "Медиа файл обновлен"
        });
      } else {
        await db.createMedia({
          ...formData,
          date: new Date().toISOString()
        });
        toast({
          title: "Успех",
          description: "Медиа файл создан"
        });
      }
      setIsDialogOpen(false);
      loadMedia();
      resetForm();
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Ошибка",
        description: "Произошла ошибка"
      });
    }
  };

  const handleEdit = (mediaItem: Media) => {
    setEditingMedia(mediaItem);
    setFormData({
      title: mediaItem.title,
      description: mediaItem.description,
      fileUrl: mediaItem.fileUrl,
      type: mediaItem.type,
      tags: mediaItem.tags
    });
    setIsDialogOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Вы уверены, что хотите удалить этот медиа файл?')) {
      try {
        await db.deleteMedia(id);
        toast({
          title: "Успех",
          description: "Медиа файл удален"
        });
        loadMedia();
      } catch (error) {
        toast({
          variant: "destructive",
          title: "Ошибка",
          description: "Ошибка при удалении медиа файла"
        });
      }
    }
  };

  const resetForm = () => {
    setEditingMedia(null);
    setFormData({
      title: '',
      description: '',
      fileUrl: '',
      type: 'image',
      tags: []
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Управление медиа</h1>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => resetForm()}>
              <Plus className="mr-2 h-4 w-4" />
              Добавить медиа
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>{editingMedia ? 'Редактировать медиа' : 'Новый медиа файл'}</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="text-sm font-medium">Название</label>
                <Input
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  required
                />
              </div>

              <div>
                <label className="text-sm font-medium">Описание</label>
                <Textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="min-h-[100px]"
                />
              </div>

              <div>
                <label className="text-sm font-medium">URL файла</label>
                <Input
                  value={formData.fileUrl}
                  onChange={(e) => setFormData({ ...formData, fileUrl: e.target.value })}
                  required
                  placeholder="https://example.com/file.jpg"
                />
              </div>

              <div>
                <label className="text-sm font-medium">Тип</label>
                <select
                  value={formData.type}
                  onChange={(e) => setFormData({ ...formData, type: e.target.value as 'image' | 'video' })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="image">Изображение</option>
                  <option value="video">Видео</option>
                </select>
              </div>

              <div className="flex justify-end space-x-2">
                <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                  Отмена
                </Button>
                <Button type="submit">
                  {editingMedia ? 'Сохранить' : 'Создать'}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {media.map((mediaItem) => (
          <Card key={mediaItem.id}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-lg font-medium line-clamp-2">
                {mediaItem.title}
              </CardTitle>
              <div className="flex space-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleEdit(mediaItem)}
                >
                  <Pencil className="h-4 w-4" />
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleDelete(mediaItem.id)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="flex items-center mb-2">
                {mediaItem.type === 'image' ? (
                  <ImageIcon className="h-4 w-4 mr-2 text-blue-500" />
                ) : (
                  <Video className="h-4 w-4 mr-2 text-red-500" />
                )}
                <span className="text-sm text-gray-500 capitalize">{mediaItem.type}</span>
              </div>
              <p className="text-sm text-gray-600 line-clamp-3 mb-2">
                {mediaItem.description}
              </p>
              <div className="text-xs text-gray-400">
                {new Date(mediaItem.date).toLocaleDateString()}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default MediaManagement; 