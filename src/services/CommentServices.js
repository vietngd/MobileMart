const connection = require("../config/ConnectDB.js");

const createComment = (newComment) => {
  return new Promise((resolve, reject) => {
    const { product_id, content, name, phone, email, rating } = newComment;

    try {
      const sql =
        "INSERT INTO comments (product_id,content,rating,name,phone,email) VALUES (? , ? , ? , ? , ? , ?)";

      connection.query(
        sql,
        [product_id, content, rating, name, phone, email],
        (err, data) => {
          if (err) {
            console.log(err);
            resolve({
              status: "Err",
              message: "Thêm commnet thất bại",
              err,
            });
          }

          // Cập nhật total comment của product

          const sqlUpdateTotalComment = `UPDATE products SET total_comments = total_comments +1 WHERE id = ?`;
          connection.query(
            sqlUpdateTotalComment,
            [product_id],
            (err, dataProduct) => {
              if (err) {
                console.log(err);
                resolve({
                  status: "Err",
                  message: "Thêm commnet thất bại",
                  err,
                });
              }

              resolve({
                status: "OK",
                message: "Thêm commnet thành công",
              });
            }
          );
        }
      );
    } catch (err) {
      console.log(err);
      reject(err);
    }
  });
};

const getAllComment = (product_id, Page, PageSize) => {
  const startIndex = (Page - 1) * PageSize; // Tính startIndex cho trang hiện tại

  return new Promise((resolve, reject) => {
    try {
      let sql =
        "SELECT comments.id, comments.name, comments.phone, comments.created_at, comments.content, comments.rating, comment_replies.content AS reply_content, comment_replies.created_at AS created_at_reply, users.name AS admin_name, users.phone AS admin_phone FROM comments LEFT JOIN comment_replies ON comments.id = comment_replies.comment_id LEFT JOIN users ON comment_replies.user_id = users.id WHERE product_id = ? ORDER BY comments.created_at DESC LIMIT ?, ?";

      connection.query(
        sql,
        [product_id, startIndex, PageSize],
        (err, comments) => {
          if (err) {
            console.log(err);
            resolve({
              status: "Err",
              message: "Get comment thất bại",
              err,
            });
          }

          // Truy vấn tổng số lượng comments
          connection.query(
            "SELECT COUNT(*) AS totalCount FROM comments WHERE product_id = ?",
            [product_id],
            (err, data) => {
              if (err) {
                console.log("Err khi get all comments");
                resolve({
                  status: "Err",
                  message: "Get all comments faild",
                });
              }

              const totalCount = data[0].totalCount;

              // Truy vấn tổng số lượng đánh giá cho mỗi mức rating
              let ratingSql =
                "SELECT rating, COUNT(*) as total_ratings FROM comments WHERE product_id = ? AND rating IN (1, 2, 3, 4, 5) GROUP BY rating";

              connection.query(ratingSql, [product_id], (err, ratingData) => {
                if (err) {
                  console.log("Err khi get rating count");
                  resolve({
                    status: "Err",
                    message: "Get rating count failed",
                  });
                }

                // Chuyển đổi kết quả ratingData thành đối tượng dễ sử dụng
                const ratingCounts = {
                  1: 0,
                  2: 0,
                  3: 0,
                  4: 0,
                  5: 0,
                };

                ratingData.forEach((row) => {
                  ratingCounts[row.rating] = row.total_ratings;
                });

                // Tạo đối tượng kết quả để trả về
                const response = {
                  status: "OK",
                  message: "Get all comments success",
                  data: comments,
                  ratingCounts: ratingCounts,
                  pagination: {
                    currentPage: Page,
                    pageSize: PageSize,
                    totalPages: Math.ceil(totalCount / PageSize),
                    totalCount: totalCount,
                  },
                };

                resolve(response);
              });
            }
          );
        }
      );
    } catch (err) {
      console.log(err);
      reject(err);
    }
  });
};

const ReplyComment = (replyComment) => {
  return new Promise((resolve, reject) => {
    try {
      const { comment_id, content, user_id } = replyComment;
      const sql =
        "INSERT INTO comment_replies (comment_id , content , user_id ) VALUES( ? , ? , ?)";

      connection.query(sql, [comment_id, content, user_id], (err, data) => {
        if (err) {
          console.log(err);
          resolve({
            status: "Err",
            message: "Reply commnet thất bại",
            err,
          });
        }

        resolve({
          status: "OK",
          message: "Reply commnet thành công",
        });
      });
    } catch (err) {
      console.log(err);
      reject(err);
    }
  });
};
module.exports = {
  createComment,
  getAllComment,
  ReplyComment,
};
