const express = require('express');
const nodemailer = require('nodemailer');
const dotenv = require('dotenv');
const cors = require('cors'); 

dotenv.config();
const app = express();
const port = process.env.PORT || 5000;

app.use(cors());  
app.use(express.json()); 

const transporter = nodemailer.createTransport({
  service: 'gmail', 
  auth: {
    user: process.env.EMAIL,  
    pass: process.env.PASSWORD,  
  },
});
app.post('/send-verification', (req, res) => {
    const { email } = req.body;
    
    console.log('Received email:', email); 
    
    if (!email) {
      return res.status(400).json({ error: 'Email is required' });
    }
  
    const verificationCode = Math.floor(100000 + Math.random() * 900000).toString();
    console.log('Generated verification code:', verificationCode);  
  
    const mailOptions = {
      from: process.env.EMAIL,
      to: email,
      subject: 'Email Verification',
      text: `Your verification code is: ${verificationCode}`,
    };
  
    transporter.sendMail(mailOptions, (err, info) => {
      if (err) {
        console.error('Error sending email:', err);
        return res.status(500).json({ error: 'Error sending email', details: err });
      }
      console.log('Email sent successfully:', info.response);  
      res.status(200).json({ message: 'Verification email sent', verificationCode });
    });
  });
  

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
