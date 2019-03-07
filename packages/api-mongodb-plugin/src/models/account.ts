import mongoose from 'mongoose';
let AccountSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true
    }
  }
)
export default mongoose.model('Account', AccountSchema, 'accounts')
