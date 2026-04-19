import '../../index.css';
import styles from './page-layout.module.css';

import { AppHeader } from '@components';
import { Outlet } from 'react-router-dom';

const PageLayout = () => (
  <div className={styles.page}>
    <AppHeader />
    <Outlet />
  </div>
);

export default PageLayout;
