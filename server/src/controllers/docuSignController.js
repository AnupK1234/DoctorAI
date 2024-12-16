const axios = require("axios");
const moment = require("moment");

let tokenData = {
  accessToken: null,
  refreshToken:
    "eyJ0eXAiOiJNVCIsImFsZyI6IlJTMjU2Iiwia2lkIjoiNjgxODVmZjEtNGU1MS00Y2U5LWFmMWMtNjg5ODEyMjAzMzE3In0.AQoAAAABAAgABwCAFlPb_x3dSAgAgJa305I13UgCAAhYEjuCwx9ChVLQ9mh_uikVAAEAAAAYAAEAAAAFAAAADQAkAAAAMjhlNGQ4MWMtMzIyZS00NzYwLThiNjItMmU5ODMyMjkyYmExIgAkAAAAMjhlNGQ4MWMtMzIyZS00NzYwLThiNjItMmU5ODMyMjkyYmExMAAAaR65jBrdSDcAFUClA74_NEOPhZemZGvCkw.rRr_T62O2wMgJqrgSVwAfng54soQY5VO-0q_PfMzudf64t6vb_4uFdzHxnGJ_7ZH7z09ewFDnbokttg9NC3cX-X2tzBQYnPEFUfdsZgXRbKQ2E5S1fCpAkRw8KEZkxc8Sv3C8xLXJT9bBVr6TqS-DT6ddOct2Xfibh7zU0YGGPSZrlypvCbh96W6j5W4f1fa86-ZI-OPMI_8DuA6Yo8wSQq_jA8gtsE42WAlBoW183m2g4cK4V66Xfh9HXaHjaRfE1svDNgvUF1OVF4onySYpeT1fAlsYxhVdQt12Qo9ROKakej2vYD6_3fitE-v4xdSDKQpysIrGFLDhcmAc-vS3A",
  expiresAt: null,
};

/**
 * Refresh the access token if expired or close to expiry.
 */
const getAccessToken = async () => {
  // Check if token is valid or close to expiration
  if (
    tokenData.accessToken &&
    tokenData.expiresAt &&
    moment().isBefore(tokenData.expiresAt)
  ) {
    console.log("Access token is still valid.");
    return tokenData.accessToken;
  }

  // If the token has expired or is invalid, refresh it
  console.log("Refreshing access token...");

  try {
    const response = await axios.post(
      "https://account-d.docusign.com/oauth/token",
      new URLSearchParams({
        grant_type: "refresh_token",
        refresh_token: tokenData.refreshToken,
      }),
      {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
          Authorization: `Basic ${Buffer.from(
            `${process.env.INTEGRATION_KEY}:${process.env.SECRET_KEY}`
          ).toString("base64")}`, // Replace with your integration key and secret
        },
      }
    );

    const { access_token, expires_in, refresh_token } = response.data;

    // Update token data
    tokenData.accessToken = access_token;
    tokenData.refreshToken = refresh_token || tokenData.refreshToken; // Refresh token might not always change
    tokenData.expiresAt = moment().add(expires_in, "seconds"); // Set new expiration time

    console.log("New access token obtained.");
    return tokenData.accessToken;
  } catch (err) {
    console.error(
      "Error refreshing access token:",
      err.response?.data || err.message
    );
    throw new Error("Failed to refresh access token.");
  }
};

module.exports = { getAccessToken };
