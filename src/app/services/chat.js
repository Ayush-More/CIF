// Fetch chat rooms for a user
export const fetchChatRooms = async (userId) => {
    try {
        const response = await fetch('/api/chat/fetch-chat-rooms', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ user_id: userId })
        });

        const data = await response.json();
        if (!data.success) {
            throw new Error(data.message);
        }

        return data.data;
    } catch (error) {
        console.error('Fetch Chat Rooms Error:', error);
        throw error;
    }
};

// Handle chat operations (save message, update status)
export const handleChatOperation = async (type, data) => {
    try {
        // Validate required fields before sending
        if (!type || !data.roomID || !data.sender) {
            throw new Error('Missing required fields: type, room_id, and sender are required');
        }

        // For saveChat operation, validate message
        if (type === 'saveChat' && !data.message) {
            throw new Error('Message content is required for saveChat operation');
        }

        const response = await fetch('/api/chat/handle-chat-operation', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                type,
                ...data
            })
        });

        const result = await response.json();
        if (!result.success) {
            throw new Error(result.message);
        }

        return result.data;
    } catch (error) {
        console.error('Chat Operation Error:', error);
        throw error;
    }
};

export const fetchChatProfile = async (userId) => {
    try {
        const response = await fetch('/api/chat/chat-profile', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ user_id: userId })
        });

        const data = await response.json();
        if (!data.success) {
            throw new Error(data.message);
        }

        return data.data;
    } catch (error) {
        console.error('Fetch Chat Profile Error:', error);
        throw error;
    }
};