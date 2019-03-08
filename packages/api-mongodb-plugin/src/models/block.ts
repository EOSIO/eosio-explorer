import mongoose from 'mongoose';
let BlockSchema = new mongoose.Schema(
  {
    block_num: {
      type: Number,
      required: true
    },
    block_id: {
      type: String,
      required: true
    }
  }
)
export default mongoose.model('Block', BlockSchema, 'blocks')
