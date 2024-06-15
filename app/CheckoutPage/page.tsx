"use client";
import React, { useState } from "react";
import { useSelector } from "react-redux";
import Head from "next/head";
import OrderSummary from "./OrderSummary";
import BillingDetailsForm from "./BillingDetailsForm";
import { Transition } from "@headlessui/react";

import { selectCartItems } from "@/redux/slices/basketSlice";

const CheckoutPage: React.FC = () => {
  const cartItems = useSelector(selectCartItems);
  const [loading, setLoading] = useState(false);
  const [showBillingForm, setShowBillingForm] = useState(false);

  const totalPrice = cartItems.reduce(
    (acc, item) => acc + item.price * (item.quantity ?? 1),
    0,
  );

  const handlePlaceOrder = () => {
    setShowBillingForm(true);
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
        <div>
          {!showBillingForm && (
            <div className="flex flex-col justify-center items-center">
              <button
                onClick={handlePlaceOrder}
                className="bg-blue-500 text-white px-6 py-2 rounded hover:bg-blue-600 transition-colors duration-300"
                aria-label="Place Order"
              >
                Place Order
              </button>
            </div>
          )}
          {showBillingForm && (
            <BillingDetailsForm
              totalPrice={totalPrice}
              setLoading={setLoading}
            />
          )}
        </div>
      </div>
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
