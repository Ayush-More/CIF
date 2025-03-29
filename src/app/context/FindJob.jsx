"use client";
import { createContext, useEffect, useState, useMemo } from "react";

export const FindJobContext = createContext();

const getInitialFindJobData = () => {
  if (typeof window !== "undefined") {
    return JSON.parse(window.sessionStorage.getItem("findJobData")) || {};
  }
  return {};
};

const FindJobProvider = ({ children }) => {
  const [findJobData, setFindJobData] = useState(getInitialFindJobData);

  const getProfile = async () => {
    try {
      const res = await fetch("/api/profile/getProfile");
      const data = await res.json();
      // console.log("Profile Data:", data); // Debugging log
      if (data.user) {
        setFindJobData({ ...data.user, mode: "edit" });
      }
    } catch (error) {
      console.error("Error fetching profile data:", error);
    }
  };

  useEffect(() => {
    if (findJobData !== undefined) {
      if (typeof window !== "undefined") {
        window.sessionStorage.setItem(
          "findJobData",
          JSON.stringify(findJobData)
        );
      }
    }
  }, [findJobData]);

  useEffect(() => {
    if (typeof window !== "undefined") {
      getProfile();
    }
  }, []);

  const handleData = (data) => {
    setFindJobData((prev) => ({ ...prev, ...data }));
  };

  const handleReset = () => {
    sessionStorage.removeItem("findJobData");
    setFindJobData({});
  };

  const contextValue = useMemo(
    () => ({
      handleData,
      findJobData,
      handleReset,
    }),
    [findJobData]
  );

  return (
    <FindJobContext.Provider value={contextValue}>
      {children}
    </FindJobContext.Provider>
  );
};

export default FindJobProvider;
