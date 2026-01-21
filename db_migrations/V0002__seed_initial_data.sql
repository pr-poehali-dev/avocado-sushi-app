-- Добавление начальных данных

-- Добавление админа (пароль: admin123)
INSERT INTO users (email, password_hash, name, phone, role) 
VALUES ('admin@avocado.ru', '$2b$10$rKZMaXkGYEqCvXxqH8F5duZ3vK8WqP5YJ5F1gN9mH5R4wZJxE0F5u', 'Администратор', '+7 (999) 999-99-99', 'admin');

-- Добавление промокодов
INSERT INTO promo_codes (code, discount_percent, is_active, usage_limit) VALUES
('ПЕРВЫЙЗАКАЗ', 15, true, 100),
('ЛЕТО2026', 10, true, NULL),
('VIP20', 20, true, 50);

-- Добавление меню (роллы)
INSERT INTO menu_items (name, description, price, category, image_url, is_popular) VALUES
('Филадельфия', 'Лосось, сливочный сыр, огурец', 450, 'rolls', 'https://cdn.poehali.dev/projects/d7a0e6cd-ae73-49e7-94f9-e13522ebe130/files/60aa3bdd-9e2f-49f5-9f45-0dc29675cbe2.jpg', true),
('Калифорния', 'Краб, авокадо, огурец, икра тобико', 390, 'rolls', 'https://cdn.poehali.dev/projects/d7a0e6cd-ae73-49e7-94f9-e13522ebe130/files/60aa3bdd-9e2f-49f5-9f45-0dc29675cbe2.jpg', false),
('Спайси с лососем', 'Лосось, спайси соус, кунжут', 420, 'rolls', 'https://cdn.poehali.dev/projects/d7a0e6cd-ae73-49e7-94f9-e13522ebe130/files/60aa3bdd-9e2f-49f5-9f45-0dc29675cbe2.jpg', false);

-- Добавление меню (суши)
INSERT INTO menu_items (name, description, price, category, image_url, is_popular) VALUES
('Нигири с лососем', 'Свежий лосось на рисе', 120, 'sushi', 'https://cdn.poehali.dev/projects/d7a0e6cd-ae73-49e7-94f9-e13522ebe130/files/f3d7444a-9ba1-4730-90e7-c31b74e68c90.jpg', false),
('Нигири с тунцом', 'Свежий тунец на рисе', 140, 'sushi', 'https://cdn.poehali.dev/projects/d7a0e6cd-ae73-49e7-94f9-e13522ebe130/files/f3d7444a-9ba1-4730-90e7-c31b74e68c90.jpg', true),
('Нигири с креветкой', 'Тигровая креветка на рисе', 130, 'sushi', 'https://cdn.poehali.dev/projects/d7a0e6cd-ae73-49e7-94f9-e13522ebe130/files/f3d7444a-9ba1-4730-90e7-c31b74e68c90.jpg', false);

-- Добавление меню (сеты)
INSERT INTO menu_items (name, description, price, category, image_url, is_popular) VALUES
('Сет "Авокадо"', '24 шт: Филадельфия, Калифорния, Спайси', 1290, 'sets', 'https://cdn.poehali.dev/projects/d7a0e6cd-ae73-49e7-94f9-e13522ebe130/files/c9d3fcb9-b9de-4b77-8633-6bc67ce7fc33.jpg', true),
('Сет "Для двоих"', '40 шт: роллы, суши, сашими', 2100, 'sets', 'https://cdn.poehali.dev/projects/d7a0e6cd-ae73-49e7-94f9-e13522ebe130/files/c9d3fcb9-b9de-4b77-8633-6bc67ce7fc33.jpg', false),
('Сет "Классика"', '16 шт: традиционные роллы', 890, 'sets', 'https://cdn.poehali.dev/projects/d7a0e6cd-ae73-49e7-94f9-e13522ebe130/files/c9d3fcb9-b9de-4b77-8633-6bc67ce7fc33.jpg', false);

-- Добавление меню (пицца)
INSERT INTO menu_items (name, description, price, category, image_url, is_popular) VALUES
('Маргарита', 'Томаты, моцарелла, базилик', 590, 'pizza', 'https://cdn.poehali.dev/projects/d7a0e6cd-ae73-49e7-94f9-e13522ebe130/files/60aa3bdd-9e2f-49f5-9f45-0dc29675cbe2.jpg', true),
('Пепперони', 'Пепперони, моцарелла, томатный соус', 650, 'pizza', 'https://cdn.poehali.dev/projects/d7a0e6cd-ae73-49e7-94f9-e13522ebe130/files/60aa3bdd-9e2f-49f5-9f45-0dc29675cbe2.jpg', false),
('Четыре сыра', 'Моцарелла, пармезан, дор блю, чеддер', 720, 'pizza', 'https://cdn.poehali.dev/projects/d7a0e6cd-ae73-49e7-94f9-e13522ebe130/files/60aa3bdd-9e2f-49f5-9f45-0dc29675cbe2.jpg', false),
('Гавайская', 'Курица, ананасы, моцарелла', 680, 'pizza', 'https://cdn.poehali.dev/projects/d7a0e6cd-ae73-49e7-94f9-e13522ebe130/files/60aa3bdd-9e2f-49f5-9f45-0dc29675cbe2.jpg', false);

