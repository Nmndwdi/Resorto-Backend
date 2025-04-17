import mongoose from "mongoose"

const reviewSchema = mongoose.Schema(
    {
        name: {
            type: String,
            required: true
        },
        contact: {
            type: String,
            required: true
        },
        description: {
            type: String,
        },
        stars: {
            type: Number,
            required: true,
            min: 1,
            max: 5
        },
        approved: {
            type: Boolean,
            default: false
        }
    },
    {
        timestamps: true
    }
)

export const Review=mongoose.model("Review",reviewSchema)