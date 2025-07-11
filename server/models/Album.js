import mongoose from 'mongoose';
const { Schema } = mongoose;

const AlbumSchema = new Schema({
  title: {
    type: String,
    required: true
  },
  artist: {
    type: String,
    required: true
  },
  uploader: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  genre: {
    type: String,
    default: ''
  },
  coverUrl: {
    type: String,
    default: ''
  },
  releaseDate: {
    type: Date
  },
  songs: [
    {
      type: Schema.Types.ObjectId,
      ref: 'Song'
    }
  ]
}, { timestamps: true });

export default mongoose.model('Album', AlbumSchema);
