import mongoose from 'mongoose';
let TransactionsSchema = new mongoose.Schema(
  {
    trx_id: {
      type: String,
      required: true
    }
  }
)
export default mongoose.model('Transactions', TransactionsSchema, 'transactions')
