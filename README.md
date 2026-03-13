# 🛢️ Oil Price Tracker

**Oil Price Tracker** — это мини-приложение VK для мониторинга цен на сырьевые товары в реальном времени. Приложение предоставляет актуальную информацию о ценах на нефть, энергоносители, металлы и валютные пары.

![VK Mini Apps](https://img.shields.io/badge/platform-VK%20Mini%20Apps-0077FF?style=flat-square&logo=vk)
![React](https://img.shields.io/badge/React-18.2.0-61DAFB?style=flat-square&logo=react)
![VKUI](https://img.shields.io/badge/VKUI-5.8.0-0077FF?style=flat-square)
![Vite](https://img.shields.io/badge/Vite-5.0.8-646CFF?style=flat-square&logo=vite)

## 📱 Возможности

- **4 категории товаров:**
  - 🛢️ **Нефть** — Brent Crude Oil, WTI Crude Oil
  - ⚡ **Энергия** — природный газ, бензин, дизельное топливо
  - 🥇 **Металлы** — золото
  - 💱 **Валюты** — EUR/USD, GBP/USD

- **Функции:**
  - Отображение текущих цен в реальном времени
  - Показ изменения цены за 24 часа (в процентах)
  - Время последнего обновления данных
  - Кнопка ручного обновления данных
  - Переключение между категориями (кнопки + Tabbar)
  - Персонализация (имя пользователя из VK)
  - Адаптивный дизайн для мобильных и десктопных устройств

## 🚀 Быстрый старт

### Требования

- Node.js 18+ 
- npm или yarn

### Установка

1. Клонируйте репозиторий:
```bash
git clone https://github.com/gregergegr56/Oil.git
cd Oil
```

2. Установите зависимости:
```bash
npm install
```

3. Запустите проект в режиме разработки:
```bash
npm run dev
```

4. Откройте браузер по адресу `http://localhost:5173`

## 📦 Сборка и деплой

### Сборка проекта

```bash
npm run build
```

Собранный проект будет в папке `dist/`.

### Деплой на GitHub Pages

```bash
npm run deploy
```

Эта команда выполнит сборку и опубликует проект на GitHub Pages.

**Ссылка на приложение:** https://gregergegr56.github.io/Oil/

## 🏗️ Структура проекта

```
Oil/
├── src/
│   ├── App.jsx           # Основной компонент приложения
│   └── main.jsx          # Точка входа, инициализация VK Bridge
├── index.html            # HTML шаблон
├── vite.config.js        # Конфигурация Vite
├── package.json          # Зависимости и скрипты
└── README.md             # Документация
```

## 🔧 Технологии

| Технология | Версия | Назначение |
|------------|--------|------------|
| React | 18.2.0 | Фреймворк для создания UI |
| Vite | 5.0.8 | Сборщик проектов |
| VKUI | 5.8.0 | Библиотека компонентов ВКонтакте |
| VK Bridge | 2.15.2 | Мост для взаимодействия с VK |
| VK Bridge React | 1.1.2 | React-хуки для VK Bridge |
| gh-pages | 6.3.0 | Деплой на GitHub Pages |

## 🔌 Интеграция с VK

### VK Bridge

Приложение использует VK Bridge для:

- **Инициализации соединения с VK:**
  ```javascript
  vkBridge.send('VKWebAppInit')
  ```

- **Получения темы (светлая/тёмная):**
  ```javascript
  const appearance = useAppearance()
  ```

- **Получения имени пользователя:**
  ```javascript
  vkBridge.send('VKWebAppGetUserInfo')
    .then(data => {
      setUserName(`${data.first_name} ${data.last_name}`)
    })
  ```

### VKUI

Компоненты VKUI, используемые в приложении:

- `Panel`, `PanelHeader`, `PanelHeaderButton` — панели и заголовки
- `Button` — кнопки переключения категорий
- `SimpleCell` — ячейки для отображения товаров
- `Tabbar`, `TabbarItem` — нижняя навигационная панель
- `Spinner` — индикатор загрузки
- `Progress` — индикатор обновления
- `Group`, `Div` — контейнеры
- `Caption`, `Text`, `Footnote` — типографика

## 📡 API

Приложение использует публичное API **Oil Price API**:

- **Endpoint:** `https://api.oilpriceapi.com/v1/demo/prices`
- **Метод:** GET
- **Формат ответа:** JSON

### Структура ответа

```json
{
  "status": "success",
  "data": {
    "prices": [
      {
        "code": "BRENT_CRUDE_USD",
        "name": "Brent Crude Oil",
        "price": 95.75,
        "currency": "USD",
        "change_24h": 12.18,
        "updated_at": "2026-03-12T10:30:00Z"
      }
    ]
  }
}
```

### Поля данных

| Поле | Тип | Описание |
|------|-----|----------|
| `code` | string | Уникальный код товара |
| `name` | string | Название товара |
| `price` | number | Текущая цена |
| `currency` | string | Валюта (USD) |
| `change_24h` | number | Изменение за 24 часа (%) |
| `updated_at` | string | Время обновления (ISO 8601) |

## 🎨 Категории товаров

### Нефть (oil)
- BRENT_CRUDE_USD — Brent Crude Oil
- WTI_CRUDE_USD — WTI Crude Oil

### Энергия (energy)
- US_NATURAL_GAS_USD — US Natural Gas
- HEATING_OIL_USD — Heating Oil
- GASOLINE_USD — Gasoline
- DIESEL_GULF_COAST_USD — Diesel (Gulf Coast)

### Металлы (metals)
- GOLD_USD — Gold

### Валюты (currency)
- EUR_USD — EUR/USD
- GBP_USD — GBP/USD

## 📝 Скрипты npm

| Команда | Описание |
|---------|----------|
| `npm run dev` | Запуск сервера разработки |
| `npm run build` | Сборка проекта для продакшена |
| `npm run preview` | Предпросмотр собранной версии |
| `npm run deploy` | Сборка и деплой на GitHub Pages |

## 🔗 Ссылки

- **Репозиторий:** https://github.com/gregergegr56/Oil
- **Демо:** https://gregergegr56.github.io/Oil/
- **VK Developer:** https://dev.vk.com/

## 📚 Документация

- [VK Mini Apps Documentation](https://dev.vk.com/mini-apps)
- [VKUI Documentation](https://vkcom.github.io/VKUI/)
- [VK Bridge Documentation](https://dev.vk.com/bridge/overview)
- [React Documentation](https://react.dev/)
- [Vite Documentation](https://vitejs.dev/)

## 📄 Лицензия

Проект создан в учебных целях в рамках практики по разработке VK Mini Apps.

## 👨‍💻 Автор

Студент ФГБОУ ВО «ИГУ», Факультет бизнес-коммуникаций и информатики

---

**Дата обновления:** 14 марта 2026
