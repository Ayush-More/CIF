"use client";
import { createContext, useState } from "react";

export const AppContext = createContext();

export function AppProvider({ children }) {
  const BASE_URL = "/api";
  const [isOpen, setIsOpen] = useState(false);
  const contextValue = { BASE_URL, isOpen, setIsOpen };

  return (
    <AppContext.Provider value={contextValue}>{children}</AppContext.Provider>
  );
}
