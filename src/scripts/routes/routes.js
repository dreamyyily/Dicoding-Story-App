import HomePage from '../pages/home/home-page.js';
import AuthPage from '../pages/auth/auth-page.js';
import StoryFormPage from '../pages/story-form/story-form-page.js';
import ProfilePage from '../pages/profile/profile-page.js';
import FavoritesPage from '../pages/favorites/favorites-page.js'; 

const routes = {
  '/': () => new HomePage(),
  '/login': () => new AuthPage(false),
  '/register': () => new AuthPage(true),
  '/add': () => new StoryFormPage(),
  '/profile': () => new ProfilePage(),
  '/favorites': () => new FavoritesPage(), 
};

export default routes;
