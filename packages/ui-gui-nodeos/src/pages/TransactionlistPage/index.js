import Loadable from 'react-loadable';

export default Loadable({
  loader: () => import('./TransactionlistPage'),
  loading: () => false
});
