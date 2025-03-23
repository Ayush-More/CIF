export default function ProfileReview() {
  return (
    <div className="mt-8">
      <div>
        <h1 className="text-[#101828] text-[22px] font-[600] mb-3">Reviews</h1>
        <textarea
          name=""
          id=""
          placeholder="Write review here"
          className="outline rounded-sm h-48 w-full p-2 text-[14px] italic"
        ></textarea>
        <div className="flex justify-end mt-2">
          <button className="cursor-pointer bg-[#EF5744] text-[#fff] rounded-full px-6 py-[11px] text-[14px]">
            Add Review
          </button>
        </div>
      </div>
      <div className="flex flex-col gap-8">
        {[1, 2, 3, 4].map((_) => {
          return (
            <div className="flex items-start gap-7 w-[50%]">
              <div className="w-7 h-7 rounded-full">
                <img
                  src="/Images/review1.png"
                  alt=""
                  className="w-full h-full object-cover rounded-full"
                />
              </div>
              <div className="flex flex-col gap-3">
                <div className="flex gap-1">
                  {[1, 2, 3, 4, 5].map((item) => {
                    return <img src="/Icons/star.svg" alt="" className="h-4" />;
                  })}
                </div>
                <div className="text-[11px] text-[#18181B]">
                  Est illo eum fugit autem et dolores magnam voluptatem. Totam
                  voluptatem velit similique laborum enim deserunt error omnis.
                  Omnis vero libero
                </div>
                <div className="flex flex-col gap-[1px]">
                  <h1 className="text-[#18181B] text-[10px] font-[600]">
                    Kristin Watson
                  </h1>
                  <span className="text-[#71717A] text-[10px]">
                    March 14, 2021
                  </span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
