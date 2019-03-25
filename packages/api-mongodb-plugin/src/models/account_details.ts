import mongoose from 'mongoose';
let AccountDetailsSchema = new mongoose.Schema(
  {
    account: {
      type: String,
      required: true
    }
  }
)
export default mongoose.model('AccountDetails', AccountDetailsSchema, 'pub_keys')
