import Loadable from 'react-loadable';

export default Loadable({
  loader: () => import('./AccountdetailPage'),
  loading: () => false
});
