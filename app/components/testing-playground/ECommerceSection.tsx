'use client';

import { useState, useEffect } from 'react';
import { Card, Button, Input } from '@/app/ui';

interface Product {
  id: string;
  name: string;
  price: number;
  category: string;
  image: string;
  description: string;
  stock: number;
  rating: number;
}

interface CartItem {
  product: Product;
  quantity: number;
}

interface Order {
  id: string;
  items: CartItem[];
  total: number;
  status: 'pending' | 'processing' | 'shipped' | 'delivered';
  date: Date;
  customer: {
    name: string;
    email: string;
    address: string;
    city: string;
    zipCode: string;
    phone: string;
  };
  payment: {
    method: string;
    cardNumber?: string;
    expiryDate?: string;
    cvv?: string;
  };
}

const sampleProducts: Product[] = [
  {
    id: '1',
    name: 'Laptop Gaming Pro X1',
    price: 1299.99,
    category: 'electronics',
    image: '💻',
    description: 'Laptop gaming de alta gama con procesador Intel i9, 32GB RAM y RTX 4080.',
    stock: 15,
    rating: 4.8
  },
  {
    id: '2',
    name: 'Smartphone Ultra 5G',
    price: 899.99,
    category: 'electronics',
    image: '📱',
    description: 'Smartphone flagship con cámara de 108MP, 256GB almacenamiento y 5G.',
    stock: 23,
    rating: 4.6
  },
  {
    id: '3',
    name: 'Auriculares Bluetooth Premium',
    price: 199.99,
    category: 'electronics',
    image: '🎧',
    description: 'Auriculares inalámbricos con cancelación de ruido activa.',
    stock: 45,
    rating: 4.5
  },
  {
    id: '4',
    name: 'Camiseta Casual Cotton',
    price: 29.99,
    category: 'clothing',
    image: '👕',
    description: 'Camiseta de algodón 100% orgánico, disponible en varios colores.',
    stock: 120,
    rating: 4.2
  },
  {
    id: '5',
    name: 'Zapatillas Running Pro',
    price: 129.99,
    category: 'clothing',
    image: '👟',
    description: 'Zapatillas deportivas con tecnología de amortiguación avanzada.',
    stock: 67,
    rating: 4.7
  },
  {
    id: '6',
    name: 'Libro: JavaScript Avanzado',
    price: 39.99,
    category: 'books',
    image: '📚',
    description: 'Guía completa de JavaScript para desarrolladores avanzados.',
    stock: 89,
    rating: 4.9
  },
  {
    id: '7',
    name: 'Cafetera Espresso',
    price: 299.99,
    category: 'home',
    image: '☕',
    description: 'Cafetera automática con molinillo integrado y pantalla táctil.',
    stock: 12,
    rating: 4.4
  },
  {
    id: '8',
    name: 'Monitor 4K 32"',
    price: 459.99,
    category: 'electronics',
    image: '🖥️',
    description: 'Monitor profesional 4K con HDR y frecuencia de 144Hz.',
    stock: 8,
    rating: 4.6
  }
];

