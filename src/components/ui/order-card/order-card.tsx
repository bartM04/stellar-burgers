import { OrderStatus } from '@components';
import {
  CurrencyIcon,
  FormattedDate,
} from '@krgaa/react-developer-burger-ui-components';
import { memo } from 'react';
import { Link, useLocation } from 'react-router-dom';

import type { OrderCardUIProps } from './type';

import styles from './order-card.module.css';

export const OrderCardUI = memo(function OrderCardUI({
  orderInfo,
  maxIngredients,
  locationState,
  isNew,
  onClick,
}: OrderCardUIProps): React.JSX.Element {
  const location = useLocation();

  return (
    <Link
      to={orderInfo.number.toString()}
      state={locationState}
      className={`p-6 mb-4 mr-2 ${styles.order}`}
      onClick={onClick}
      style={
        isNew
          ? {
              boxShadow: '0 0 30px rgba(73, 78, 230, 1)',
              border: '2px solid #494ee6',
              transition: 'all 0.3s ease',
            }
          : {}
      }
    >
      <div className={styles.order_info}>
        <span className="text text_type_digits-default">
          #{String(orderInfo.number).padStart(6, '0')}
        </span>
        <span className="text text_type_main-default text_color_inactive">
          <FormattedDate date={orderInfo.date} />
        </span>
      </div>
      <h4 className={`pt-6 text text_type_main-medium ${styles.order_name}`}>
        {orderInfo.name}
      </h4>
      {location.pathname === '/profile/orders' && (
        <OrderStatus status={orderInfo.status} />
      )}
      <div className={`pt-6 ${styles.order_content}`}>
        <ul className={styles.ingredients}>
          {orderInfo.ingredientsToShow.map((ingredient, index) => {
            const zIndex = maxIngredients - index;
            const right = 20 * index;
            return (
              <li
                className={styles.img_wrap}
                style={{ zIndex: zIndex, right: right }}
                key={`${ingredient._id}-${index}`}
              >
                <img
                  style={{
                    opacity:
                      orderInfo.remains && maxIngredients === index + 1 ? '0.5' : '1',
                  }}
                  className={styles.img}
                  src={ingredient.image_mobile}
                  alt={ingredient.name}
                />
                {maxIngredients === index + 1 ? (
                  <span className={`text text_type_digits-default ${styles.remains}`}>
                    {orderInfo.remains > 0 ? `+${orderInfo.remains}` : null}
                  </span>
                ) : null}
              </li>
            );
          })}
        </ul>
        <div>
          <span className={`text text_type_digits-default pr-1 ${styles.order_total}`}>
            {orderInfo.total}
          </span>
          <CurrencyIcon type="primary" />
        </div>
      </div>
    </Link>
  );
});
