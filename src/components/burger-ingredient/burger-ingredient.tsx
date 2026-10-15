import { BurgerIngredientUI } from '@ui';
import { memo } from 'react';
import { useLocation } from 'react-router-dom';
import { useDispatch, useSelector } from '../../services/store';
import { addBun, addIngredient } from '../../services/slices/constructorSlice';

import type { TBurgerIngredientProps } from './type';

export const BurgerIngredient = memo(function BurgerIngredient({
  ingredient,
}: TBurgerIngredientProps): React.JSX.Element {
  const location = useLocation();
  const dispatch = useDispatch();
  
  const constructorItems = useSelector((state) => state.burgerConstructor);

  const handleAdd = (): void => {
    if (ingredient.type === 'bun') {
      dispatch(addBun(ingredient));
    } else {
      dispatch(addIngredient(ingredient));
    }
  };

  let ingredientCount = 0;
  if (ingredient.type === 'bun') {
    if (constructorItems.bun && constructorItems.bun._id === ingredient._id) {
      ingredientCount = 1;
    }
  } else {
    ingredientCount = constructorItems.ingredients.filter(
      (item) => item._id === ingredient._id
    ).length;
  }

  return (
    <BurgerIngredientUI
      ingredient={ingredient}
      count={ingredientCount > 0 ? ingredientCount : undefined}
      locationState={{ background: location }}
      handleAdd={handleAdd}
    />
  );
});