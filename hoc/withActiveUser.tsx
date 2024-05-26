import { ComponentType } from 'react';
import withAuth, { WithAuthProps } from './withAuth';

const withActiveUser = <P extends WithAuthProps>(WrappedComponent: ComponentType<P>) => {
  const WithActiveUserComponent = (props: Omit<P, keyof WithAuthProps> & { user: WithAuthProps['user'] }) => {
    const { user } = props;

    if (!user.is_active) {
      return <div>Access Denied</div>;
    }

    return <WrappedComponent {...(props as P)} />;
  };

  return withAuth(WithActiveUserComponent);
};

export default withActiveUser;
