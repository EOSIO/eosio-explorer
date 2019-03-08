import BlockModel from '../models/block';

export default async () => {
  try{
    let result = await BlockModel.findOne({}, {}, { sort: { 'createdAt' : -1 } });
    return result;
  }catch(err){
    console.log(err);
  }
}
