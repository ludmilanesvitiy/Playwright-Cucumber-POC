// var imaps = require('imap-simple');
// const env = require('dotenv');
// env.load({path: '../.env'});
//
// var config = {
//     imap: {
//         user: process.env.GMAIL_USER,
//         password: process.env.GMAIL_PASS,
//         host: 'imap.gmail.com',
//         port: 993,
//         tls: true,
//         authTimeout: 3000
//     }
// };
//
// export function getLinkFromEmailBody(domain: string, markSeen = true) {
//     return imaps.connect(config).then(function(connection) {
//         return connection.openBox('INBOX').then(function() {
//             var searchCriteria = [
//                 'UNSEEN', ['from', `test.support@${domain}.domain.com`]
//             ];
//
//             var fetchOptions = {
//                 bodies: ['TEXT'],
//                 markSeen: markSeen
//             };
//
//             return connection.search(searchCriteria, fetchOptions).then(function(res) {
//                 const body = res[0].parts[0].body;
//                 console.log(body);
//                 const link = body.split('<a href=3D"')[1].split('" target=3D"_blank"')[0].replace(/(=\r\n|=\n|=\r)/gm, "").replace('3D', '');
//                 return link;
//             });
//         });
//     });
// }
//
// export function getEmailNotificationBody(domain: string, markSeen = true, subject = '') {
//     return imaps.connect(config).then(function(connection) {
//         return connection.openBox('INBOX').then(function() {
//             var searchCriteria = [
//                 'UNSEEN', ['from', `test.support@${domain}.domain.com`], ['subject', subject]
//             ];
//
//             var fetchOptions = {
//                 bodies: ['HEADER', 'TEXT'],
//                 markSeen: markSeen
//             };
//
//             return connection.search(searchCriteria, fetchOptions).then(function(res) {
//                 console.log(res[0].parts[0].body);
//                 console.log(res[0].parts[1].body);
//                 return {body: res[0].parts[0].body, subject: res[0].parts[1].body.subject};
//             });
//         });
//     });
// }