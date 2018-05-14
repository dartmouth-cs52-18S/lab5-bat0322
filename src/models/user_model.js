import mongoose, { Schema } from 'mongoose';
import bcrypt from 'bcryptjs';

const UserSchema = new Schema({
  email: { type: String, unique: true, lowercase: true },
  password: { type: String, select: false },
}, {
  toJSON: {
    virtuals: true,
  },
});

UserSchema.pre('save', function beforeUserSave(next) {
  // this is a reference to our model
  // the function runs in some other context so DO NOT bind it
  const user = this;

  if (!user.isModified('password')) return next();

  const salt = bcrypt.genSaltSync(10);
  const hash = bcrypt.hashSync(user.password, salt);

  user.password = hash;
  return next();
});

UserSchema.methods.comparePassword = function comparePassword(candidatePassword, callback) {
  // return callback(null, comparisonResult) for success
  // or callback(error) in the error case
  bcrypt.compare(candidatePassword, this.password, (err, isMatch) => {
    if (err) return callback(err);
    return callback(null, isMatch);
  });
};

const UserModel = mongoose.model('User', UserSchema);

export default UserModel;
