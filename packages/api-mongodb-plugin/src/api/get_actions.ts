import ActionsModel from '../models/actions';

export default async (query:any) => {
  try{
    let { account_name } = query;

    let result: object;

    if(account_name !== undefined) //include empty actions
    {
      result = await ActionsModel
        .find( 
        { $and: [{"act.account": account_name}, {"act.name": { $ne: "onblock" }}]}, 
        {
          "receipt.act_digest": 1,
          "act.name": 1,
          "act.account": 1,
          "trx_id": 1,
          "createdAt": 1
        })
        .sort({ 'createdAt' : -1 })
        .limit( 100 );
    }
    else //list non empty actions
    {
      result = await ActionsModel
      .find({ "act.name": { $ne: "onblock" } }
      ,{
          "receipt.act_digest": 1,
          "act.name": 1,
          "act.account": 1,
          "trx_id": 1,
          "createdAt": 1
      })
      .sort({ 'createdAt' : -1 })
      .limit( 100 );
    }
    return result;
  }catch(err){
    console.log(err);
    throw err;
  }
}
