import mongoose, { Schema } from 'mongoose';

const PostSchema = new Schema({
  title: String,
  tags: String,
  content: String,
  cover_url: String,
  created_at: Date,
  author: { type: Schema.Types.ObjectId, ref: 'User' },
  author_name: String,
}, {
  toJSON: {
    options: true,
  },
});

// Found the below at https://stackoverflow.com/questions/7034848/mongodb-output-id-instead-of-id
// Stores the item's id as 'id' in the JSON rather than '_id' but keeps _id on the server
// Transform
PostSchema.options.toJSON.transform = (doc, ret, options) => {
  // remove the _id of every document before returning the result
  ret.id = ret._id;
  delete ret._id;
  delete ret.__v;
};
const PostModel = mongoose.model('Post', PostSchema);

export default PostModel;
