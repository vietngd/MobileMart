const CommentServices = require("../services/CommentServices");

const CreateComment = async (req, res) => {
  try {
    const { product_id, content, name, phone, email } = req.body;

    if (!name || !content || !phone || !email) {
      return res.status(200).json({
        status: "Err",
        message: "Vui lòng nhập đầy đủ thông tin",
      });
    }
    const regexPhoneNumber = /(03|05|07|08|09|01[2|6|8|9])+([0-9]{8})\b/;
    if (!regexPhoneNumber.test(phone)) {
      return res.status(200).json({
        status: "Err",
        message: "Vui lòng nhập đúng số điện thoại",
      });
    }
    if (!product_id) {
      return res.status(200).json({
        status: "Err",
        message: "product_id thiếu",
      });
    }
    const regEmail = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
    const isCheckEmail = regEmail.test(email);

    if (!isCheckEmail) {
      return res.status(200).json({
        status: "Err",
        message: "Email sai định dạng",
      });
    }

    const response = await CommentServices.createComment(req.body);
    return res.status(200).json(response);
  } catch (err) {
    console.log(err);
    return res.status(404).json({
      message: err,
    });
  }
};

const GetAllComment = async (req, res) => {
  try {
    const { product_id, page, pageSize } = req.query;
    const PageSize = parseInt(pageSize) || 3;
    const Page = parseInt(page) || 1;

    if (!product_id) {
      return res.status(200).json({
        status: "Err",
        message: "product_id thiếu",
      });
    }

    const response = await CommentServices.getAllComment(
      product_id,
      Page,
      PageSize
    );
    return res.status(200).json(response);
  } catch (err) {
    console.log(err);
    return res.status(404).json({
      message: err,
    });
  }
};

const ReplyComment = async (req, res) => {
  try {
    const { user_id, content, comment_id } = req.body;

    if (!user_id) {
      return res.status(200).json({
        status: "Err",
        message: "user_id thiếu",
      });
    }
    if (!content) {
      return res.status(200).json({
        status: "Err",
        message: "Vui lòng nhập câu trả lời",
      });
    }
    if (!comment_id) {
      return res.status(200).json({
        status: "Err",
        message: "comment_id thiếu",
      });
    }

    const response = await CommentServices.ReplyComment(req.body);
    return res.status(200).json(response);
  } catch (err) {
    console.log(err);
    return res.status(404).json({
      message: err,
    });
  }
};
module.exports = {
  CreateComment,
  GetAllComment,
  ReplyComment,
};
