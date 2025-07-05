const twilio = require('twilio');
const sdk = require("node-appwrite");

const client = new sdk.Client()
  .setEndpoint(process.env.APPWRITE_ENDPOINT)
  .setProject(process.env.APPWRITE_PROJECT_ID)
  .setKey(process.env.APPWRITE_API_KEY);

const databases = new sdk.Databases(client);

// Initialize Twilio client
const twilioClient = twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);

const MEMBERS_COLLECTION_ID = "685fa34f0029a39d29fc";

/**
 * Send SMS messages to members in target groups
 * @param {string} title - Announcement title
 * @param {string} message - Announcement message
 * @param {string} targetGroups - Comma-separated target groups
 */
const sendPhoneMessages = async (title, message, targetGroups) => {
  try {
    if (!targetGroups || targetGroups.toLowerCase() === 'website') {
      console.log('No phone target groups specified');
      return { success: true, sent: 0, message: 'No phone groups targeted' };
    }

    // Parse target groups
    const groups = targetGroups.split(',').map(group => group.trim().toLowerCase());
    
    // Filter out 'website' from groups for phone messaging
    const phoneGroups = groups.filter(group => group !== 'website');
    
    if (phoneGroups.length === 0) {
      console.log('No phone target groups after filtering');
      return { success: true, sent: 0, message: 'No phone groups after filtering' };
    }

    // Fetch members from database
    const membersResponse = await databases.listDocuments(
      process.env.APPWRITE_DATABASE_ID,
      MEMBERS_COLLECTION_ID
    );

    const members = membersResponse.documents;
    
    // Filter members by target groups and ensure they have phone numbers
    const targetMembers = members.filter(member => {
      if (!member.phone || !member.approved) return false;
      
      // Check if member belongs to any of the target groups
      const memberGroups = Array.isArray(member.groups) 
        ? member.groups.map(g => g.toLowerCase().replace(/['']/g, '').replace(/\s+/g, ' ').trim())
        : (member.groups || '').split(',').map(g => g.trim().toLowerCase().replace(/['']/g, '').replace(/\s+/g, ' ').trim());
      
      return phoneGroups.some(targetGroup => {
        // Normalize target group for comparison
        const normalizedTarget = targetGroup.replace(/['']/g, '').replace(/\s+/g, ' ').trim();
        return memberGroups.some(memberGroup => {
          // Exact match
          if (memberGroup === normalizedTarget) return true;
          
          // Handle singular/plural variations
          const targetWords = normalizedTarget.split(' ');
          const memberWords = memberGroup.split(' ');
          
          // Check if all significant words match (ignoring 's' endings)
          if (targetWords.length === memberWords.length) {
            const wordsMatch = targetWords.every((targetWord, i) => {
              const memberWord = memberWords[i];
              // Direct match
              if (targetWord === memberWord) return true;
              // Singular/plural match (remove 's' from end)
              const targetBase = targetWord.replace(/s$/, '');
              const memberBase = memberWord.replace(/s$/, '');
              return targetBase === memberBase && targetBase.length > 2;
            });
            if (wordsMatch) return true;
          }
          
          // Fallback: partial matching
          return memberGroup.includes(normalizedTarget) || normalizedTarget.includes(memberGroup);
        });
      });
    });

    if (targetMembers.length === 0) {
      console.log('No members found for target groups:', phoneGroups);
      return { success: true, sent: 0, message: 'No members found for target groups' };
    }

    // Format the SMS message
    const smsMessage = `${title}\n\n${message}\n\n- Voice of God Church`;

    // Send SMS to each target member
    const sendPromises = targetMembers.map(async (member) => {
      try {
        // Clean phone number (remove any non-digit characters except +)
        let phoneNumber = member.phone.replace(/[^\d+]/g, '');
        
        // Add country code if not present (assuming US +1)
        if (!phoneNumber.startsWith('+')) {
          phoneNumber = '+1' + phoneNumber;
        }

        const result = await twilioClient.messages.create({
          body: smsMessage,
          from: process.env.TWILIO_PHONE_NUMBER,
          to: phoneNumber
        });

        console.log(`SMS sent to ${member.name} (${phoneNumber}): ${result.sid}`);
        return { success: true, member: member.name, phone: phoneNumber, sid: result.sid };
      } catch (error) {
        console.error(`Failed to send SMS to ${member.name} (${member.phone}):`, error.message);
        return { success: false, member: member.name, phone: member.phone, error: error.message };
      }
    });

    const results = await Promise.all(sendPromises);
    const successful = results.filter(r => r.success);
    const failed = results.filter(r => !r.success);

    console.log(`SMS Summary: ${successful.length} sent, ${failed.length} failed`);
    
    return {
      success: true,
      sent: successful.length,
      failed: failed.length,
      results: results,
      message: `SMS sent to ${successful.length} members`
    };

  } catch (error) {
    console.error('Error in sendPhoneMessages:', error);
    return {
      success: false,
      error: error.message,
      sent: 0
    };
  }
};

module.exports = {
  sendPhoneMessages
};