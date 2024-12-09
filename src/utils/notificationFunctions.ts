export const sendNotificationToBuddy = async (buddyEmail: string, message: string) => {
  try {
    const response = await fetch("http://localhost:3000/notify", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        buddyEmail,
        message,
      }),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    console.log("Notification sent successfully");
  } catch (error) {
    console.error("Error sending notification:", error);
  }
}; 