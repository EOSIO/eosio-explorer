import BlockModel from '../models/block';

export default async (query:any) => {
  try{
    let { filter } = query;
    let result: Object;
    
    filter !== 'true' 
      ? result = await BlockModel.find({}, {}, { sort: { 'createdAt' : -1 } }).limit(100)
      : result = await BlockModel.find({"block.transactions": { $ne: [] }}, {}, { sort: { 'createdAt' : -1 } }).limit(100);  
    return result;
  }catch(err){
    console.log(err);
    throw(err);
  }
}
