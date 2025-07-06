const express = require('express');
const router = express.Router();
const emailService = require('../emailService');

router.post('/send-test', async (req, res) => {
  const { to } = req.body;
  
  if (!to) {
    return res.status(400).json({ success: false, error: 'Email address is required' });
  }
  
  try {
    console.log(`Sending test email to: ${to}`);
    
    const result = await emailService.sendEmail({
      to: to,
      subject: 'Test Email from Voice of God Ministries',
      message: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <h2 style="color: #4F46E5;">Test Email</h2>
          <p>This is a test email to verify that the email service is working correctly.</p>
          <p>If you received this email, the email service is working!</p>
          <p>Time sent: ${new Date().toISOString()}</p>
        </div>
      `
    });
    
    console.log('Test email sent successfully:', result);
    res.status(200).json({ success: true, message: 'Test email sent successfully', result });
  } catch (error) {
    console.error('Error sending test email:', error);
    res.status(500).json({ 
      success: false, 
      error: `Failed to send test email: ${error.message}`,
      stack: error.stack
    });
  }
});

module.exports = router;