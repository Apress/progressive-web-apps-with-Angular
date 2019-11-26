// this is equivalent to following addEventistener
// self.oninstall = (event) => { };
self.addEventListener("install", event => {
  console.log("[SW.JS] Step 2, Server worker has been installed");
  console.log("Just added something;");
});

// this is equivalent to following addEventistener
// self.oninstall = (event) => { };
self.addEventListener("activate", event => {
  console.log("[SW.JS] Step 3, Server worker has been activated");
});
