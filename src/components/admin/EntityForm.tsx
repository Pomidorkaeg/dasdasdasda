import React from 'react';
import { Button } from '../ui/button';

export interface EntityFormProps {
  title: string;
  onSubmit: (data: any) => void;
  initialData?: any;
  children: React.ReactNode;
  onCancel?: () => void;
}

export const EntityForm: React.FC<EntityFormProps> = ({
  title,
  onSubmit,
  initialData,
  children,
  onCancel
}) => {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const formData = new FormData(e.target as HTMLFormElement);
    const data = Object.fromEntries(formData.entries());
    onSubmit(data);
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">{title}</h2>
        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-2 text-gray-600 hover:text-gray-800"
          >
            Отмена
          </button>
        )}
      </div>
      <form onSubmit={handleSubmit} className="space-y-4">
        {children}
        <div className="flex justify-end gap-4">
          {onCancel && (
            <Button type="button" variant="outline" onClick={onCancel}>
              Отмена
            </Button>
          )}
          <Button type="submit" variant="default">
            Сохранить
          </Button>
        </div>
      </form>
    </div>
  );
};

export const FormField: React.FC<{
  label: string;
  name: string;
  type?: string;
  required?: boolean;
  defaultValue?: string | number;
}> = ({ label, name, type = 'text', required = false, defaultValue }) => {
  return (
    <div className="space-y-2">
      <label htmlFor={name} className="block text-sm font-medium text-gray-700">
        {label}
      </label>
      <input
        type={type}
        id={name}
        name={name}
        defaultValue={defaultValue}
        required={required}
        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
      />
    </div>
  );
}; 