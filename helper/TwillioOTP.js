const serviceID = "VA227c5736c0a5c9606e14ac50d33eccbc";
const accountSid = "AC0b4317002731c2fc4689a87782ad6662";
const authToken = "40c3dbac0b784572becc81494726067e";

const client = require('twilio')(accountSid, authToken);

const sendOtp = function sendOtp(to){
    return client.verify.services(serviceID)
        .verifications
        .create({to: to, channel: 'sms'})
}

const verifyOtp = function verifyOtp(phone, code){
    return client.verify.services(serviceID)
      .verificationChecks
      .create({to: phone, code: code})
}

module.exports = {
    sendOtp,
    verifyOtp
}