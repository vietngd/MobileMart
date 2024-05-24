const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
dotenv.config();

const calculateAverageRating = (ratingCounts) => {
  let totalRatings = 0;
  let totalStars = 0;

  for (let star in ratingCounts) {
    let count = ratingCounts[star];
    totalRatings += count;
    totalStars += star * count;
  }

  if (totalRatings === 0) {
    return 0; // Nếu không có đánh giá nào thì trả về 0
  }

  let averageRating = totalStars / totalRatings;
  return Number.isInteger(averageRating)
    ? averageRating
    : averageRating.toFixed(1);
};
const RandomCode = () => {
  let randomString = "";
  for (let i = 0; i < 6; i++) {
    const randomNumber = Math.floor(Math.random() * 10); // Sinh số ngẫu nhiên từ 0 đến 9
    randomString += randomNumber.toString(); // Chuyển số thành chuỗi và ghép vào chuỗi kết quả
  }
  return randomString;
};

const genneralCodeJWT = (code) => {
  const codeJWT = jwt.sign(
    {
      code,
    },
    process.env.VERIFY_KEY,
    { expiresIn: "60s" }
  );

  return codeJWT;
};
module.exports = { calculateAverageRating, RandomCode, genneralCodeJWT };
