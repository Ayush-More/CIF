import Navbar from "../components/Navbar";
import SignupContainer from "../components/SignupContainer";

export default function Signup() {
  return (
    <>
      <Navbar />
      <div className="py-24 px-5 flex justify-center">
        <SignupContainer />
      </div>
    </>
  );
}
