import AccountModel from '../models/account';

export default async () => {
  try{
    let result = await AccountModel.find();
    return result;
  }catch(err){
    console.log(err);
  }
}
