"use client";
import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useRouter } from 'next/navigation';
import { FaCreditCard, FaTruck, FaLock, FaMoneyBillAlt, FaBan } from 'react-icons/fa';
import { selectCartItems, clearCart, updateBasket, decreaseBasket, removeFromBasket } from '@/redux/slices/basketSlice'; // Ensure correct import path
import { selectUser } from '@/redux/slices/authSlice';
import { baseAPI } from '@/utils/variables';
import { RootState } from '@reduxjs/toolkit/query';

const CheckoutPage: React.FC = () => {
  const user = useSelector(selectUser);
  const token = user?.token;

  const cartItems = useSelector(selectCartItems);
  const dispatch = useDispatch();
  const router = useRouter();
  const [form, setForm] = useState({
    name: '',
    email: '',
    address: '',
    city: '',
    postalCode: '',
    country: '',
    cardNumber: '',
    cardExpiry: '',
    cardCVC: '',
  });
  const [paymentMethod, setPaymentMethod] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm({
      ...form,
      [name]: value,
    });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
  
    const orderData = {
      token: token || null, // Pass the token if available
      user_id: user?.user_id,
      name: form.name,
      email: form.email,
      total_price: totalPrice,
      address: form.address,
      city: form.city,
      postal_code: form.postalCode,
      country: form.country,
      payment_method: paymentMethod,
      items: cartItems.map(item => ({
        id: item.id,
        quantity: item.quantity
      }))
    };
  
    try {
      const response = await fetch(`${baseAPI}/order/checkout/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(orderData)
      });
  
      if (response.ok) {
        dispatch(clearCart());
        router.push('/thank-you');
      } else {
        const errorData = await response.json();
        console.error('Error:', errorData);
        alert(`Error: ${errorData.detail}`); // Show error to user
      }
    } catch (error) {
      console.error('Error:', error);
      alert('An error occurred. Please try again.'); // Show error to user
    }
  
    setLoading(false);
  };

  const totalPrice = cartItems.reduce((acc, item) => acc + item.price * (item.quantity ?? 1), 0);

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">Checkout</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white shadow-lg rounded-lg p-6">
          <h2 className="text-xl font-semibold mb-4">Payment Method</h2>
          <div className="flex mb-4">
            <div className="flex items-center mr-4">
              <input
                type="radio"
                id="card"
                name="paymentMethod"
                value="card"
                checked={paymentMethod === 'card'}
                onChange={() => setPaymentMethod('card')}
                className="mr-2"
              />
              <label htmlFor="card" className="flex items-center">
                <FaCreditCard className="mr-2" /> Credit Card
              </label>
            </div>
            <div className="flex items-center mr-4">
              <input
                type="radio"
                id="delivery"
                name="paymentMethod"
                value="delivery"
                checked={paymentMethod === 'delivery'}
                onChange={() => setPaymentMethod('delivery')}
                className="mr-2"
              />
              <label htmlFor="delivery" className="flex items-center">
                <FaMoneyBillAlt className="mr-2" /> On Delivery
              </label>
            </div>
            <div className="flex items-center">
              <input
                type="radio"
                id="eft"
                name="paymentMethod"
                value="eft"
                checked={paymentMethod === 'eft'}
                onChange={() => setPaymentMethod('eft')}
                className="mr-2"
              />
              <label htmlFor="eft" className="flex items-center">
                <FaBan className="mr-2" /> EFT
              </label>
            </div>
          </div>

          {paymentMethod && (
            <>
              <h2 className="text-xl font-semibold mb-4">Billing Details</h2>
              <form onSubmit={handleSubmit}>
                <div className="mb-4">
                  <label className="block text-gray-700">Name</label>
                  <input 
                    type="text" 
                    name="name" 
                    value={form.name} 
                    onChange={handleChange} 
                    className="w-full border rounded px-3 py-2 mt-1"
                    required
                  />
                </div>
                <div className="mb-4">
                  <label className="block text-gray-700">Email</label>
                  <input 
                    type="email" 
                    name="email" 
                    value={form.email} 
                    onChange={handleChange} 
                    className="w-full border rounded px-3 py-2 mt-1"
                    required
                  />
                </div>
                <div className="mb-4">
                  <label className="block text-gray-700">Address</label>
                  <input 
                    type="text" 
                    name="address" 
                    value={form.address} 
                    onChange={handleChange} 
                    className="w-full border rounded px-3 py-2 mt-1"
                    required
                  />
                </div>
                <div className="mb-4">
                  <label className="block text-gray-700">City</label>
                  <input 
                    type="text" 
                    name="city" 
                    value={form.city} 
                    onChange={handleChange} 
                    className="w-full border rounded px-3 py-2 mt-1"
                    required
                  />
                </div>
                <div className="mb-4">
                  <label className="block text-gray-700">Postal Code</label>
                  <input 
                    type="text" 
                    name="postalCode" 
                    value={form.postalCode} 
                    onChange={handleChange} 
                    className="w-full border rounded px-3 py-2 mt-1"
                    required
                  />
                </div>
                <div className="mb-4">
                  <label className="block text-gray-700">Country</label>
                  <input 
                    type="text" 
                    name="country" 
                    value={form.country} 
                    onChange={handleChange} 
                    className="w-full border rounded px-3 py-2 mt-1"
                    required
                  />
                </div>
                {paymentMethod === 'card' && (
                  <>
                    <h2 className="text-xl font-semibold mb-4">Payment Details</h2>
                    <div className="mb-4">
                      <label className="block text-gray-700">Card Number</label>
                      <input 
                        type="text" 
                        name="cardNumber" 
                        value={form.cardNumber} 
                        onChange={handleChange} 
                        className="w-full border rounded px-3 py-2 mt-1"
                        required
                      />
                    </div>
                    <div className="flex space-x-4">
                      <div className="mb-4 flex-1">
                        <label className="block text-gray-700">Expiry Date</label>
                        <input 
                          type="text" 
                          name="cardExpiry" 
                          value={form.cardExpiry} 
                          onChange={handleChange} 
                          className="w-full border rounded px-3 py-2 mt-1"
                          required
                        />
                      </div>
                      <div className="mb-4 flex-1">
                        <label className="block text-gray-700">CVC</label>
                        <input 
                          type="text" 
                          name="cardCVC" 
                          value={form.cardCVC} 
                          onChange={handleChange} 
                          className="w-full border rounded px-3 py-2 mt-1"
                          required
                        />
                      </div>
                    </div>
                  </>
                )}
                {paymentMethod === 'delivery' && (
                  <div className="bg-yellow-100 text-yellow-800 p-4 rounded mb-4">
                    Please make sure to have the exact change ready for the delivery person.
                  </div>
                )}
                {paymentMethod === 'eft' && (
                  <div className="bg-green-100 text-green-800 p-4 rounded mb-4">
                    <p>Please transfer the total amount to the following bank account:</p>
                    <p>Bank: Example Bank</p>
                    <p>Account Number: 123456789</p>
                    <p>Routing Number: 987654321</p>
                  </div>
                )}
                <button 
                  type="submit" 
                  className="bg-blue-500 text-white px-4 py-2 rounded w-full hover:bg-blue-600 transition-colors duration-300"
                  disabled={loading}
                >
                  {loading ? 'Placing Order...' : 'Place Order'}
                </button>
              </form>
            </>
          )}
        </div>
        <div className="bg-white shadow-lg rounded-lg p-6">
          <h2 className="text-xl font-semibold mb-4">Order Summary</h2>
          {cartItems.length === 0 ? (
            <p>Your cart is empty.</p>
          ) : (
            <div>
              {cartItems.map((item) => (
                <div key={item.id} className="flex justify-between items-center mb-4">
                  <div>
                    <h3 className="text-lg font-semibold">{item.name}</h3>
                    <p className="text-gray-600">{(item.quantity ?? 1)} x {item.price} Kz</p>
                    <div className="flex items-center space-x-2 mt-2">
                      <button 
                        onClick={() => dispatch(decreaseBasket(item.id))} 
                        className="bg-gray-200 px-3 py-1 rounded hover:bg-gray-300 transition-colors duration-300"
                      >
                        -
                      </button>
                      <span>{item.quantity}</span>
                      <button 
                        onClick={() => dispatch(updateBasket(item))} 
                        className="bg-gray-200 px-3 py-1 rounded hover:bg-gray-300 transition-colors duration-300"
                      >
                        +
                      </button>
                      <button 
                        onClick={() => dispatch(removeFromBasket(item.id))} 
                        className="text-red-500 hover:text-red-700 transition-colors duration-300 ml-2"
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                  <p className="text-lg font-semibold">{(item.price * (item.quantity ?? 1)).toFixed(2)} Kz</p>
                </div>
              ))}
              <div className="border-t pt-4 mt-4">
                <div className="flex justify-between items-center mb-2">
                  <p className="text-lg font-semibold">Total</p>
                  <p className="text-2xl font-bold">{totalPrice.toFixed(2)} Kz</p>
                </div>
                <div className="flex justify-between items-center text-gray-600 text-sm">
                  <p className="flex items-center">
                    <FaTruck className="mr-2" /> Shipping
                  </p>
                  <p>Free</p>
                </div>
                <div className="flex justify-between items-center text-gray-600 text-sm">
                  <p className="flex items-center">
                    <FaCreditCard className="mr-2" /> Payment Method
                  </p>
                  <p>{paymentMethod === 'card' ? 'Credit Card' : paymentMethod === 'delivery' ? 'On Delivery' : 'EFT'}</p>
                </div>
                <div className="flex justify-between items-center text-gray-600 text-sm">
                  <p className="flex items-center">
                    <FaLock className="mr-2" /> Secure Checkout
                  </p>
                  <p>SSL Encrypted</p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CheckoutPage;
