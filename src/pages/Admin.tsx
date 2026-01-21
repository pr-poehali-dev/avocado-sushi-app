import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import Icon from '@/components/ui/icon';

type Order = {
  id: number;
  user_name: string;
  user_phone: string;
  delivery_type: string;
  delivery_address?: string;
  subtotal: number;
  delivery_fee: number;
  discount: number;
  total: number;
  promo_code?: string;
  status: string;
  created_at: string;
  items: Array<{
    name: string;
    price: number;
    quantity: number;
    subtotal: number;
  }>;
};

type MenuItem = {
  id: number;
  name: string;
  description: string;
  price: number;
  category: string;
  image: string;
  popular: boolean;
};

const Admin = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [editingItem, setEditingItem] = useState<MenuItem | null>(null);
  const [isAddingNew, setIsAddingNew] = useState(false);

  useEffect(() => {
    loadOrders();
    loadMenu();
  }, []);

  const loadOrders = async () => {
    try {
      const response = await fetch('https://functions.poehali.dev/638ec515-262e-4ed3-b036-8ceffe04b418');
      const data = await response.json();
      setOrders(data.orders);
    } catch (error) {
      console.error('Error loading orders:', error);
    }
  };

  const loadMenu = async () => {
    try {
      const response = await fetch('https://functions.poehali.dev/60d59c09-4530-44bc-a06d-84ff951e8929');
      const data = await response.json();
      setMenuItems(data.items);
    } catch (error) {
      console.error('Error loading menu:', error);
    }
  };

  const saveMenuItem = async (item: Partial<MenuItem>) => {
    try {
      const method = item.id ? 'PUT' : 'POST';
      await fetch('https://functions.poehali.dev/60d59c09-4530-44bc-a06d-84ff951e8929', {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(item)
      });
      loadMenu();
      setEditingItem(null);
      setIsAddingNew(false);
    } catch (error) {
      console.error('Error saving menu item:', error);
    }
  };

  const getOrderStats = () => {
    const total = orders.reduce((sum, order) => sum + order.total, 0);
    const todayOrders = orders.filter(order => {
      const orderDate = new Date(order.created_at);
      const today = new Date();
      return orderDate.toDateString() === today.toDateString();
    });
    const todayTotal = todayOrders.reduce((sum, order) => sum + order.total, 0);

    return {
      totalOrders: orders.length,
      totalRevenue: total,
      todayOrders: todayOrders.length,
      todayRevenue: todayTotal,
      averageCheck: orders.length > 0 ? total / orders.length : 0
    };
  };

  const stats = getOrderStats();

  const statusColors: Record<string, string> = {
    pending: 'bg-yellow-500',
    confirmed: 'bg-blue-500',
    preparing: 'bg-purple-500',
    delivering: 'bg-orange-500',
    completed: 'bg-green-500',
    cancelled: 'bg-red-500'
  };

  const statusLabels: Record<string, string> = {
    pending: 'Ожидает',
    confirmed: 'Подтвержден',
    preparing: 'Готовится',
    delivering: 'Доставляется',
    completed: 'Завершен',
    cancelled: 'Отменен'
  };

  return (
    <div className="min-h-screen bg-muted/30">
      <header className="bg-white border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="text-3xl">🥑</div>
              <div>
                <h1 className="text-2xl font-bold">Админ-панель Авокадо</h1>
                <p className="text-sm text-muted-foreground">Управление заказами и меню</p>
              </div>
            </div>
            <Button variant="outline" onClick={() => window.location.href = '/'}>
              <Icon name="ArrowLeft" size={18} className="mr-2" />
              На сайт
            </Button>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <div className="grid md:grid-cols-4 gap-4 mb-8">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">Всего заказов</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{stats.totalOrders}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">Общая выручка</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{Math.round(stats.totalRevenue)} ₽</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">Заказов сегодня</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{stats.todayOrders}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">Средний чек</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{Math.round(stats.averageCheck)} ₽</div>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="orders" className="w-full">
          <TabsList className="grid w-full max-w-md grid-cols-2 mb-8">
            <TabsTrigger value="orders">Заказы</TabsTrigger>
            <TabsTrigger value="menu">Меню</TabsTrigger>
          </TabsList>

          <TabsContent value="orders">
            <Card>
              <CardHeader>
                <CardTitle>Список заказов</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {orders.length === 0 ? (
                    <p className="text-center text-muted-foreground py-8">Заказов пока нет</p>
                  ) : (
                    orders.map((order) => (
                      <Card key={order.id} className="overflow-hidden">
                        <CardContent className="p-4">
                          <div className="flex items-start justify-between mb-3">
                            <div>
                              <div className="flex items-center gap-2 mb-1">
                                <span className="font-semibold">Заказ #{order.id}</span>
                                <Badge className={statusColors[order.status]}>
                                  {statusLabels[order.status]}
                                </Badge>
                              </div>
                              <p className="text-sm text-muted-foreground">
                                {new Date(order.created_at).toLocaleString('ru-RU')}
                              </p>
                            </div>
                            <div className="text-right">
                              <div className="text-2xl font-bold">{order.total} ₽</div>
                              {order.promo_code && (
                                <Badge variant="outline" className="mt-1">
                                  {order.promo_code}
                                </Badge>
                              )}
                            </div>
                          </div>
                          <div className="grid md:grid-cols-2 gap-4 text-sm">
                            <div>
                              <p className="font-medium mb-1">Клиент:</p>
                              <p className="text-muted-foreground">{order.user_name}</p>
                              <p className="text-muted-foreground">{order.user_phone}</p>
                            </div>
                            <div>
                              <p className="font-medium mb-1">Доставка:</p>
                              <p className="text-muted-foreground">
                                {order.delivery_type === 'delivery' ? 'Доставка' : 'Самовывоз'}
                              </p>
                              {order.delivery_address && (
                                <p className="text-muted-foreground">{order.delivery_address}</p>
                              )}
                            </div>
                          </div>
                          <div className="mt-3 pt-3 border-t">
                            <p className="font-medium mb-2 text-sm">Состав заказа:</p>
                            <div className="space-y-1">
                              {order.items.map((item, idx) => (
                                <div key={idx} className="flex justify-between text-sm">
                                  <span className="text-muted-foreground">
                                    {item.name} x{item.quantity}
                                  </span>
                                  <span className="font-medium">{item.subtotal} ₽</span>
                                </div>
                              ))}
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="menu">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>Управление меню</CardTitle>
                  <Button onClick={() => setIsAddingNew(true)}>
                    <Icon name="Plus" size={18} className="mr-2" />
                    Добавить блюдо
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                {(isAddingNew || editingItem) && (
                  <Card className="mb-6 bg-muted/50">
                    <CardContent className="p-6">
                      <h3 className="font-semibold mb-4">
                        {isAddingNew ? 'Новое блюдо' : 'Редактирование'}
                      </h3>
                      <div className="space-y-4">
                        <div>
                          <label className="text-sm font-medium mb-2 block">Название</label>
                          <Input
                            value={editingItem?.name || ''}
                            onChange={(e) => setEditingItem({ ...editingItem!, name: e.target.value })}
                          />
                        </div>
                        <div>
                          <label className="text-sm font-medium mb-2 block">Описание</label>
                          <Textarea
                            value={editingItem?.description || ''}
                            onChange={(e) => setEditingItem({ ...editingItem!, description: e.target.value })}
                            rows={2}
                          />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <label className="text-sm font-medium mb-2 block">Цена (₽)</label>
                            <Input
                              type="number"
                              value={editingItem?.price || 0}
                              onChange={(e) => setEditingItem({ ...editingItem!, price: parseFloat(e.target.value) })}
                            />
                          </div>
                          <div>
                            <label className="text-sm font-medium mb-2 block">Категория</label>
                            <Select
                              value={editingItem?.category}
                              onValueChange={(value) => setEditingItem({ ...editingItem!, category: value })}
                            >
                              <SelectTrigger>
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="rolls">Роллы</SelectItem>
                                <SelectItem value="sushi">Суши</SelectItem>
                                <SelectItem value="sets">Сеты</SelectItem>
                                <SelectItem value="pizza">Пицца</SelectItem>
                                <SelectItem value="burgers">Бургеры</SelectItem>
                                <SelectItem value="wok">WOK</SelectItem>
                                <SelectItem value="drinks">Напитки</SelectItem>
                                <SelectItem value="other">Прочее</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                        </div>
                        <div>
                          <label className="text-sm font-medium mb-2 block">URL изображения</label>
                          <Input
                            value={editingItem?.image || ''}
                            onChange={(e) => setEditingItem({ ...editingItem!, image: e.target.value })}
                          />
                        </div>
                        <div className="flex items-center gap-4">
                          <Button onClick={() => saveMenuItem(editingItem!)}>
                            Сохранить
                          </Button>
                          <Button
                            variant="outline"
                            onClick={() => {
                              setEditingItem(null);
                              setIsAddingNew(false);
                            }}
                          >
                            Отмена
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                )}

                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {menuItems.map((item) => (
                    <Card key={item.id} className="overflow-hidden">
                      <div className="relative aspect-square overflow-hidden">
                        <img
                          src={item.image}
                          alt={item.name}
                          className="w-full h-full object-cover"
                        />
                        {item.popular && (
                          <Badge className="absolute top-2 right-2 bg-primary">
                            Популярное
                          </Badge>
                        )}
                      </div>
                      <CardContent className="p-4">
                        <h3 className="font-semibold mb-1">{item.name}</h3>
                        <p className="text-sm text-muted-foreground mb-2 line-clamp-2">
                          {item.description}
                        </p>
                        <div className="flex items-center justify-between">
                          <span className="text-lg font-bold">{item.price} ₽</span>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => setEditingItem(item)}
                          >
                            <Icon name="Edit" size={14} className="mr-1" />
                            Изменить
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Admin;
