const otpTemplate = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <style>
    body {
      font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
      background-color: #f9f9f9;
      margin: 0;
      padding: 0;
    }
    .container {
      width: 100%;
      max-width: 600px;
      margin: 30px auto;
      background-color: #ffffff;
      border-radius: 12px;
      overflow: hidden;
      box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
    }
    .header {
      background-color: #4CAF50;
      color: #ffffff;
      text-align: center;
      padding: 30px 20px;
    }
    .header h1 {
      margin: 0;
      font-size: 28px;
      font-weight: 600;
    }
    .content {
      padding: 30px;
      text-align: center;
      color: #333333;
    }
    .content p {
      margin: 0 0 15px;
      font-size: 16px;
      line-height: 1.6;
    }
    .otp {
      display: inline-block;
      margin: 20px 0;
      padding: 18px 36px;
      font-size: 24px;
      color: #ffffff;
      background-color: #4CAF50;
      border: 1px solid #4CAF50;
      border-radius: 8px;
      font-weight: bold;
    }
    .footer {
      padding: 20px;
      text-align: center;
      font-size: 14px;
      color: #777777;
      background-color: #f1f1f1;
    }
    .footer p {
      margin: 10px 0;
    }
    .footer a {
      color: #007BFF;
      text-decoration: none;
    }
    /* Responsive Design */
    @media screen and (max-width: 600px) {
      .container {
        margin: 20px auto;
      }
      .header {
        padding: 20px;
      }
      .content {
        padding: 20px;
      }
      .otp {
        font-size: 22px;
        padding: 15px 30px;
      }
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>Email Verification</h1>
    </div>
    <div class="content">
      <p>Hello,</p>
      <p>Thank you for registering with us! Please use the following OTP to verify your email address and complete your registration:</p>
      <div class="otp">{verificationCode}</div>
      <p>This OTP is valid for 10 minutes. Please do not share it with anyone.</p>
    </div>
    <div class="footer">
      <p>&copy; 2024 Your Company Name. All rights reserved.</p>
      <p>If you have any questions, feel free to <a href="mailto:support@company.com">contact us</a>.</p>
    </div>
  </div>
</body>
</html>
`;

module.exports = otpTemplate;
