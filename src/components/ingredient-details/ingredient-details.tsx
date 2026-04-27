import { FC } from 'react';
import { Preloader, IngredientDetailsUI } from '@ui';
import { useParams } from 'react-router-dom';
import { useSelector } from '../../services/store';
import {
  getIngredientById,
  getIngredientsStatus
} from '../../services/slices/constructorSlice';

export const IngredientDetails: FC = () => {
  const { id } = useParams();

  const isLoading = useSelector(getIngredientsStatus);
  const ingredientData = useSelector((state) =>
    getIngredientById(state, id || '')
  );

  if (isLoading) {
    return <Preloader />;
  }

  if (!ingredientData) {
    return <p className='text text_type_main-default'>Ингредиент не найден</p>;
  }

  return <IngredientDetailsUI ingredientData={ingredientData} />;
};
