"use client"

import { useState } from 'react';
import { Star } from 'lucide-react';
import { useSession } from 'next-auth/react';

export default function ReviewSection({ 
    careId, 
    initialReviews = [], 
    initialAverageRating = 0, 
    initialTotalReviews = 0 
}) {
    const { data: session } = useSession();
    const [rating, setRating] = useState(0);
    const [comment, setComment] = useState('');
    const [reviews, setReviews] = useState(initialReviews);
    const [averageRating, setAverageRating] = useState(initialAverageRating);
    const [totalReviews, setTotalReviews] = useState(initialTotalReviews);
    const [hover, setHover] = useState(0);
    const [error, setError] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!session?.user) {
            setError('Please login to submit a review');
            return;
        }

        if (rating === 0) {
            setError('Please select a rating');
            return;
        }

        setIsSubmitting(true);
        setError('');

        try {
            const response = await fetch('/api/reviews', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    careId,
                    userId: session.user.id,
                    rating,
                    comment,
                    username: session.user.name
                }),
            });

            const data = await response.json();
            if (data.success) {
                setReviews(data.data.reviews);
                setAverageRating(data.data.averageRating);
                setTotalReviews(data.data.totalReviews);
                setRating(0);
                setComment('');
                setError('');
            } else {
                setError(data.message || 'Failed to submit review');
            }
        } catch (err) {
            setError('Failed to submit review. Please try again.');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="p-4 bg-white rounded-lg shadow">
            <h2 className="text-2xl font-bold mb-4">Reviews</h2>
            
            {/* Average Rating Display */}
            <div className="mb-6">
                <div className="flex items-center gap-2">
                    <div className="text-3xl font-bold">{Number(averageRating).toFixed(1)}</div>
                    <div className="flex">
                        {[1, 2, 3, 4, 5].map((index) => (
                            <Star
                                key={index}
                                className={`w-5 h-5 ${
                                    index <= averageRating
                                        ? 'text-yellow-400 fill-yellow-400'
                                        : 'text-gray-300'
                                }`}
                            />
                        ))}
                    </div>
                    <span className="text-gray-500">({totalReviews} reviews)</span>
                </div>
            </div>

            {/* Review Form */}
            {session?.user ? (
                <form onSubmit={handleSubmit} className="mb-8">
                    <div className="mb-4">
                        <label className="block mb-2">Your Rating</label>
                        <div className="flex gap-1">
                            {[1, 2, 3, 4, 5].map((index) => (
                                <Star
                                    key={index}
                                    className={`w-6 h-6 cursor-pointer ${
                                        index <= (hover || rating)
                                            ? 'text-yellow-400 fill-yellow-400'
                                            : 'text-gray-300'
                                    }`}
                                    onClick={() => setRating(index)}
                                    onMouseEnter={() => setHover(index)}
                                    onMouseLeave={() => setHover(0)}
                                />
                            ))}
                        </div>
                    </div>

                    <div className="mb-4">
                        <label className="block mb-2">Your Review</label>
                        <textarea
                            className="w-full p-2 border rounded"
                            rows={4}
                            value={comment}
                            onChange={(e) => setComment(e.target.value)}
                            required
                            disabled={isSubmitting}
                        />
                    </div>

                    {error && (
                        <div className="text-red-500 mb-4">{error}</div>
                    )}

                    <button
                        type="submit"
                        className={`bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 disabled:bg-blue-300`}
                        disabled={isSubmitting}
                    >
                        {isSubmitting ? 'Submitting...' : 'Submit Review'}
                    </button>
                </form>
            ) : (
                <div className="mb-8 p-4 bg-gray-50 rounded text-center">
                    Please login to submit a review
                </div>
            )}

            {/* Reviews List */}
            <div className="space-y-4">
                {reviews.length > 0 ? (
                    reviews.map((review, index) => (
                        <div key={index} className="border-b pb-4">
                            <div className="flex items-center gap-3 mb-2">
                                <img
                                    src={review.userAvatar}
                                    alt={review.username}
                                    className="w-10 h-10 rounded-full"
                                />
                                <div>
                                    <div className="font-semibold">{review.username}</div>
                                    <div className="flex items-center gap-2">
                                        <div className="flex">
                                            {[1, 2, 3, 4, 5].map((index) => (
                                                <Star
                                                    key={index}
                                                    className={`w-4 h-4 ${
                                                        index <= review.rating
                                                            ? 'text-yellow-400 fill-yellow-400'
                                                            : 'text-gray-300'
                                                    }`}
                                                />
                                            ))}
                                        </div>
                                        <span className="text-sm text-gray-500">
                                            {new Date(review.createdAt).toLocaleDateString()}
                                        </span>
                                    </div>
                                </div>
                            </div>
                            <p className="text-gray-700">{review.comment}</p>
                        </div>
                    ))
                ) : (
                    <div className="text-center text-gray-500">
                        No reviews yet. Be the first to review!
                    </div>
                )}
            </div>
        </div>
    );
}