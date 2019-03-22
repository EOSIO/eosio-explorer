import PermissionsModel from '../models/permissions';

export default async () => {
  try{
    let result: object;

    let query_gen = PermissionsModel
    .find({}
    ,{
        "account": 1,
        "permission": 1,
        "public_key": 1,
        "createdAt": 1
    });

    query_gen.limit(100);
    query_gen.sort({createdAt: -1});
    result = await query_gen.exec();
    return result;
  }catch(err){
    console.log(err);
    throw err;
  }
}
