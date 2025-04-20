export default function ProfileImages({ data }) {
    if (!data || !data.profilePic) return null
  
    // Create an array with the profile picture repeated
    const images = Array(5).fill(data.profilePic)
  
    return (
      <div className="w-full mt-8">
        <h1 className="text-[#101828] text-[22px] font-[600] mb-4">Photos</h1>
        <div className="w-full">
          <div className="w-full mb-2 md:h-[350px]">
            <img
              src={images[0] || "/placeholder.svg"}
              alt={`${data.username || "Provider"} main photo`}
              className="w-full h-full rounded-lg object-cover"
            />
          </div>
          <div className="grid grid-cols-4 gap-2">
            {images.slice(1).map((image, index) => (
              <img
                key={index}
                src={image || "/placeholder.svg"}
                alt={`${data.username || "Provider"} photo ${index + 1}`}
                className="w-full rounded-lg h-[80px] md:h-[135px] object-cover"
              />
            ))}
          </div>
        </div>
      </div>
    )
  }
  