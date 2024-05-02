const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
dotenv.config();

const genneralAccessToken = async (payload) => {
  const access_token = jwt.sign(
    {
      ...payload,
    },
    process.env.ACCESS_TOKEN,
    { expiresIn: "1h" }
  );
  return access_token;
};

const genneralRefreshToken = async (payload) => {
  const access_token = jwt.sign(
    {
      ...payload,
    },
    process.env.REFRESH_TOKEN,
    { expiresIn: "365d" }
  );
  return access_token;
};

const RefreshToken = async (token) => {
  return new Promise((resolve, reject) => {
    try {
      jwt.verify(token, process.env.REFRESH_TOKEN, async (err, user) => {
        if (err) {
          console.log(err);
          resolve({
            status: "Err",
            message: "The authencation",
          });
        }
        const refresh_token = await genneralAccessToken({
          id: user.id,
          isAdmin: user.isAdmin,
        });

        resolve({
          status: "OK",
          message: "Refresh token",
          access_token: refresh_token,
        });
      });
    } catch (err) {
      console.log(err);
      reject(err);
    }
  });
};

module.exports = {
  genneralAccessToken,
  genneralRefreshToken,
  RefreshToken,
};
