import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { Separator } from '@/components/ui/separator';
import Icon from '@/components/ui/icon';

type MenuItem = {
  name: string;
  description: string;
  price: number;
  image: string;
  popular?: boolean;
};

type CartItem = MenuItem & { quantity: number };

const Index = () => {
  const [activeSection, setActiveSection] = useState('menu');
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);

  const scrollToSection = (sectionId: string) => {
    setActiveSection(sectionId);
    const element = document.getElementById(sectionId);
    element?.scrollIntoView({ behavior: 'smooth' });
  };

  const addToCart = (item: MenuItem) => {
    setCart((prevCart) => {
      const existingItem = prevCart.find((cartItem) => cartItem.name === item.name);
      if (existingItem) {
        return prevCart.map((cartItem) =>
          cartItem.name === item.name
            ? { ...cartItem, quantity: cartItem.quantity + 1 }
            : cartItem
        );
      }
      return [...prevCart, { ...item, quantity: 1 }];
    });
  };

  const removeFromCart = (itemName: string) => {
    setCart((prevCart) => prevCart.filter((item) => item.name !== itemName));
  };

  const updateQuantity = (itemName: string, newQuantity: number) => {
    if (newQuantity <= 0) {
      removeFromCart(itemName);
      return;
    }
    setCart((prevCart) =>
      prevCart.map((item) =>
        item.name === itemName ? { ...item, quantity: newQuantity } : item
      )
    );
  };

  const getTotalPrice = () => {
    return cart.reduce((total, item) => total + item.price * item.quantity, 0);
  };

  const getTotalItems = () => {
    return cart.reduce((total, item) => total + item.quantity, 0);
  };

  const getDeliveryFee = () => {
    const total = getTotalPrice();
    return total >= 1000 ? 0 : 300;
  };

  const menuItems = {
    rolls: [
      {
        name: 'Филадельфия',
        description: 'Лосось, сливочный сыр, огурец',
        price: 450,
        image: 'https://cdn.poehali.dev/projects/d7a0e6cd-ae73-49e7-94f9-e13522ebe130/files/60aa3bdd-9e2f-49f5-9f45-0dc29675cbe2.jpg',
        popular: true
      },
      {
        name: 'Калифорния',
        description: 'Краб, авокадо, огурец, икра тобико',
        price: 390,
        image: 'https://cdn.poehali.dev/projects/d7a0e6cd-ae73-49e7-94f9-e13522ebe130/files/60aa3bdd-9e2f-49f5-9f45-0dc29675cbe2.jpg'
      },
      {
        name: 'Спайси с лососем',
        description: 'Лосось, спайси соус, кунжут',
        price: 420,
        image: 'https://cdn.poehali.dev/projects/d7a0e6cd-ae73-49e7-94f9-e13522ebe130/files/60aa3bdd-9e2f-49f5-9f45-0dc29675cbe2.jpg'
      }
    ],
    sushi: [
      {
        name: 'Нигири с лососем',
        description: 'Свежий лосось на рисе',
        price: 120,
        image: 'https://cdn.poehali.dev/projects/d7a0e6cd-ae73-49e7-94f9-e13522ebe130/files/f3d7444a-9ba1-4730-90e7-c31b74e68c90.jpg'
      },
      {
        name: 'Нигири с тунцом',
        description: 'Свежий тунец на рисе',
        price: 140,
        image: 'https://cdn.poehali.dev/projects/d7a0e6cd-ae73-49e7-94f9-e13522ebe130/files/f3d7444a-9ba1-4730-90e7-c31b74e68c90.jpg',
        popular: true
      },
      {
        name: 'Нигири с креветкой',
        description: 'Тигровая креветка на рисе',
        price: 130,
        image: 'https://cdn.poehali.dev/projects/d7a0e6cd-ae73-49e7-94f9-e13522ebe130/files/f3d7444a-9ba1-4730-90e7-c31b74e68c90.jpg'
      }
    ],
    sets: [
      {
        name: 'Сет "Авокадо"',
        description: '24 шт: Филадельфия, Калифорния, Спайси',
        price: 1290,
        image: 'https://cdn.poehali.dev/projects/d7a0e6cd-ae73-49e7-94f9-e13522ebe130/files/c9d3fcb9-b9de-4b77-8633-6bc67ce7fc33.jpg',
        popular: true
      },
      {
        name: 'Сет "Для двоих"',
        description: '40 шт: роллы, суши, сашими',
        price: 2100,
        image: 'https://cdn.poehali.dev/projects/d7a0e6cd-ae73-49e7-94f9-e13522ebe130/files/c9d3fcb9-b9de-4b77-8633-6bc67ce7fc33.jpg'
      },
      {
        name: 'Сет "Классика"',
        description: '16 шт: традиционные роллы',
        price: 890,
        image: 'https://cdn.poehali.dev/projects/d7a0e6cd-ae73-49e7-94f9-e13522ebe130/files/c9d3fcb9-b9de-4b77-8633-6bc67ce7fc33.jpg'
      }
    ],
    pizza: [
      {
        name: 'Маргарита',
        description: 'Томаты, моцарелла, базилик',
        price: 590,
        image: 'https://cdn.poehali.dev/projects/d7a0e6cd-ae73-49e7-94f9-e13522ebe130/files/60aa3bdd-9e2f-49f5-9f45-0dc29675cbe2.jpg',
        popular: true
      },
      {
        name: 'Пепперони',
        description: 'Пепперони, моцарелла, томатный соус',
        price: 650,
        image: 'https://cdn.poehali.dev/projects/d7a0e6cd-ae73-49e7-94f9-e13522ebe130/files/60aa3bdd-9e2f-49f5-9f45-0dc29675cbe2.jpg'
      },
      {
        name: 'Четыре сыра',
        description: 'Моцарелла, пармезан, дор блю, чеддер',
        price: 720,
        image: 'https://cdn.poehali.dev/projects/d7a0e6cd-ae73-49e7-94f9-e13522ebe130/files/60aa3bdd-9e2f-49f5-9f45-0dc29675cbe2.jpg'
      },
      {
        name: 'Гавайская',
        description: 'Курица, ананасы, моцарелла',
        price: 680,
        image: 'https://cdn.poehali.dev/projects/d7a0e6cd-ae73-49e7-94f9-e13522ebe130/files/60aa3bdd-9e2f-49f5-9f45-0dc29675cbe2.jpg'
      }
    ],
    burgers: [
      {
        name: 'Чизбургер',
        description: 'Говяжья котлета, чеддер, соус, овощи',
        price: 450,
        image: 'https://cdn.poehali.dev/projects/d7a0e6cd-ae73-49e7-94f9-e13522ebe130/files/f3d7444a-9ba1-4730-90e7-c31b74e68c90.jpg',
        popular: true
      },
      {
        name: 'Дабл бургер',
        description: 'Две котлеты, сыр, бекон, соус',
        price: 580,
        image: 'https://cdn.poehali.dev/projects/d7a0e6cd-ae73-49e7-94f9-e13522ebe130/files/f3d7444a-9ba1-4730-90e7-c31b74e68c90.jpg'
      },
      {
        name: 'Картофель фри',
        description: 'Хрустящий картофель с соусом',
        price: 180,
        image: 'https://cdn.poehali.dev/projects/d7a0e6cd-ae73-49e7-94f9-e13522ebe130/files/f3d7444a-9ba1-4730-90e7-c31b74e68c90.jpg'
      },
      {
        name: 'Куриные крылья BBQ',
        description: '8 крылышек с соусом барбекю',
        price: 390,
        image: 'https://cdn.poehali.dev/projects/d7a0e6cd-ae73-49e7-94f9-e13522ebe130/files/f3d7444a-9ba1-4730-90e7-c31b74e68c90.jpg'
      }
    ],
    wok: [
      {
        name: 'Лапша с курицей',
        description: 'Яичная лапша, курица, овощи, терияки',
        price: 420,
        image: 'https://cdn.poehali.dev/projects/d7a0e6cd-ae73-49e7-94f9-e13522ebe130/files/c9d3fcb9-b9de-4b77-8633-6bc67ce7fc33.jpg',
        popular: true
      },
      {
        name: 'Рис с креветками',
        description: 'Жареный рис, креветки, овощи, соевый соус',
        price: 490,
        image: 'https://cdn.poehali.dev/projects/d7a0e6cd-ae73-49e7-94f9-e13522ebe130/files/c9d3fcb9-b9de-4b77-8633-6bc67ce7fc33.jpg'
      },
      {
        name: 'Удон с говядиной',
        description: 'Лапша удон, говядина, овощи, устричный соус',
        price: 460,
        image: 'https://cdn.poehali.dev/projects/d7a0e6cd-ae73-49e7-94f9-e13522ebe130/files/c9d3fcb9-b9de-4b77-8633-6bc67ce7fc33.jpg'
      },
      {
        name: 'Овощной вок',
        description: 'Лапша, брокколи, перец, грибы, кунжут',
        price: 350,
        image: 'https://cdn.poehali.dev/projects/d7a0e6cd-ae73-49e7-94f9-e13522ebe130/files/c9d3fcb9-b9de-4b77-8633-6bc67ce7fc33.jpg'
      }
    ],
    drinks: [
      {
        name: 'Апельсиновый фреш',
        description: '100% натуральный сок, 300 мл',
        price: 250,
        image: 'https://cdn.poehali.dev/projects/d7a0e6cd-ae73-49e7-94f9-e13522ebe130/files/f3d7444a-9ba1-4730-90e7-c31b74e68c90.jpg'
      },
      {
        name: 'Лимонад домашний',
        description: 'Лимон, мята, газированная вода, 500 мл',
        price: 180,
        image: 'https://cdn.poehali.dev/projects/d7a0e6cd-ae73-49e7-94f9-e13522ebe130/files/f3d7444a-9ba1-4730-90e7-c31b74e68c90.jpg',
        popular: true
      },
      {
        name: 'Зелёный чай',
        description: 'Японский сенча, 400 мл',
        price: 150,
        image: 'https://cdn.poehali.dev/projects/d7a0e6cd-ae73-49e7-94f9-e13522ebe130/files/f3d7444a-9ba1-4730-90e7-c31b74e68c90.jpg'
      },
      {
        name: 'Морс клюквенный',
        description: 'Домашний морс из северной клюквы, 500 мл',
        price: 200,
        image: 'https://cdn.poehali.dev/projects/d7a0e6cd-ae73-49e7-94f9-e13522ebe130/files/f3d7444a-9ba1-4730-90e7-c31b74e68c90.jpg'
      }
    ],
    other: [
      {
        name: 'Чизкейк Нью-Йорк',
        description: 'Классический американский чизкейк',
        price: 280,
        image: 'https://cdn.poehali.dev/projects/d7a0e6cd-ae73-49e7-94f9-e13522ebe130/files/60aa3bdd-9e2f-49f5-9f45-0dc29675cbe2.jpg',
        popular: true
      },
      {
        name: 'Тирамису',
        description: 'Итальянский десерт с маскарпоне',
        price: 320,
        image: 'https://cdn.poehali.dev/projects/d7a0e6cd-ae73-49e7-94f9-e13522ebe130/files/60aa3bdd-9e2f-49f5-9f45-0dc29675cbe2.jpg'
      },
      {
        name: 'Эдамаме',
        description: 'Молодые соевые бобы с солью',
        price: 220,
        image: 'https://cdn.poehali.dev/projects/d7a0e6cd-ae73-49e7-94f9-e13522ebe130/files/60aa3bdd-9e2f-49f5-9f45-0dc29675cbe2.jpg'
      },
      {
        name: 'Мисо-суп',
        description: 'Традиционный японский суп',
        price: 190,
        image: 'https://cdn.poehali.dev/projects/d7a0e6cd-ae73-49e7-94f9-e13522ebe130/files/60aa3bdd-9e2f-49f5-9f45-0dc29675cbe2.jpg'
      }
    ]
  };

  const reviews = [
    {
      name: 'Мария',
      rating: 5,
      text: 'Лучшие суши в городе! Всегда свежие ингредиенты и быстрая доставка.',
      date: '15.01.2026'
    },
    {
      name: 'Алексей',
      rating: 5,
      text: 'Заказываем уже второй год. Качество всегда на высоте!',
      date: '10.01.2026'
    },
    {
      name: 'Екатерина',
      rating: 5,
      text: 'Филадельфия просто тает во рту. Спасибо за вкусную еду!',
      date: '05.01.2026'
    }
  ];

  return (
    <div className="min-h-screen">
      <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-sm border-b border-border">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="text-3xl">🥑</div>
              <h1 className="text-2xl font-bold text-primary">Авокадо</h1>
            </div>
            <nav className="hidden md:flex gap-8">
              {['menu', 'order', 'about', 'delivery', 'contacts', 'reviews'].map((section) => (
                <button
                  key={section}
                  onClick={() => scrollToSection(section)}
                  className={`text-sm font-medium transition-colors hover:text-primary ${
                    activeSection === section ? 'text-primary' : 'text-muted-foreground'
                  }`}
                >
                  {section === 'menu' && 'Меню'}
                  {section === 'order' && 'Заказать'}
                  {section === 'about' && 'О нас'}
                  {section === 'delivery' && 'Доставка'}
                  {section === 'contacts' && 'Контакты'}
                  {section === 'reviews' && 'Отзывы'}
                </button>
              ))}
            </nav>
            <Sheet open={isCartOpen} onOpenChange={setIsCartOpen}>
              <SheetTrigger asChild>
                <Button className="hidden md:flex relative">
                  <Icon name="ShoppingCart" size={18} className="mr-2" />
                  Корзина
                  {getTotalItems() > 0 && (
                    <Badge className="absolute -top-2 -right-2 h-6 w-6 flex items-center justify-center p-0 rounded-full">
                      {getTotalItems()}
                    </Badge>
                  )}
                </Button>
              </SheetTrigger>
              <SheetContent className="w-full sm:max-w-lg overflow-y-auto">
                <SheetHeader>
                  <SheetTitle>Корзина</SheetTitle>
                </SheetHeader>
                <div className="mt-8">
                  {cart.length === 0 ? (
                    <div className="text-center py-12">
                      <Icon name="ShoppingCart" size={48} className="mx-auto text-muted-foreground mb-4" />
                      <p className="text-muted-foreground">Корзина пуста</p>
                    </div>
                  ) : (
                    <>
                      <div className="space-y-4">
                        {cart.map((item) => (
                          <Card key={item.name}>
                            <CardContent className="p-4">
                              <div className="flex gap-4">
                                <img
                                  src={item.image}
                                  alt={item.name}
                                  className="w-20 h-20 object-cover rounded-md"
                                />
                                <div className="flex-1">
                                  <h4 className="font-semibold mb-1">{item.name}</h4>
                                  <p className="text-sm text-muted-foreground mb-2">{item.price} ₽</p>
                                  <div className="flex items-center gap-2">
                                    <Button
                                      size="sm"
                                      variant="outline"
                                      onClick={() => updateQuantity(item.name, item.quantity - 1)}
                                    >
                                      <Icon name="Minus" size={14} />
                                    </Button>
                                    <span className="w-8 text-center">{item.quantity}</span>
                                    <Button
                                      size="sm"
                                      variant="outline"
                                      onClick={() => updateQuantity(item.name, item.quantity + 1)}
                                    >
                                      <Icon name="Plus" size={14} />
                                    </Button>
                                    <Button
                                      size="sm"
                                      variant="ghost"
                                      className="ml-auto"
                                      onClick={() => removeFromCart(item.name)}
                                    >
                                      <Icon name="Trash2" size={14} />
                                    </Button>
                                  </div>
                                </div>
                                <div className="font-semibold">
                                  {item.price * item.quantity} ₽
                                </div>
                              </div>
                            </CardContent>
                          </Card>
                        ))}
                      </div>
                      <Separator className="my-6" />
                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Сумма заказа:</span>
                          <span className="font-semibold">{getTotalPrice()} ₽</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Доставка:</span>
                          <span className="font-semibold">
                            {getDeliveryFee() === 0 ? 'Бесплатно' : `${getDeliveryFee()} ₽`}
                          </span>
                        </div>
                        <Separator className="my-2" />
                        <div className="flex justify-between text-lg">
                          <span className="font-bold">Итого:</span>
                          <span className="font-bold">{getTotalPrice() + getDeliveryFee()} ₽</span>
                        </div>
                      </div>
                      <Button
                        className="w-full mt-6"
                        size="lg"
                        onClick={() => {
                          setIsCartOpen(false);
                          scrollToSection('order');
                        }}
                      >
                        Оформить заказ
                      </Button>
                      {getTotalPrice() < 1000 && (
                        <p className="text-sm text-center text-muted-foreground mt-4">
                          Добавьте товаров на {1000 - getTotalPrice()} ₽ для бесплатной доставки
                        </p>
                      )}
                    </>
                  )}
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </header>

      <section className="py-20 bg-gradient-to-b from-primary/5 to-white">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center animate-fade-in">
            <h2 className="text-5xl md:text-6xl font-bold mb-6">
              Свежие суши <br />
              <span className="text-primary">с доставкой за 60 минут</span>
            </h2>
            <p className="text-xl text-muted-foreground mb-8">
              Готовим из премиальных ингредиентов. Каждый ролл — с любовью.
            </p>
            <Button size="lg" className="text-lg px-8" onClick={() => scrollToSection('menu')}>
              Смотреть меню
              <Icon name="ArrowRight" size={20} className="ml-2" />
            </Button>
          </div>
        </div>
      </section>

      <section id="menu" className="py-20">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl font-bold text-center mb-12">Наше меню</h2>
          <Tabs defaultValue="rolls" className="w-full">
            <TabsList className="grid w-full max-w-4xl mx-auto grid-cols-4 lg:grid-cols-8 mb-12">
              <TabsTrigger value="rolls">Роллы</TabsTrigger>
              <TabsTrigger value="sushi">Суши</TabsTrigger>
              <TabsTrigger value="sets">Сеты</TabsTrigger>
              <TabsTrigger value="pizza">Пицца</TabsTrigger>
              <TabsTrigger value="burgers">Бургеры</TabsTrigger>
              <TabsTrigger value="wok">WOK</TabsTrigger>
              <TabsTrigger value="drinks">Напитки</TabsTrigger>
              <TabsTrigger value="other">Прочее</TabsTrigger>
            </TabsList>
            {Object.entries(menuItems).map(([category, items]) => (
              <TabsContent key={category} value={category}>
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {items.map((item, idx) => (
                    <Card key={idx} className="overflow-hidden hover:shadow-lg transition-all duration-300 animate-scale-in">
                      <div className="relative aspect-square overflow-hidden">
                        <img
                          src={item.image}
                          alt={item.name}
                          className="w-full h-full object-cover transition-transform duration-300 hover:scale-110"
                        />
                        {item.popular && (
                          <Badge className="absolute top-4 right-4 bg-primary">
                            Популярное
                          </Badge>
                        )}
                      </div>
                      <CardContent className="p-6">
                        <h3 className="text-xl font-semibold mb-2">{item.name}</h3>
                        <p className="text-muted-foreground text-sm mb-4">{item.description}</p>
                        <div className="flex items-center justify-between">
                          <span className="text-2xl font-bold">{item.price} ₽</span>
                          <Button size="sm" onClick={() => addToCart(item)}>
                            <Icon name="Plus" size={16} className="mr-1" />
                            В корзину
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </TabsContent>
            ))}
          </Tabs>
        </div>
      </section>

      <section id="order" className="py-20 bg-muted/50">
        <div className="container mx-auto px-4">
          <div className="max-w-2xl mx-auto">
            <h2 className="text-4xl font-bold text-center mb-4">Оформить заказ</h2>
            <p className="text-center text-muted-foreground mb-12">
              Доставка бесплатно при заказе от 1000 ₽
            </p>
            <Card>
              <CardContent className="p-8">
                <Tabs defaultValue="delivery" className="w-full">
                  <TabsList className="grid w-full grid-cols-2 mb-6">
                    <TabsTrigger value="delivery">
                      <Icon name="Truck" size={16} className="mr-2" />
                      Доставка
                    </TabsTrigger>
                    <TabsTrigger value="pickup">
                      <Icon name="Store" size={16} className="mr-2" />
                      Самовывоз
                    </TabsTrigger>
                  </TabsList>
                  <TabsContent value="delivery" className="space-y-4">
                    <div>
                      <label className="text-sm font-medium mb-2 block">Ваше имя</label>
                      <Input placeholder="Введите имя" />
                    </div>
                    <div>
                      <label className="text-sm font-medium mb-2 block">Телефон</label>
                      <Input placeholder="+7 (___) ___-__-__" />
                    </div>
                    <div>
                      <label className="text-sm font-medium mb-2 block">Адрес доставки</label>
                      <Input placeholder="Улица, дом, квартира" />
                    </div>
                    <div>
                      <label className="text-sm font-medium mb-2 block">Комментарий к заказу</label>
                      <Textarea placeholder="Время доставки, пожелания..." rows={3} />
                    </div>
                    <Button className="w-full" size="lg">
                      Оформить заказ
                    </Button>
                  </TabsContent>
                  <TabsContent value="pickup" className="space-y-4">
                    <div>
                      <label className="text-sm font-medium mb-2 block">Ваше имя</label>
                      <Input placeholder="Введите имя" />
                    </div>
                    <div>
                      <label className="text-sm font-medium mb-2 block">Телефон</label>
                      <Input placeholder="+7 (___) ___-__-__" />
                    </div>
                    <div>
                      <label className="text-sm font-medium mb-2 block">Время получения</label>
                      <Input type="time" />
                    </div>
                    <div className="p-4 bg-muted rounded-lg">
                      <p className="text-sm font-medium mb-2">Адрес ресторана:</p>
                      <p className="text-sm text-muted-foreground">ул. Пушкина, д. 10</p>
                      <p className="text-sm text-muted-foreground">Ежедневно с 10:00 до 23:00</p>
                    </div>
                    <Button className="w-full" size="lg">
                      Оформить заказ
                    </Button>
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      <section id="about" className="py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-4xl font-bold mb-6">О нас</h2>
            <p className="text-lg text-muted-foreground mb-6">
              Суши-бар «Авокадо» — это место, где японская кухня встречается с любовью к деталям. 
              Мы работаем только с проверенными поставщиками и используем свежие ингредиенты премиум-класса.
            </p>
            <div className="grid md:grid-cols-3 gap-8 mt-12">
              <div className="text-center">
                <div className="text-4xl mb-4">🍣</div>
                <h3 className="font-semibold mb-2">Свежесть</h3>
                <p className="text-sm text-muted-foreground">
                  Ингредиенты каждый день
                </p>
              </div>
              <div className="text-center">
                <div className="text-4xl mb-4">⚡</div>
                <h3 className="font-semibold mb-2">Быстро</h3>
                <p className="text-sm text-muted-foreground">
                  Доставка за 60 минут
                </p>
              </div>
              <div className="text-center">
                <div className="text-4xl mb-4">👨‍🍳</div>
                <h3 className="font-semibold mb-2">Мастерство</h3>
                <p className="text-sm text-muted-foreground">
                  Опытные сушисты
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="delivery" className="py-20 bg-muted/50">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-4xl font-bold text-center mb-12">Доставка и оплата</h2>
            <div className="grid md:grid-cols-2 gap-8">
              <Card>
                <CardContent className="p-6">
                  <Icon name="Truck" size={32} className="text-primary mb-4" />
                  <h3 className="text-xl font-semibold mb-3">Условия доставки</h3>
                  <ul className="space-y-2 text-muted-foreground">
                    <li className="flex items-start gap-2">
                      <Icon name="Check" size={18} className="text-primary mt-0.5" />
                      <span>Бесплатно от 1000 ₽</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <Icon name="Check" size={18} className="text-primary mt-0.5" />
                      <span>300 ₽ при заказе до 1000 ₽</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <Icon name="Check" size={18} className="text-primary mt-0.5" />
                      <span>Доставка за 60 минут</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <Icon name="Check" size={18} className="text-primary mt-0.5" />
                      <span>Зона доставки — весь город</span>
                    </li>
                  </ul>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-6">
                  <Icon name="CreditCard" size={32} className="text-primary mb-4" />
                  <h3 className="text-xl font-semibold mb-3">Способы оплаты</h3>
                  <ul className="space-y-2 text-muted-foreground">
                    <li className="flex items-start gap-2">
                      <Icon name="Check" size={18} className="text-primary mt-0.5" />
                      <span>Наличными курьеру</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <Icon name="Check" size={18} className="text-primary mt-0.5" />
                      <span>Картой курьеру</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <Icon name="Check" size={18} className="text-primary mt-0.5" />
                      <span>Онлайн на сайте</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <Icon name="Check" size={18} className="text-primary mt-0.5" />
                      <span>Безналичный расчёт</span>
                    </li>
                  </ul>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      <section id="contacts" className="py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-4xl font-bold text-center mb-12">Контакты</h2>
            <div className="grid md:grid-cols-2 gap-8">
              <div className="space-y-6">
                <div className="flex items-start gap-4">
                  <Icon name="MapPin" size={24} className="text-primary mt-1" />
                  <div>
                    <h3 className="font-semibold mb-1">Адрес</h3>
                    <p className="text-muted-foreground">ул. Пушкина, д. 10</p>
                    <p className="text-muted-foreground">г. Москва</p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <Icon name="Phone" size={24} className="text-primary mt-1" />
                  <div>
                    <h3 className="font-semibold mb-1">Телефон</h3>
                    <p className="text-muted-foreground">+7 (495) 123-45-67</p>
                    <p className="text-sm text-muted-foreground">Ежедневно с 10:00 до 23:00</p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <Icon name="Mail" size={24} className="text-primary mt-1" />
                  <div>
                    <h3 className="font-semibold mb-1">Email</h3>
                    <p className="text-muted-foreground">info@avocado-sushi.ru</p>
                  </div>
                </div>
              </div>
              <Card>
                <CardContent className="p-6">
                  <h3 className="text-xl font-semibold mb-4">Напишите нам</h3>
                  <form className="space-y-4">
                    <Input placeholder="Ваше имя" />
                    <Input placeholder="Email" type="email" />
                    <Textarea placeholder="Сообщение" rows={4} />
                    <Button className="w-full">Отправить</Button>
                  </form>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      <section id="reviews" className="py-20 bg-muted/50">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl font-bold text-center mb-12">Отзывы наших гостей</h2>
          <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {reviews.map((review, idx) => (
              <Card key={idx}>
                <CardContent className="p-6">
                  <div className="flex items-center gap-1 mb-3">
                    {[...Array(review.rating)].map((_, i) => (
                      <Icon key={i} name="Star" size={18} className="text-yellow-500 fill-yellow-500" />
                    ))}
                  </div>
                  <p className="text-muted-foreground mb-4">{review.text}</p>
                  <div className="flex items-center justify-between">
                    <span className="font-semibold">{review.name}</span>
                    <span className="text-sm text-muted-foreground">{review.date}</span>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <footer className="bg-foreground text-background py-12">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-3 gap-8 mb-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <div className="text-3xl">🥑</div>
                <h3 className="text-xl font-bold">Авокадо</h3>
              </div>
              <p className="text-background/70">
                Свежие суши с доставкой за 60 минут
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Навигация</h4>
              <ul className="space-y-2 text-background/70">
                <li><button onClick={() => scrollToSection('menu')}>Меню</button></li>
                <li><button onClick={() => scrollToSection('order')}>Заказать</button></li>
                <li><button onClick={() => scrollToSection('delivery')}>Доставка</button></li>
                <li><button onClick={() => scrollToSection('contacts')}>Контакты</button></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Контакты</h4>
              <ul className="space-y-2 text-background/70">
                <li>+7 (495) 123-45-67</li>
                <li>info@avocado-sushi.ru</li>
                <li>ул. Пушкина, д. 10</li>
              </ul>
            </div>
          </div>
          <div className="border-t border-background/20 pt-8 text-center text-background/70">
            <p>© 2026 Авокадо. Все права защищены.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;