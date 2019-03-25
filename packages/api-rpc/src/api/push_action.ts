import { Api, JsonRpc } from 'eosjs';
import JsSignatureProvider from 'eosjs/dist/eosjs-jssig'
import { TextDecoder, TextEncoder } from 'text-encoding';

export default async (query:any) => {
  try{
    let { endpoint, account_name, private_key, actor, permission,  action_name, payload } = query;
    
    const rpc = new JsonRpc(endpoint);
    const signatureProvider = new JsSignatureProvider([private_key]);
    const api = new Api({ rpc, signatureProvider, textDecoder: new TextDecoder(), textEncoder: new TextEncoder() });

    const result = await api.transact({
      actions: [{
        account: account_name,
        name: action_name,
        authorization: [{
          actor: actor,
          permission: permission,
        }],
        data: payload,
      }]
    }, {
      blocksBehind: 3,
      expireSeconds: 30,
    });
    
    return result;

  }catch(e){
    console.log('Caught exception: ' + e);
    throw(e);
  }
}
