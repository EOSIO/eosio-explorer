import { from } from 'rxjs';
import apiRpc from '@eosio-toppings/api-rpc';
import store from "store";

export default async ( apiPath, query ) => {

  if ( navigator.userAgent !== "ReactSnap" ){
    try{
      const state = store.getState();
      let { endpoint: { path : { nodeos }}} = state;
      let result = await apiRpc[apiPath]({
        ...query,
        endpoint: nodeos,
        timeout: 2500,
        // responseType: "json"
      })
      return result;
    }catch(err){
      console.error(err);
      throw err;
    }
  }else{ //If we are prerending using react snap, return a promise that resolved with a repsonse with { repsonse: undefined}

    return new Promise((resolve, reject)=>{
      resolve({response: undefined});
    })
  }
}
