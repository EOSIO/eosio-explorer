import ActionsModel from '../models/actions';
import mongoose from 'mongoose';

export default async (query:any) => {
  try{
	let { block_num, global_sequence } = query;
	let result: object;
	const max_int32_value = 2147483647;

	let query_gen = ActionsModel
		.find({});

  if(block_num === undefined || block_num.trim() === ""){
    throw("invalid block number");
	}
	else if(global_sequence === undefined || global_sequence.trim() === ""){
    throw("invalid sequence number");
  }
  else {
		//Check if the number is greater than max int32 value. 
		//After this value mongodb converts int32 type to string
		block_num = (parseInt(block_num) > max_int32_value) ? 
			block_num : parseInt(block_num);
		
		global_sequence = (parseInt(global_sequence) > max_int32_value) ? 
			global_sequence : parseInt(global_sequence);

		query_gen.and([
			{"block_num": block_num},
			{"receipt.global_sequence": global_sequence}
		]);
  }
	
	result = await query_gen.exec();
	return result;
  }catch(err){
		console.log(err);
		throw err;
  }
}
