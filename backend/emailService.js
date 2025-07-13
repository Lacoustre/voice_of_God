const nodemailer = require("nodemailer");

class EmailService {
  constructor() {
    this.transporter = nodemailer.createTransport({
      service: "gmail",
      host: "smtp.gmail.com",
      port: 465,
      secure: true,
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });
    
    // Log email configuration (without sensitive data)
    console.log(`Email service initialized with user: ${process.env.EMAIL_USER}`);
    console.log(`Email password provided: ${process.env.EMAIL_PASS ? 'Yes' : 'No'}`);
  
  }

  /**
   * @param {Object} options
   * @param {string} options.to - Recipient email address
   * @param {string} options.subject
   * @param {string} options.message
   * @returns {Promise}
   */
  async sendEmail({ to, subject, message }) {
    const mailOptions = {
      from: `"Voice of God Ministries" <${process.env.EMAIL_USER}>`,
      to: to,
      subject: subject,
      html: message,
    };

    console.log(`Attempting to send email to: ${to}`);
    console.log(`Subject: ${subject}`);
    
    try {
      const result = await this.transporter.sendMail(mailOptions);
      console.log(`Email sent successfully to ${to}. Message ID: ${result.messageId}`);
      return result;
    } catch (error) {
      console.error("Error sending email:", error);
      throw error;
    }
  }
}

module.exports = new EmailService();
