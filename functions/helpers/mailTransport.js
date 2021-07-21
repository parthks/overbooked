const nodemailer = require('nodemailer');

const { google } = require("googleapis");



const gmailEmail = "admin@overbooked.in"



exports.getMailTransport = async function initializeMailTransport() {

    const OAuth2 = google.auth.OAuth2;
    const clientID = "57306778842-4g0vptpp5g7eg9jfajkapkegfdd4hhtu.apps.googleusercontent.com";
    const clientSecret = "o4hLJ2M5nwSidzA_6_1ekXD6";
    const refreshToken = "1//04UQ2yxHNw1NICgYIARAAGAQSNwF-L9Iris0b1NNKYk-Xj1I-VCyENXz11IACpJVpRd7lORhbnPakAUPZNKemXe8vTJlLhG381WU"
  
    const oauth2Client = new OAuth2(
      clientID, //client Id
      clientSecret, // Client Secret
      "https://developers.google.com/oauthplayground" // Redirect URL
    );
  
    oauth2Client.setCredentials({
      refresh_token: refreshToken
    });
  
    const tokens = await oauth2Client.refreshAccessToken();
    const accessToken = tokens.credentials.access_token;
  
    // const cors = require('cors')({origin: true});
  
    const mailTransport = nodemailer.createTransport({
      service: "gmail",
      auth: {
        type: "OAuth2",
        user: gmailEmail,
        clientId: clientID,
        clientSecret: clientSecret,
        refreshToken: refreshToken,
        accessToken: accessToken
      }
    });
    return mailTransport
}