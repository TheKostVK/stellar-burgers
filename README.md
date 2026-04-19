# Stellar Burgers

Приложение для сборки бургера и оформления заказов с авторизацией пользователя, лентой заказов и личной историей заказов.

## Демо

Опубликованная версия: [https://thekostvk.github.io/stellar-burgers/](https://thekostvk.github.io/stellar-burgers/)

## Технологии

- React + TypeScript
- Redux Toolkit (slice + thunk)
- React Router DOM
- Webpack
- CSS Modules + `clsx`
- GitHub Pages (`gh-pages`)

## Возможности

- Конструктор бургера: выбор булки, добавление ингредиентов, динамическая стоимость
- Оформление заказа только для авторизованных пользователей
- Защищённые роуты и возврат на целевой URL после логина
- Лента всех заказов (`/feed`)
- История заказов пользователя (`/profile/orders`)
- Модальные окна через роутинг (`/ingredients/:id`, `/feed/:number`, `/profile/orders/:number`)

## Установка и запуск

Установка зависимостей:

```bash
npm install
```

Запуск в режиме разработки:

```bash
npm start
```

Сборка для продакшена:

```bash
npm run build
```

## Деплой

Деплой на GitHub Pages:

```bash
npm run deploy
```

Команда публикует содержимое папки `dist` в ветку `gh-pages`.

## Переменные окружения

Для API нужна переменная окружения:

```env
BURGER_API_URL=https://norma.education-services.ru/api
```

Пример есть в файле `.env.example`.
