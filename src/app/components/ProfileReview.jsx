"use client"

import { useState } from "react"
import { createReview } from "../services/auth"
import { useAuth } from "../context/AuthContext"

export default function ProfileReview({ careId }) {
  const { userData } = useAuth()
  const [comment, setComment] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitSuccess, setSubmitSuccess] = useState(false)
  const [reviews, setReviews] = useState([
    {
      id: 1,
      name: "Kristin Watson",
      date: "March 14, 2021",
      rating: 5,
      comment: "Est illo eum fugit autem et dolores magnam voluptatem...",
      avatar: "/Images/review1.png",
    },
    {
      id: 2,
      name: "Jacob Jones",
      date: "April 23, 2021",
      rating: 4,
      comment: "Excellent service and very professional approach to care...",
      avatar: "/Images/review1.png",
    },
    {
      id: 3,
      name: "Esther Howard",
      date: "May 10, 2021",
      rating: 5,
      comment: "Highly recommended! The care provided was exceptional...",
      avatar: "/Images/review1.png",
    },
    {
      id: 4,
      name: "Robert Fox",
      date: "June 5, 2021",
      rating: 5,
      comment: "Very satisfied with the service. Would definitely use again...",
      avatar: "/Images/review1.png",
    },
  ])

  const handleAddReview = async () => {
    if (!comment.trim()) return

    setIsSubmitting(true)
    try {
      await createReview({
        care_id: careId,
        user_id: userData?.id || null,
        comment: comment,
      })

      // Add the new review to the local state
      const newReview = {
        id: Date.now(),
        name: userData?.name || "Anonymous User",
        date: new Date().toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" }),
        rating: 5,
        comment: comment,
        avatar: userData?.profilePic || "/Images/review1.png",
      }

      setReviews([newReview, ...reviews])
      setComment("") // Clear textarea
      setSubmitSuccess(true)

      // Reset success message after 3 seconds
      setTimeout(() => {
        setSubmitSuccess(false)
      }, 3000)
    } catch (error) {
      console.error("Error submitting review:", error)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="mt-8">
      <div>
        <h1 className="text-[#101828] text-[22px] font-[600] mb-3">Reviews</h1>
        <textarea
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          placeholder="Write review here"
          className="outline rounded-sm h-48 w-full p-2 text-[14px] italic"
          disabled={isSubmitting}
        ></textarea>
        <div className="flex justify-between mt-2">
          {submitSuccess && (
            <div className="text-green-600 text-sm flex items-center">Review submitted successfully!</div>
          )}
          <div className="ml-auto">
            <button
              onClick={handleAddReview}
              disabled={isSubmitting || !comment.trim()}
              className={`cursor-pointer bg-[#EF5744] text-[#fff] rounded-full px-6 py-[11px] text-[14px] ${
                isSubmitting || !comment.trim() ? "opacity-70 cursor-not-allowed" : ""
              }`}
            >
              {isSubmitting ? "Submitting..." : "Add Review"}
            </button>
          </div>
        </div>
      </div>

      <div className="flex flex-col gap-8">
        {reviews.map((review) => (
          <div key={review.id} className="flex items-start gap-7 md:w-[50%] mt-8 md:mt-0">
            <div className="w-7 h-7 rounded-full">
              <img
                src={review.avatar || "/placeholder.svg"}
                alt={review.name}
                className="w-full h-full object-cover rounded-full"
              />
            </div>
            <div className="flex w-[85%] flex-col gap-3">
              <div className="flex gap-1">
                {[1, 2, 3, 4, 5].map((star) => (
                  <img
                    key={star}
                    src={star <= review.rating ? "/Icons/star.svg" : "/Icons/star_empty.svg"}
                    alt=""
                    className="h-4"
                  />
                ))}
              </div>
              <div className="text-[11px] text-[#18181B]">{review.comment}</div>
              <div className="flex flex-col gap-[1px]">
                <h1 className="text-[#18181B] text-[10px] font-[600]">{review.name}</h1>
                <span className="text-[#71717A] text-[10px]">{review.date}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
