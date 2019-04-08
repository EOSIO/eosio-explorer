import TransactionTracesModel from '../models/transaction_traces';

export default async (query:any) => {
  try{
    let { id } = query;

    let result: object;

    let query_gen = TransactionTracesModel
      .find({});

    if(id === undefined || id.trim() === ""){
      throw("invalid transaction id");
    }
    else {
      query_gen.where({id: id});
    }
    result = await query_gen.exec();
    return result;
  }catch(err){
    console.log(err);
    throw(err);
  }
}
