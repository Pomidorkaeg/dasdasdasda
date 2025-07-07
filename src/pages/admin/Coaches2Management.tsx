import React, { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Coach } from '@/types/coach';
import { getTeams } from '@/api/api';
import { db } from '@/lib/db';

const Coaches2Management: React.FC = () => {
  const [coaches, setCoaches] = useState<Coach[]>([]);
  const [teams, setTeams] = useState<any[]>([]);
  const [form, setForm] = useState<Partial<Coach>>({});
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  useEffect(() => {
    db.getCoaches().then(setCoaches);
    getTeams().then(setTeams);
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleEdit = (coach: Coach) => {
    setForm({
      name: coach.name,
      age: coach.age?.toString() || '',
      experience: coach.experience?.toString() || '',
      photo: coach.photo || '',
      team_id: coach.team_id || '',
    });
    setEditingId(coach.id);
    setShowForm(true);
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Удалить этого тренера?')) {
      await db.deleteCoach(id);
      setCoaches(await db.getCoaches());
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.team_id || !form.age || !form.experience) return;
    if (editingId) {
      await db.updateCoach(editingId, {
        ...form,
        age: Number(form.age),
        experience: Number(form.experience),
      } as Coach);
    } else {
      await db.createCoach({
        ...form,
        age: Number(form.age),
        experience: Number(form.experience),
      } as Coach);
    }
    setCoaches(await db.getCoaches());
    setShowForm(false);
    setForm({});
    setEditingId(null);
  };

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">Тренера2</h2>
      <Button onClick={() => { setShowForm(!showForm); setForm({}); setEditingId(null); }} className="mb-4">{showForm ? 'Отмена' : 'Добавить тренера'}</Button>
      {showForm && (
        <form onSubmit={handleSubmit} className="mb-6 space-y-4 bg-white p-4 rounded shadow">
          <div>
            <Label>Имя</Label>
            <Input name="name" value={form.name || ''} onChange={handleChange} required />
          </div>
          <div>
            <Label>Возраст</Label>
            <Input name="age" type="number" min="0" pattern="[0-9]*" inputMode="numeric" value={form.age || ''} onChange={handleChange} required />
          </div>
          <div>
            <Label>Опыт (лет)</Label>
            <Input name="experience" type="number" min="0" pattern="[0-9]*" inputMode="numeric" value={form.experience || ''} onChange={handleChange} required />
          </div>
          <div>
            <Label>Фото (URL)</Label>
            <Input name="photo" value={form.photo || ''} onChange={handleChange} />
            {form.photo && <img src={form.photo} alt="preview" className="w-24 h-24 object-cover rounded mt-2" />}
          </div>
          <div>
            <Label>Команда</Label>
            <select name="team_id" value={form.team_id || ''} onChange={handleChange} required className="w-full border rounded p-2">
              <option value="">Выберите команду</option>
              {teams.map(team => (
                <option key={team.id} value={team.id}>{team.name}</option>
              ))}
            </select>
          </div>
          <Button type="submit">Сохранить</Button>
        </form>
      )}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {coaches.map(coach => (
          <div key={coach.id} className="bg-white rounded shadow p-4 flex flex-col items-center">
            <img src={coach.photo} alt={coach.name} className="w-24 h-24 object-cover rounded-full mb-2" onError={e => (e.currentTarget.style.display = 'none')} />
            <div className="font-bold text-lg">{coach.name}</div>
            <div className="text-gray-500">Возраст: {coach.age || '—'}</div>
            <div className="text-gray-500">Опыт: {coach.experience || '—'} лет</div>
            <div className="text-gray-500">Команда: {teams.find(t => t.id === coach.team_id)?.name || '—'}</div>
            <div className="flex gap-2 mt-2">
              <Button size="sm" variant="outline" onClick={() => handleEdit(coach)}>Редактировать</Button>
              <Button size="sm" variant="destructive" onClick={() => handleDelete(coach.id)}>Удалить</Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Coaches2Management; 