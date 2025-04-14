// services/auth.js
export const signupUser = async (BASE_URL , userData) => {
  const response = await fetch(`${BASE_URL}/auth/signup`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(userData),
  });
  return response.json();
};

export const verifyOtp = async (BASE_URL, { email, otp }) => {
  const response = await fetch(`${BASE_URL}/auth/verify-email`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ email, otp }),
  });
  return response.json();
};

export const loginUser = async (BASE_URL, { email, password }) => {
  const response = await fetch(`${BASE_URL}/auth/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ email, password }),
  });
  return response.json();
};

export const createCare = async (BASE_URL, formData) => {
  const response = await fetch(`${BASE_URL}/cares/create`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(formData),
  });
  return response.json();
};

export const listCare = async (category , rating , location) => {
  const response = await fetch(`/api/cares/list?category=${category|| ''}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });
  return response.json();
};

export const listCareProfile = async (user_id) => {
  const response = await fetch(`/api/cares/profile?userId=${user_id || ""}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
    
  });
  return response.json();
};

export const createReview = async (data) => {
  console.log("Called")
  const response = await fetch(`/api/reviews/create`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });
  return response.json();
};

export const listReview = async (careId) => {
  const response = await fetch(`/api/reviews/list?care_id=${careId}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });
  return response.json();
};

export const forgotPassword = async (BASE_URL , email) => {
  const response = await fetch(`${BASE_URL}/auth/forgot-password`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(email),
  });
  return response.json();
};

export const resetPassword = async (BASE_URL , password) => {
  const response = await fetch(`${BASE_URL}/auth/reset-password`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(password),
  });
  return response.json();
};

export const verifyOtpOnEmail = async (BASE_URL, { email, otp }) => {
  const response = await fetch(`${BASE_URL}/auth/verify-otp`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ email, otp }),
  });
  return response.json();
};

