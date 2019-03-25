import TransactionsModel from '../models/transactions';

export default async (query:any) => {
  try{
    let { trx_id } = query;

    let result: object;

    let query_gen = TransactionsModel
      .find({},
        {
          "trx_id": 1,
          "block_num": 1,
          "createdAt": 1,
          "actions.account": 1,
          "actions.name": 1
        });

    if(trx_id === undefined || trx_id.trim() === ""){
      throw("invalid transaction id");
    } 
    else {
      query_gen.where({trx_id: trx_id});
    }

    query_gen.limit(100);
    query_gen.sort({createdAt: -1});
    result = await query_gen.exec();

    return result;
  }catch(err){
    console.log(err);
    throw(err);
  }
}
