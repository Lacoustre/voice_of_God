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
  }

  /**
   * @param {Object} options
   * @param {string} options.from
   * @param {string} options.fromName
   * @param {string} options.subject
   * @param {string} options.message
   * @returns {Promise}
   */
  async sendEmail({ from, fromName, subject, message }) {
    const mailOptions = {
      from: `"Voice of God Ministries" <${process.env.EMAIL_USER}>`,
      to: process.env.EMAIL_TO || "INFO@THEVOGMINISTRIES.ORG",
      replyTo: from,
      subject: `[VOG Website] ${subject}`,
      html: message,
    };

    try {
      const result = await this.transporter.sendMail(mailOptions);
      return result;
    } catch (error) {
      console.error("Error sending email:", error);
      throw error;
    }
  }
}

module.exports = new EmailService();
