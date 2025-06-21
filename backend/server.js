const express = require('express');
const cors = require('cors');
require('dotenv').config();
const emailService = require('./emailService');

const app = express();
const PORT = process.env.PORT || 4000;

app.use(cors());
app.options('*', cors());
app.use(express.json());



app.post('/api/contact', async (req, res) => {
  const { name, email, phone, message } = req.body;

  if (!name || !email) {
    return res.status(400).json({ error: 'Please provide name and email' });
  }

  try {

    await emailService.sendEmail({
      from: email,
      fromName: name,
      subject: `New Contact Form Message - VOG Ministries Website`,
      message: `
        <div style="max-width:600px;margin:auto;border:1px solid #eee;padding:20px;font-family:sans-serif;color:#333;">
          <div style="text-align:center;margin-bottom:20px;">
            <img src="https://thevogministries.org/assets/img/logo.jpg?h=745c1fb457de9bc4bffe9fe91d5cbea2" alt="VOG Ministries" style="max-width:120px;" />
            <h2 style="color:#663399;margin-top:10px;">VOG Ministries</h2>
          </div>

          <h3 style="color:#444;">📬 New Contact Form Submission</h3>
          <table style="width:100%;margin-top:10px;">
            <tr>
              <td style="padding:8px 0;"><strong>Name:</strong></td>
              <td>${name}</td>
            </tr>
            <tr>
              <td style="padding:8px 0;"><strong>Email:</strong></td>
              <td>${email}</td>
            </tr>
            <tr>
              <td style="padding:8px 0;"><strong>Phone:</strong></td>
              <td>${phone || 'Not provided'}</td>
            </tr>
          </table>

          <div style="margin-top:20px;">
            <p><strong>Message:</strong></p>
            <div style="background:#f9f9f9;border-left:4px solid #663399;padding:10px;margin:10px 0;">
              ${message || 'No message content'}
            </div>
          </div>

          <p style="font-size:0.9em;color:#999;">Submitted on ${new Date().toLocaleString()}</p>
        </div>
      `,
    });

    res.status(200).json({ success: true, message: 'Email sent successfully' });
  } catch (error) {
    console.error('Error sending email:', error);
    res.status(500).json({ success: false, message: 'Failed to send email', error: error.message });
  }
});

app.post('/api/newsletter', async (req, res) => {
  const { email } = req.body;

  if (!email) {
    return res.status(400).json({ error: 'Please provide an email address' });
  }

  try {
    await emailService.sendEmail({
      from: email,
      fromName: 'Newsletter Subscription',
      subject: 'New Newsletter Subscription - VOG Ministries',
      message: `
        <div style="max-width:600px;margin:auto;border:1px solid #eee;padding:20px;font-family:sans-serif;color:#333;">
          <div style="text-align:center;margin-bottom:20px;">
            <img src="https://thevogministries.org/assets/img/logo.jpg?h=745c1fb457de9bc4bffe9fe91d5cbea2" alt="VOG Ministries" style="max-width:120px;" />
            <h2 style="color:#663399;margin-top:10px;">VOG Ministries</h2>
          </div>

          <h3 style="color:#444;">📰 New Newsletter Subscription</h3>
          <p><strong>Email:</strong> ${email}</p>

          <p style="margin-top:20px;">Please add this email to the subscription list.</p>
          <p style="font-size:0.9em;color:#999;">Submitted on ${new Date().toLocaleString()}</p>
        </div>
      `,
    });

    res.status(200).json({ success: true, message: 'Subscription successful' });
  } catch (error) {
    console.error('Error processing subscription:', error);
    res.status(500).json({ success: false, message: 'Failed to process subscription', error: error.message });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
