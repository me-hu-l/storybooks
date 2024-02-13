import mongoose from "mongoose";
import bcrypt from 'bcryptjs'

const userSchema = mongoose.Schema({
        name: {
                type: String,
                required: true
        },
        email: {
                type: String,
                required: true,
                unique: true
        },
        password: {
                type: String,
                required: true
        },
        followers: [
                {
                    type: mongoose.Schema.Types.ObjectId,
                    ref: 'User'
                }
        ],
        following: [
                {
                        type: mongoose.Schema.Types.ObjectId,
                        ref: 'User'
                }
        ],
        pendingRequests: [
                {
                        type: mongoose.Schema.Types.ObjectId,
                        ref: 'User'
                }
        ],
        pendingSentRequests: [
                {
                        type: mongoose.Schema.Types.ObjectId,
                        ref: 'User'
                }
        ]
        
}, {
        timestamps: true
})

userSchema.virtual('followerCount').get(function() {
        return this.followers.length;
    });
    

userSchema.pre('save', async function(next) {
        if(!this.isModified('password')){
                next()
        }

        const salt = await bcrypt.genSalt(10);
        this.password = await bcrypt.hash(this.password, salt)
})

userSchema.method('matchPasswords', async function(enteredPassword){
        return await bcrypt.compare(enteredPassword, this.password)
})

const User = mongoose.model('User', userSchema)

export default User