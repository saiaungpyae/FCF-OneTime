const functions = require('firebase-functions');
const admin = require('firebase-admin');

admin.initializeApp();

exports.sendNotiToJobPoster = functions.database.ref('/jobPosts/{jobPostId}/applicants/{applicantId}')
  .onCreate((snapshot, context) => {
  const jobPostId = context.params.jobPostId;
  const applicantId = context.params.applicantId;
  const applicantName = snapshot.val().name;
  return admin.database()
  .ref(`/jobPosts/${jobPostId}/ownerId`).once('value')
  .then(posterSnapshot => {
    const posterId = posterSnapshot.val();

    return admin.database().ref('notifications/').push({
      title: "သင့္အား အလုပ္အပ္ရန္ ေရြးခ်ယ္လိုက္ပါျပီ",
      name : applicantName,
      type : "poster",
      jobPostId   : jobPostId,
      ownerId : posterId,
      referenceId : applicantId,
      unread : true,
      createdAt : Date.now()
    });

    // const getDeviceTokensPromise = admin.database()
    // .ref(`/users/${posterId}/notificationTokens`).once('value');
    // const getApplicantPromise = admin.database()
    // .ref(`/users/${applicantId}`).once('value');

  //   let tokensSnapshot;
  //   let tokens;

  //   return Promise.all([getDeviceTokensPromise, getApplicantPromise]).then(results => {
  //     tokensSnapshot = results[0];
  //     const applicant = results[1];
  //     const applicantName = applicant.name;

  //     const payload = {
  //       notification: {
  //         title: `${applicantName} has applied your job.`,
  //         type : "poster",
  //         jobPostId   : jobPostId,
  //         ownerId : "posterId",
  //         referenceId : "seekerID"
  //       }
  //     };

  //     tokens = Object.keys(tokensSnapshot.val());
  //     return admin.messaging().sendToDevice(tokens, payload)
  //   }).then(response => {
  //     const tokensToRemove = [];
  //     response.results.forEach((result, index) => {
  //       const error = result.error;
  //       if (error) {
  //         console.error('Failure sending notification to', tokens[index], error);
  //         if (error.code === 'messaging/invalid-registration-token' ||
  //             error.code === 'messaging/registration-token-not-registered') {
  //           tokensToRemove.push(tokensSnapshot.ref.child(tokens[index]).remove());
  //         }
  //       }
  //     });

  //     if( tokensToRemove.length == 0) {
  //       admin.database().ref('notifications/').push({
  //         title: `Someone has applied your job.`,
  //         type : "poster",
  //         jobPostId   : jobPostId,
  //         ownerId : "posterId",
  //         referenceId : "seekerID"
  //       });
  //     }
  //     return Promise.all(tokensToRemove);
  //   });
  });
});


exports.sendNotiToApplicant = functions.database.ref('/jobPosts/{jobPostId}/applicants/{applicantId}/chosen')
.onUpdate((change, context) => {

  const jobPostId = context.params.jobPostId;
  const applicantId = context.params.applicantId;

  return admin.database()
  .ref(`/jobPosts/${jobPostId}`).once('value')
  .then(snapshot => {
    snapshot = snapshot.val();
    const posterId = snapshot.ownerId;
    const posterName = snapshot.ownerName;
    // return admin.database()
    // .ref(`/users/${ownerId}/ownerId`).once('value')
    // .then({

    // })
    return admin.database().ref('notifications/').push({
      title: "သင့္အလုပ္အား ေရြးခ်ယ္သူ တစ္ေယာက္ရွိပါသည္",
      name : posterName,
      type : "seeker",
      jobPostId   : jobPostId,
      ownerId : applicantId,
      referenceId : posterId,
      unread : true,
      createdAt : Date.now()
    });
  })
}); //remove
  // return Promise.all([getDeviceTokensPromise, getApplicantPromise]).then(results => {
  //   const tokens = results[0];
  //   const applicant = results[1];

  //   const payload = {
  //     notification: {
  //       title: "The job you applied has now chosen by someone",
  //       type : "seeker",
  //       jobpostid   : "jobpostID",
  //       ownerid : "seekerID",
  //       referenceid : "posterId"
  //     }
  //   };

  //   const tokens = Object.keys(tokensSnapshot.val());

    // return admin.messaging().sendToDevice(tokens, payload);
    // }).then(response => {
    //   const tokensToRemove = [];
    //   response.results.forEach((result, index) => {
    //     const error = result.error;
    //     if (error) {
    //       console.error('Failure sending notification to', tokens[index], error);
    //       if (error.code === 'messaging/invalid-registration-token' ||
    //           error.code === 'messaging/registration-token-not-registered') {
    //         tokensToRemove.push(tokensSnapshot.ref.child(tokens[index]).remove());
    //       }
    //     }
    //   });

    //   if( tokensToRemove.length == 0) {
    //     admin.database().ref('notifications/').push({
    //       title: `Someone has applied your job.`,
    //       type : "poster",
    //       jobPostId   : jobPostId,
    //       ownerId : "posterId",
    //       referenceId : "seekerID"
    //     });
    //   }

    //   return Promise.all(tokensToRemove);
    // });
// });