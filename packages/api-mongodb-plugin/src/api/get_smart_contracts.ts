import AccountsModel from '../models/account';

export default async () => {
  try{
    let result: object;
  
    let query_gen = AccountsModel
    .find({});

    query_gen.exists("abi");
    query_gen.sort({createdAt: -1}).limit(100);  

    result = await query_gen.exec();  
    return result;
  }catch(err){
    console.log(err);
  }
}
