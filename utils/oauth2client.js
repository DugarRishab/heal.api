const { google } = require('googleapis');

/**
 * To use OAuth2 authentication, we need access to a CLIENT_ID, CLIENT_SECRET, AND REDIRECT_URI
 * from the client_secret.json file. To get these credentials for your application, visit
 * https://console.cloud.google.com/apis/credentials.
 */
const GOOGLE_CLIENT_ID = "163584497548-6uovpebrvioqdepje90dinuagvi60ulc.apps.googleusercontent.com";
const GOOGLE_CLIENT_SECRET = "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";

exports.oauth2Client = new google.auth.OAuth2(
    GOOGLE_CLIENT_ID,
    GOOGLE_CLIENT_SECRET,
    'postmessage'
);
