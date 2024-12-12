export function notifierRequest(message) {
  if (!("Notification" in window)) {
    // alert("This browser does not support desktop notification");
    showNotification(message);
  } else if (Notification.permission === "granted") {
    var notification = new Notification("ShotView", {
      lang: "en",
      body: message,
      icon: "../../src/icon/shotsview_logo.png",
      vibrate: [200, 100, 200], //200ms pause, 200ms,
      image: "png",
    });
  } else if (Notification.permission !== "denied") {
    Notification.requestPermission().then((permission) => {
      if (permission === "granted") {
        console.log("notifica in basso");
        const notification = new Notification("Hi there!");
      }
    });
  }
}

// android
function showNotification(message) {
  Notification.requestPermission().then((result) => {
    if (result === "granted") {
      navigator.serviceWorker.ready.then((registration) => {
        registration.showNotification("ShotView", {
          body: message,
          icon: "src/icon/shotsview_logo.png",
          vibrate: [200, 100, 200, 100, 200, 100, 200],
          tag: "vibration-sample",
        });
      });
    }
  });
}
