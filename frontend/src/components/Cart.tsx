import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FiTrash2, FiPlus, FiMinus, FiArrowLeft, FiCheckCircle } from 'react-icons/fi';

interface CartItem {
  id: number;
  name: string;
  price: number;
  image: string;
  quantity: number;
  farmer: {
    id: number;
    name: string;
  };
  weight?: string;
}

const Cart = () => {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [couponCode, setCouponCode] = useState('');
  const [appliedCoupon, setAppliedCoupon] = useState<string | null>(null);
  const [discount, setDiscount] = useState(0);
  const [checkingOut, setCheckingOut] = useState(false);
  const [orderPlaced, setOrderPlaced] = useState(false);
  
  useEffect(() => {
    // Simulate fetching cart data
    setLoading(true);
    setTimeout(() => {
      const mockCartItems: CartItem[] = [
        {
          id: 1,
          name: "Organic Desi Ghee",
          price: 950,
          image: "https://images.unsplash.com/photo-1589352611772-52a496a2bf54?w=400&auto=format&fit=crop",
          quantity: 1,
          farmer: {
            id: 1,
            name: "Ramesh Patel"
          },
          weight: "500g"
        },
        {
          id: 2,
          name: "Organic Turmeric Powder",
          price: 250,
          image: "https://images.unsplash.com/photo-1615485500834-bc10199bc727?w=400&auto=format&fit=crop",
          quantity: 2,
          farmer: {
            id: 1,
            name: "Ramesh Patel"
          },
          weight: "200g"
        },
        {
          id: 3,
          name: "Brown Rice",
          price: 120,
          image: "https://images.unsplash.com/photo-1586201375761-83865001e31c?w=400&auto=format&fit=crop",
          quantity: 1,
          farmer: {
            id: 2,
            name: "Sunita Sharma"
          },
          weight: "1kg"
        }
      ];
      setCartItems(mockCartItems);
      setLoading(false);
    }, 800);
  }, []);

  const updateQuantity = (id: number, change: number) => {
    setCartItems(prevItems => 
      prevItems.map(item => 
        item.id === id 
          ? { ...item, quantity: Math.max(1, item.quantity + change) } 
          : item
      )
    );
  };

  const removeItem = (id: number) => {
    setCartItems(prevItems => prevItems.filter(item => item.id !== id));
  };

  const applyCoupon = () => {
    if (couponCode.toLowerCase() === 'fresh20') {
      setAppliedCoupon(couponCode);
      setDiscount(0.2); // 20% discount
    } else if (couponCode.toLowerCase() === 'first10') {
      setAppliedCoupon(couponCode);
      setDiscount(0.1); // 10% discount
    } else {
      alert('Invalid coupon code');
    }
  };

  const removeCoupon = () => {
    setAppliedCoupon(null);
    setDiscount(0);
    setCouponCode('');
  };

  const handleCheckout = () => {
    setCheckingOut(true);
    // Simulate checkout process
    setTimeout(() => {
      window.location.href = "/checkout";
    }, 1000);
  };

  // Calculate totals
  const subtotal = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const discountAmount = subtotal * discount;
  const deliveryFee = subtotal > 2000 ? 0 : 100;
  const total = subtotal - discountAmount + deliveryFee;

  // Group items by farmer
  const itemsByFarmer = cartItems.reduce((grouped, item) => {
    const key = item.farmer.id;
    if (!grouped[key]) {
      grouped[key] = {
        farmer: item.farmer,
        items: []
      };
    }
    grouped[key].items.push(item);
    return grouped;
  }, {} as Record<number, { farmer: { id: number; name: string }, items: CartItem[] }>);

  if (loading) {
    return (
      <div className="container-custom py-16 flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (orderPlaced) {
    return (
      <div className="container-custom py-16 flex flex-col items-center justify-center min-h-[400px]">
        <div className="text-success text-6xl mb-6">
          <FiCheckCircle />
        </div>
        <h2 className="text-2xl font-bold text-text mb-4">Order Placed Successfully!</h2>
        <p className="text-text-light mb-8 text-center max-w-md">
          Thank you for your order. Your fresh, organic products will be on their way to you soon!
        </p>
        <div className="flex space-x-4">
          <Link to="/products" className="btn-primary">
            Continue Shopping
          </Link>
          <Link to="/profile" className="btn-outline">
            View My Orders
          </Link>
        </div>
      </div>
    );
  }

  if (cartItems.length === 0) {
    return (
      <div className="container-custom py-16 flex flex-col items-center justify-center min-h-[400px]">
        <svg className="w-24 h-24 text-text-light mb-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
        </svg>
        <h2 className="text-2xl font-bold text-text mb-4">Your Cart is Empty</h2>
        <p className="text-text-light mb-8 text-center max-w-md">
          Looks like you haven't added any products to your cart yet. Browse our fresh selection of organic products!
        </p>
        <Link to="/products" className="btn-primary">
          Shop Now
        </Link>
      </div>
    );
  }

  return (
    <div className="bg-background py-8">
      <div className="container-custom">
        <div className="flex items-center mb-6">
          <Link to="/products" className="flex items-center text-primary hover:text-primary-dark transition-colors">
            <FiArrowLeft className="mr-2" />
            <span>Continue Shopping</span>
          </Link>
          <h1 className="text-2xl md:text-3xl font-bold text-text ml-auto">Your Cart</h1>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2">
            <div className="card shadow-medium p-6 mb-6 divide-y divide-border">
              {Object.values(itemsByFarmer).map(({ farmer, items }) => (
                <div key={farmer.id} className="py-4 first:pt-0 last:pb-0">
                  <div className="flex items-center mb-4">
                    <Link to={`/farmers/${farmer.id}`} className="text-lg font-medium text-primary hover:underline">
                      {farmer.name}'s Products
                    </Link>
                  </div>
                  
                  <div className="space-y-4">
                    {items.map(item => (
                      <div key={item.id} className="flex items-center">
                        <div className="h-20 w-20 flex-shrink-0 overflow-hidden rounded-md border border-border">
                          <img
                            src={item.image}
                            alt={item.name}
                            className="h-full w-full object-cover object-center"
                          />
                        </div>

                        <div className="ml-4 flex-1">
                          <div className="flex justify-between">
                            <div>
                              <h3 className="text-base font-medium text-text">
                                <Link to={`/products/${item.id}`} className="hover:text-primary">
                                  {item.name}
                                </Link>
                              </h3>
                              {item.weight && (
                                <p className="mt-1 text-sm text-text-light">{item.weight}</p>
                              )}
                            </div>
                            <p className="text-primary font-medium">₹{item.price}</p>
                          </div>

                          <div className="flex items-center justify-between mt-2">
                            <div className="flex items-center border border-border rounded-md">
                              <button
                                onClick={() => updateQuantity(item.id, -1)}
                                className="px-3 py-1 text-text-light hover:text-primary transition-colors"
                                aria-label="Decrease quantity"
                              >
                                <FiMinus size={16} />
                              </button>
                              <span className="px-3 py-1 text-text">{item.quantity}</span>
                              <button
                                onClick={() => updateQuantity(item.id, 1)}
                                className="px-3 py-1 text-text-light hover:text-primary transition-colors"
                                aria-label="Increase quantity"
                              >
                                <FiPlus size={16} />
                              </button>
                            </div>
                            <button
                              onClick={() => removeItem(item.id)}
                              className="text-text-light hover:text-error transition-colors"
                              aria-label="Remove item"
                            >
                              <FiTrash2 size={18} />
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="card shadow-medium p-6 mb-6 sticky top-24">
              <h2 className="text-xl font-bold text-text mb-4">Order Summary</h2>
              
              <div className="space-y-3 mb-6">
                <div className="flex justify-between">
                  <span className="text-text-light">Subtotal</span>
                  <span className="text-text">₹{subtotal.toFixed(2)}</span>
                </div>
                
                {appliedCoupon && (
                  <div className="flex justify-between text-success">
                    <span>Discount ({(discount * 100).toFixed(0)}%)</span>
                    <span>-₹{discountAmount.toFixed(2)}</span>
                  </div>
                )}
                
                <div className="flex justify-between">
                  <span className="text-text-light">Delivery Fee</span>
                  <span className="text-text">
                    {deliveryFee === 0 ? 'Free' : `₹${deliveryFee.toFixed(2)}`}
                  </span>
                </div>
                
                <div className="border-t border-border pt-3 flex justify-between font-bold">
                  <span className="text-text">Total</span>
                  <span className="text-primary text-lg">₹{total.toFixed(2)}</span>
                </div>
              </div>
              
              {/* Coupon Code */}
              {!appliedCoupon ? (
                <div className="mb-6">
                  <label htmlFor="coupon" className="block text-sm font-medium text-text-light mb-2">
                    Have a coupon?
                  </label>
                  <div className="flex">
                    <input
                      type="text"
                      id="coupon"
                      value={couponCode}
                      onChange={(e) => setCouponCode(e.target.value)}
                      placeholder="Enter coupon code"
                      className="form-input rounded-r-none"
                    />
                    <button
                      onClick={applyCoupon}
                      className="btn-primary rounded-l-none"
                      disabled={!couponCode}
                    >
                      Apply
                    </button>
                  </div>
                  <p className="text-xs text-text-light mt-1">Try: FRESH20, FIRST10</p>
                </div>
              ) : (
                <div className="flex justify-between items-center bg-success/10 p-3 rounded-md mb-6">
                  <div>
                    <span className="text-success font-medium">{appliedCoupon}</span>
                    <p className="text-xs text-text-light">
                      {(discount * 100).toFixed(0)}% discount applied
                    </p>
                  </div>
                  <button
                    onClick={removeCoupon}
                    className="text-text-light hover:text-error transition-colors"
                  >
                    <FiTrash2 size={16} />
                  </button>
                </div>
              )}
              
              {/* Checkout Button */}
              <button
                onClick={handleCheckout}
                className={`btn-primary w-full flex justify-center items-center ${checkingOut ? 'opacity-75 cursor-not-allowed' : ''}`}
                disabled={checkingOut}
              >
                {checkingOut ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-white mr-2"></div>
                    Processing...
                  </>
                ) : (
                  'Proceed to Checkout'
                )}
              </button>
              
              <div className="mt-4 text-center text-sm text-text-light">
                <p>Free delivery on orders above ₹2000</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart; 