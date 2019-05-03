import Loadable from 'react-loadable';

export default Loadable({
  loader: () => import('./PushactionPage'),
  loading: () => false
});
