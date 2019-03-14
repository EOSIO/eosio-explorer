import Loadable from 'react-loadable';

export default Loadable({
  loader: () => import('./BlocklistPage'),
  loading: () => false
});
