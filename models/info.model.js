import mongoose from "mongoose";

const infoSchema = new mongoose.Schema(
    {
        // header
        logo: {
            type: String,
            required: true
        },
        title: {
            type: String,
            required: true
        },
        phone_no: {
            type: String,
            required: true
        },
        address: {
            type: String,
            required: true
        },

        // home
        home_images: [
            {
                type: String
            }
        ],
        
        short_about_heading: {
            type: String
        },

        short_about_description:{
            type: String
        },

        event_options: [
            {
                title: {
                    type: String
                },
                description: {
                    type: String
                }
            }
        ],
        
        // about
        about_heading: {
            type: String
        },

        about_description: {
            type: String
        },
        
        // footer
        name: {
            type: String,
            required: true
        },
        description: {
            type: String
        },
        linkedin: {
            type: String
        },
        instagram: {
            type: String
        },
        facebook: {
            type: String
        },
        twitter: {
            type: String
        },
        email: {
            type: String
        },

        // contact
        whatsApp_number: {
            type: String,
            required: true
        },
        calling_number: {
            type: String,
            required: true
        },

        // information
        main_info: [
            {
                heading: {
                    type: String,
                },
                content: [
                    {
                        subheading: {
                            type: String
                        },
                        description: {
                            type: String
                        }
                    }
                ]
            }
        ],

        // gallery
        gallery: [
            {
                title: {
                    type: String
                },
                media: [
                    {
                        type: String
                    }
                ]
            }
        ]
    },
    {
        timestamps: true
    }
)

export const Info = mongoose.model("Info", infoSchema)