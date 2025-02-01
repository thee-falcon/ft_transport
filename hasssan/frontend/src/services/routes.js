
const routes = [
    {
      path: '/home',
      view: async () => {
      await import("../pages/home.js");
      return "<home-page></home-page>";
      }
     },
    {
      path: '/about',
      view: async () => {
      await import("../pages/about.js");
      return "<about-page></about-page>";
      }
     },
    {
      path: '/login',
      view: async () => {
      await import('../pages/login.js');
      return '<login-page></login-page>';
    },
     }
  ]
export default routes;
