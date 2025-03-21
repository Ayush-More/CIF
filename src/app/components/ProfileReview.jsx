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
    </div>
  );
}
