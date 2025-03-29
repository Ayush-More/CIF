import Footer from "../components/Footer";
import Navbar from "../components/Navbar";
import data from "../../../public/assets/data.js";
const { carecardData } = data;

export default function Profile() {
  const data = carecardData[2];

  return (
    <>
      <Navbar />
      <div className="max-w-7xl mx-auto md:px-10 lg:px-14 xl:px-20 pt-20">
        <div className="bg-[#F2F3F4] md:mt-7 rounded-md flex flex-col gap-6 pt-8 pb-20 md:px-10 px-6">
          {/* profile upper section */}
          <div className="w-full flex flex-col-reverse md:flex-row items-start justify-between">
            <div className="md:w-[55%]">
              <div className="h-40 w-40 rounded-full overflow-hidden">
                <img
                  src="/Images/carecard1.jpeg"
                  alt=""
                  className="h-full w-full object-cover"
                />
              </div>
              {/** profile card */}
              <div className="flex flex-col gap-2 mt-5">
                <h1 className="text-[17px] text-[#101828] font-[600]">
                  Shasta Weishampel
                </h1>
                <div className="flex items-center gap-[5px]">
                  <img src="/Icons/location.svg" alt="" className="h-[20px]" />
                  <span className="text-[15px] font-[400]">
                    6391 Elgin St. Celina
                  </span>
                </div>
                <div className="flex gap-2 items-center">
                  <div className="flex gap-1">
                    {[1, 2, 3, 4, 5].map((item) => {
                      return (
                        <img
                          src="/Icons/star.svg"
                          alt=""
                          className="h-[20px]"
                          key={item}
                        />
                      );
                    })}
                  </div>
                  <span className="text-[#475467] text-[13px]">
                    (103 reviews)
                  </span>
                </div>
                <div className="text-[13px] text-[#475467] mt-3">
                  A luxury center treating addiction and co-occurring mental
                  health with evidence-based therapies, a continuum of care in
                  bespoke facilities, and private bedrooms.
                </div>
              </div>
            </div>
            <div className="flex gap-2 mb-4 md:mb-0 w-full justify-end">
              <button className="bg-[#EF5744] px-[19px] py-[8px] rounded-full text-[#fff] text-[14px] cursor-pointer">
                Repost
              </button>
              <button className="border border-[#EF5744] px-[19px] py-[8px] rounded-full text-[#EF5744] text-[14px] cursor-pointer">
                Edit Profile
              </button>
            </div>
          </div>

          {/* highlight section*/}
          <div>
            <h1 className="text-[16px] text-[#101828] font-[600]">
              Highlights from the Shasta
            </h1>
            <div className="flex gap-[13px]">
              {data.treatments.map((treatment, index) => {
                return (
                  <button
                    key={index}
                    className={`text-[13px] mt-[8px] text-[#101828] px-[13px] py-[5px] rounded-md font-[500] ${
                      treatment === "Tutoring"
                        ? "bg-[#E9ECFF]"
                        : treatment === "Child Care"
                        ? "bg-[#E7F2FF]"
                        : "bg-[#EFFFDF]"
                    }`}
                  >
                    {treatment}
                  </button>
                );
              })}
            </div>
          </div>

          {/*education */}
          <div>
            <h1 className="text-[#101828] text-[20px] font-[600] mb-3">
              Education
            </h1>
            <div className="text-[#101828] text-[14px]">
              BA In Physology - Stanford University - 2012
            </div>
          </div>

          {/*language */}
          <div>
            <h1 className="text-[#101828] text-[20px] font-[600] mb-3">
              Languages
            </h1>
            <div className="flex gap-3">
              <button className="flex px-4 items-center bg-[#F2F3F4] rounded-3xl py-[9px] gap-2 text-[13px] font-[500]">
                <img src="/Icons/america.svg" alt="" className="h-[14px]" />
                English
              </button>
              <button className="flex px-4 items-center bg-[#F2F3F4] rounded-3xl py-[9px] gap-2 text-[13px] font-[500]">
                <img src="/Icons/india.svg" alt="" className="h-[18px]" />
                India
              </button>
            </div>
          </div>

          {/*about */}
          <div>
            <h1 className="text-[#101828] text-[20px] font-[600] mb-2">
              About
            </h1>
            <div className="text-[#475467] text-[13px]">
              Sukoon Health treats acute psychiatric needs, addiction, mental
              health conditions, personality disorders, and more across all
              ages. They use personalized and intensive care to provide a
              comprehensive treatment experience in a residential, outpatient,
              or at-home setting. Their experienced staff includes
              psychiatrists, psychologists, medical doctors, counsellors, art
              therapists, and a 1:1 nurse-to-client ratio. Sukoon Health has
              special treatment tracks for women, older adults, and adolescents.
            </div>
          </div>

          {/*experience */}
          <div>
            <h1 className="text-[#101828] text-[20px] font-[600] mb-3">
              Experiences
            </h1>
            <div className="flex gap-2 text-[#101828] text-[13px] font-[500] items-center">
              <img src="/Icons/star_u.svg" alt="" className="h-4" />7 Years Of
              Experience
            </div>
            <div className="text-[#475467] text-[13px] mt-4">
              Sukoon Health provides behavioral, mental health, and learning
              disability treatment for adolescents. They offer a women-only
              treatment program with only women on staff. Sukoon Health also
              provides geriatric psychiatric care for older adults. They provide
              adjunct therapies for all ages, including rTMS (repeated
              transcranial magnetic stimulation), art therapy with on-staff art
              therapists, yoga, and exercise with an on-site fitness studio.
              Sukoon Health additionally helps international clients with their
              visa process and airport transfers.
            </div>
            <img src="/Icons/trusted.svg" alt="" className="h-16 mt-4" />
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}
