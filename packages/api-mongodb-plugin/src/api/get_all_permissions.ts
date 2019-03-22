import PermissionsModel from '../models/permissions';

export default async (query:any) => {
  try{
    let result: object;

    result = await PermissionsModel
    .find({}
    ,{
        "account": 1,
        "permission": 1,
        "public_key": 1,
        "createdAt": 1
    })
    .sort({ 'createdAt' : -1 })
    .limit( 100 );
    
    return result;
  }catch(err){
    console.log(err);
    throw err;
  }
}
