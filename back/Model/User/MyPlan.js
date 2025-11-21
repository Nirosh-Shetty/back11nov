const mongoose = require("mongoose");
const { ObjectId } = mongoose.Schema.Types;

const myPlanSchema = new mongoose.Schema(
  {
    userId: { type: ObjectId, ref: "Customer", required: true },

    // Grouping Fields
    deliveryDate: { type: Date, required: true },
    session: { type: String, enum: ["Lunch", "Dinner"], required: true },
    hubId: { type: String, required: true }, 

    products: [
      {
        foodItemId: { type: ObjectId, ref: "addproduct" },
        foodName: { type: String },
        foodImage: { type: String },
        foodCategory: { type: String },

        // This price will be determined by Logic (Instant Price vs Reserved Price)
        price: { type: Number, required: true },
        quantity: { type: Number, required: true },
        totalPrice: { type: Number, required: true },
      },
    ],

    // Slot Totals
    slotTotalAmount: { type: Number, required: true }, // Sum of all products in this slot

    // Status & Logic
    // Pending Payment: Added to plan, not paid
    // Confirmed: Paid and active
    // Skipped: User chose to skip or deadline passed
    // Cancelled: Paid but cancelled by user/admin
    // Delivered: Food delivered
    status: {
      type: String,
      enum: [
        "Pending Payment",
        "Confirmed",
        "Skipped",
        "Cancelled",
        "Delivered",
      ],
      default: "Pending Payment",
    },
    orderType: {
      type: String,
      enum: ["Instant", "Preorder"],
      required: true,
    },
    paymentDeadline: { type: Date, required: true },

    // If paid, link to the Order ID
    orderId: { type: ObjectId, ref: "Order", default: null },
  },
  { timestamps: true }
);

// Index to quickly find a user's plan for a specific date/session
myPlanSchema.index({ userId: 1, deliveryDate: 1, session: 1 });

const MyPlanModel = mongoose.model("MyPlan", myPlanSchema);
module.exports = MyPlanModel;
