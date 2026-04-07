const express = require('express');
const cors = require('cors');
const nodemailer = require('nodemailer');

const app = express();
app.use(cors());
app.use(express.json());

let otpStore = {}; // simple in-memory storage

// ✅ EMAIL CONFIG (use your Gmail or app password)
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'YOUR_EMAIL@gmail.com',
    pass: 'YOUR_APP_PASSWORD', // NOT your real password
  },
});

// ✅ SEND OTP
app.post('/api/send-otp', async (req, res) => {
  const { email } = req.body;

  if (!email) {
    return res.json({ success: false, message: 'Email required' });
  }

  const otp = Math.floor(100000 + Math.random() * 900000).toString();
  otpStore[email] = otp;

  try {
    await transporter.sendMail({
      from: 'MoodFlix <YOUR_EMAIL@gmail.com>',
      to: email,
      subject: 'Your OTP Code',
      text: `Your OTP is ${otp}`,
    });

    console.log("OTP:", otp); // for testing

    res.json({ success: true });
  } catch (err) {
    console.error(err);
    res.json({ success: false, message: 'Email sending failed' });
  }
});

// ✅ VERIFY OTP
app.post('/api/verify-otp', (req, res) => {
  const { email, otp } = req.body;

  if (otpStore[email] === otp) {
    delete otpStore[email];
    return res.json({ success: true });
  }

  res.json({ success: false, message: 'Invalid OTP' });
});

app.listen(5000, () => {
  console.log('Server running on http://localhost:5000');
});
