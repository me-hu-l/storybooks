import mongoose from "mongoose";

const StorySchema = new mongoose.Schema({
        title: {
                type: String,
                required: true,
                trim: true
        },
        body: {
                type: String,
                required: true
        },
        status: {
                type: String,
                default: 'public',
                enum: ['public', 'private']
        },
        user: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'User'
        }
        
}, {
        timestamps: true
})

export default mongoose.model('Story', StorySchema)