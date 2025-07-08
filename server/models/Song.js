import { Schema, model } from 'mongoose';

const SongSchema = new Schema({
  title:     { type: String, required: true },
  artist:    { type: String, required: true },
  username:  { type: String, required: true },
  type:      { type: String, required: true },
  description: { type: String, default: "" },
  createdAt: { type: Date, default: Date.now },
  imageUrl:  { type: String, required: true },
  audioUrl:  { type: String, required: true },
  duration:  { type: Number, required: true },
  likedBy:   [{ type: Schema.Types.ObjectId, ref: 'User' }], // Thêm trường likedBy
}, {
  indexes: [{ key: { likedBy: 1 } }], // Tạo index cho likedBy để tối ưu query
});

export default model('Song', SongSchema);