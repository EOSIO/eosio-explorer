import Loadable from 'react-loadable';

export default Loadable({
  loader: () => import('./LandingPage'),
  loading: () => false
});
