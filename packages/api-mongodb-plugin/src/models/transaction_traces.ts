import mongoose from 'mongoose';
let TransactionTracesSchema = new mongoose.Schema(
  {
    trx_id: {
      type: String,
      required: true
    }
  }
)
export default mongoose.model('TransactionTraces', TransactionTracesSchema, 'transaction_traces')