-- Добавление меню (бургеры)
INSERT INTO menu_items (name, description, price, category, image_url, is_popular) VALUES
('Чизбургер', 'Говяжья котлета, чеддер, соус, овощи', 450, 'burgers', 'https://cdn.poehali.dev/projects/d7a0e6cd-ae73-49e7-94f9-e13522ebe130/files/f3d7444a-9ba1-4730-90e7-c31b74e68c90.jpg', true),
('Дабл бургер', 'Две котлеты, сыр, бекон, соус', 580, 'burgers', 'https://cdn.poehali.dev/projects/d7a0e6cd-ae73-49e7-94f9-e13522ebe130/files/f3d7444a-9ba1-4730-90e7-c31b74e68c90.jpg', false),
('Картофель фри', 'Хрустящий картофель с соусом', 180, 'burgers', 'https://cdn.poehali.dev/projects/d7a0e6cd-ae73-49e7-94f9-e13522ebe130/files/f3d7444a-9ba1-4730-90e7-c31b74e68c90.jpg', false),
('Куриные крылья BBQ', '8 крылышек с соусом барбекю', 390, 'burgers', 'https://cdn.poehali.dev/projects/d7a0e6cd-ae73-49e7-94f9-e13522ebe130/files/f3d7444a-9ba1-4730-90e7-c31b74e68c90.jpg', false);

-- Добавление меню (wok)
INSERT INTO menu_items (name, description, price, category, image_url, is_popular) VALUES
('Лапша с курицей', 'Яичная лапша, курица, овощи, терияки', 420, 'wok', 'https://cdn.poehali.dev/projects/d7a0e6cd-ae73-49e7-94f9-e13522ebe130/files/c9d3fcb9-b9de-4b77-8633-6bc67ce7fc33.jpg', true),
('Рис с креветками', 'Жареный рис, креветки, овощи, соевый соус', 490, 'wok', 'https://cdn.poehali.dev/projects/d7a0e6cd-ae73-49e7-94f9-e13522ebe130/files/c9d3fcb9-b9de-4b77-8633-6bc67ce7fc33.jpg', false),
('Удон с говядиной', 'Лапша удон, говядина, овощи, устричный соус', 460, 'wok', 'https://cdn.poehali.dev/projects/d7a0e6cd-ae73-49e7-94f9-e13522ebe130/files/c9d3fcb9-b9de-4b77-8633-6bc67ce7fc33.jpg', false),
('Овощной вок', 'Лапша, брокколи, перец, грибы, кунжут', 350, 'wok', 'https://cdn.poehali.dev/projects/d7a0e6cd-ae73-49e7-94f9-e13522ebe130/files/c9d3fcb9-b9de-4b77-8633-6bc67ce7fc33.jpg', false);

-- Добавление меню (напитки)
INSERT INTO menu_items (name, description, price, category, image_url, is_popular) VALUES
('Апельсиновый фреш', '100% натуральный сок, 300 мл', 250, 'drinks', 'https://cdn.poehali.dev/projects/d7a0e6cd-ae73-49e7-94f9-e13522ebe130/files/f3d7444a-9ba1-4730-90e7-c31b74e68c90.jpg', false),
('Лимонад домашний', 'Лимон, мята, газированная вода, 500 мл', 180, 'drinks', 'https://cdn.poehali.dev/projects/d7a0e6cd-ae73-49e7-94f9-e13522ebe130/files/f3d7444a-9ba1-4730-90e7-c31b74e68c90.jpg', true),
('Зелёный чай', 'Японский сенча, 400 мл', 150, 'drinks', 'https://cdn.poehali.dev/projects/d7a0e6cd-ae73-49e7-94f9-e13522ebe130/files/f3d7444a-9ba1-4730-90e7-c31b74e68c90.jpg', false),
('Морс клюквенный', 'Домашний морс из северной клюквы, 500 мл', 200, 'drinks', 'https://cdn.poehali.dev/projects/d7a0e6cd-ae73-49e7-94f9-e13522ebe130/files/f3d7444a-9ba1-4730-90e7-c31b74e68c90.jpg', false);

-- Добавление меню (прочее)
INSERT INTO menu_items (name, description, price, category, image_url, is_popular) VALUES
('Чизкейк Нью-Йорк', 'Классический американский чизкейк', 280, 'other', 'https://cdn.poehali.dev/projects/d7a0e6cd-ae73-49e7-94f9-e13522ebe130/files/60aa3bdd-9e2f-49f5-9f45-0dc29675cbe2.jpg', true),
('Тирамису', 'Итальянский десерт с маскарпоне', 320, 'other', 'https://cdn.poehali.dev/projects/d7a0e6cd-ae73-49e7-94f9-e13522ebe130/files/60aa3bdd-9e2f-49f5-9f45-0dc29675cbe2.jpg', false),
('Эдамаме', 'Молодые соевые бобы с солью', 220, 'other', 'https://cdn.poehali.dev/projects/d7a0e6cd-ae73-49e7-94f9-e13522ebe130/files/60aa3bdd-9e2f-49f5-9f45-0dc29675cbe2.jpg', false),
('Мисо-суп', 'Традиционный японский суп', 190, 'other', 'https://cdn.poehali.dev/projects/d7a0e6cd-ae73-49e7-94f9-e13522ebe130/files/60aa3bdd-9e2f-49f5-9f45-0dc29675cbe2.jpg', false);
