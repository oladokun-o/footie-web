import { Order, OrderStatus } from "src/app/core/interfaces/order.interface";

export class OrdersHelpers {
  // Display the order status in a human-readable format
  getOrderStatus(status: OrderStatus): string {
    switch (status) {
      case "Pending":
        return "Pending Courier Allocation";
      case "Accepted":
        return "Accepted";
      case "InProgress":
        return "In Transit";
      case "Delivered":
        return "Delivered";
      case "Cancelled":
        return "Cancelled";
      case "Failed":
        return "Failed";
      default:
        return "Unknown";
    }
  }

  // Get the order status color based on the status
  getOrderStatusColor(status: OrderStatus): string {
    switch (status) {
      case "Pending":
        return "orange";
      case "Accepted":
        return "blue";
      case "InProgress":
        return "green";
      case "Delivered":
        return "green";
      case "Cancelled":
        return "red";
      case "Failed":
        return "red";
      default:
        return "gray";
    }
  }

  // Display the order delivery mode icon based on the delivery mode
  getDeliveryModeIcon(order: Order): string {
    switch (order.deliveryMode) {
      case "feet":
        return "assets/images/icons/feet-mode.svg";
      case "bike":
        return "assets/images/icons/bike-mode.svg";
      case "car":
        return "assets/images/icons/car-mode.svg";
      case "van":
        return "assets/images/icons/van-mode.svg";
      case "truck":
        return "assets/images/icons/truck-mode.svg";
      default:
        return "assets/images/icons/feet-mode.svg";
    }
  }

  getEstimatedDeliveryTime(order: Order): string {
    // format: Delivery Time Left: 30 minutes | Order Placed: 1 hour ago based on whether the order has been accepted and in progress or completed
    if (order.status === "Accepted") {
      return "Order Accepted, Awaiting Pickup"
    } else if(order.status === "InProgress") {
      // Calculate the time left for delivery
      const estimatedDeliveryTime = new Date(order.estimatedDeliveryTime as Date).getTime();
      const currentTime = new Date().getTime();
      const timeLeft = estimatedDeliveryTime - currentTime;
      const minutesLeft = Math.floor(timeLeft / 60000);
      return `Delivery Time Left: ${minutesLeft} minutes`;
    } else {
      // Calculate the time since the order was placed
      const createdAt = new Date(order.createdAt).getTime();
      const currentTime = new Date().getTime();
      const timePassed = currentTime - createdAt;
      const hoursPassed = Math.floor(timePassed / 3600000);
      return `Order Placed: ${hoursPassed} hours ago`;
    }
  }
}
