"use client";
import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { FaTrashAlt } from 'react-icons/fa';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { Transition } from '@headlessui/react';
import { selectCartItems, updateBasket, decreaseBasket, removeFromBasket, clearCart } from '@/redux/slices/basketSlice';
import { Drug } from '@/utils/types';

const CartPage: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const cartItems = useSelector(selectCartItems);
  const dispatch = useDispatch();
  const router = useRouter();

  useEffect(() => {
    // Simulate loading delay
    setTimeout(() => {
      setLoading(false);
    }, 1000);
  }, []);

  const handleIncrease = (item: Drug) => {
    if (item.quantity && item.quantity < item.quantity_available) {
      dispatch(updateBasket({ ...item, quantity: item.quantity + 1 }));
    }
  };

  const handleDecrease = (id: number) => {
    dispatch(decreaseBasket(id));
  };

  const handleRemove = (id: number) => {
    dispatch(removeFromBasket(id));
  };

  const handleClearCart = () => {
    dispatch(clearCart());
  };

  const handleCheckout = () => {
    router.push('/CheckoutPage'); // Redirect to the checkout page
  };

  const totalPrice = cartItems.reduce((acc, item) => acc + item.price * (item.quantity || 1), 0);

  return (
    <div className="container mx-auto p-6">
      <Transition
        show={loading}
        enter="transition-opacity duration-300"
        enterFrom="opacity-0"
        enterTo="opacity-100"
        leave="transition-opacity duration-300"
        leaveFrom="opacity-100"
        leaveTo="opacity-0"
      >
        <div className="fixed top-0 left-0 z-50 flex items-center justify-center w-full h-full bg-black bg-opacity-50">
          <div className="w-16 h-16 border-t-4 border-b-4 border-blue-500 rounded-full animate-spin"></div>
        </div>
      </Transition>

      {!loading && (
        <>
          <h1 className="text-3xl font-bold mb-6 text-center">Shopping Cart</h1>
          {cartItems.length === 0 ? (
            <div className="text-center text-gray-600">
              <p>Your cart is empty.</p>
              <p>Continue shopping to add items to your cart.</p>
            </div>
          ) : (
            <>
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-semibold">Cart Items</h2>
                <button 
                  onClick={handleClearCart} 
                  className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 transition-colors duration-300"
                >
                  Clear Cart
                </button>
              </div>
              <div className="bg-white shadow-lg rounded-lg p-6">
                {cartItems.map((item) => (
                  <div key={item.id} className="flex justify-between items-center border-b pb-4 mb-4">
                    <div className="flex items-center space-x-4">
                      <div className="relative w-20 h-20">
                        <Image 
                          src={item.image_urls[0]} 
                          alt={item.name} 
                          layout="fill"
                          objectFit="cover"
                          className="rounded"
                        />
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold">{item.name}</h3>
                        <p className="text-gray-600">R{item.price}</p>
                        <div className="flex items-center space-x-2 mt-2">
                          <button 
                            onClick={() => handleDecrease(item.id)} 
                            className="bg-gray-200 px-3 py-1 rounded hover:bg-gray-300 transition-colors duration-300"
                          >
                            -
                          </button>
                          <span className="font-semibold text-lg">{item.quantity}</span>
                          <button 
                            onClick={() => handleIncrease(item)} 
                            className="bg-gray-200 px-3 py-1 rounded hover:bg-gray-300 transition-colors duration-300"
                          >
                            +
                          </button>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-4">
                      <p className="text-lg font-semibold">R{(item.price * (item.quantity || 1)).toFixed(2)}</p>
                      <button 
                        onClick={() => handleRemove(item.id)} 
                        className="text-red-500 hover:text-red-700 transition-colors duration-300"
                      >
                        <FaTrashAlt />
                      </button>
                    </div>
                  </div>
                ))}
                <div className="flex justify-between items-center mt-6">
                  <h3 className="text-xl font-semibold">Total</h3>
                  <p className="text-2xl font-bold">R{totalPrice.toFixed(2)}</p>
                </div>
                <div className="flex justify-end mt-6">
                  <button 
                    onClick={handleCheckout} 
                    className="bg-green-500 text-white px-6 py-2 rounded hover:bg-green-600 transition-colors duration-300"
                  >
                    Checkout
                  </button>
                </div>
              </div>
            </>
          )}
        </>
      )}
    </div>
  );
};

export default CartPage;
