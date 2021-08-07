const functions = require("firebase-functions");

// // Create and Deploy Your First Cloud Functions
// // https://firebase.google.com/docs/functions/write-firebase-functions
//
const { GraphQLClient, gql } = require('graphql-request')



const hasuraKeys = functions.config().hasura;
const endpoint = hasuraKeys.endpoint
const password = hasuraKeys.password

const graphQLClient = new GraphQLClient(endpoint, {
    headers: {
      "x-hasura-admin-secret": password,
    },
  })



const mailTransport = require("./helpers/mailTransport");
const getMailTransport = mailTransport.getMailTransport;
const gmailEmail = "admin@overbooked.in";


const sentWelcomeEmailToUser = gql`
mutation MyMutation($uid: String!) {
    update_Users_by_pk(pk_columns: {uid: $uid}, _set: {sent_welcome_email: true}) {
      uid
    }
  }  
`

const getUserDataByID = gql`
query MyQuery($uid: String!) {
    Users_by_pk(uid: $uid) {
      name
      email
      phone_number
      notification_email
      notification_phone
    }
  }
`

const getBookData = gql`
query MyQuery($id: Int!) {
    Books_by_pk(id: $id) {
      id
      name
      User {
        name
        email
        phone_number
        notification_email
        notification_phone
      }
    }
  }  
`

exports.welcome_user = functions.https.onRequest(async (request, response) => {
  if (request.get("webhook_password") !== hasuraKeys.webhook_password) {
    return response.status(404).send();
  }

    const newValue = request.body.event.data.new

    if (newValue.uid && newValue.name && newValue.email && !newValue.sent_welcome_email && newValue.new_user) {

        const emailTemplate = require('./emails/welcome_email');

        const mailOptions = {
            from: `Overbooked <${gmailEmail}>`,
            to: newValue.email,
            subject: "Welcome to Overbooked!",
            html: emailTemplate.template(newValue.name)
        };

        const nodeMailTransport = await getMailTransport()
        nodeMailTransport.sendMail(mailOptions);

        await graphQLClient.request(sentWelcomeEmailToUser, {uid: newValue.uid})
        return response.send("sent");
    }

    response.send("No send");
});


exports.book_uploaded_for_review = functions.https.onRequest(async (request, response) => {
    if (request.get("webhook_password") !== hasuraKeys.webhook_password) {
      return response.status(404).send();
    }
  
      const newValue = request.body.event.data.new

      if (newValue.approved) {return response.send("No send, book approved");}

      const userData = (await graphQLClient.request(getUserDataByID, {uid: newValue.user_id})).Users_by_pk

      const userName  = userData.name
      const userEmail  = userData.email

      const bookName = newValue.name
      const mailOptions = {
        from: `Overbooked <${gmailEmail}>`,
        to: userEmail,
      }

      let emailTemplate = null;
  
      if (newValue.approved === null) {
        emailTemplate = require('./emails/book_uploaded');
        mailOptions["subject"] = bookName+" Uploaded!"
  
      } else  {
        mailOptions["subject"] = bookName+" Rejected :(",
        emailTemplate = require('./emails/book_rejected');
      }

    mailOptions["html"] = emailTemplate.template(userName.trim(), bookName)
    const nodeMailTransport = await getMailTransport()
    nodeMailTransport.sendMail(mailOptions);
  
    return response.send("sent book uploaded email");
  
});

exports.book_requested = functions.https.onRequest(async (request, response) => {
    if (request.get("webhook_password") !== hasuraKeys.webhook_password) {
      return response.status(404).send();
    }
  
    const newValue = request.body.event.data.new

    const requesterData = (await graphQLClient.request(getUserDataByID, {uid: newValue.user_id})).Users_by_pk
    const bookData = (await graphQLClient.request(getBookData, {id: newValue.book_id})).Books_by_pk
  
    const emailTemplate = require('./emails/book_requested');

    const mailOptions = {
        from: `Overbooked <${gmailEmail}>`,
        to: bookData.User.email,
        subject: bookData.name + " has been requested!",
        html: emailTemplate.template(bookData.User.name.trim(), bookData.name, requesterData.name.trim())
    };

    const nodeMailTransport = await getMailTransport()
    nodeMailTransport.sendMail(mailOptions);

    return response.send("sent");
});


exports.book_request_approved = functions.https.onRequest(async (request, response) => {
    if (request.get("webhook_password") !== hasuraKeys.webhook_password) {
      return response.status(404).send();
    }
  
    const newValue = request.body.event.data.new

    if (!newValue.approved) {return response.send("no send")}

    const requesterData = (await graphQLClient.request(getUserDataByID, {uid: newValue.user_id})).Users_by_pk
    const bookData = (await graphQLClient.request(getBookData, {id: newValue.book_id})).Books_by_pk
  
    const emailTemplate_owner = require('./emails/book_request_approved_owner');
    const emailTemplate_requester = require('./emails/book_request_approved_requester');

    const mailOptions_owner = {
        from: `Overbooked <${gmailEmail}>`,
        to: bookData.User.email,
        subject: bookData.name + " request approved!",
        html: emailTemplate_owner.template(bookData.User.name.trim(), bookData.name, requesterData.name, 
            requesterData.notification_email ? requesterData.email : "Not shared",
            requesterData.notification_phone ? requesterData.phone_number : "Not shared")
    };
    const mailOptions_requester = {
        from: `Overbooked <${gmailEmail}>`,
        to: requesterData.email,
        subject: bookData.name + " request approved!",
        html: emailTemplate_requester.template(requesterData.name.trim(), bookData.name, bookData.User.name,
            bookData.User.notification_email ? bookData.User.email : "Not shared",
            bookData.User.notification_phone ? bookData.User.phone_number : "Not shared")
    };

    const nodeMailTransport = await getMailTransport()
    nodeMailTransport.sendMail(mailOptions_owner);
    nodeMailTransport.sendMail(mailOptions_requester);

    return response.send("sent");
});

