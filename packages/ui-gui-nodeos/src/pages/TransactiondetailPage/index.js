import Loadable from 'react-loadable';

export default Loadable({
  loader: () => import('./TransactiondetailPage'),
  loading: () => false
});
