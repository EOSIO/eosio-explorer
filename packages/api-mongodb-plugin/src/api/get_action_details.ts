import ActionsModel from '../models/actions';

export default async (query:any) => {
  try{
	let { account_name } = query;
	let result: object;

	let query_gen = ActionsModel
	.find({});

  if(account_name === undefined || account_name.trim() === ""){
    throw("invalid account name");
  } 
  else {
    query_gen.where("act.account").equals(account_name);
  }
    
	query_gen.where("act.name").ne("onblock");

	query_gen.limit(100);
	query_gen.sort({createdAt: -1});
	result = await query_gen.exec();    
	return result;
  }catch(err){
	console.log(err);
	throw err;
  }
}
