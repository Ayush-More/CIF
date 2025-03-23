import Navbar from "../components/Navbar";
import ForgotPasswordContainer from "../components/ForgotPasswordContainer";

export default function ForgotPassword() {
  return (
    <>
      <Navbar />
      <div className="py-24 flex justify-center">
        <ForgotPasswordContainer />
      </div>
    </>
  );
}
