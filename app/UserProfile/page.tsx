"use client";
import { useEffect, useState } from "react";
import axios from "axios";
import { useSelector, useDispatch } from "react-redux";
import { useRouter } from "next/navigation";
import dynamic from "next/dynamic";
import { baseAPI } from "@/utils/variables";
import { RootState } from "@/redux/store";
import { selectUser, logoutUser } from "@/redux/slices/authSlice";
import { clearCart } from "@/redux/slices/basketSlice";
import withAuth from "@/components/PrivateRoute";
import Sidebar from "./Sidebar";
import Loading from "./Loading";

interface UserProfile {
  id: number;
  username: string;
  email: string;
  first_name: string;
  last_name: string;
  address: string;
  city: string;
  postal_code: string;
  country: string;
  orders: any[];
}

const ProfilePage = () => {
  const auth = useSelector((state: RootState) => selectUser(state));
  const dispatch = useDispatch();
  const router = useRouter();
  const token = auth?.token;
  const userId = auth?.user_id;
  const [user, setUser] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [activeComponent, setActiveComponent] = useState<string>("ProfileInformation");

  const ProfileInformation = dynamic(() => import("./ProfileInformation"), {
    loading: () => <Loading loading={true} />,
  });
  const OrderHistory = dynamic(() => import("./OrderHistory"), {
    loading: () => <Loading loading={true} />,
  });

  useEffect(() => {
    if (token && userId) {
      axios
        .get(`${baseAPI}/account/account/profile/${userId}/`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        .then((response) => {
          const userData = response.data;
          axios
            .get(`${baseAPI}/account/orders/user/${userId}/`, {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            })
            .then((orderResponse) => {
              setUser({ ...userData, orders: orderResponse.data });
              setLoading(false);
            })
            .catch((error) => {
              console.error("Failed to fetch user orders:", error);
              setError("Failed to fetch user orders.");
              setLoading(false);
            });
        })
        .catch((error) => {
          if (error.response && error.response.status === 404) {
            console.error("User not found:", error);
            dispatch(logoutUser());
            dispatch(clearCart());
            router.push("/Login");
          } else {
            console.error("Failed to fetch user data:", error);
            setError("Failed to fetch user data.");
            setLoading(false);
          }
        });
    }
  }, [token, userId, dispatch, router]);

  const handleUpdateProfile = (updatedUser: UserProfile) => {
    if (updatedUser && token) {
      axios
        .put(`${baseAPI}/account/account/update/${userId}/`, updatedUser, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        .then((response) => {
          setUser(response.data);
        })
        .catch((error) => console.error("Failed to update user data:", error));
    }
  };

  if (loading) {
    return <Loading loading={loading} />;
  }

  if (error) {
    return <div>{error}</div>;
  }

  if (!user) {
    return <div>No user data available</div>;
  }

  return (
    <div className="container mx-auto p-6">
      <Sidebar setActiveComponent={setActiveComponent} />
      <div className="ml-64">
        {activeComponent === "ProfileInformation" && (
          <ProfileInformation user={user} handleUpdateProfile={handleUpdateProfile} />
        )}
        {activeComponent === "OrderHistory" && <OrderHistory orders={user.orders} />}
      </div>
    </div>
  );
};

export default withAuth(ProfilePage);
