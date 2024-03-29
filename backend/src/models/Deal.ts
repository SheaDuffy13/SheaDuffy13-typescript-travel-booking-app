import mongoose, { Document, Schema } from 'mongoose';


interface IDeal extends Document {
    flight: Schema.Types.ObjectId;
    price: number;
    validUntil: Date;
  }
  
  const DealSchema: Schema = new Schema({
    flight: { type: Schema.Types.ObjectId, ref: 'Flight', required: true },
    price: { type: Number, required: true },
    validUntil: { type: Date, required: true }
  });
  
  export const Deal = mongoose.model<IDeal>('Deal', DealSchema);