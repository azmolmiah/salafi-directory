var setTime = new Date("January 31 1980 14:30");
var bdTime = new Date(setTime).toLocaleString("en-US", {
  timeZone: "America/New_York",
});
var finDate = new Date(bdTime);
console.log(`currentTime: ${finDate.getHours()} : ${finDate.getMinutes()}`);
