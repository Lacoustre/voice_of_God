const emailService = require('../emailService');
const contactTemplate = require('../templates/contactTemplate');

exports.handleContact = async (req, res) => {
  const { name, email, phone, message } = req.body;

  if (!name || !email) {
    return res.status(400).json({ error: 'Please provide name and email' });
  }

  try {
    await emailService.sendEmail({
      from: email,
      fromName: name,
      subject: `New Contact Form Message - VOG Ministries Website`,
      message: contactTemplate({ name, email, phone, message }),
    });

    res.status(200).json({ success: true, message: 'Email sent successfully' });
  } catch (error) {
    console.error('Error sending email:', error);
    res.status(500).json({ success: false, message: 'Failed to send email', error: error.message });
  }
};
