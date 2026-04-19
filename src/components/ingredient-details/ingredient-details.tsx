import { FC } from 'react';
import { Preloader, IngredientDetailsUI } from '@ui';
import { useParams } from 'react-router-dom';
import { useDispatch, useSelector } from '../../services/store';
import {
  getIngredientById,
  getIngredientsStatus,
  ingredientsInit
} from '../../services/slices/constructorSlice';
import { useEffect } from 'react';

export const IngredientDetails: FC = () => {
  const { number } = useParams();

  const dispatch = useDispatch();

  const isLoading = useSelector(getIngredientsStatus);
  const ingredientData = useSelector((state) =>
    getIngredientById(state, number || '')
  );

  useEffect(() => {
    if (!ingredientData && !isLoading) {
      dispatch(ingredientsInit());
    }
  }, [dispatch, ingredientData, isLoading]);

  if (isLoading) {
    return <Preloader />;
  }

  if (!ingredientData) {
    return <p className='text text_type_main-default'>Ингредиент не найден</p>;
  }

  return <IngredientDetailsUI ingredientData={ingredientData} />;
};
