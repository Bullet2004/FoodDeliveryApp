import express from "express"
import { loginUser, registerUser } from "../controllers/userController.js"
import { forgotPassword, resetPassword } from "../controllers/passwordController.js"

const userRouter = express.Router()

userRouter.post("/register", registerUser)
userRouter.post("/login", loginUser)
userRouter.post("/forgot-password", forgotPassword)

// Hiển thị form đổi mật khẩu (GET)
userRouter.get("/reset-password/:token", (req, res) => {
  const { token } = req.params
  res.send(`
    <!DOCTYPE html>
    <html lang="vi">
    <head>
      <meta charset="UTF-8" />
      <title>Đặt lại mật khẩu</title>
      <style>
        *{
            box-sizing: border-box;
        }
        body {
          font-family: Arial, sans-serif;
          background: #f7f7f7;
          display: flex;
          justify-content: center;
          align-items: center;
          height: 100vh;
        }
        .form-container {
          background: white;
          padding: 30px 40px;
          border-radius: 10px;
          box-shadow: 0 4px 8px rgba(0,0,0,0.1);
          width: 100%;
          max-width: 400px;
          text-align: center;
        }
        h2 {
          margin-bottom: 20px;
          color: #333;
        }
        input {
          width: 100%;
          padding: 12px 15px;
          margin-bottom: 15px;
          border-radius: 5px;
          border: 1px solid #ccc;
        }
        button {
          background: #4CAF50;
          color: white;
          padding: 12px 20px;
          border: none;
          border-radius: 5px;
          cursor: pointer;
          width: 100%;
          font-size: 16px;
        }
        button:hover {
          background: #45a049;
        }
      </style>
    </head>
    <body>
      <div class="form-container">
        <h2>Đặt lại mật khẩu</h2>
        <form action="/api/user/reset-password/${token}" method="POST">
          <input type="password" name="newPassword" placeholder="Nhập mật khẩu mới" required />
          <button type="submit">Đặt lại mật khẩu</button>
        </form>
      </div>
    </body>
    </html>
  `)
})


// Xử lý đổi mật khẩu (POST)
userRouter.post("/reset-password/:token", resetPassword)

export default userRouter
