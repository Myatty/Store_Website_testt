const express = require('express');
const nodemailer = require('nodemailer');
const dotenv = require('dotenv');

dotenv.config();
const app = express();
const port = process.env.PORT || 5000;

app.use(express.json()); // Parse incoming JSON requests

// Set up a nodemailer transporter using an SMTP service
const transporter = nodemailer.createTransport({
  service: 'gmail', // or use a different email provider
  auth: {
    user: process.env.EMAIL,  // your email
    pass: process.env.PASSWORD,  // your email app password (generated from Google, etc.)
  },
});

app.post('/send-verification', (req, res) => {
  const { email } = req.body;

  const verificationCode = Math.floor(100000 + Math.random() * 900000).toString();

  const mailOptions = {
    from: process.env.EMAIL,
    to: email,
    subject: 'Email Verification',
    text: `Your verification code is: ${verificationCode}`,
  };

  transporter.sendMail(mailOptions, (err, info) => {
    if (err) {
        console.error('Error:', err); 
      return res.status(500).send('Error sending email');
    }
    res.status(200).send({ message: 'Verification email sent', verificationCode });
  });
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
