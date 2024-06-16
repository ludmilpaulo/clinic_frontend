// components/OrderHistory.tsx
import { Order } from "@/utils/types";

const OrderHistory = ({ orders }: { orders: Order[] }) => (
  <div className="bg-white p-6 rounded-lg shadow-md">
    <h2 className="text-2xl font-semibold mb-4">Order History</h2>
    <table className="min-w-full border-collapse">
      <thead>
        <tr>
          <th className="p-2 text-left border-b">Order ID</th>
          <th className="p-2 text-left border-b">Date</th>
          <th className="p-2 text-left border-b">Status</th>
          <th className="p-2 text-left border-b">Invoice</th>
        </tr>
      </thead>
      <tbody>
        {orders && orders.length > 0 ? (
          orders.map((order) => (
            <tr key={order.id}>
              <td className="p-2 border-b">{order.id}</td>
              <td className="p-2 border-b">
                {new Date(order.created_at).toLocaleDateString()}
              </td>
              <td className="p-2 border-b">{order.status}</td>
              <td className="p-2 border-b">
                {order.invoice ? (
                  <span
                    className="text-blue-500 cursor-pointer"
                    onClick={() => (window.location.href = order.invoice)}
                  >
                    Download
                  </span>
                ) : (
                  <span className="text-gray-500">No Invoice</span>
                )}
              </td>
            </tr>
          ))
        ) : (
          <tr>
            <td colSpan={4} className="p-2 text-center text-gray-500">
              No orders found.
            </td>
          </tr>
        )}
      </tbody>
    </table>
  </div>
);

export default OrderHistory;
