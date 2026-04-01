import admin from "firebase-admin";

let app;

export const initializeFirebase = () => {
  if (app || !process.env.FCM_PROJECT_ID || !process.env.FCM_CLIENT_EMAIL || !process.env.FCM_PRIVATE_KEY) {
    return app;
  }

  app = admin.initializeApp({
    credential: admin.credential.cert({
      projectId: process.env.FCM_PROJECT_ID,
      clientEmail: process.env.FCM_CLIENT_EMAIL,
      privateKey: process.env.FCM_PRIVATE_KEY.replace(/\\n/g, "\n")
    })
  });

  return app;
};

export const sendPushNotification = async ({ tokens = [], title, body, data = {} }) => {
  if (!tokens.length) return null;
  initializeFirebase();
  if (!app) return null;

  return admin.messaging().sendEachForMulticast({
    tokens,
    notification: { title, body },
    data
  });
};
