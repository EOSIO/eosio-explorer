import PermissionsModel from '../models/permissions';

export default async (query:any) => {
  try{
    let { records_count } = query;
    let result: object;

    let query_gen = PermissionsModel
    .find({}
    ,{
        "account": 1,
        "permission": 1,
        "public_key": 1,
        "createdAt": 1
    });

    (records_count !== undefined) ?
        query_gen.limit(parseInt(records_count)): query_gen.limit(100); 
        
    query_gen.sort({_id: -1});
    result = await query_gen.exec();
    return result;
  }catch(err){
    console.log(err);
    throw err;
  }
}
