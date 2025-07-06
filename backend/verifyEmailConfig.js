// Script to verify email configuration
require('dotenv').config();
const emailService = require('./emailService');

console.log('=== Email Configuration Verification ===');
console.log(`EMAIL_USER: ${process.env.EMAIL_USER ? '✓ Set' : '✗ Not set'}`);
console.log(`EMAIL_PASS: ${process.env.EMAIL_PASS ? '✓ Set' : '✗ Not set'}`);

// Test the email service if credentials are provided
if (process.env.EMAIL_USER && process.env.EMAIL_PASS) {
  console.log('\nAttempting to send a test email...');
  
  // Send to the same address as the sender for testing
  emailService.sendEmail({
    to: process.env.EMAIL_USER,
    subject: 'Email Service Test',
    message: `
      <div style="font-family: Arial, sans-serif; padding: 20px;">
        <h2>Email Service Test</h2>
        <p>This is a test email to verify that the email service is configured correctly.</p>
        <p>If you received this email, your email service is working!</p>
        <p>Time: ${new Date().toISOString()}</p>
      </div>
    `
  })
  .then(result => {
    console.log('\n✓ Test email sent successfully!');
    console.log(`Message ID: ${result.messageId}`);
    console.log(`Accepted recipients: ${result.accepted.join(', ')}`);
    process.exit(0);
  })
  .catch(error => {
    console.error('\n✗ Failed to send test email:');
    console.error(error);
    process.exit(1);
  });
} else {
  console.error('\n✗ Email credentials are not properly configured in .env file');
  process.exit(1);
}