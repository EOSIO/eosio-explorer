import AccountDetailsModel from '../models/account_details';

export default async (query:any) => {
  try{
    let { account_name } = query;
    let result: object;
  
    let query_gen = AccountDetailsModel
    .find({},
    {
      "account": 1,
      "permission": 1,
      "public_key": 1,
      "createdAt": 1
    });

    if(account_name !== undefined){
      query_gen.where("account").equals(account_name);
    } 

    query_gen.sort({createdAt: -1}).limit(100);  

    result = await query_gen.exec();  
    return result;
  }catch(err){
    console.log(err);
  }
}
