import ActionsModel from '../models/actions';

export default async (query:any) => {
  try{
	let { global_sequence } = query;
	let result: object;

	let query_gen = ActionsModel
	.find({});

  if(global_sequence === undefined || global_sequence.trim() === ""){
    throw("invalid global sequence");
  } 
  else {
    query_gen.where({"receipt.global_sequence": parseInt(global_sequence)});
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
