import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai";

export default function InputField({
  type,
  value,
  onChange,
  placeholder,
  label,
  error,
  isSubmitted,
  showPassword,
  togglePassword,
  isPassword,
}) {
  return (
    <div className="mb-4">
      {label && <p className="text-[14px] mb-2">{label}</p>}
      <div className="relative">
        <input
          type={isPassword && showPassword ? "text" : type}
          value={value}
          onChange={onChange}
          className={`w-full text-[13px] px-2 py-[8px] outline-none border rounded-md ${
            isSubmitted && error ? "border-red-500" : "border-[#0000001A]"
          }`}
          placeholder={placeholder}
        />
        {isPassword && (
          <span
            className="absolute right-2 top-1/2 -translate-y-1/2 cursor-pointer text-[#475467]"
            onClick={togglePassword}
          >
            {showPassword ? (
              <AiOutlineEyeInvisible size={20} />
            ) : (
              <AiOutlineEye size={20} />
            )}
          </span>
        )}
      </div>
      {isSubmitted && error && (
        <p className="text-[12px] text-red-500 mt-1">{error}</p>
      )}
    </div>
  );
}
