import Loadable from 'react-loadable';

export default Loadable({
  loader: () => import('./ActionlistPage'),
  loading: () => false
});
