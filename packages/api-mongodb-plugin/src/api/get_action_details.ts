import ActionsModel from '../models/actions';

export default async (query:any) => {
  try{
	let { action_digest } = query;
	let result: object;

	let query_gen = ActionsModel
	.find({});

  if(action_digest === undefined || action_digest.trim() === ""){
    throw("invalid action digest");
  } 
  else {
    query_gen.where("receipt.act_digest").equals(action_digest);
  }

	query_gen.limit(100);
	query_gen.sort({createdAt: -1});
	result = await query_gen.exec();    
	return result;
  }catch(err){
	console.log(err);
	throw err;
  }
}
