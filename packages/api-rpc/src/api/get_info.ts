import { JsonRpc } from 'eosjs';

export default async (query: { endpoint: string }) => {
  try{
    let { endpoint } = query;
    
    const rpc = new JsonRpc(endpoint);
    let response = await rpc.get_info();
    return response;

  }catch(e){
    console.log('Caught exception: ' + e);
    throw(e);
  }
}
