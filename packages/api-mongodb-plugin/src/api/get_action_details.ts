import ActionsModel from '../models/actions';

function sanitizeInput(value: string | number) {
	if (typeof value === 'string') {
		return value.trim();
	} 
	if (typeof value === 'number') {
		return value;
	}
	return value;
}

function parseInput(value: string | number) {
	if (typeof value === 'string') {
		return parseInt(value);
	}
	if (typeof value === 'number') {
		return value;
	}
	return value;
}

export default async (query: {
	block_num: string | number,
	global_sequence: string | number
}) => {
  try{
	let { block_num = "", global_sequence = "" } = query;
	let result: object;
	const max_int32_value = 2147483647;

	let query_gen = ActionsModel
		.find({});

  if (sanitizeInput(block_num) === "") {
    throw("invalid block number");
	}
	else if(sanitizeInput(global_sequence) === ""){
    throw("invalid sequence number");
  }
  else {
		//Check if the number is greater than max int32 value. 
		//After this value mongodb converts int32 type to string
		block_num = (parseInput(block_num) > max_int32_value) ? 
			block_num : parseInput(block_num);
		
		global_sequence = (parseInput(global_sequence) > max_int32_value) ? 
			global_sequence : parseInput(global_sequence);

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
