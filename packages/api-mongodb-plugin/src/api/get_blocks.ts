import BlockModel from '../models/block';

export default async (query:any) => {
  try{
    let { filter } = query;
    // Todo: make real filtering from mongodb
    // Current: if filter === 'true' ( filter is on ), show only 2 results instead of 10
    let result = await BlockModel.find({}, {}, { sort: { 'createdAt' : -1 } }).limit( filter !== 'true' ? 10 : 2 );
    return result;
  }catch(err){
    console.log(err);
  }
}
