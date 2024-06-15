"use client";
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useSelector, useDispatch } from 'react-redux';
import Head from 'next/head';
import CryptoJS from 'crypto-js';
import axios from 'axios';
import OrderSummary from './OrderSummary';
import BillingDetailsForm from './BillingDetailsForm';
import { Transition } from '@headlessui/react';

import { selectCartItems, clearCart } from '@/redux/slices/basketSlice';
import { selectUser } from '@/redux/slices/authSlice';
import { baseAPI } from '@/utils/variables';

interface FormState {
  name: string;
  email: string;
  address: string;
  city: string;
  postalCode: string;
  country: string;
}

const CheckoutPage: React.FC = () => {
  const user = useSelector(selectUser);
  const token = user?.token;
  const router = useRouter();
  const cartItems = useSelector(selectCartItems);
  const [loading, setLoading] = useState(false);
  const [showBillingForm, setShowBillingForm] = useState(false);
  const [formData, setFormData] = useState<FormState | null>(null);
  const [paymentMethod, setPaymentMethod] = useState('payfast');
  const dispatch = useDispatch();

  const [form, setForm] = useState<FormState>({
    name: '',
    email: '',
    address: '',
    city: '',
    postalCode: '',
    country: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm({
      ...form,
      [name]: value,
    });
  };

  const handleSubmit = async (status: string) => {
    setLoading(true);
  
    const orderData = {
      token: token || null,
      user_id: user?.user_id,
      name: form.name,
      email: form.email,
      total_price: totalPrice,
      address: form.address,
      city: form.city,
      postal_code: form.postalCode,
      country: form.country,
      payment_method: paymentMethod,
      status,
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
        if (status === 'completed') {
          router.push('/thank-you');
        }
      } else {
        const errorData = await response.json();
        console.error('Error:', errorData);
        alert(`Error: ${errorData.detail}`);
      }
    } catch (error) {
      console.error('Error:', error);
      alert('An error occurred. Please try again.');
    }
  
    setLoading(false);
  };

  useEffect(() => {
    const script = document.createElement('script');
    script.src = "https://sandbox.payfast.co.za/onsite/engine.js";
    script.async = true;
    document.body.appendChild(script);
    return () => {
      document.body.removeChild(script);
    };
  }, []);

  const totalPrice = cartItems.reduce((acc, item) => acc + item.price * (item.quantity ?? 1), 0);

  const generateSignature = (data: Record<string, string>, passphrase: string): string => {
    const queryString = Object.keys(data)
      .map(key => `${key}=${encodeURIComponent(data[key]).replace(/%20/g, "+")}`)
      .join('&');
    const signatureString = `${queryString}&passphrase=${encodeURIComponent(passphrase).replace(/%20/g, "+")}`;
    return CryptoJS.MD5(signatureString).toString();
  };

  const dataToString = (dataArray: Record<string, string>): string => {
    return Object.keys(dataArray)
      .map(key => `${key}=${encodeURIComponent(dataArray[key].trim()).replace(/%20/g, "+")}`)
      .join('&');
  };

  const generatePaymentIdentifier = async (pfParamString: string) => {
    try {
      const response = await axios.post('https://sandbox.payfast.co.za/onsite/process', pfParamString, {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
      });
      return response.data.uuid;
    } catch (error: any) {
      console.error('PayFast payment identifier generation error:', error.response ? error.response.data : error.message);
      alert(`An error occurred during payment identifier generation: ${error.response ? error.response.data : error.message}`);
      return null;
    }
  };

  const handlePayFast = async (amount: number, formData: FormState) => {
    const myData: Record<string, string> = {
      merchant_id: process.env.NEXT_PUBLIC_MERCHANT_ID!,
      merchant_key: process.env.NEXT_PUBLIC_MERCHANT_KEY!,
      return_url: process.env.NEXT_PUBLIC_RETURN_URL!,
      cancel_url: process.env.NEXT_PUBLIC_RETURN_URL!,
      notify_url: `${process.env.NEXT_PUBLIC_BASE_API}/order/notify/`,
      name_first: formData.name.split(' ')[0],
      name_last: formData.name.split(' ')[1] || '',
      email_address: formData.email,
      m_payment_id: `${new Date().getTime()}`,
      amount: amount.toFixed(2),
      item_name: `Order #${new Date().getTime()}`,
    };

    const passPhrase = process.env.NEXT_PUBLIC_PASSPHRASE!;
    myData.signature = generateSignature(myData, passPhrase);

    const pfParamString = dataToString(myData);
    const paymentUUID = await generatePaymentIdentifier(pfParamString);

    if (paymentUUID) {
      // Handle the submission before triggering the payment
      await handleSubmit('pending');

      // Add event listeners for payment completion and cancellation
      window.addEventListener('message', (event) => {
        if (event.data && event.data.status) {
          if (event.data.status === 'completed') {
            handleSubmit('completed');
          } else if (event.data.status === 'cancelled') {
            handleSubmit('canceled');
          }
        }
      });

      // Trigger the PayFast modal popup
      window.payfast_do_onsite_payment({
        uuid: paymentUUID,
        return_url: process.env.NEXT_PUBLIC_RETURN_URL!,
        cancel_url: process.env.NEXT_PUBLIC_CANCEL_URL!,
      });
    }
  };

  const handlePlaceOrder = () => {
    setShowBillingForm(true);
  };

  const handleBillingFormSubmit = (form: FormState) => {
    setFormData(form);
  };

  const handleMakePayment = () => {
    if (formData) {
      setLoading(true);
      handlePayFast(totalPrice, formData).finally(() => {
        setLoading(false);
      });
    }
  };

  return (
    <div className="container mx-auto p-6">
      <Head>
        <title>Checkout</title>
        <script src="https://sandbox.payfast.co.za/onsite/engine.js" async />
      </Head>
      <h1 className="text-3xl font-bold mb-6 text-center">Checkout</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <OrderSummary totalPrice={totalPrice} />
        {!showBillingForm && (
          <div className="flex flex-col justify-center items-center">
            <button
              onClick={handlePlaceOrder}
              className="bg-blue-500 text-white px-6 py-2 rounded hover:bg-blue-600 transition-colors duration-300"
            >
              Place Order
            </button>
          </div>
        )}
        {showBillingForm && (
          <BillingDetailsForm onSubmit={handleBillingFormSubmit} loading={loading} />
        )}
      </div>
      {showBillingForm && (
        <div className="flex justify-end mt-6">
          <button
            onClick={handleMakePayment}
            className="bg-green-500 text-white px-6 py-2 rounded hover:bg-green-600 transition-colors duration-300"
          >
            Make Payment
          </button>
        </div>
      )}
      <div id="payfast-form-container" className="mt-6"></div>
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
          <div className="w-16 h-16 border-t-4 border-b-4 border-white rounded-full animate-spin"></div>
        </div>
      </Transition>
    </div>
  );
};

export default CheckoutPage;
