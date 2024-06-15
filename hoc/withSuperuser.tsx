import { ComponentType } from "react";
import withAuth, { WithAuthProps } from "./withAuth";

const withSuperuser = <P extends WithAuthProps>(
  WrappedComponent: ComponentType<P>,
) => {
  const WithSuperuserComponent = (
    props: Omit<P, keyof WithAuthProps> & { user: WithAuthProps["user"] },
  ) => {
    const { user } = props;

    if (!user.is_superuser) {
      return <div>Access Denied</div>;
    }

    return <WrappedComponent {...(props as P)} />;
  };

  return withAuth(WithSuperuserComponent);
};

export default withSuperuser;
