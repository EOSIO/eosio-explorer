import AccountDetailsModel from '../models/account_details';

const get_account_details = async (query: { account_name: string }) => {
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
    else{
      throw("invalid account name")
    }

    result = await query_gen.exec();  
    return result;
  }catch(err){
    console.log(err);
  }
}

export default get_account_details;
