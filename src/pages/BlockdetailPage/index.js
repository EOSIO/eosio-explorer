import Loadable from 'react-loadable';

export default Loadable({
  loader: () => import('./BlockdetailPage'),
  loading: () => false
});
