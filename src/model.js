import { Schema, model } from "mongoose";

const userSchema = new Schema({
    name: {
        type: String
    },
    email: {
        type: String,
        validator: {
            validate: function(value) {
                return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
            },
            message: "Invalid email address"
        }
    }
});


const User = model('users', userSchema)
export default User