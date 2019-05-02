import { Api, JsonRpc } from 'eosjs';
import JsSignatureProvider from 'eosjs/dist/eosjs-jssig'
import { TextDecoder, TextEncoder } from 'text-encoding';

export default async (query: {
  endpoint: string,
  private_key: string,
  actor: string,
  permission: string,
  new_account_name: string,
  new_account_owner_key: string,
  new_account_active_key: string
}) => {
  try{
    let { endpoint, private_key: creator_private_key, actor: creator_account_name, permission: creator_account_permission, new_account_name, new_account_owner_key, new_account_active_key } = query;

    const rpc = new JsonRpc(endpoint);
    const signatureProvider = new JsSignatureProvider([creator_private_key]);
    const api = new Api({ rpc, signatureProvider, textDecoder: new TextDecoder(), textEncoder: new TextEncoder() });

    const result = await api.transact({
      actions: [{
        account: 'eosio',
        name: 'newaccount',
        authorization: [{
          actor: creator_account_name,
          permission: creator_account_permission,
        }],
        data: {
          creator: creator_account_name,
          name: new_account_name,
          owner: {
            threshold: 1,
            keys: [{
              key: new_account_owner_key,
              weight: 1
            }],
            accounts: [],
            waits: []
          },
          active: {
            threshold: 1,
            keys: [{
              key: new_account_active_key,
              weight: 1
            }],
            accounts: [],
            waits: []
          },
        },
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
