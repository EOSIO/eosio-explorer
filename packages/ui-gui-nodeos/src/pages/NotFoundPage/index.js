import Loadable from 'react-loadable';

export default Loadable({
  loader: () => import('./NotFoundPage'),
  loading: () => false
});
