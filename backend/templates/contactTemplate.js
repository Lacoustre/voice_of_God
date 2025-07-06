module.exports = ({ name, email, phone, message }) => `
  <div style="max-width:600px;margin:auto;border:1px solid #eee;padding:20px;font-family:sans-serif;color:#333;">
    <div style="text-align:center;margin-bottom:20px;">
      <img src="https://thevogministries.org/assets/img/logo.jpg?h=745c1fb457de9bc4bffe9fe91d5cbea2" alt="VOG Ministries" style="max-width:120px;" />
      <h2 style="color:#663399;margin-top:10px;">VOG Ministries</h2>
    </div>
    <h3 style="color:#444;">📬 New Contact Form Submission</h3>
    <table style="width:100%;margin-top:10px;">
      <tr><td style="padding:8px 0;"><strong>Name:</strong></td><td>${name}</td></tr>
      <tr><td style="padding:8px 0;"><strong>Email:</strong></td><td>${email}</td></tr>
      <tr><td style="padding:8px 0;"><strong>Phone:</strong></td><td>${phone || 'Not provided'}</td></tr>
    </table>
    <div style="margin-top:20px;">
      <p><strong>Message:</strong></p>
      <div style="background:#f9f9f9;border-left:4px solid #663399;padding:10px;margin:10px 0;">
        ${message || 'No message content'}
      </div>
    </div>
    <p style="font-size:0.9em;color:#999;">Submitted on ${new Date().toLocaleString()}</p>
  </div>
`;
