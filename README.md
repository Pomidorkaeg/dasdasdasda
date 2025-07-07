# Tournament Tables Hub

Веб-приложение для управления спортивными командами, игроками, матчами и новостями.

## Установка и запуск

### Предварительные требования
- Node.js (версия 16 или выше)
- npm или yarn

### Установка зависимостей
```bash
npm install
```

### Запуск сервера
```bash
cd server
node index.js
```
Сервер будет доступен по адресу: http://localhost:8080

### Запуск фронтенда
```bash
npm run dev
```
Фронтенд будет доступен по адресу: http://localhost:5173

### Доступ к админ панели
После запуска фронтенда и сервера, админ панель будет доступна по адресу:
- http://localhost:5173/#/admin
- http://localhost:5173/#/admin/teams (управление командами)
- http://localhost:5173/#/admin/players (управление игроками)
- http://localhost:5173/#/admin/matches (управление матчами)
- http://localhost:5173/#/admin/news (управление новостями)
- http://localhost:5173/#/admin/media (управление медиа)

### Запуск через batch файлы (Windows)
```bash
# Запуск сервера
start-server.bat

# Запуск веб-сайта
start_website.bat
```

## Структура проекта

- `src/` - Исходный код фронтенда
- `server/` - Серверная часть (Express.js + SQLite)
- `public/` - Статические файлы
- `src/app/admin/` - Админ панель
- `src/components/` - React компоненты
- `src/types/` - TypeScript типы

## Функциональность

### Админ панель
- Управление командами
- Управление игроками
- Управление матчами
- Управление новостями
- Управление медиа файлами

### Публичная часть
- Просмотр команд
- Просмотр игроков
- Просмотр матчей
- Просмотр новостей

## API Endpoints

- `GET /api/teams` - Получить все команды
- `POST /api/teams` - Создать команду
- `PUT /api/teams/:id` - Обновить команду
- `DELETE /api/teams/:id` - Удалить команду

Аналогичные endpoints для players, matches, news, media.

## База данных

Проект использует SQLite базу данных, которая автоматически создается при первом запуске сервера.

## Технологии

- **Frontend**: React, TypeScript, Vite, Tailwind CSS
- **Backend**: Node.js, Express.js, SQLite
- **UI Components**: Radix UI, Lucide React
- **Styling**: Tailwind CSS
