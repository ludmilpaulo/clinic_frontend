import { ComponentType } from 'react';
import withAuth, { WithAuthProps } from './withAuth';

const withStaff = <P extends WithAuthProps>(WrappedComponent: ComponentType<P>) => {
  const WithStaffComponent = (props: Omit<P, keyof WithAuthProps> & { user: WithAuthProps['user'] }) => {
    const { user } = props;

    if (!user.is_staff) {
      return <div>Access Denied</div>;
    }

    return <WrappedComponent {...(props as P)} />;
  };

  return withAuth(WithStaffComponent);
};

export default withStaff;
