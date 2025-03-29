export default function ProfileImages() {
    const images = [
        "/Images/profileimage1.jpeg", 
        "/Images/profileimage2.jpeg",
        "/Images/profileimage3.jpeg",
        "/Images/profileimage4.jpeg",
        "/Images/profileimage1.jpeg",
    ];

    return (
        <div className="w-full mt-8">
            <h1 className="text-[#101828] text-[22px] font-[600] mb-4">Photos</h1>
            <div className="w-full">
                <div className="w-full mb-2 md:h-[350px]">
                    <img src={images[0]} alt="Full Width" className="w-full h-full rounded-lg object-cover" />
                </div>
                <div className="grid grid-cols-4 gap-2">
                    {images.slice(1).map((image, index) => (
                        <img
                            key={index}
                            src={image}
                            alt={`Small ${index + 1}`}
                            className="w-full rounded-lg h-[80px] md:h-[135px]"
                        />
                    ))}
                </div>
            </div>
        </div>
    );
}