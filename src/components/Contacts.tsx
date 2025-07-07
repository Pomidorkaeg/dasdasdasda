import React from 'react';
import { MapPin, Phone, Mail, Globe } from 'lucide-react';

const Contacts = React.memo(() => {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Контакты</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-2xl font-semibold mb-6">Контактная информация</h2>
          <div className="space-y-4">
            <div className="flex items-center">
              <MapPin className="h-5 w-5 text-primary mr-3" />
              <div>
                <h3 className="font-medium">Адрес</h3>
                <p className="text-gray-600">Нет данных</p>
              </div>
            </div>
            <div className="flex items-center">
              <Phone className="h-5 w-5 text-primary mr-3" />
              <div>
                <h3 className="font-medium">Телефон</h3>
                <p className="text-gray-600">Нет данных</p>
              </div>
            </div>
            <div className="flex items-center">
              <Mail className="h-5 w-5 text-primary mr-3" />
              <div>
                <h3 className="font-medium">Email</h3>
                <p className="text-gray-600">Нет данных</p>
              </div>
            </div>
            <div className="flex items-center">
              <Globe className="h-5 w-5 text-primary mr-3" />
              <div>
                <h3 className="font-medium">Веб-сайт</h3>
                <p className="text-gray-600">Нет данных</p>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-2xl font-semibold mb-6">Напишите нам</h2>
          <form className="space-y-4">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                Имя
              </label>
              <input
                type="text"
                id="name"
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary"
                placeholder="Введите ваше имя"
              />
            </div>
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                Email
              </label>
              <input
                type="email"
                id="email"
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary"
                placeholder="Введите ваш email"
              />
            </div>
            <div>
              <label htmlFor="message" className="block text-sm font-medium text-gray-700">
                Сообщение
              </label>
              <textarea
                id="message"
                rows={4}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary"
                placeholder="Введите ваше сообщение"
              />
            </div>
            <button
              type="submit"
              className="w-full bg-primary text-white py-2 px-4 rounded-md hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
            >
              Отправить
            </button>
          </form>
        </div>
      </div>
    </div>
  );
});

Contacts.displayName = 'Contacts';

export default Contacts; 