"use client";
import { createContext } from "react";

export const AppContext = createContext();

export function AppProvider({ children }) {
  const BASE_URL = "https://careforindians.com/api";
  const contextValue = { BASE_URL };

  return (
    <AppContext.Provider value={contextValue}>{children}</AppContext.Provider>
  );
}
