import React, { useState, useEffect } from 'react';
import { newsApi } from '@/api/api';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Plus, Pencil, Trash2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface News {
  id: string;
  title: string;
  content: string;
  image: string | null;
  author: string | null;
  date: Date;
  tags: string[];
  category: string;
}

const NewsManagement = () => {
  const { toast } = useToast();
  const [news, setNews] = useState<News[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingNews, setEditingNews] = useState<News | null>(null);
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    image: '',
    author: ''
  });

  useEffect(() => {
    loadNews();
  }, []);

  const loadNews = async () => {
    try {
      const data = await newsApi.getAll();
      if (data && Array.isArray(data)) {
        setNews(data);
      } else {
        setNews([]);
        console.error('Полученные данные не являются массивом:', data);
      }
    } catch (error) {
      console.error('Ошибка при загрузке новостей:', error);
      setNews([]);
      toast({
        variant: "destructive",
        title: "Ошибка",
        description: "Ошибка при загрузке новостей"
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingNews) {
        await newsApi.update(parseInt(editingNews.id), formData);
        toast({
          title: "Успех",
          description: "Новость обновлена"
        });
      } else {
        await newsApi.create(formData);
        toast({
          title: "Успех",
          description: "Новость создана"
        });
      }
      setIsDialogOpen(false);
      loadNews();
      resetForm();
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Ошибка",
        description: "Произошла ошибка"
      });
    }
  };

  const handleEdit = (newsItem: News) => {
    setEditingNews(newsItem);
    setFormData({
      title: newsItem.title,
      content: newsItem.content,
      image: newsItem.image || '',
      author: newsItem.author || ''
    });
    setIsDialogOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Вы уверены, что хотите удалить эту новость?')) {
      try {
        await newsApi.delete(parseInt(id));
        toast({
          title: "Успех",
          description: "Новость удалена"
        });
        loadNews();
      } catch (error) {
        toast({
          variant: "destructive",
          title: "Ошибка",
          description: "Ошибка при удалении новости"
        });
      }
    }
  };

  const resetForm = () => {
    setEditingNews(null);
    setFormData({
      title: '',
      content: '',
      image: '',
      author: ''
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Управление новостями</h1>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => resetForm()}>
              <Plus className="mr-2 h-4 w-4" />
              Добавить новость
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>{editingNews ? 'Редактировать новость' : 'Новая новость'}</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="text-sm font-medium">Заголовок</label>
                <Input
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  required
                />
              </div>

              <div>
                <label className="text-sm font-medium">Содержание</label>
                <Textarea
                  value={formData.content}
                  onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                  required
                  className="min-h-[200px]"
                />
              </div>

              <div>
                <label className="text-sm font-medium">URL изображения</label>
                <Input
                  value={formData.image}
                  onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                  placeholder="https://example.com/image.jpg"
                />
              </div>

              <div>
                <label className="text-sm font-medium">Автор</label>
                <Input
                  value={formData.author}
                  onChange={(e) => setFormData({ ...formData, author: e.target.value })}
                  required
                />
              </div>

              <div className="flex justify-end space-x-2">
                <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                  Отмена
                </Button>
                <Button type="submit">
                  {editingNews ? 'Сохранить' : 'Создать'}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {news.map((newsItem) => (
          <Card key={newsItem.id}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-lg font-medium line-clamp-2">
                {newsItem.title}
              </CardTitle>
              <div className="flex space-x-2">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => handleEdit(newsItem)}
                >
                  <Pencil className="h-4 w-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => handleDelete(newsItem.id)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {newsItem.image && (
                  <img
                    src={newsItem.image}
                    alt={newsItem.title}
                    className="w-full h-48 object-cover rounded-md mb-2"
                  />
                )}
                <p className="text-sm line-clamp-3">{newsItem.content}</p>
                <div className="flex justify-between items-center text-sm text-gray-500">
                  <span>{newsItem.author}</span>
                  <span>{new Date(newsItem.date).toLocaleDateString()}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default NewsManagement; 