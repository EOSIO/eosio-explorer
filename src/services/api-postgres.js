import { from } from 'rxjs';
import { ajax } from 'rxjs/ajax';

export default ( apiPath ) => navigator.userAgent !== "ReactSnap"
?
  ajax({
    url :`/api/postgres/${apiPath}`,
    timeout: process.env.REACT_APP_API_TIMEOUT_TIME,
    responseType: "json"
  })
: //If we are prerendering using react snap, return a promise that resolved with a repsonse with { repsonse: undefined }
  from(new Promise((resolve, reject)=>{
    resolve({response: undefined});
  }))
