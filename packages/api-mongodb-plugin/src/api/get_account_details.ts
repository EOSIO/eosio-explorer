import AccountDetailsModel from '../models/account_details';

export default async (query:any) => {
  try{
    let { account_name, records_count } = query;
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
    else{
      
      (records_count !== undefined) ?
        query_gen.limit(records_count): query_gen.limit(100);  

      query_gen.sort({_id: -1});  
    }

    result = await query_gen.exec();  
    return result;
  }catch(err){
    console.log(err);
  }
}
