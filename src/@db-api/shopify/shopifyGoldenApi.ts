import toast from "react-hot-toast";
import bkUrl from "src/configs/bkUrl";

export const deleteOrder = async (orderId: string, onReloadData: () => void) => {
  try {
    const response = await fetch(`${bkUrl}/shopify-email/deleteOrderByOrderNumber`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Cookie: "jwt=your_jwt_token_here",
      },
      body: JSON.stringify({
        orderId: orderId,
      }),
    });

    if (response.ok) {
      toast.success((response as any)?.message ?? "Deleted order successfully")
      onReloadData();
    } else {
      toast.error('Error deleting the order', {
        duration: 2000
      });
    }
  } catch (error) {
    console.error("Error deleting order:", error);
  }
}

export const sendTestMessage = async (orderId: string, msgId: string) => {
  try {
    const response = await fetch(`${bkUrl}/shopify-email/testSendMessage`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Cookie: "jwt=your_jwt_token_here",
      },
      body: JSON.stringify({
        orderId, msgId
      }),
    });

    if (response.ok) {
      toast.success((response as any)?.message ?? "Message sent successfully");
    } else {
      toast.error('Error sending test message', {
        duration: 2000
      });
    }
  } catch (error) {
    console.error("Error in sendTestMessage:", error);
  }
}

export const updateOrderStatus = async (status: string, orderIds: string[]) => {
  try {
    const response = await fetch(`${bkUrl}/shopify-email/updateStatus`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Cookie: "jwt=your_jwt_token_here",
      },
      body: JSON.stringify({
        status, orderIds
      }),
    });

    if (response.ok) {
      toast.success((response as any)?.body?.message ?? "Status updated successfully!");
    } else {
      toast.error('Error updating status', {
        duration: 2000
      });
    }
  } catch (error) {
    console.error("Error in updateOrderStatus:", error);
  }
}

export const updateMessageTemplate = async (selectedMessageKey: string, value: string) => {
  try {
    const response = await fetch(`${bkUrl}/message/updateMessage/${selectedMessageKey}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Cookie: "jwt=your_jwt_token_here",
      },
      body: JSON.stringify({ value }),
    });

    if (response.ok) {
      toast.success((response as any)?.message ?? "Template updated successfully");
      
      return true
    } else {
      toast.error('Failed to update message template', {
        duration: 2000
      });
    }
  } catch (error) {
    console.error("Error in updateMessageTemplate:", error);
  }
}
