# Приложение для управления комментариями

Vue.js 2 приложение для управления комментариями с поддержкой CRUD операций, сортировки и пагинации.

## Функционал

- Добавление, редактирование и удаление комментариев
- Постраничная навигация (3 комментария на страницу)
- Сортировка по ID и дате (по возрастанию/убыванию)
- Все операции без перезагрузки страницы (AJAX)
- Валидация форм
- Адаптивная вёрстка

## Технологии

- Vue 2
- Vuex
- Axios
- Vue2 DatePicker
- Laravel (backend API)
- SQLite

## Установка

### С Docker

```bash
docker-compose up -d
docker-compose exec app bash
sed -i 's/\r$//' init.sh
bash ./init.sh
yarn install
yarn dev
```

### Без Docker

```bash
cp .env.example .env
php artisan key:generate
composer install
yarn install
yarn dev
php artisan serve
```

Приложение будет доступно по адресу: http://localhost:8080

## API

- `GET /api/comments` - получить все комментарии
- `POST /api/comments` - создать комментарий
- `PATCH /api/comments/{id}` - обновить комментарий
- `DELETE /api/comments/{id}` - удалить комментарий

## Структура проекта

```
resources/js/
├── store/index.js              # Vuex store
├── components/
│   ├── CommentsList.vue       # Список комментариев
│   ├── CommentItem.vue        # Отдельный комментарий
│   ├── CommentForm.vue        # Форма добавления/редактирования
│   └── Pagination.vue         # Пагинация
└── views/app.vue              # Главный компонент
```
