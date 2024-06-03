importScripts("https://www.gstatic.com/firebasejs/8.8.0/firebase-app.js");
importScripts("https://www.gstatic.com/firebasejs/8.8.0/firebase-messaging.js");

const firebaseConfig = {
  apiKey: "AIzaSyDbw15pdmae6rnpwYkCXlTuIq1AJahmsyg",
  authDomain: "gachi-myeonjeob.firebaseapp.com",
  projectId: "gachi-myeonjeob",
  storageBucket: "gachi-myeonjeob.appspot.com",
  messagingSenderId: "1013024533440",
  appId: "1:1013024533440:web:e5a6157dcf86451c4cb625",
  measurementId: "G-8529WYLE5Y",
};

firebase.initializeApp(firebaseConfig);

const messaging = firebase.messaging();

messaging.onBackgroundMessage((payload) => {
  console.log("[firebase-messaging-sw.js] Received background message ", payload);
  const notificationTitle = payload.notification.title;
  const notificationOptions = {
    body: payload.notification.body,
    icon: payload.notification.image,
  };
  self.registration.showNotification(notificationTitle, notificationOptions);
});

self.addEventListener("push", async (event) => {
  console.log("push");
  console.log(event);
  try {
    const res = await fetch(`http://52.78.111.188:8080/alert`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
    });
    return await res.json();
  } catch (error) {
    console.error("Failed to fetch data:", error);
    throw new Error("Failed to fetch data");
  }
});
