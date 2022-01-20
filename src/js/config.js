let url = process.env.VUE_APP_URL || "";

if (typeof window.meedu_app_url !== "undefined" && window.meedu_app_url) {
  url = window.meedu_app_url;
}

let url2 = "https://api2.camec.sdyougao.com";
//let url2 = "https://localhost:44359/";

export default {
  url: url,
  url2: url2,
  version: "v4.5.4",
};
