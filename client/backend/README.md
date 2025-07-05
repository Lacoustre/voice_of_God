# VOG Email Server

This is a simple backend server for handling email functionality for the Voice of God Ministries website.

## Setup Instructions

1. Install dependencies:
   ```
   npm install
   ```

2. Configure your email service:
   - Edit the `.env` file with your email configuration
   - The default recipient is set to INFO@THEVOGMINISTRIES.ORG

3. Start the server:
   ```
   npm start
   ```
   
   For development with auto-restart:
   ```
   npm run dev
   ```

## Important Notes

- For production use, you should implement a proper email service like SendGrid, Mailgun, or AWS SES
- The current implementation is a simplified version for demonstration purposes
- In a real-world scenario, you would need to set up proper email authentication

## API Endpoints

- `POST /api/contact` - Send contact form emails
- `POST /api/newsletter` - Subscribe to newsletter (forwards to contact endpoint)

## Environment Variables

- `EMAIL_TO` - The recipient email address
- `PORT` - The port the server runs on (default: 5000)