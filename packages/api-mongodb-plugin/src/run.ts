// A ts for testing an api call

import api from './index';

const endpoint = 'get_accounts';

api[endpoint]()
  .then((doc: any)=>{
    console.log(doc);
  })
  .catch((err: any)=>{
    console.error(err);
  });
