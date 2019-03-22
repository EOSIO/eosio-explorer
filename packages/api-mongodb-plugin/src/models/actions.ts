import mongoose from 'mongoose';
let ActionsSchema = new mongoose.Schema(
  {
    _id: {
      type: String,
      required: true
    }
  }
)
export default mongoose.model('Actions', ActionsSchema, 'action_traces')
