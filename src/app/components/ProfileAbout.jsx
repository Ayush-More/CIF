export default function ProfileAbout({ data }) {
  if (!data) return null;

  // Function to split the about text into paragraphs
  const formatAboutText = (text) => {
    if (!text) return [];
    
    // Split by periods followed by a space, and ensure each part ends with a period
    const paragraphs = text.split(/\.(?=\s|$)/).filter(p => p.trim().length > 0);
    return paragraphs.map(p => p.trim() + (p.endsWith('.') ? '' : '.'));
  };

  const aboutParagraphs = formatAboutText(data.about);

  // Generate section titles based on category
  const getSectionTitles = () => {
    switch (data.category) {
      case 'tutoring':
        return ['Teaching Approach', 'Specializations', 'Student Success'];
      case 'childcare':
        return ['Childcare Philosophy', 'Activities & Learning', 'Safety & Care'];
      case 'mentalphysical':
        return ['Therapeutic Approach', 'Specializations', 'Client Experience'];
      case 'mealservice':
        return ['Culinary Style', 'Special Diets', 'Service Options'];
      default:
        return ['Experience', 'Specializations', 'Service Approach'];
    }
  };

  const sectionTitles = getSectionTitles();

  return (
    <div className="w-full mt-8">
      <h1 className="text-[#101828] text-[22px] font-[600] mb-2">About</h1>
      
      {/* Main about section */}
      <div className="text-[#475467] text-[13px]">
        {aboutParagraphs[0] || data.about}
      </div>

      {/* Additional sections - dynamically created based on available content */}
      {aboutParagraphs.length > 1 && (
        <div className="mt-5">
          <span className="text-[#475467] font-[600] text-[16px]">
            {sectionTitles[0]}
          </span>
          <div className="text-[#475467] text-[13px]">
            {aboutParagraphs[1]}
          </div>
        </div>
      )}

      {aboutParagraphs.length > 2 && (
        <div className="mt-5">
          <span className="text-[#475467] font-[600] text-[16px]">
            {sectionTitles[1]}
          </span>
          <div className="text-[#475467] text-[13px]">
            {aboutParagraphs[2]}
          </div>
        </div>
      )}

      {aboutParagraphs.length > 3 && (
        <div className="mt-5">
          <span className="text-[#475467] font-[600] text-[16px]">
            {sectionTitles[2]}
          </span>
          <div className="text-[#475467] text-[13px]">
            {aboutParagraphs.slice(3).join(' ')}
          </div>
        </div>
      )}

      {/* If we don't have enough paragraphs, display skills in a separate section */}
      {aboutParagraphs.length <= 3 && data.skills && (
        <div className="mt-5">
          <span className="text-[#475467] font-[600] text-[16px]">
            Skills & Specializations
          </span>
          <div className="text-[#475467] text-[13px]">
            {data.skills}
          </div>
        </div>
      )}
    </div>
  );
}
