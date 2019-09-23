import Loadable from 'react-loadable';

export default Loadable({
  loader: () => import('./CheckShipVersionPage'),
  loading: () => false
});
