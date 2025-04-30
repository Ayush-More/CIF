"use client"

import { useState, useEffect } from "react"
import { createReview, listReview } from "../services/auth"
import { useAuth } from "../context/AuthContext"
import { Star } from 'lucide-react'
import { ToastContainer, toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

export default function ProfileReview({ careId }) {
  const { userData } = useAuth()
  const [comment, setComment] = useState("")
  const [rating, setRating] = useState(5)
  const [hoveredRating, setHoveredRating] = useState(0)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitSuccess , setSubmitSuccess] = useState(false)
  const [reviews, setReviews] = useState([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchReviews = async () => {
      setIsLoading(true)
      try {
        const response = await listReview(careId)
        if (response.data) {
          const formattedReviews = response.data.map(review => ({
            id: review._id,
            name: review.user?.name || "Anonymous User",
            email: review.user?.email,
            date: new Date(review.createdAt).toLocaleDateString("en-US", {
              month: "long",
              day: "numeric",
              year: "numeric"
            }),
            rating: review.rating,
            comment: review.comment,
            avatar: review.user?.profilePic || "/Images/review1.png"
          }))
          setReviews(formattedReviews)
        }
      } catch (error) {
        toast.error("Failed to fetch reviews")
      } finally {
        setIsLoading(false)
      }
    }

    if (careId) {
      fetchReviews()
    }
  }, [careId])
  const userId = localStorage.getItem('userId');
  console.log(userId , 7777);

  const handleAddReview = async () => {
    if (!comment.trim()) {
      toast.warning("Please write a review comment")
      return
    }

    setIsSubmitting(true)
    try {
      const response = await createReview({
        care_id: careId,
        user_id: userId,
        rating: rating,
        comment: comment,
      })

      if (response.success && response.review) {
        const newReview = {
          id: response.review._id,
          name: response.review.user_id?.fullName || userData?.name || "Anonymous User",
          email: response.review.user_id?.email,
          date: new Date().toLocaleDateString("en-US", {
            month: "long",
            day: "numeric",
            year: "numeric"
          }),
          rating: rating,
          comment: comment,
          avatar: response.review.user_id?.profilePic || userData?.profilePic || "/Images/review1.png",
        }

        setReviews([newReview, ...reviews])
        setComment("")
        setRating(5)
        toast.success("Review submitted successfully!")
      }
    } catch (error) {
      // Check for specific error types
      if (error.response?.status === 409 || error.message?.includes('already reviewed')) {
        toast.error("You have already reviewed this care provider", {
          position: "top-right",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
        })
      } else {
        toast.error("Failed to submit review. Please try again later.")
      }
      console.error("Error submitting review:", error)
    } finally {
      setIsSubmitting(false)
    }
  }

  // Star rating component using Lucide Star
  const StarRating = ({ value, hovered, onRate, onHover }) => {
    return (
      <div className="flex gap-2">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={`w-6 h-6 cursor-pointer transition-all duration-200 hover:scale-110 ${
              star <= (hovered || value)
                ? 'fill-yellow-400 text-yellow-400'
                : 'fill-none text-gray-300'
            }`}
            onClick={() => onRate(star)}
            onMouseEnter={() => onHover(star)}
            onMouseLeave={() => onHover(0)}
          />
        ))}
      </div>
    )
  }

  const ReadOnlyStars = ({ rating }) => {
    return (
      <div className="flex gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={`w-4 h-4 ${
              star <= rating ? 'fill-yellow-400 text-yellow-400' : 'fill-none text-gray-300'
            }`}
          />
        ))}
      </div>
    )
  }

  return (
    <div className="mt-8">
      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />
      <div>
        <h1 className="text-[#101828] text-[22px] font-[600] mb-3">Reviews</h1>
        {/* Rating Input with hover effect */}
        <div className="mb-4">
          <p className="text-[#475467] text-[13px] mb-2">Rating</p>
          <StarRating
            value={rating}
            hovered={hoveredRating}
            onRate={setRating}
            onHover={setHoveredRating}
          />
        </div>
        <textarea
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          placeholder="Write review here"
          className="outline rounded-sm h-30 w-full p-2 text-[14px] italic"
          disabled={isSubmitting}
        ></textarea>
        <div className="flex justify-between mt-2">
          {isSubmitting && (
            <div className="text-green-600 text-sm flex items-center">
              Review submitted successfully!
            </div>
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

      {/* Reviews List */}
      <div className="flex flex-col gap-8 mt-8">
        {isLoading ? (
          <div className="text-center py-4">Loading reviews...</div>
        ) : reviews.length === 0 ? (
          <div className="text-center py-4 text-gray-500">No reviews yet</div>
        ) : (
          reviews.map((review) => (
            <div key={review.id} className="flex items-start gap-7 md:w-[50%] mt-8 md:mt-0">
              <div className="w-7 h-7 rounded-full overflow-hidden">
                <img
                  src={review.avatar || "/placeholder.svg"}
                  alt={review.name}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="flex w-[85%] flex-col gap-1">
              <h1 className="text-[#18181B] text-[10px] font-[600]">{review.name}</h1>
                <ReadOnlyStars rating={review.rating} />
                <div className="text-[11px] text-[#18181B]">{review.comment}</div>
                <div className="flex flex-col gap-[1px]">
                
                  <span className="text-[#71717A] text-[10px]">{review.date}</span>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  )
}