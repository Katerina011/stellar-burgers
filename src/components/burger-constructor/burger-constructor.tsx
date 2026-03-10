import { FC, useMemo } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { TConstructorIngredient } from '@utils-types';
import { BurgerConstructorUI } from '@ui';
import { useDispatch, useSelector } from 'src/services/store';
import {
  clearConstructor,
  selectBun,
  selectIngredients
} from 'src/services/slices/burgerConstructorSlice';
import {
  isAuthenticatedSelector,
  userDataSelector
} from 'src/services/slices/userSlice';
import {
  clearOrderModal,
  createOrder,
  selectOrderLoading,
  selectOrderModal
} from 'src/services/slices/ordersSlice';

export const BurgerConstructor: FC = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  const bun = useSelector(selectBun);
  const ingredients = useSelector(selectIngredients);
  const orderRequest = useSelector(selectOrderLoading);
  const orderModalData = useSelector(selectOrderModal);
  const user = useSelector(userDataSelector);
  const isAuthenticated = useSelector(isAuthenticatedSelector);
  const onOrderClick = () => {
    if (!user || !isAuthenticated) {
      return navigate('/login', { state: { from: location.pathname } });
    }

    if (!bun || orderRequest) return;

    const ingredientIds = [
      bun._id,
      ...ingredients.map((ing) => ing._id),
      bun._id
    ];

    dispatch(createOrder(ingredientIds));
  };

  const closeOrderModal = () => {
    dispatch(clearOrderModal());
    dispatch(clearConstructor());
    navigate('/');
  };

  const price = useMemo(() => {
    const bunPrice = bun ? bun.price * 2 : 0;
    const ingredientsPrice = ingredients.reduce(
      (sum: number, item: TConstructorIngredient) => sum + item.price,
      0
    );
    return bunPrice + ingredientsPrice;
  }, [bun, ingredients]);

  return (
    <BurgerConstructorUI
      price={price}
      orderRequest={orderRequest}
      constructorItems={{ bun, ingredients }}
      orderModalData={orderModalData}
      onOrderClick={onOrderClick}
      closeOrderModal={closeOrderModal}
    />
  );
};
