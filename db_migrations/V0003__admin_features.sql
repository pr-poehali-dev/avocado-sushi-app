-- Таблица настроек сайта
CREATE TABLE IF NOT EXISTS site_settings (
    id SERIAL PRIMARY KEY,
    key VARCHAR(100) UNIQUE NOT NULL,
    value TEXT NOT NULL,
    description TEXT,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Таблица акций
CREATE TABLE IF NOT EXISTS promotions (
    id SERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    discount_text VARCHAR(100),
    image_url TEXT,
    is_active BOOLEAN DEFAULT true,
    start_date TIMESTAMP,
    end_date TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Таблица push-подписок
CREATE TABLE IF NOT EXISTS push_subscriptions (
    id SERIAL PRIMARY KEY,
    endpoint TEXT UNIQUE NOT NULL,
    p256dh TEXT NOT NULL,
    auth TEXT NOT NULL,
    user_id INTEGER,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Добавление начальных настроек
INSERT INTO site_settings (key, value, description) VALUES
('restaurant_name', 'Авокадо', 'Название ресторана'),
('phone', '+7 (495) 123-45-67', 'Телефон'),
('email', 'info@avocado-sushi.ru', 'Email'),
('address', 'Киевское шоссе, д. 56, г. Смоленск', 'Адрес'),
('work_hours', '10:00-23:00', 'Часы работы'),
('work_days', 'Ежедневно', 'Дни работы'),
('delivery_free_from', '1000', 'Бесплатная доставка от (₽)'),
('delivery_fee', '300', 'Стоимость доставки (₽)'),
('delivery_time', '60', 'Время доставки (минут)'),
('hero_title', 'Свежие суши с доставкой за 60 минут', 'Заголовок главной страницы'),
('hero_subtitle', 'Готовим из премиальных ингредиентов. Каждый ролл — с любовью.', 'Подзаголовок главной страницы'),
('about_text', 'Суши-бар «Авокадо» — это место, где японская кухня встречается с любовью к деталям. Мы работаем только с проверенными поставщиками и используем свежие ингредиенты премиум-класса.', 'Текст О нас'),
('payment_enabled', 'true', 'Включена ли онлайн-оплата'),
('push_enabled', 'true', 'Включены ли push-уведомления');

-- Добавление акций
INSERT INTO promotions (title, description, discount_text, is_active, start_date, end_date) VALUES
('Летняя акция', 'Скидка 15% на все роллы и сеты!', '15% на роллы', true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP + INTERVAL '30 days'),
('Счастливые часы', 'С 14:00 до 16:00 скидка 10% на всё меню', '10% с 14:00 до 16:00', true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP + INTERVAL '90 days');

-- Индексы
CREATE INDEX IF NOT EXISTS idx_site_settings_key ON site_settings(key);
CREATE INDEX IF NOT EXISTS idx_promotions_active ON promotions(is_active);
CREATE INDEX IF NOT EXISTS idx_push_subscriptions_endpoint ON push_subscriptions(endpoint);
