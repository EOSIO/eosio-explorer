import mongoose from 'mongoose';
let accountSchema = new mongoose.Schema(
  {
    name: String
  }
)
export default mongoose.model('Account', accountSchema, 'accounts')
