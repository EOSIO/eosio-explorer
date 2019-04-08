import BlockModel from '../models/block';

export default async () => {
  try{
    let result: Object;
    let query_gen = BlockModel
      .find({});

    query_gen.limit(1);
    query_gen.sort({block_num: -1});
    result = await query_gen.exec();

    return result;
  }catch(err){
    console.log(err);
    throw(err);
  }
}
