import { useEffect, useState, ComponentType } from "react";
import { useRouter } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import { getCurrentUser } from "@/services/authService";
import { Transition } from "@headlessui/react";
import { logoutUser } from "@/redux/slices/authSlice";

interface User {
  id: number;
  username: string;
  email: string;
  is_superuser: boolean;
  is_staff: boolean;
  is_active: boolean;
}

export interface WithAuthProps {
  user: User;
}

const withAuth = <P extends WithAuthProps>(
  WrappedComponent: ComponentType<P>,
) => {
  const WithAuthComponent = (props: Omit<P, keyof WithAuthProps>) => {
    const [loading, setLoading] = useState(true);
    const [user, setUser] = useState<User | null>(null);
    const router = useRouter();
    const dispatch = useDispatch();

    const auth_user = useSelector((state: RootState) => state.auth.user);

    useEffect(() => {
      const token = auth_user?.token;
      if (!token) {
        router.push("/Login");
        return;
      }

      getCurrentUser(token)
        .then((data) => {
          setUser(data);
          setLoading(false);
        })
        .catch(() => {
          dispatch(logoutUser()); // Ensure the action creator is called
          router.push("/Login");
        });
    }, [auth_user, router, dispatch]);

    if (loading) {
      return (
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
      );
    }

    if (!user) {
      return null;
    }

    return <WrappedComponent {...(props as P)} user={user} />;
  };

  return WithAuthComponent;
};

export default withAuth;
