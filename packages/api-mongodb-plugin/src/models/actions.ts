import mongoose from 'mongoose';
let ActionsSchema = new mongoose.Schema(
  {
    _id: {
      type: mongoose.Schema.Types.ObjectId,
      required: true
    }
  }
)
export default mongoose.model('Actions', ActionsSchema, 'action_traces')
