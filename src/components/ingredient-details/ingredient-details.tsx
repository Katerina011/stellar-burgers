import { FC, useMemo } from 'react';
import { Preloader } from '../ui/preloader';
import { IngredientDetailsUI } from '../ui/ingredient-details';
import { useParams } from 'react-router-dom';
import { useSelector } from 'src/services/store';
import { selectIng } from 'src/services/slices/ingredientsSlice';

export const IngredientDetails: FC = () => {
  const { id } = useParams<{ id: string }>();
  const ingredients = useSelector(selectIng);
  const ingredientData = ingredients.find((ing) => ing._id === id);
  // const ingredientData = useMemo(() => {
  //   if (!ingredients.length || !id) return null;
  //   return ingredients.find((ing) => ing._id === id);
  // }, [ingredients, id]);

  if (!ingredientData) {
    return <Preloader />;
  }

  return <IngredientDetailsUI ingredientData={ingredientData} />;
};
