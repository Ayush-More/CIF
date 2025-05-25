const sendEmailNotification = async (recipientEmail, senderName, messagePreview) => {
    try {
        const response = await fetch('/api/email/send-notification', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                recipientEmail,
                senderName,
                messagePreview
            })
        });

        const data = await response.json();
        if (!data.success) {
            throw new Error(data.message);
        }

        return data;
    } catch (error) {
        console.error('Send Email Notification Error:', error);
        throw error;
    }
};

export { sendEmailNotification };