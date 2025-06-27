const emailService = require('../emailService');
const newsletterTemplate = require('../templates/newsLetterTemplate');

exports.handleNewsletter = async (req, res) => {
  const { email } = req.body;

  if (!email) {
    return res.status(400).json({ error: 'Please provide an email address' });
  }

  try {
    await emailService.sendEmail({
      from: email,
      fromName: 'Newsletter Subscription',
      subject: 'New Newsletter Subscription - VOG Ministries',
      message: newsletterTemplate({ email }),
    });

    res.status(200).json({ success: true, message: 'Subscription successful' });
  } catch (error) {
    console.error('Error processing subscription:', error);
    res.status(500).json({ success: false, message: 'Failed to process subscription', error: error.message });
  }
};
