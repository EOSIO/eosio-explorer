import BlockModel from '../models/block';

export default async (query:any) => {
  try{
    let { id = "" } = query;
    let result = await BlockModel
      .find({ block_id: id },
      {
        "block_id": 1,
        "block_num": 1,
        "createdAt": 1,
        "block.transactions.trx.id": 1
      });
    return result;
  }catch(err){
    console.log(err);
  }
}
