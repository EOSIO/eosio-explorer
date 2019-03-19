import { from } from 'rxjs';
import { ajax } from 'rxjs/ajax';

export default ( endpoint ) => navigator.userAgent !== "ReactSnap"
?
  ajax({
    url :`/api/mongodb/${endpoint}`,
    timeout: 1000,
    responseType: "json"
  })
: //If we are prerending using react snap, return a promise that resolved with a repsonse with { repsonse: null}
  from(new Promise((resolve, reject)=>{
    resolve({response: null});
  }))
