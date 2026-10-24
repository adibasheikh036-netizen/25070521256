import mongoose from 'mongoose';

// Stored in the "users" collection. Open MongoDB Compass to see the records.
const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    course: { type: String, default: '' },
    password: { type: String, required: true }, // bcrypt hash, never the real password
    loginCount: { type: Number, default: 0 },
    lastLoginAt: { type: Date, default: null },
  },
  { timestamps: true, versionKey: false },
);

// What the browser is allowed to see: everything except the password hash
userSchema.methods.toPublic = function toPublic() {
  return {
    id: this._id.toString(),
    name: this.name,
    email: this.email,
    course: this.course,
    loginCount: this.loginCount,
    lastLoginAt: this.lastLoginAt,
    createdAt: this.createdAt,
  };
};

export const User = mongoose.model('User', userSchema);
