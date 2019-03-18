import { ajax } from 'rxjs/ajax';

export default ( endpoint ) =>
  ajax({
    url :`/api/mongodb/${endpoint}`,
    timeout: 1000,
    responseType: "json"
  })
