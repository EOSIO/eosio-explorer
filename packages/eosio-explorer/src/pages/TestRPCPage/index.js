import Loadable from 'react-loadable';

export default Loadable({
  loader: () => import('./TestRPCPage'),
  loading: () => false
});
