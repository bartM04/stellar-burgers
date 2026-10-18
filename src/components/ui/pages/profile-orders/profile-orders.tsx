import { ProfileMenu, OrdersList } from '@components';
import { Preloader } from '@ui';

import type { ProfileOrdersUIProps } from './type';

import styles from './profile-orders.module.css';

export const ProfileOrdersUI = ({
  orders,
  isLoading,
  onOrderClick,
}: ProfileOrdersUIProps): React.JSX.Element => {
  if (isLoading) {
    return <Preloader />;
  }

  return (
    <main className={`${styles.main}`}>
      <div className={`mt-30 mr-15 ${styles.menu}`}>
        <ProfileMenu />
      </div>
      <div className={`mt-10 ${styles.orders}`}>
        <OrdersList orders={orders} onOrderClick={onOrderClick} />
      </div>
    </main>
  );
};
