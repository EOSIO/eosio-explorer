import { JsonRpc } from 'eosjs';

export default async (query: {
  endpoint: string,
  account_name: string
}) => {
  try{
    let { endpoint, account_name } = query;
    
    const rpc = new JsonRpc(endpoint);
    const result = await rpc.get_account(account_name);
    return result;
  }catch(e){
    console.log('Caught exception: ' + e);
    throw(e);
  }
}
