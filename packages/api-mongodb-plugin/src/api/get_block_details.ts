import BlockModel from '../models/block';

export default async (query: { id_or_num: string }) => {
  try{
    let { id_or_num = "" } = query;
    let result: object;

    let query_gen = BlockModel
      .find({});

    // check if id is passed
    // check if its a number or not else it gives parsing error
    if(id_or_num !== undefined){
      isNaN(Number(id_or_num)) ?
        query_gen.where({block_id: id_or_num}): 
        query_gen.where({block_num: id_or_num});
    }
    else {
      throw("invalid id or number");
    }

    result = await query_gen.exec();
    return result;
  }catch(err){
    console.log(err);
  }
}
