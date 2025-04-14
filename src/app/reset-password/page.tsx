import Navbar from "../components/Navbar";
import ResetPasswordContainer from "../components/ResetPasswordContainer.jsx";

export default function ResetPassword() {
  return (
    <>
      <Navbar />
      <div className="py-24 flex justify-center">
        <ResetPasswordContainer />
      </div>
    </>
  );
} 