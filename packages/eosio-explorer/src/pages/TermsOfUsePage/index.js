import Loadable from 'react-loadable';

export default Loadable({
  loader: () => import('./TermsOfUsePage'),
  loading: () => false
});
