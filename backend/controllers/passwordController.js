import crypto from "crypto"
import nodemailer from "nodemailer"
import userModel from '../models/userModel.js'
import bcrypt from "bcrypt"

const forgotPassword = async (req, res) => {
    const { email } = req.body

    try {
        const user = await userModel.findOne({ email })
        if (!user) {
            return res.json({ success: false, message: "Email does not exist" })
        }

        const token = crypto.randomBytes(32).toString("hex")
        const expireTime = Date.now() + 60 * 60 * 1000 // 1 giờ

        user.resetPasswordToken = token
        user.resetPasswordExpires = expireTime
        await user.save()

        const resetLink = `http://localhost:4000/api/user/reset-password/${token}`

        const transporter = nodemailer.createTransport({
            service: "gmail",
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS
            }
        })

        await transporter.sendMail({
            to: email,
            subject: "Password Reset",
            html: `
                <p>You requested a password reset.</p>
                <p>Click <a href="${resetLink}">here</a> to reset your password.</p>
                <p>This link will expire in 1 hour.</p>
            `
        })

        res.json({ success: true, message: "Password reset link sent to email" })

    } catch (error) {
        console.log(error)
        res.json({ success: false, message: "Something went wrong" })
    }
}

const resetPassword = async (req, res) => {
    const { token } = req.params
    const { newPassword } = req.body

    try {
        const user = await userModel.findOne({
            resetPasswordToken: token,
            resetPasswordExpires: { $gt: Date.now() }
        })

        if (!user) {
            return res.json({ success: false, message: "Invalid or expired token" })
        }

        if (newPassword.length < 8) {
            return res.json({ success: false, message: "Password must be at least 8 characters" })
        }

        const salt = await bcrypt.genSalt(10)
        const hashed = await bcrypt.hash(newPassword, salt)

        user.password = hashed
        user.resetPasswordToken = undefined
        user.resetPasswordExpires = undefined

        await user.save()

        res.send(`
            <!DOCTYPE html>
            <html lang="vi">
            <head>
                <meta charset="UTF-8" />
                <title>Thành công</title>
                <style>
                body {
                    font-family: Arial, sans-serif;
                    background: #f0fff0;
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    height: 100vh;
                }
                .success {
                    background: white;
                    padding: 30px 40px;
                    border-radius: 10px;
                    box-shadow: 0 4px 8px rgba(0,0,0,0.1);
                    text-align: center;
                }
                h2 {
                    color: #4CAF50;
                    margin-bottom: 15px;
                }
                a {
                    text-decoration: none;
                    color: #4CAF50;
                    font-weight: bold;
                }
                a:hover {
                    text-decoration: underline;
                }
                </style>
            </head>
            <body>
                <div class="success">
                <h2>✅ Mật khẩu đã được đặt lại thành công!</h2>
                <p><a href="http://localhost:5173/">Quay lại trang chủ</a></p>
                </div>
            </body>
            </html>
            `)
    } catch (error) {
        console.log(error)
        res.json({ success: false, message: "Something went wrong" })
    }
}

export {forgotPassword, resetPassword}

