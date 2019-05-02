import AccountModel from '../models/account';

const get_abi = async (query: { 
  account_name: string,
  records_count: string
}) => {
  try{
    let { account_name, records_count } = query;

    let result: object;

    let query_gen = AccountModel
      .find({},
        {
          "name": 1,
          "abi": 1,
          "createdAt": 1
        });

    if(account_name !== undefined){
      query_gen.where("name").equals(account_name);
    }
    else {
      query_gen.exists("abi");

      (records_count !== undefined) ?
        query_gen.limit(parseInt(records_count)): query_gen.limit(100);  

      query_gen.sort({_id: -1});
    } 
    
    result = await query_gen.exec();
    return result;
  }catch(err){
    console.log(err);
  }
}

export default get_abi;
