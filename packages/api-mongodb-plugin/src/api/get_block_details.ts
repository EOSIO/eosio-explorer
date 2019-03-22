import BlockModel from '../models/block';

export default async (query:any) => {
  try{
    let { id = "" } = query;
    let result = await BlockModel.find({ block_id: id });
    return result;
  }catch(err){
    console.log(err);
  }
}
