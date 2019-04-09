import ActionsModel from '../models/actions';
import mongoose from 'mongoose';

export default async (query:any) => {
  try{
	let { action_id } = query;
	let result: object;

	let query_gen = ActionsModel
	.find({});

  if(action_id === undefined || action_id.trim() === ""){
    throw("invalid action id");
  }
  else {
		query_gen.where({"_id": mongoose.Types.ObjectId(action_id)});
  }
	
	result = await query_gen.exec();
	return result;
  }catch(err){
	console.log(err);
	throw err;
  }
}
