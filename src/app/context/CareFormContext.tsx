"use client"
import { createContext, useContext, useState, type ReactNode } from "react"

interface Language {
  name: string
  proficiency: "Beginner" | "Intermediate" | "Advanced"
}

export interface CareFormData {
  user_id: string
  category: string
  workingDays: string[]
  timings: string
  languages: Language[]
  hourlyRate: number
  profilePic: string
  username: string
  gender: string
  dateOfBirth: string
  about: string
  skills: string
  location: string
  ratings?: number

  // New fields for all care types
  zipCode?: string
  experience?: string

  // Tutoring specific fields
  mode?: string

  // Child care specific fields
  schoolDrop?: boolean
  smoking?: boolean
  overnightCare?: boolean
  ageBand?: string
  jobTiming?: string
  careFor?: number

  // Meal service specific fields
  travelDistance?: string
  serviceType?: string
  mealPrice?: string
  offerSubscription?: boolean
  mealTypes?: string[]
}

const defaultData: CareFormData = {
  user_id: "",
  category: "",
  workingDays: [],
  timings: "",
  languages: [],
  hourlyRate: 0,
  profilePic: "",
  username: "",
  gender: "",
  dateOfBirth: "",
  about: "",
  skills: "",
  location: "Mumbai",
  ratings: 4.5,
}

interface CareFormContextType {
  formData: CareFormData
  updateForm: (data: Partial<CareFormData>) => void
  resetForm: () => void
}

const CareFormContext = createContext<CareFormContextType | undefined>(undefined)

export const CareFormProvider = ({ children }: { children: ReactNode }) => {
  const [formData, setFormData] = useState<CareFormData>(defaultData)

  const updateForm = (data: Partial<CareFormData>) => {
    setFormData((prev) => ({ ...prev, ...data }))
  }

  const resetForm = () => setFormData(defaultData)

  return <CareFormContext.Provider value={{ formData, updateForm, resetForm }}>{children}</CareFormContext.Provider>
}

export const useCareForm = () => {
  const context = useContext(CareFormContext)
  if (!context) {
    throw new Error("useCareForm must be used within CareFormProvider")
  }
  return context
}
