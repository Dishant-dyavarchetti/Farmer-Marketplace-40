import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FiArrowLeft, FiCheckCircle } from 'react-icons/fi';

interface CheckoutFormData {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  pincode: string;
  paymentMethod: 'cod' | 'online';
}

interface OrderSummaryItem {
  id: number;
  name: string;
  price: number;
  quantity: number;
  weight?: string;
}

const Checkout = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState<'address' | 'payment' | 'confirmation'>('address');
  const [processing, setProcessing] = useState(false);

  const [formData, setFormData] = useState<CheckoutFormData>({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    state: '',
    pincode: '',
    paymentMethod: 'cod'
  });

  // Mock order summary data
  const [orderSummary] = useState({
    items: [
      {
        id: 1,
        name: "Organic Desi Ghee",
        price: 950,
        quantity: 1,
        weight: "500g"
      },
      {
        id: 2,
        name: "Organic Turmeric Powder",
        price: 250,
        quantity: 2,
        weight: "200g"
      },
      {
        id: 3,
        name: "Brown Rice",
        price: 120,
        quantity: 1,
        weight: "1kg"
      }
    ] as OrderSummaryItem[],
    subtotal: 1570,
    discount: 157,
    deliveryFee: 0,
    total: 1413
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleRadioChange = (value: 'cod' | 'online') => {
    setFormData(prev => ({ ...prev, paymentMethod: value }));
  };

  const handleAddressSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setStep('payment');
  };

  const handlePaymentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setProcessing(true);
    
    // Simulate processing payment
    setTimeout(() => {
      setProcessing(false);
      setStep('confirmation');
    }, 2000);
  };

  return (
    <div className="bg-background py-8">
      <div className="container-custom">
        <div className="mb-8">
          <Link to="/cart" className="flex items-center text-primary hover:text-primary-dark transition-colors">
            <FiArrowLeft className="mr-2" />
            <span>Back to Cart</span>
          </Link>
        </div>

        {/* Checkout steps */}
        <div className="mb-8">
          <div className="flex justify-between">
            <div className={`flex-1 text-center ${step === 'address' ? 'text-primary' : 'text-text'}`}>
              <div className={`h-10 w-10 rounded-full flex items-center justify-center mx-auto mb-2 ${step === 'address' ? 'bg-primary text-white' : 'bg-background border-2 border-text-light'}`}>
                1
              </div>
              <p className="text-sm font-medium">Shipping Address</p>
            </div>
            <div className={`flex-1 text-center ${step === 'payment' ? 'text-primary' : 'text-text'}`}>
              <div className={`h-10 w-10 rounded-full flex items-center justify-center mx-auto mb-2 ${step === 'payment' ? 'bg-primary text-white' : 'bg-background border-2 border-text-light'}`}>
                2
              </div>
              <p className="text-sm font-medium">Payment</p>
            </div>
            <div className={`flex-1 text-center ${step === 'confirmation' ? 'text-primary' : 'text-text'}`}>
              <div className={`h-10 w-10 rounded-full flex items-center justify-center mx-auto mb-2 ${step === 'confirmation' ? 'bg-primary text-white' : 'bg-background border-2 border-text-light'}`}>
                3
              </div>
              <p className="text-sm font-medium">Confirmation</p>
            </div>
          </div>
          <div className="mt-2 relative">
            <div className="absolute top-0 left-0 right-0 h-1 bg-border">
              <div 
                className="h-full bg-primary transition-all duration-300"
                style={{ 
                  width: step === 'address' ? '16.67%' : 
                         step === 'payment' ? '50%' : '100%' 
                }}
              ></div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main checkout form */}
          <div className="lg:col-span-2">
            {/* Step 1: Address */}
            {step === 'address' && (
              <div className="card shadow-medium p-6">
                <h2 className="text-xl font-bold text-text mb-6">Shipping Address</h2>
                
                <form onSubmit={handleAddressSubmit}>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    <div>
                      <label htmlFor="firstName" className="block text-sm font-medium text-text-light mb-2">
                        First Name*
                      </label>
                      <input
                        type="text"
                        id="firstName"
                        name="firstName"
                        value={formData.firstName}
                        onChange={handleInputChange}
                        required
                        className="form-input"
                        placeholder="Enter your first name"
                      />
                    </div>
                    
                    <div>
                      <label htmlFor="lastName" className="block text-sm font-medium text-text-light mb-2">
                        Last Name*
                      </label>
                      <input
                        type="text"
                        id="lastName"
                        name="lastName"
                        value={formData.lastName}
                        onChange={handleInputChange}
                        required
                        className="form-input"
                        placeholder="Enter your last name"
                      />
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    <div>
                      <label htmlFor="email" className="block text-sm font-medium text-text-light mb-2">
                        Email Address*
                      </label>
                      <input
                        type="email"
                        id="email"
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        required
                        className="form-input"
                        placeholder="Enter your email"
                      />
                    </div>
                    
                    <div>
                      <label htmlFor="phone" className="block text-sm font-medium text-text-light mb-2">
                        Phone Number*
                      </label>
                      <input
                        type="tel"
                        id="phone"
                        name="phone"
                        value={formData.phone}
                        onChange={handleInputChange}
                        required
                        className="form-input"
                        placeholder="Enter your phone number"
                      />
                    </div>
                  </div>
                  
                  <div className="mb-4">
                    <label htmlFor="address" className="block text-sm font-medium text-text-light mb-2">
                      Address*
                    </label>
                    <textarea
                      id="address"
                      name="address"
                      value={formData.address}
                      onChange={handleInputChange}
                      required
                      rows={3}
                      className="form-input"
                      placeholder="Enter your full address"
                    ></textarea>
                  </div>
                  
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-6">
                    <div>
                      <label htmlFor="city" className="block text-sm font-medium text-text-light mb-2">
                        City*
                      </label>
                      <input
                        type="text"
                        id="city"
                        name="city"
                        value={formData.city}
                        onChange={handleInputChange}
                        required
                        className="form-input"
                        placeholder="City"
                      />
                    </div>
                    
                    <div>
                      <label htmlFor="state" className="block text-sm font-medium text-text-light mb-2">
                        State*
                      </label>
                      <select
                        id="state"
                        name="state"
                        value={formData.state}
                        onChange={handleInputChange}
                        required
                        className="form-input"
                      >
                        <option value="">Select State</option>
                        <option value="Andhra Pradesh">Andhra Pradesh</option>
                        <option value="Gujarat">Gujarat</option>
                        <option value="Karnataka">Karnataka</option>
                        <option value="Kerala">Kerala</option>
                        <option value="Maharashtra">Maharashtra</option>
                        <option value="Punjab">Punjab</option>
                        <option value="Tamil Nadu">Tamil Nadu</option>
                        <option value="Uttar Pradesh">Uttar Pradesh</option>
                        {/* Add more states as needed */}
                      </select>
                    </div>
                    
                    <div>
                      <label htmlFor="pincode" className="block text-sm font-medium text-text-light mb-2">
                        Pincode*
                      </label>
                      <input
                        type="text"
                        id="pincode"
                        name="pincode"
                        value={formData.pincode}
                        onChange={handleInputChange}
                        required
                        className="form-input"
                        placeholder="Pincode"
                      />
                    </div>
                  </div>
                  
                  <div className="flex justify-end">
                    <button type="submit" className="btn-primary">
                      Continue to Payment
                    </button>
                  </div>
                </form>
              </div>
            )}
            
            {/* Step 2: Payment */}
            {step === 'payment' && (
              <div className="card shadow-medium p-6">
                <h2 className="text-xl font-bold text-text mb-6">Payment Method</h2>
                
                <form onSubmit={handlePaymentSubmit}>
                  <div className="space-y-4 mb-6">
                    <div 
                      className={`border rounded-md p-4 cursor-pointer ${formData.paymentMethod === 'cod' ? 'border-primary bg-primary/5' : 'border-border'}`}
                      onClick={() => handleRadioChange('cod')}
                    >
                      <div className="flex items-center">
                        <input
                          type="radio"
                          id="cod"
                          name="paymentMethod"
                          checked={formData.paymentMethod === 'cod'}
                          onChange={() => handleRadioChange('cod')}
                          className="h-4 w-4 text-primary border-gray-300"
                        />
                        <label htmlFor="cod" className="ml-3 block text-text font-medium">
                          Cash on Delivery
                        </label>
                      </div>
                      <p className="mt-1 ml-7 text-sm text-text-light">
                        Pay when your order is delivered to your doorstep.
                      </p>
                    </div>
                    
                    <div 
                      className={`border rounded-md p-4 cursor-pointer ${formData.paymentMethod === 'online' ? 'border-primary bg-primary/5' : 'border-border'}`}
                      onClick={() => handleRadioChange('online')}
                    >
                      <div className="flex items-center">
                        <input
                          type="radio"
                          id="online"
                          name="paymentMethod"
                          checked={formData.paymentMethod === 'online'}
                          onChange={() => handleRadioChange('online')}
                          className="h-4 w-4 text-primary border-gray-300"
                        />
                        <label htmlFor="online" className="ml-3 block text-text font-medium">
                          Online Payment
                        </label>
                      </div>
                      <p className="mt-1 ml-7 text-sm text-text-light">
                        Pay now using credit/debit card, UPI, or net banking.
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex justify-between">
                    <button 
                      type="button" 
                      onClick={() => setStep('address')}
                      className="btn-outline"
                    >
                      Back
                    </button>
                    <button 
                      type="submit" 
                      className="btn-primary"
                      disabled={processing}
                    >
                      {processing ? (
                        <>
                          <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-white mr-2"></div>
                          Processing...
                        </>
                      ) : (
                        `Place Order - ₹${orderSummary.total.toFixed(2)}`
                      )}
                    </button>
                  </div>
                </form>
              </div>
            )}
            
            {/* Step 3: Confirmation */}
            {step === 'confirmation' && (
              <div className="card shadow-medium p-6 text-center">
                <div className="text-success text-6xl mb-6 flex justify-center">
                  <FiCheckCircle />
                </div>
                
                <h2 className="text-2xl font-bold text-text mb-4">Order Placed Successfully!</h2>
                
                <p className="text-text-light mb-6">
                  Thank you for your order. Your fresh, organic products will be on their way to you soon!
                </p>
                
                <div className="bg-background-light p-4 rounded-md mb-6">
                  <h3 className="font-medium text-text mb-2">Order #FRH78391</h3>
                  <p className="text-text-light text-sm">A confirmation email has been sent to {formData.email}</p>
                </div>
                
                <div className="mb-6">
                  <h3 className="font-medium text-text mb-2">Delivery Details</h3>
                  <p className="text-text-light">
                    {formData.firstName} {formData.lastName}<br />
                    {formData.address}<br />
                    {formData.city}, {formData.state} - {formData.pincode}<br />
                    {formData.phone}
                  </p>
                </div>
                
                <div className="mb-6">
                  <h3 className="font-medium text-text mb-2">Payment Method</h3>
                  <p className="text-text-light">
                    {formData.paymentMethod === 'cod' ? 'Cash on Delivery' : 'Online Payment'}
                  </p>
                </div>
                
                <div className="flex space-x-4 justify-center">
                  <Link to="/" className="btn-primary">
                    Back to Home
                  </Link>
                  <Link to="/profile" className="btn-outline">
                    View My Orders
                  </Link>
                </div>
              </div>
            )}
          </div>
          
          {/* Order Summary sidebar */}
          <div className="lg:col-span-1">
            <div className="card shadow-medium p-6 sticky top-24">
              <h2 className="text-xl font-bold text-text mb-4">Order Summary</h2>
              
              <div className="mb-4">
                <div className="max-h-64 overflow-y-auto mb-4 space-y-3">
                  {orderSummary.items.map(item => (
                    <div key={item.id} className="flex items-start">
                      <div className="text-text-light w-8 text-center mr-1">
                        {item.quantity}x
                      </div>
                      <div className="flex-1">
                        <h4 className="text-text font-medium">{item.name}</h4>
                        <p className="text-text-light text-sm">{item.weight}</p>
                      </div>
                      <div className="text-right text-text-light">
                        ₹{(item.price * item.quantity).toFixed(2)}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              
              <div className="space-y-3 border-t border-border pt-4 mb-4">
                <div className="flex justify-between">
                  <span className="text-text-light">Subtotal</span>
                  <span className="text-text">₹{orderSummary.subtotal.toFixed(2)}</span>
                </div>
                
                <div className="flex justify-between text-success">
                  <span>Discount (10%)</span>
                  <span>-₹{orderSummary.discount.toFixed(2)}</span>
                </div>
                
                <div className="flex justify-between">
                  <span className="text-text-light">Delivery Fee</span>
                  <span className="text-text">
                    {orderSummary.deliveryFee === 0 ? 'Free' : `₹${orderSummary.deliveryFee.toFixed(2)}`}
                  </span>
                </div>
                
                <div className="border-t border-border pt-3 flex justify-between font-bold">
                  <span className="text-text">Total</span>
                  <span className="text-primary text-lg">₹{orderSummary.total.toFixed(2)}</span>
                </div>
              </div>
              
              <div className="text-center text-sm text-text-light">
                <p>Free delivery on orders above ₹2000</p>
                <p className="mt-1">All prices are inclusive of taxes</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout; 