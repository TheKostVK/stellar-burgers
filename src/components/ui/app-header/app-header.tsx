import React, { FC } from 'react';
import styles from './app-header.module.css';
import { TAppHeaderUIProps } from './type';
import {
  BurgerIcon,
  ListIcon,
  Logo,
  ProfileIcon
} from '@zlden/react-developer-burger-ui-components';
import { Link, NavLink } from 'react-router-dom';
import { clsx } from 'clsx';
import { AppRoute } from '@constants/routes';
import { useSelector } from '../../../services/store';
import { getUser } from '../../../services/slices/userSlice';

export const AppHeaderUI: FC<TAppHeaderUIProps> = () => {
  const user = useSelector(getUser);
  const userName = user?.name || undefined;

  return (
    <header className={styles.header}>
      <nav className={`${styles.menu} p-4`}>
        <div className={styles.menu_part_left}>
          <NavLink
            to={AppRoute.HOME}
            end
            className={({ isActive }) =>
              clsx(styles.link, isActive ? styles.link_active : null)
            }
          >
            {({ isActive }) => (
              <>
                <BurgerIcon type={isActive ? 'primary' : 'secondary'} />
                <p className='text text_type_main-default ml-2 mr-10'>
                  Конструктор
                </p>
              </>
            )}
          </NavLink>
          <NavLink
            to={AppRoute.FEED}
            className={({ isActive }) =>
              clsx(styles.link, isActive ? styles.link_active : null)
            }
          >
            {({ isActive }) => (
              <>
                <ListIcon type={isActive ? 'primary' : 'secondary'} />
                <p className='text text_type_main-default ml-2'>
                  Лента заказов
                </p>
              </>
            )}
          </NavLink>
        </div>
        <Link to={AppRoute.HOME} className={styles.logo}>
          <Logo className='' />
        </Link>
        <NavLink
          to={AppRoute.PROFILE}
          className={({ isActive }) =>
            clsx(
              styles.link_position_last,
              styles.link,
              isActive ? styles.link_active : null
            )
          }
        >
          {({ isActive }) => (
            <>
              <ProfileIcon type={isActive ? 'primary' : 'secondary'} />
              <p className='text text_type_main-default ml-2'>
                {userName || 'Личный кабинет'}
              </p>
            </>
          )}
        </NavLink>
      </nav>
    </header>
  );
};
