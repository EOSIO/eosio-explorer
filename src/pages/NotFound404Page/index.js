import Loadable from 'react-loadable';

export default Loadable({
  loader: () => import('./NotFound404Page'),
  loading: () => false
});
