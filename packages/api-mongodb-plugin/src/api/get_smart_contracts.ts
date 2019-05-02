import AccountsModel from '../models/account';

const get_smart_contracts = async (query: { records_count: string }) => {
  try{
    let { records_count } = query;
    let result: object;
  
    let query_gen = AccountsModel
    .find({});

    query_gen.exists("abi");
    query_gen.sort({_id: -1});
    
    (records_count !== undefined) ?
        query_gen.limit(parseInt(records_count)): query_gen.limit(100);
    
    result = await query_gen.exec();  
    return result;
  }catch(err){
    console.log(err);
  }
}

export default get_smart_contracts;
