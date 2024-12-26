import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { Button, Card, Input, Typography } from "@material-tailwind/react";

const VerifyOTP = () => {
  const [otp, setOtp] = useState("");
  const [message, setMessage] = useState("");
  const [isResendDisabled, setIsResendDisabled] = useState(true);
  const [timer, setTimer] = useState(60);

  const navigate = useNavigate();

  const handleOtpChange = (e) => {
    setOtp(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        "http://localhost:5000/auth/user/verifyOTP",
        { otp }
      );
      setMessage(response.data.message); // Show success message
      setTimeout(() => {
        navigate("/login");
      }, 2000);
    } catch (error) {
      setMessage(error.response.data.message || "*Error verifying OTP");
    }
  };

  const handleResendOtp = () => {
    setIsResendDisabled(true);
    setTimer(60); // Reset the timer
    navigate("/resend-OTP"); // Trigger resend OTP logic here if needed
  };

  useEffect(() => {
    if (isResendDisabled) {
      const countdown = setInterval(() => {
        setTimer((prevTimer) => {
          if (prevTimer <= 1) {
            clearInterval(countdown);
            setIsResendDisabled(false);
            return 0;
          }
          return prevTimer - 1;
        });
      }, 1000);

      return () => clearInterval(countdown);
    }
  }, [isResendDisabled]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-blue-100">
      <Card className="p-8 w-full max-w-md shadow-lg">
        <Typography
          variant="h4"
          color="blue-gray"
          className="text-center font-semibold mb-4"
        >
          Verify OTP
        </Typography>
        <Typography
          variant="small"
          color="blue-gray"
          className="text-center mb-6"
        >
          Enter the OTP sent to your registered email to proceed.
        </Typography>
        <form onSubmit={handleSubmit}>
          <Input
            type="text"
            label="6-digit OTP"
            value={otp}
            onChange={handleOtpChange}
            maxLength="6"
            className="mb-6"
            size="lg"
          />
          <Button
            type="submit"
            fullWidth
            color="blue"
            size="lg"
            className="mb-4"
          >
            Submit OTP
          </Button>
          <Button
            type="button"
            onClick={handleResendOtp}
            disabled={isResendDisabled}
            fullWidth
            color={isResendDisabled ? "gray" : "blue-gray"}
            size="lg"
          >
            {isResendDisabled ? `Resend OTP (${timer}s)` : "Resend OTP"}
          </Button>
        </form>
        {message && (
          <Typography
            variant="small"
            color="red"
            className="text-center mt-4 font-medium p-2 rounded-md bg-red-50"
          >
            {message}
          </Typography>
        )}
      </Card>
    </div>
  );
};

export default VerifyOTP;
