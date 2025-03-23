// utils/validation.js
export const validateForm = (formData, setErrors) => {
  let isValid = true;
  const { firstName, lastName, email, password } = formData;
  const newErrors = {};

  if (firstName !== undefined && !firstName) {
    newErrors.firstName = "First name is required";
    isValid = false;
  }

  if (lastName !== undefined && !lastName) {
    newErrors.lastName = "Last name is required";
    isValid = false;
  }

  if (!email) {
    newErrors.email = "Email is required";
    isValid = false;
  } else if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(email)) {
    newErrors.email = "Invalid email address";
    isValid = false;
  }

  if (!password) {
    newErrors.password = "Password is required";
    isValid = false;
  } else if (password.length < 8) {
    newErrors.password = "Password must be at least 8 characters";
    isValid = false;
  } else if (!/[A-Z]/.test(password)) {
    newErrors.password = "Password must contain at least one capital letter";
    isValid = false;
  } else if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
    newErrors.password = "Password must contain at least one special character";
    isValid = false;
  }

  setErrors((prev) => ({ ...prev, ...newErrors }));
  return isValid;
};

export const validateLoginForm = (formData, setErrors) => {
  return validateForm(
    { email: formData.email, password: formData.password },
    setErrors
  );
};
