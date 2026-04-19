export enum AppRoute {
  HOME = '/',
  FEED = '/feed',
  LOGIN = '/login',
  REGISTER = '/register',
  FORGOT_PASSWORD = '/forgot-password',
  RESET_PASSWORD = '/reset-password',
  PROFILE = '/profile',
  PROFILE_ORDERS = '/profile/orders',
  INGREDIENTS = '/ingredients',
  NOT_FOUND = '*'
}

export enum AppRoutePattern {
  FEED_ORDER = '/feed/:number',
  INGREDIENT_DETAILS = '/ingredients/:id',
  PROFILE_ORDER = '/profile/orders/:number'
}

export enum AppRouteSegment {
  FEED = 'feed',
  LOGIN = 'login',
  REGISTER = 'register',
  FORGOT_PASSWORD = 'forgot-password',
  RESET_PASSWORD = 'reset-password',
  PROFILE = 'profile',
  PROFILE_ORDERS = 'orders'
}
