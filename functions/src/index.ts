/**
 * Import function triggers from their respective submodules:
 *
 * import {onCall} from "firebase-functions/v2/https";
 * import {onDocumentWritten} from "firebase-functions/v2/firestore";
 *
 * See a full list of supported triggers at https://firebase.google.com/docs/functions
 */

import functions = require('firebase-functions');
import admin = require('firebase-admin');
admin.initializeApp();

// Start writing functions
// https://firebase.google.com/docs/functions/typescript

const nodemailer = require("nodemailer");
const gmailEmail = functions.config().email.user;
const gmailPassword = functions.config().email.pass;
// Email transport configuration using Gmail SMTP (you can also use other providers)
const transporter = nodemailer.createTransport({
  service: "gmail", // You can use other services such as Outlook, Yahoo, etc.
  auth: {
    user: gmailEmail, 
    pass: gmailPassword,  
  },
});

exports.sendBlockedSiteNotification = functions.https.onCall((data, context) => {
    const url = data.url;
    const userEmail = data.userEmail;
    const moderators = data.moderators;
    const userId = context.auth!.uid; // Get the user's ID if authenticated
    
    console.log(`User ${userId} attempted to access blocked site: ${url}`);
  
    // You can now trigger any notification logic here, such as sending an email, push notification, or logging it in Firestore.
    const mailOptions = {
        from: "hallcoder25@gmail.com",        // Sender email
        to: moderators,                           // Recipient email
        subject: "Blocked Site Access Attempt", // Email subject
        text: `${userEmail} tried to access a blocked site: ${url}`, // Email body
      };

    return transporter.sendMail(mailOptions)
    .then(() => {
      console.log("Email sent successfully to", moderators);
      return { success: true };
    })
    .catch((error:any) => {
      console.error("Error sending email:", error);
      throw new functions.https.HttpsError('internal', 'Failed to send email');
    });
  });