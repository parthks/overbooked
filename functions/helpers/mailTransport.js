const nodemailer = require('nodemailer');

const { google } = require("googleapis");



const gmailEmail = "admin@overbooked.in"



exports.getMailTransport = async function initializeMailTransport() {

    const OAuth2 = google.auth.OAuth2;
    const clientID = "376098439791-dfjdgit8okorcfb4dnrn8g2snr6ckmej.apps.googleusercontent.com";
    const clientSecret = "kgJw79w-fDT-W_tWXz5tEsaD";
    const refreshToken = "1//04unIobVCPD5RCgYIARAAGAQSNwF-L9IrBU7TTuVoPkjmXN6ReNakljNZOIcM51zdP0eemK-7D3W8O40txwNNxoS4w8Xyyvw38Hc"
  
    const oauth2Client = new OAuth2(
      clientID, //client Id
      clientSecret, // Client Secret
      "https://developers.google.com/oauthplayground" // Redirect URL
    );
  
    oauth2Client.setCredentials({
      refresh_token: refreshToken
    });
  
    // const tokens = await oauth2Client.refreshAccessToken();
    // const accessToken = tokens.credentials.access_token;
    const accessToken = oauth2Client.getAccessToken()


  
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