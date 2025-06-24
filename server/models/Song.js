// ===== FILE: server/models/Song.js =====
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
});

export default model('Song', SongSchema);


// ===== FILE: server/routes/song.js =====
