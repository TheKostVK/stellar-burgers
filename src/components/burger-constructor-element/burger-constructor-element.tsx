import { FC, memo } from 'react';
import { BurgerConstructorElementUI } from '@ui';
import { BurgerConstructorElementProps } from './type';
import { useDispatch } from '../../services/store';
import {
  moveIngredientInConstructorItems,
  removeIngredientFromConstructorItems
} from '../../services/slices/constructorSlice';

export const BurgerConstructorElement: FC<BurgerConstructorElementProps> = memo(
  ({ ingredient, index, totalItems }) => {
    const dispatch = useDispatch();

    const handleMoveDown = () => {
      if (index >= totalItems - 1) return;

      dispatch(
        moveIngredientInConstructorItems({
          fromIndex: index,
          toIndex: index + 1
        })
      );
    };

    const handleMoveUp = () => {
      if (index <= 0) return;

      dispatch(
        moveIngredientInConstructorItems({
          fromIndex: index,
          toIndex: index - 1
        })
      );
    };

    const handleClose = () => {
      dispatch(removeIngredientFromConstructorItems(ingredient));
    };

    return (
      <BurgerConstructorElementUI
        ingredient={ingredient}
        index={index}
        totalItems={totalItems}
        handleMoveUp={handleMoveUp}
        handleMoveDown={handleMoveDown}
        handleClose={handleClose}
      />
    );
  }
);
