module.exports = ({ email }) => `
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
`;
