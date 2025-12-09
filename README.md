# WORK21 Frontend (BroJS)

Фронтенд платформы WORK21, соединяющей студентов Школы 21 с реальными заказчиками.

## Технологии

- **React** 18.3.1
- **BroJS** 2.0.0 (билдер и сервер разработки)
- **TypeScript**
- **Lucide React** (иконки)

## Установка

```bash
npm install
```

## Запуск

### Режим разработки
```bash
npm start
```
Приложение будет доступно по адресу http://localhost:8099

### Сборка проекта

Разработка:
```bash
npm run build
```

Продакшн:
```bash
npm run build:prod
```

### PROM режим
```bash
npm run prom
```

## Структура проекта

```
work21-front/
├── src/
│   ├── components/      # React компоненты
│   │   ├── Header.tsx
│   │   ├── Hero.tsx
│   │   ├── Features.tsx
│   │   ├── AIAgents.tsx
│   │   ├── HowItWorks.tsx
│   │   ├── CTA.tsx
│   │   ├── Footer.tsx
│   │   ├── ThemeToggle.tsx
│   │   └── index.ts
│   ├── lib/            # Библиотеки и утилиты
│   │   ├── api.ts      # API клиент
│   │   └── theme-context.tsx
│   ├── styles/         # Глобальные стили
│   │   └── global.css
│   ├── App.tsx         # Главный компонент приложения
│   └── index.tsx       # Точка входа
├── public/             # Статические файлы
│   └── index.html
├── stubs/              # API заглушки
│   └── api/
├── bro.config.js       # Конфигурация BroJS
├── package.json
└── tsconfig.json
```

## Особенности

### Темная/Светлая тема
Приложение поддерживает переключение между темной и светлой темой с помощью `ThemeProvider`.

### API
API клиент находится в `src/lib/api.ts` и включает:
- Аутентификация
- Управление пользователями
- Работа с проектами
- AI оценка проектов

### Компоненты
- **Header** - Шапка сайта с навигацией
- **Hero** - Главный баннер
- **Features** - Преимущества платформы
- **AIAgents** - Информация об AI агентах
- **HowItWorks** - Процесс работы
- **CTA** - Призыв к действию
- **Footer** - Подвал сайта

## Конфигурация

### BroJS
Конфигурация находится в `bro.config.js`. Основные параметры:
- `apiPath` - путь к API заглушкам
- `navigations` - навигация приложения
- `config` - конфигурационные параметры

## Backend API

Приложение использует следующие переменные окружения:
- `NEXT_PUBLIC_API_URL` - URL backend API (по умолчанию: http://localhost:8000)
- `NEXT_PUBLIC_ESTIMATOR_API_URL` - URL AI оценщика (по умолчанию: http://localhost:8080)

## Команды

- `npm start` - Запуск dev сервера
- `npm run build` - Сборка для разработки
- `npm run build:prod` - Продакшн сборка
- `npm run clean` - Очистка директории dist
- `npm run compile` - Компиляция проекта
- `npm run prom` - Запуск в PROM режиме

## Лицензия

ISC

