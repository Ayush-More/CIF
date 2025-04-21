export default function ProfileOthers({ data }) {
  if (!data) return null

  // Format experience based on available data
  const getExperienceText = () => {
    if (data.experience) {
      return `${data.experience} Of Experience`
    }
    // Generate random experience years if not provided
    return `${Math.floor(Math.random() * 10) + 2} Years Of Experience`
  }

  // Format education based on category
  const getEducation = () => {
    switch (data.category) {
      case "tutoring":
        return "BA In Education - University"
      case "childcare":
        return "Certified Childcare Provider"
      case "mentalphysical":
        return "BS In Psychology"
      case "mealservice":
        return "Culinary Arts Certificate"
      default:
        return "Professional Certification"
    }
  }

  // Format date of birth to get graduation year
  const getGraduationYear = () => {
    if (data.dateOfBirth) {
      const birthYear = new Date(data.dateOfBirth).getFullYear()
      return birthYear + 22 // Assuming graduation around age 22
    }
    return new Date().getFullYear() - Math.floor(Math.random() * 10) - 1
  }

  return (
    <div className="w-full mt-8">
      <div>
        <h1 className="text-[#101828] text-[22px] font-[600] mb-3">Experiences</h1>
        <div className="flex gap-2 text-[#101828] text-[13px] font-[500] items-center">
          <img src="/Icons/star_u.svg" alt="" className="h-4" />
          {getExperienceText()}
        </div>
        <div className="text-[#475467] text-[13px] mt-4">{data.skills || data.about}</div>
        <img src="/Icons/trusted.svg" alt="" className="h-16 mt-4" />
      </div>

      <div className="mt-8">
        <h1 className="text-[#101828] text-[22px] font-[600] mb-3">Education</h1>
        <div className="text-[#101828] text-[14px]">
          {getEducation()} - {getGraduationYear()}
        </div>
      </div>

      <div className="mt-8">
        <h1 className="text-[#101828] text-[22px] font-[600] mb-3">Languages</h1>
        <div className="flex flex-wrap gap-3">
          {data.languages && data.languages.length > 0 ? (
            data.languages.map((lang, index) => (
              <button
                key={index}
                className="flex px-4 items-center bg-[#F2F3F4] rounded-3xl py-[9px] gap-2 text-[13px] font-[500]"
              >
                <img
                  src={`/Icons/${lang.name?.toLowerCase() === "english" ? "america" : "india"}.svg`}
                  alt={lang.name}
                  className="h-[14px]"
                />
                {lang.name}
              </button>
            ))
          ) : (
            <>
              <button className="flex px-4 items-center bg-[#F2F3F4] rounded-3xl py-[9px] gap-2 text-[13px] font-[500]">
                <img src="/Icons/america.svg" alt="English" className="h-[14px]" />
                English
              </button>
              {data.location === "Mumbai" && (
                <button className="flex px-4 items-center bg-[#F2F3F4] rounded-3xl py-[9px] gap-2 text-[13px] font-[500]">
                  <img src="/Icons/india.svg" alt="Hindi" className="h-[18px]" />
                  Hindi
                </button>
              )}
            </>
          )}
        </div>
      </div>

      {/* Additional section based on category */}
      {data.category === "mealservice" && (
        <div className="mt-8">
          <h1 className="text-[#101828] text-[22px] font-[600] mb-3">Meal Types</h1>
          <div className="flex flex-wrap gap-3">
            {data.mealTypes && data.mealTypes.length > 0 ? (
              data.mealTypes.map((meal, index) => (
                <button
                  key={index}
                  className="flex px-4 items-center bg-[#F2F3F4] rounded-3xl py-[9px] gap-2 text-[13px] font-[500]"
                >
                  {meal}
                </button>
              ))
            ) : (
              <>
                <button className="flex px-4 items-center bg-[#F2F3F4] rounded-3xl py-[9px] gap-2 text-[13px] font-[500]">
                  Vegetarian
                </button>
                <button className="flex px-4 items-center bg-[#F2F3F4] rounded-3xl py-[9px] gap-2 text-[13px] font-[500]">
                  South Indian
                </button>
              </>
            )}
          </div>
        </div>
      )}

      {data.category === "childcare" && data.workingDays && (
        <div className="mt-8">
          <h1 className="text-[#101828] text-[22px] font-[600] mb-3">Available Days</h1>
          <div className="flex flex-wrap gap-3">
            {data.workingDays.map((day, index) => (
              <button
                key={index}
                className="flex px-4 items-center bg-[#F2F3F4] rounded-3xl py-[9px] gap-2 text-[13px] font-[500]"
              >
                {day}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
