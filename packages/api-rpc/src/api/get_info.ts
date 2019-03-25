import { Api, JsonRpc, RpcError } from 'eosjs';
import JsSignatureProvider from 'eosjs/dist/eosjs-jssig'
import { TextDecoder, TextEncoder } from 'text-encoding';

export default async (query:any) => {
  try{
    let { endpoint, privateKey } = query;
    
    const rpc = new JsonRpc(endpoint);
    let response = await rpc.get_info();
    return response;

  }catch(e){
    console.log('Caught exception: ' + e);
    throw(e);
  }
}
