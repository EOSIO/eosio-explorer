
import Loadable from 'react-loadable';

export default Loadable({
  loader: () => import('./Footer'),
  loading: () => false
});
