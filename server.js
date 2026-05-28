const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');
const path = require('path');
const nodemailer = require('nodemailer');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'public')));

// Replace these with your real email credentials
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'your_email@gmail.com',
    pass: 'your_app_password', // NOT your regular password
  },
});

// Handle form submission
app.post('/contact', (req, res) => {
  const { name, email, message } = req.body;
  const timestamp = new Date().toLocaleString();
  const entry = `\n---\nTime: ${timestamp}\nName: ${name}\nEmail: ${email}\nMessage: ${message}\n`;

  // Save to file
  fs.appendFile('messages.txt', entry, (err) => {
    if (err) console.error('File save error:', err);
    else console.log('Message saved to file');
  });

  // Email options
  const mailOptions = {
    from: email,
    to: 'your_email@gmail.com', // Your email address to receive messages
    subject: 'New Contact Form Message',
    text: `You received a new message:\n\nName: ${name}\nEmail: ${email}\nMessage:\n${message}`,
  };

  // Send email
  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.error('Email send error:', error);
      return res.status(500).send('Error sending email');
    } else {
      console.log('Email sent:', info.response);
      res.send('Thank you! Your message has been sent.');
    }
  });
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