export default function ECommerceSection() {
  const [products, setProducts] = useState<Product[]>(sampleProducts);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [currentView, setCurrentView] = useState<'catalog' | 'cart' | 'checkout' | 'confirmation'>('catalog');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState<'name' | 'price' | 'rating'>('name');
  const [currentOrder, setCurrentOrder] = useState<Order | null>(null);
  const [orderHistory, setOrderHistory] = useState<Order[]>([]);
  
  const [checkoutForm, setCheckoutForm] = useState({
    customer: {
      name: '',
      email: '',
      address: '',
      city: '',
      zipCode: '',
      phone: ''
    },
    payment: {
      method: 'credit_card',
      cardNumber: '',
      expiryDate: '',
      cvv: '',
      cardHolder: ''
    },
    shipping: {
      method: 'standard',
      instructions: ''
    }
  });

  const categories = ['all', 'electronics', 'clothing', 'books', 'home'];

  const addToCart = (product: Product) => {
    setCart(prevCart => {
      const existingItem = prevCart.find(item => item.product.id === product.id);
      if (existingItem) {
        return prevCart.map(item =>
          item.product.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      return [...prevCart, { product, quantity: 1 }];
    });
  };

  const removeFromCart = (productId: string) => {
    setCart(prevCart => prevCart.filter(item => item.product.id !== productId));
  };

  const updateQuantity = (productId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(productId);
      return;
    }
    
    setCart(prevCart =>
      prevCart.map(item =>
        item.product.id === productId
          ? { ...item, quantity }
          : item
      )
    );
  };

  const getCartTotal = () => {
    return cart.reduce((total, item) => total + (item.product.price * item.quantity), 0);
  };

  const getCartItemsCount = () => {
    return cart.reduce((total, item) => total + item.quantity, 0);
  };

  const getFilteredProducts = () => {
    let filtered = products;

    // Filter by category
    if (selectedCategory !== 'all') {
      filtered = filtered.filter(product => product.category === selectedCategory);
    }

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(product =>
        product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Sort
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'price':
          return a.price - b.price;
        case 'rating':
          return b.rating - a.rating;
        default:
          return a.name.localeCompare(b.name);
      }
    });

    return filtered;
  };

  const processOrder = async () => {
    if (cart.length === 0) return;

    const orderId = Math.random().toString(36).substr(2, 9);
    const newOrder: Order = {
      id: orderId,
      items: [...cart],
      total: getCartTotal(),
      status: 'pending',
      date: new Date(),
      customer: checkoutForm.customer,
      payment: checkoutForm.payment
    };

    setCurrentOrder(newOrder);
    setOrderHistory(prev => [newOrder, ...prev]);
    
    // Simulate processing
    setTimeout(() => {
      if (currentOrder) {
        setCurrentOrder(prev => prev ? { ...prev, status: 'processing' } : null);
      }
    }, 2000);

    setTimeout(() => {
      if (currentOrder) {
        setCurrentOrder(prev => prev ? { ...prev, status: 'shipped' } : null);
      }
    }, 4000);

    // Clear cart
    setCart([]);
    setCurrentView('confirmation');
  };

  const resetForm = () => {
    setCheckoutForm({
      customer: {
        name: '',
        email: '',
        address: '',
        city: '',
        zipCode: '',
        phone: ''
      },
      payment: {
        method: 'credit_card',
        cardNumber: '',
        expiryDate: '',
        cvv: '',
        cardHolder: ''
      },
      shipping: {
        method: 'standard',
        instructions: ''
      }
    });
  };

  const renderCatalog = () => (
    <div className="space-y-6">
      {/* Filters and Search */}
      <Card className="p-6">
        <div className="flex flex-wrap gap-4 items-center justify-between">
          <div className="flex flex-wrap gap-4 items-center">
            <div>
              <label className="block text-sm font-medium mb-2">Categoría:</label>
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="px-3 py-2 border rounded-md bg-white dark:bg-gray-700"
                data-testid="category-filter"
              >
                <option value="all">Todas</option>
                <option value="electronics">Electrónicos</option>
                <option value="clothing">Ropa</option>
                <option value="books">Libros</option>
                <option value="home">Hogar</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Ordenar por:</label>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as 'name' | 'price' | 'rating')}
                className="px-3 py-2 border rounded-md bg-white dark:bg-gray-700"
                data-testid="sort-filter"
              >
                <option value="name">Nombre</option>
                <option value="price">Precio</option>
                <option value="rating">Valoración</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Buscar:</label>
              <Input
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Buscar productos..."
                className="w-64"
                data-testid="search-input"
              />
            </div>
          </div>

          <div className="text-sm text-gray-600 dark:text-gray-400">
            {getFilteredProducts().length} productos encontrados
          </div>
        </div>
      </Card>

      {/* Products Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6" data-testid="products-grid">
        {getFilteredProducts().map(product => (
          <Card key={product.id} className="p-4 hover:shadow-lg transition-shadow" data-testid={`product-${product.id}`}>
            <div className="text-center mb-4">
              <div className="text-6xl mb-2">{product.image}</div>
              <h3 className="font-semibold text-lg mb-2" data-testid={`product-name-${product.id}`}>
                {product.name}
              </h3>
              <div className="flex items-center justify-center gap-1 mb-2">
                {Array.from({ length: 5 }, (_, i) => (
                  <span key={i} className={i < Math.floor(product.rating) ? 'text-yellow-500' : 'text-gray-300'}>
                    ⭐
                  </span>
                ))}
                <span className="text-sm text-gray-600 ml-1">({product.rating})</span>
              </div>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-4 line-clamp-2">
                {product.description}
              </p>
            </div>

            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-2xl font-bold text-lime-600" data-testid={`product-price-${product.id}`}>
                  ${product.price}
                </span>
                <span className="text-sm text-gray-500">
                  Stock: {product.stock}
                </span>
              </div>

              <Button
                onClick={() => addToCart(product)}
                className="w-full"
                disabled={product.stock === 0}
                data-testid={`add-to-cart-${product.id}`}
              >
                {product.stock === 0 ? '❌ Sin Stock' : '🛒 Agregar al Carrito'}
              </Button>
            </div>
          </Card>
        ))}
      </div>

      {getFilteredProducts().length === 0 && (
        <div className="text-center py-12">
          <div className="text-6xl mb-4">🔍</div>
          <h3 className="text-xl font-semibold mb-2">No se encontraron productos</h3>
          <p className="text-gray-600">Intenta con otros filtros o términos de búsqueda</p>
        </div>
      )}
    </div>
  );

  const renderCart = () => (
    <div className="space-y-6">
      <Card className="p-6">
        <h3 className="text-2xl font-bold mb-6">🛒 Carrito de Compras</h3>
        
        {cart.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">🛒</div>
            <h4 className="text-xl font-semibold mb-2">Tu carrito está vacío</h4>
            <p className="text-gray-600 mb-6">Agrega algunos productos para comenzar</p>
            <Button onClick={() => setCurrentView('catalog')}>
              🛍️ Continuar Comprando
            </Button>
          </div>
        ) : (
          <>
            <div className="space-y-4" data-testid="cart-items">
              {cart.map(item => (
                <div key={item.product.id} className="flex items-center gap-4 p-4 border rounded-lg" data-testid={`cart-item-${item.product.id}`}>
                  <div className="text-4xl">{item.product.image}</div>
                  
                  <div className="flex-1">
                    <h4 className="font-semibold">{item.product.name}</h4>
                    <p className="text-sm text-gray-600">{item.product.description.slice(0, 80)}...</p>
                    <p className="text-lg font-bold text-lime-600">${item.product.price}</p>
                  </div>

                  <div className="flex items-center gap-2">
                    <Button
                      variant="secondary"
                      onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
                      className="px-3 py-1"
                      data-testid={`decrease-quantity-${item.product.id}`}
                    >
                      ➖
                    </Button>
                    <span className="px-4 py-2 border rounded" data-testid={`quantity-${item.product.id}`}>
                      {item.quantity}
                    </span>
                    <Button
                      variant="secondary"
                      onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                      className="px-3 py-1"
                      data-testid={`increase-quantity-${item.product.id}`}
                    >
                      ➕
                    </Button>
                  </div>

                  <div className="text-right">
                    <p className="font-bold">${(item.product.price * item.quantity).toFixed(2)}</p>
                    <Button
                      variant="danger"
                      onClick={() => removeFromCart(item.product.id)}
                      className="px-3 py-1 mt-2"
                      data-testid={`remove-from-cart-${item.product.id}`}
                    >
                      🗑️
                    </Button>
                  </div>
                </div>
              ))}
            </div>

            <div className="border-t pt-6">
              <div className="flex items-center justify-between text-xl font-bold mb-6">
                <span>Total:</span>
                <span className="text-lime-600" data-testid="cart-total">
                  ${getCartTotal().toFixed(2)}
                </span>
              </div>

              <div className="flex gap-4">
                <Button
                  variant="secondary"
                  onClick={() => setCurrentView('catalog')}
                  className="flex-1"
                >
                  🛍️ Continuar Comprando
                </Button>
                <Button
                  onClick={() => setCurrentView('checkout')}
                  className="flex-1"
                  data-testid="proceed-to-checkout"
                >
                  💳 Proceder al Pago
                </Button>
              </div>
            </div>
          </>
        )}
      </Card>
    </div>
  );

  const renderCheckout = () => (
    <div className="space-y-6">
      <Card className="p-6">
        <h3 className="text-2xl font-bold mb-6">💳 Checkout</h3>

        <form
          onSubmit={(e) => {
            e.preventDefault();
            processOrder();
          }}
          className="space-y-8"
          data-testid="checkout-form"
        >
          {/* Customer Information */}
          <div>
            <h4 className="text-lg font-semibold mb-4">Información del Cliente</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2">Nombre Completo *</label>
                <Input
                  value={checkoutForm.customer.name}
                  onChange={(e) => setCheckoutForm(prev => ({
                    ...prev,
                    customer: { ...prev.customer, name: e.target.value }
                  }))}
                  required
                  data-testid="customer-name"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Email *</label>
                <Input
                  type="email"
                  value={checkoutForm.customer.email}
                  onChange={(e) => setCheckoutForm(prev => ({
                    ...prev,
                    customer: { ...prev.customer, email: e.target.value }
                  }))}
                  required
                  data-testid="customer-email"
                />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium mb-2">Dirección *</label>
                <Input
                  value={checkoutForm.customer.address}
                  onChange={(e) => setCheckoutForm(prev => ({
                    ...prev,
                    customer: { ...prev.customer, address: e.target.value }
                  }))}
                  required
                  data-testid="customer-address"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Ciudad *</label>
                <Input
                  value={checkoutForm.customer.city}
                  onChange={(e) => setCheckoutForm(prev => ({
                    ...prev,
                    customer: { ...prev.customer, city: e.target.value }
                  }))}
                  required
                  data-testid="customer-city"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Código Postal *</label>
                <Input
                  value={checkoutForm.customer.zipCode}
                  onChange={(e) => setCheckoutForm(prev => ({
                    ...prev,
                    customer: { ...prev.customer, zipCode: e.target.value }
                  }))}
                  required
                  data-testid="customer-zipcode"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Teléfono</label>
                <Input
                  value={checkoutForm.customer.phone}
                  onChange={(e) => setCheckoutForm(prev => ({
                    ...prev,
                    customer: { ...prev.customer, phone: e.target.value }
                  }))}
                  data-testid="customer-phone"
                />
              </div>
            </div>
          </div>

          {/* Payment Information */}
          <div>
            <h4 className="text-lg font-semibold mb-4">Información de Pago</h4>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">Método de Pago</label>
                <select
                  value={checkoutForm.payment.method}
                  onChange={(e) => setCheckoutForm(prev => ({
                    ...prev,
                    payment: { ...prev.payment, method: e.target.value }
                  }))}
                  className="w-full px-3 py-2 border rounded-md bg-white dark:bg-gray-700"
                  data-testid="payment-method"
                >
                  <option value="credit_card">Tarjeta de Crédito</option>
                  <option value="debit_card">Tarjeta de Débito</option>
                  <option value="paypal">PayPal</option>
                  <option value="bank_transfer">Transferencia Bancaria</option>
                </select>
              </div>

              {(checkoutForm.payment.method === 'credit_card' || checkoutForm.payment.method === 'debit_card') && (
                <>
                  <div>
                    <label className="block text-sm font-medium mb-2">Titular de la Tarjeta *</label>
                    <Input
                      value={checkoutForm.payment.cardHolder}
                      onChange={(e) => setCheckoutForm(prev => ({
                        ...prev,
                        payment: { ...prev.payment, cardHolder: e.target.value }
                      }))}
                      required
                      data-testid="card-holder"
                    />
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium mb-2">Número de Tarjeta *</label>
                      <Input
                        value={checkoutForm.payment.cardNumber}
                        onChange={(e) => setCheckoutForm(prev => ({
                          ...prev,
                          payment: { ...prev.payment, cardNumber: e.target.value }
                        }))}
                        placeholder="1234 5678 9012 3456"
                        maxLength={19}
                        required
                        data-testid="card-number"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2">CVV *</label>
                      <Input
                        value={checkoutForm.payment.cvv}
                        onChange={(e) => setCheckoutForm(prev => ({
                          ...prev,
                          payment: { ...prev.payment, cvv: e.target.value }
                        }))}
                        placeholder="123"
                        maxLength={4}
                        required
                        data-testid="card-cvv"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Fecha de Vencimiento *</label>
                    <Input
                      value={checkoutForm.payment.expiryDate}
                      onChange={(e) => setCheckoutForm(prev => ({
                        ...prev,
                        payment: { ...prev.payment, expiryDate: e.target.value }
                      }))}
                      placeholder="MM/YY"
                      maxLength={5}
                      required
                      data-testid="card-expiry"
                    />
                  </div>
                </>
              )}
            </div>
          </div>

          {/* Shipping */}
          <div>
            <h4 className="text-lg font-semibold mb-4">Envío</h4>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">Método de Envío</label>
                <select
                  value={checkoutForm.shipping.method}
                  onChange={(e) => setCheckoutForm(prev => ({
                    ...prev,
                    shipping: { ...prev.shipping, method: e.target.value }
                  }))}
                  className="w-full px-3 py-2 border rounded-md bg-white dark:bg-gray-700"
                  data-testid="shipping-method"
                >
                  <option value="standard">Estándar (5-7 días) - Gratis</option>
                  <option value="express">Express (2-3 días) - $15</option>
                  <option value="overnight">Overnight (1 día) - $30</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Instrucciones de Entrega</label>
                <textarea
                  value={checkoutForm.shipping.instructions}
                  onChange={(e) => setCheckoutForm(prev => ({
                    ...prev,
                    shipping: { ...prev.shipping, instructions: e.target.value }
                  }))}
                  placeholder="Instrucciones especiales para la entrega..."
                  rows={3}
                  className="w-full px-3 py-2 border rounded-md bg-white dark:bg-gray-700"
                  data-testid="shipping-instructions"
                />
              </div>
            </div>
          </div>

          {/* Order Summary */}
          <div>
            <h4 className="text-lg font-semibold mb-4">Resumen del Pedido</h4>
            <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
              <div className="space-y-2">
                {cart.map(item => (
                  <div key={item.product.id} className="flex justify-between">
                    <span>{item.product.name} x{item.quantity}</span>
                    <span>${(item.product.price * item.quantity).toFixed(2)}</span>
                  </div>
                ))}
                <div className="border-t pt-2 flex justify-between font-bold text-lg">
                  <span>Total:</span>
                  <span className="text-lime-600">${getCartTotal().toFixed(2)}</span>
                </div>
              </div>
            </div>
          </div>

          <div className="flex gap-4">
            <Button
              type="button"
              variant="secondary"
              onClick={() => setCurrentView('cart')}
              className="flex-1"
            >
              ⬅️ Volver al Carrito
            </Button>
            <Button
              type="submit"
              className="flex-1"
              data-testid="place-order"
            >
              🚀 Realizar Pedido
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );

  const renderConfirmation = () => (
    <div className="space-y-6">
      <Card className="p-6 text-center">
        <div className="text-6xl mb-4">🎉</div>
        <h3 className="text-2xl font-bold mb-4 text-green-600">¡Pedido Realizado con Éxito!</h3>
        
        {currentOrder && (
          <div className="space-y-4">
            <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-lg">
              <p className="text-lg mb-2">
                <strong>Número de Pedido:</strong> <span data-testid="order-id">{currentOrder.id}</span>
              </p>
              <p className="text-lg mb-2">
                <strong>Total:</strong> <span data-testid="order-total">${currentOrder.total.toFixed(2)}</span>
              </p>
              <p className="text-lg">
                <strong>Estado:</strong> 
                <span className={`ml-2 px-2 py-1 rounded text-sm ${
                  currentOrder.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                  currentOrder.status === 'processing' ? 'bg-blue-100 text-blue-800' :
                  currentOrder.status === 'shipped' ? 'bg-green-100 text-green-800' :
                  'bg-gray-100 text-gray-800'
                }`} data-testid="order-status">
                  {currentOrder.status === 'pending' ? '⏳ Pendiente' :
                   currentOrder.status === 'processing' ? '🔄 Procesando' :
                   currentOrder.status === 'shipped' ? '🚚 Enviado' :
                   '✅ Entregado'}
                </span>
              </p>
            </div>

            <div className="text-left">
              <h4 className="font-semibold mb-2">Artículos del Pedido:</h4>
              <div className="space-y-2">
                {currentOrder.items.map(item => (
                  <div key={item.product.id} className="flex justify-between">
                    <span>{item.product.name} x{item.quantity}</span>
                    <span>${(item.product.price * item.quantity).toFixed(2)}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="text-left">
              <h4 className="font-semibold mb-2">Información de Envío:</h4>
              <p>{currentOrder.customer.name}</p>
              <p>{currentOrder.customer.address}</p>
              <p>{currentOrder.customer.city}, {currentOrder.customer.zipCode}</p>
            </div>
          </div>
        )}

        <div className="flex gap-4 mt-8">
          <Button
            onClick={() => {
              setCurrentView('catalog');
              setCurrentOrder(null);
              resetForm();
            }}
            className="flex-1"
            data-testid="continue-shopping"
          >
            🛍️ Continuar Comprando
          </Button>
          <Button
            variant="secondary"
            onClick={() => {
              alert('Función de seguimiento no implementada en la demo');
            }}
            className="flex-1"
          >
            📦 Rastrear Pedido
          </Button>
        </div>
      </Card>
    </div>
  );

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      {/* Header with Navigation */}
      <Card className="p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-2xl font-bold">🛒 TeamsQA Store</h3>
          
          <div className="flex items-center gap-4">
            <Button
              variant={currentView === 'catalog' ? 'primary' : 'secondary'}
              onClick={() => setCurrentView('catalog')}
              data-testid="nav-catalog"
            >
              🛍️ Catálogo
            </Button>
            <Button
              variant={currentView === 'cart' ? 'primary' : 'secondary'}
              onClick={() => setCurrentView('cart')}
              className="relative"
              data-testid="nav-cart"
            >
              🛒 Carrito
              {cart.length > 0 && (
                <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center" data-testid="cart-badge">
                  {getCartItemsCount()}
                </span>
              )}
            </Button>
          </div>
        </div>

        <div className="text-sm text-gray-600 dark:text-gray-400">
          <strong>Para Testers:</strong> Simulador completo de e-commerce con catálogo, carrito, checkout y confirmación. 
          Practica flujos de compra completos, validaciones de formularios y manejo de estados.
        </div>
      </Card>

      {/* Main Content */}
      {currentView === 'catalog' && renderCatalog()}
      {currentView === 'cart' && renderCart()}
      {currentView === 'checkout' && renderCheckout()}
      {currentView === 'confirmation' && renderConfirmation()}

      {/* Testing Tips */}
      <Card className="p-6 bg-emerald-50 dark:bg-emerald-900/20 border-emerald-200 dark:border-emerald-800">
        <h4 className="text-lg font-semibold text-emerald-900 dark:text-emerald-100 mb-3">
          💡 Escenarios de Testing E-Commerce
        </h4>
        <div className="text-emerald-800 dark:text-emerald-200 space-y-2 text-sm">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <h5 className="font-semibold mb-2">Flujos a Testear:</h5>
              <ul className="list-disc list-inside space-y-1">
                <li>Búsqueda y filtrado de productos</li>
                <li>Agregar/eliminar productos del carrito</li>
                <li>Modificar cantidades en el carrito</li>
                <li>Validación de formularios de checkout</li>
                <li>Proceso completo de compra</li>
                <li>Manejo de estados de pedido</li>
              </ul>
            </div>
            <div>
              <h5 className="font-semibold mb-2">Elementos a Validar:</h5>
              <ul className="list-disc list-inside space-y-1">
                <li>Precios y totales calculados correctamente</li>
                <li>Contador de productos en carrito</li>
                <li>Validación de campos obligatorios</li>
                <li>Estados de botones (habilitado/deshabilitado)</li>
                <li>Persistencia de datos en el carrito</li>
                <li>Confirmaciones y mensajes de éxito</li>
              </ul>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
}
