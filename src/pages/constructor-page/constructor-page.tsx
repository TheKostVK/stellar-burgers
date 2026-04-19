import { useDispatch, useSelector } from '../../services/store';

import styles from './constructor-page.module.css';

import { BurgerConstructor, BurgerIngredients } from '@components';
import { Preloader } from '@ui';
import { FC, useEffect } from 'react';
import {
  getIngredientsStatus,
  ingredientsInit
} from '../../services/slices/constructorSlice';

export const ConstructorPage: FC = () => {
  const isLoading = useSelector(getIngredientsStatus);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(ingredientsInit());
  }, [dispatch]);

  return (
    <main className={styles.containerMain}>
      <h1
        className={`${styles.title} text text_type_main-large mt-10 mb-5 pl-5`}
      >
        Соберите бургер
      </h1>
      <div className={`${styles.main} pl-5 pr-5`}>
        {isLoading ? (
          <Preloader />
        ) : (
          <>
            <BurgerIngredients />
            <BurgerConstructor />
          </>
        )}
      </div>
    </main>
  );
};
