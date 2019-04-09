import { from } from 'rxjs';
import apiRpc from '@eosio-toppings/api-rpc';
import store from "store";

export default async ( apiPath, query ) => {

  if ( navigator.userAgent !== "ReactSnap" ){
    try{
      const state = store.getState();

      let { permission: { data: { list, defaultId }}} = state;

      // Get private key of the currently selected permission
      let selectedPermission = list.find(permission => permission._id === defaultId) || {};
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
        timeout: 2500,
        // responseType: "json"
      })
      return result;
    }catch(err){
      console.error(err);
      throw err;
    }
  }else{ //If we are prerendering using react snap, return a promise that resolved with a repsonse with { repsonse: undefined }

    return new Promise((resolve, reject)=>{
      resolve({response: undefined});
    })
  }
}
