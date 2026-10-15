import {
  selectIngredients,
  selectIngredientsError,
  selectIngredientsLoading,
} from '@/services/ingredientsSlice';
import { useSelector } from '@/services/store';
import { BurgerIngredients, BurgerConstructor } from '@components';
import { Preloader } from '@ui';

import styles from './constructor-page.module.css';

export const ConstructorPage = (): React.JSX.Element => {
  const ingredients = useSelector(selectIngredients);
  const isLoading = useSelector(selectIngredientsLoading);
  const error = useSelector(selectIngredientsError);

  if (isLoading) {
    return <Preloader />;
  }

  if (error) {
    return (
      <p className="text text_type_main-medium mt-10">
        Не удалось загрузить ингредиенты: {error}
      </p>
    );
  }

  if (!ingredients.length) {
    return <p className="text text_type_main-medium mt-10">Нет ингредиентов</p>;
  }

  return (
    <main className={styles.containerMain}>
      <h1 className={`${styles.title} text text_type_main-large mt-10 mb-5 pl-5`}>
        Соберите бургер
      </h1>
      <div className={`${styles.main} pl-5 pr-5`}>
        <BurgerIngredients />
        <BurgerConstructor />
      </div>
    </main>
  );
};
