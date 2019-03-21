import TransactionsModel from '../models/transactions';

export default async (query:any) => {
  try{
    let { empty, id } = query;

    let result = [];

    if(empty !== undefined) //include empty transactions
    {
      result = await TransactionsModel.find().sort({ 'createdAt' : -1 }).limit( 10 );
    }
    else if(id !== undefined) //search transaction with id
    {
      result = await TransactionsModel.find({"trx_id": id}).sort({ 'createdAt' : -1 }).limit( 1 );
    }
    else //list non empty transactions
    {
      result = await TransactionsModel.find({ "block_num": { $exists: true } }).sort({ 'createdAt' : -1 }).limit( 10 );
    }

    return result;
  }catch(err){
    console.log(err);
  }
}
