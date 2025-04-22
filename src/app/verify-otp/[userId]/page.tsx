import Navbar from "./../../components/Navbar";
import VerifyOtpContainer from "./../../components/VerifyOtpContainer";

export default function VerifyOtp() {
  return (
    <>
      <Navbar />
      <div className="py-24 mt-25 flex justify-center">
        <VerifyOtpContainer />
      </div>
    </>
  );
} 