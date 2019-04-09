import { Api, JsonRpc, Serialize } from 'eosjs';
import JsSignatureProvider from 'eosjs/dist/eosjs-jssig';
import { TextDecoder, TextEncoder } from 'text-encoding';

export default async (query:any) => {
  try{
    let { endpoint, account_name, private_key, actor, permission, action_name, payload } = query;

    const rpc = new JsonRpc(endpoint);
    const signatureProvider = new JsSignatureProvider([private_key]);
    const api = new Api({ rpc, signatureProvider, textDecoder: new TextDecoder(), textEncoder: new TextEncoder() });


    if (account_name === "eosio" && action_name==="setabi"){
      const buffer = new Serialize.SerialBuffer({
        textEncoder: api.textEncoder,
        textDecoder: api.textDecoder,
      });

      let abi = payload.abi;
      const abiDefinition = api.abiTypes.get('abi_def');
      // need to make sure abi has every field in abiDefinition.fields
      // otherwise serialize throws error
      abi = abiDefinition!.fields.reduce(
          (acc, { name: fieldName }) => Object.assign(acc, { [fieldName]: acc[fieldName] || [] }),
          abi,
      );
      abiDefinition!.serialize(buffer, abi);
      abi = Buffer.from(buffer.asUint8Array()).toString('hex');
      payload.abi = abi;
    }

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
