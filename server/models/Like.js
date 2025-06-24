import mongoose from 'mongoose';

const LikeSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, required: true },
  songId: { type: mongoose.Schema.Types.ObjectId, required: true, ref: 'Song' },
}, { timestamps: true });

export default mongoose.model('Like', LikeSchema);
