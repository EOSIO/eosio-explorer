import mongoose from 'mongoose';
let PermissionsSchema = new mongoose.Schema(
  {
    _id: {
      type: String,
      required: true
    }
  }
)
export default mongoose.model('Permissions', PermissionsSchema, 'pub_keys')
