import Loadable from 'react-loadable';

export default Loadable({
  loader: () => import('./ActiondetailPage'),
  loading: () => false
});
