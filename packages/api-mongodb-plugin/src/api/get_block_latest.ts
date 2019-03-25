import BlockModel from '../models/block';

export default async () => {
  try{
    let result = await BlockModel.findOne({}, {}, { sort: { 'createdAt' : -1 } });
    console.log("get_block_latest response: ", result);
    return result;
  }catch(err){
    console.log(err);
  }
}
