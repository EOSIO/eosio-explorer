import Loadable from 'react-loadable';

export default Loadable({
  loader: () => import('./SomePage'),
  loading: () => false
});
