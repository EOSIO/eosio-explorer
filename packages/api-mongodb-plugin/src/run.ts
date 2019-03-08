// A ts for testing an api call

import api from './index';

const endpoint = 'get_blocks';

api[endpoint]()
  .then((doc: any)=>{
    console.log(doc);
  })
  .catch((err: any)=>{
    console.error(err);
  });

  setTimeout((function() {
    return process.exit(22);
}), 300);
