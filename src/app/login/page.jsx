import Navbar from "../components/Navbar";
import LoginContainer from "../components/LoginContainer";

export default function Login() {
  return (
    <>
      <Navbar />
      <div className="py-24 flex justify-center">
        <LoginContainer />
      </div>
    </>
  );
}
