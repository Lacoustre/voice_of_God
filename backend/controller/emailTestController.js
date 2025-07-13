const emailService = require('../emailService');

exports.testEmailService = async (req, res) => {
  try {
    // Get the test email address from request body or use a default
    const { email } = req.body;
    
    if (!email) {
      return res.status(400).json({ 
        success: false, 
        error: "Email address is required" 
      });
    }

    // Send a test email
    const result = await emailService.sendEmail({
      to: email,
      subject: 'Email Service Test - Voice of God Ministries',
      message: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <div style="text-align: center; margin-bottom: 30px;">
            <h2 style="color: #4F46E5; margin-top: 15px;">Voice of God Ministries</h2>
          </div>
          
          <p style="color: #333; font-size: 16px;">This is a test email to verify that the email service is working correctly.</p>
          
          <div style="background-color: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #4F46E5;">
            <p>If you're receiving this email, it means the email service is configured correctly.</p>
            <p>Time sent: ${new Date().toLocaleString()}</p>
          </div>
          
          <div style="margin-top: 30px; text-align: center;">
            <p style="color: #333; font-size: 16px;">Blessings,<br><strong>Voice of God Ministries Team</strong></p>
            <hr style="margin: 20px 0; border: none; border-top: 1px solid #e0e0e0;">
            <p style="font-size: 12px; color: #666;">52 Connecticut Avenue, South Windsor, CT 06074</p>
          </div>
        </div>
      `
    });
    
    console.log('Test email sent successfully:', result);
    res.status(200).json({ 
      success: true, 
      message: "Test email sent successfully",
      details: {
        messageId: result.messageId,
        recipient: email
      }
    });
  } catch (error) {
    console.error("Error sending test email:", error);
    res.status(500).json({ 
      success: false, 
      error: `Failed to send test email: ${error.message}`,
      details: error.toString()
    });
  }
};