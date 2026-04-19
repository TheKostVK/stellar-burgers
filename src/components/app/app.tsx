import '../../index.css';
import { Route, Routes, useLocation, useNavigate } from 'react-router-dom';
import {
  ConstructorPage,
  Feed,
  ForgotPassword,
  Login,
  NotFound404,
  Profile,
  ProfileOrders,
  Register,
  ResetPassword
} from '@pages';
import PageLayout from '../../pages/page-layout/page-layout';
import ProtectRoute from '../protect-route/protect-route';
import { Modal } from '../modal';
import { OrderInfo } from '../order-info';
import { IngredientDetails } from '../ingredient-details';
import { AppRoute, AppRoutePattern, AppRouteSegment } from '@constants/routes';
import { useEffect } from 'react';
import { useDispatch } from '../../services/store';
import { forceLogout, initUser } from '../../services/slices/userSlice';
import { AUTH_LOGOUT_EVENT } from '@api';

const App = () => {
  const dispatch = useDispatch();
  const location = useLocation();
  const navigate = useNavigate();
  const background = location.state?.background;

  const handleCloseModal = () =>
    background ? navigate(-1) : navigate(AppRoute.HOME, { replace: true });

  useEffect(() => {
    dispatch(initUser());
  }, [dispatch]);

  useEffect(() => {
    const handleAuthLogout = () => {
      dispatch(forceLogout());
    };

    window.addEventListener(AUTH_LOGOUT_EVENT, handleAuthLogout);

    return () => {
      window.removeEventListener(AUTH_LOGOUT_EVENT, handleAuthLogout);
    };
  }, [dispatch]);

  return (
    <>
      <Routes location={background || location}>
        <Route path={AppRoute.HOME} element={<PageLayout />}>
          <Route index element={<ConstructorPage />} />
          <Route path={AppRouteSegment.FEED} element={<Feed />} />
          <Route
            path={AppRouteSegment.LOGIN}
            element={<ProtectRoute onlyUnAuth children={<Login />} />}
          />
          <Route
            path={AppRouteSegment.REGISTER}
            element={<ProtectRoute onlyUnAuth children={<Register />} />}
          />
          <Route
            path={AppRouteSegment.FORGOT_PASSWORD}
            element={<ProtectRoute onlyUnAuth children={<ForgotPassword />} />}
          />
          <Route
            path={AppRouteSegment.RESET_PASSWORD}
            element={<ProtectRoute onlyUnAuth children={<ResetPassword />} />}
          />
          <Route path={AppRouteSegment.PROFILE}>
            <Route index element={<ProtectRoute children={<Profile />} />} />
            <Route
              path={AppRouteSegment.PROFILE_ORDERS}
              element={<ProtectRoute children={<ProfileOrders />} />}
            />
          </Route>
          <Route path={AppRoutePattern.FEED_ORDER} element={<OrderInfo />} />
          <Route
            path={AppRoutePattern.INGREDIENT_DETAILS}
            element={<IngredientDetails />}
          />
          <Route
            path={AppRoutePattern.PROFILE_ORDER}
            element={<ProtectRoute children={<OrderInfo />} />}
          />
        </Route>
        <Route path={AppRoute.NOT_FOUND} element={<NotFound404 />} />
      </Routes>
      {background && (
        <Routes>
          <Route
            path={AppRoutePattern.FEED_ORDER}
            element={
              <Modal
                title={''}
                onClose={handleCloseModal}
                children={<OrderInfo />}
              />
            }
          />
          <Route
            path={AppRoutePattern.INGREDIENT_DETAILS}
            element={
              <Modal
                title={''}
                onClose={handleCloseModal}
                children={<IngredientDetails />}
              />
            }
          />
          <Route
            path={AppRoutePattern.PROFILE_ORDER}
            element={
              <ProtectRoute
                children={
                  <Modal
                    title={''}
                    onClose={handleCloseModal}
                    children={<OrderInfo />}
                  />
                }
              />
            }
          />
        </Routes>
      )}
    </>
  );
};

export default App;
