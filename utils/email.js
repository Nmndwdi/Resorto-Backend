import nodemailer from "nodemailer"
import { ApiError } from "../utils/ApiError.js"

const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: process.env.EMAIL,
        pass: process.env.PASSWORD
    }
})

transporter.verify((error, success) => {
    if (error) {
        console.error("SMTP connection failed:", error);
    } else {
        console.log("SMTP connection successful:", success);
    }
});

const sendOtpEmail = async(email, otp) => {
    try {
        const info=await transporter.sendMail({
            from: process.env.EMAIL,
            to: email,
            subject: "Your One-Time Password (OTP)",
            text: `Your OTP is ${otp}. It will expire in 5 minutes.`,
            html: `
                <div style="font-family: Arial, sans-serif; color: #333;">
                    <h2>Your OTP Code</h2>
                    <p>Your OTP is <strong>${otp}</strong>.</p>
                    <p>This code will expire in 5 minutes.</p>
                    <br>
                    <p>Regards,<br>Resorto Team</p>
                </div>
            `
        });
    } catch (error) {
        throw new ApiError(500, "Something went wrong in sending OTP")
    }
}

const sendReviewEmail = async (email, reviewDetails) => {
    const { name, stars, description, contact } = reviewDetails;

    try {
        const info = await transporter.sendMail({
            from: process.env.EMAIL,
            to: email,  // Admin's email who will approve/review
            subject: `New Review Submitted - ${name}`,
            text: `
                Hello Admin,

                A new review has been submitted by ${name} with the following details:
                
                Name: ${name}
                Contact: ${contact}
                Rating: ${stars} stars
                Description: ${description}
                
                Please log in to the admin dashboard to review and approve or reject this review.
                
                Best regards,
                Your Team`,
            html: `
                <html>
                    <body>
                        <h2>Hello Admin, </h2>

                        <h2>A new review has been submitted by ${name}</h2>
                        <p><strong>Name:</strong> ${name}</p>
                        <p><strong>Contact:</strong> ${contact}</p>
                        <p><strong>Rating:</strong> ${stars} stars</p>
                        <p><strong>Description:</strong> ${description}</p>
                        <p>Please log in to the admin dashboard to review and approve or reject this review.
                
                        Best regards,
                        Your Team.</p>
                        
                    </body>
                </html>`
        });

    } catch (error) {
        throw new ApiError(500, "Something went wrong while sending the review notification email.");
    }
};

const sendEmail = async ({ from, to, subject, text, html }) => {
    try {
      const info = await transporter.sendMail({
        from,
        to,
        subject,
        text,
        html
      });
  
      console.log(`Email sent: ${info.messageId}`);
    } catch (error) {
      console.error("Error sending email:", error);
      throw new ApiError(500, "Something went wrong while sending email");
    }
  };

export {sendOtpEmail, sendReviewEmail, sendEmail}