import React from "react";
import { useSelector, useDispatch } from "react-redux";
import { FaTruck, FaCreditCard, FaLock } from "react-icons/fa";
import {
  selectCartItems,
  decreaseBasket,
  updateBasket,
  removeFromBasket,
} from "@/redux/slices/basketSlice";

interface OrderSummaryProps {
  totalPrice: number;
}

const OrderSummary: React.FC<OrderSummaryProps> = ({ totalPrice }) => {
  const cartItems = useSelector(selectCartItems);
  const dispatch = useDispatch();

  return (
    <div className="bg-white shadow-lg rounded-lg p-6">
      <h2 className="text-xl font-semibold mb-4">Order Summary</h2>
      {cartItems.length === 0 ? (
        <p>Your cart is empty.</p>
      ) : (
        <div>
          {cartItems.map((item) => (
            <div
              key={item.id}
              className="flex justify-between items-center mb-4"
            >
              <div>
                <h3 className="text-lg font-semibold">{item.name}</h3>
                <p className="text-gray-600">
                  R{item.quantity ?? 1} x {item.price}{" "}
                </p>
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
              <p className="text-lg font-semibold">
                R{(item.price * (item.quantity ?? 1)).toFixed(2)}
              </p>
            </div>
          ))}
          <div className="border-t pt-4 mt-4">
            <div className="flex justify-between items-center mb-2">
              <p className="text-lg font-semibold">Total</p>
              <p className="text-2xl font-bold">R{totalPrice.toFixed(2)} </p>
            </div>
            <div className="flex justify-between items-center text-gray-600 text-sm">
              <p className="flex items-center">
                <FaTruck className="mr-2" /> Shipping
              </p>
              <p>Free</p>
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
  );
};

export default OrderSummary;
