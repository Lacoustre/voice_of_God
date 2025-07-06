# Phone Messaging Setup Guide

## Overview
This system now supports sending SMS messages to church members when announcements are created. Messages are sent to members based on their assigned groups.

## Twilio Setup

### 1. Create Twilio Account
1. Go to [Twilio Console](https://console.twilio.com/)
2. Sign up for a free account
3. Verify your phone number

### 2. Get Twilio Credentials
1. From the Twilio Console Dashboard, copy:
   - **Account SID**
   - **Auth Token**
2. Go to Phone Numbers → Manage → Buy a number
3. Purchase a phone number for sending SMS

### 3. Configure Environment Variables
Update your `.env` file in the backend folder:

```env
# Replace with your actual Twilio credentials
TWILIO_ACCOUNT_SID=your_actual_account_sid_here
TWILIO_AUTH_TOKEN=your_actual_auth_token_here
TWILIO_PHONE_NUMBER=+1234567890  # Your Twilio phone number
```

## How It Works

### Automatic SMS on Announcement Creation
- When creating an announcement with target groups (other than "website"), SMS messages are automatically sent
- Messages are sent to approved members who belong to the specified target groups
- The system filters out members without phone numbers

### Manual SMS Sending
- Admins can manually send SMS for existing announcements using the "Send SMS" button
- Button appears only for admins and announcements with valid target groups
- Shows sending status and confirmation messages

### Message Format
```
[Announcement Title]

[Announcement Content]

- Voice of God Church
```

### Target Groups
- Members must be assigned to groups that match the announcement's target groups
- Phone numbers are automatically formatted (adds +1 country code if missing)
- Only approved members receive messages

## Member Requirements
For members to receive SMS messages, they must have:
1. A valid phone number in their profile
2. Be assigned to the target group(s)
3. Have approved status in the system

## Testing
1. Ensure Twilio credentials are correctly set
2. Create a test member with your phone number
3. Assign the member to a test group
4. Create an announcement targeting that group
5. Check if SMS is received

## Troubleshooting

### Common Issues
1. **SMS not sending**: Check Twilio credentials and phone number format
2. **No members receiving SMS**: Verify members are approved and in target groups
3. **Invalid phone numbers**: Ensure phone numbers are in correct format

### Logs
Check server console for detailed SMS sending logs and error messages.

## Cost Considerations
- Twilio charges per SMS sent
- Free tier includes some free messages
- Monitor usage in Twilio Console
- Consider implementing rate limiting for production use