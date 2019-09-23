
import { from } from 'rxjs';
import { timeout } from 'rxjs/operators';
import store from "store";
import apiRpc from '@eosio-toppings/api-rpc';

const apiRpcCall = async ( apiPath, query={} ) => {

  try{
    const state = store.getState();

    let { permission: { data: { list, defaultId }}} = state;

    // Get private key of the currently selected permission
    let selectedPermission = list.find(permission => permission.account+"@"+permission.permission === defaultId) || {};
    let { account: actor = "", permission = "", private_key } = selectedPermission;

    //Override actor / permissoin / private_key if the query already provide actor and permission. Loop through the list in permission store and find the private_key.
    if ( query.actor && query.permission ){
      actor = query.actor;
      permission = query.permission;
      selectedPermission = list.find(permission => permission.account === query.actor && permission.permission === query.permission) || {};
      private_key = selectedPermission.private_key || "";
    }

    let { endpoint: { path : { nodeos }}} = state;
    let result = await apiRpc[apiPath]({
      ...query,
      actor,
      permission,
      private_key,
      endpoint: nodeos,
    })
    return result;
  }catch(err){
    console.error(err);
    throw err;
  }
}

export default ( apiPath, query={} ) => navigator.userAgent !== "ReactSnap" ?
    from(apiRpcCall(apiPath, query)).pipe(timeout(process.env.REACT_APP_API_TIMEOUT_TIME))
  :
    //If we are prerendering using react snap, return a promise that resolved with a repsonse with { repsonse: undefined }
    from(new Promise((resolve, reject)=>{
      resolve({response: undefined});
    }))
