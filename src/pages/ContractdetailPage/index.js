import Loadable from 'react-loadable';

export default Loadable({
  loader: () => import('./ContractdetailPage'),
  loading: () => false
});
