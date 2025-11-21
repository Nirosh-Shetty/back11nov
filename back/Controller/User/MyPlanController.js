const MyPlanModel = require("../../Model/User/MyPlan");
const CartModel = require("../../Model/User/Cart");
const moment = require("moment"); 

class MyPlanController {
  
  async addToPlan(req, res) {
    try {
      const { userId, items } = req.body; // items = [{ foodItemId, deliveryDate, session, price, ... }]

      if (!userId || !items || items.length === 0) {
        return res.status(400).json({ error: "Invalid data" });
      }

      // 1. Group Items by "Date|Session"
      const groupedData = items.reduce((acc, item) => {
        const key = `${item.deliveryDate}|${item.session}`;
        if (!acc[key]) {
            acc[key] = {
                deliveryDate: item.deliveryDate,
                session: item.session,
                hubId: item.locationInfo?.hubId, // Assuming all items in a slot are from the same hub
                products: []
            };
        }
        acc[key].products.push(item);
        return acc;
      }, {});

      const planEntries = [];
      const now = new Date();
      
      // 2. Process each Group (Slot)
      for (const key in groupedData) {
        const slotGroup = groupedData[key];
        const deliveryDate = new Date(slotGroup.deliveryDate);
        
        // Determine Type & Deadline
        // Using moment to compare dates without time
        const isToday = moment(deliveryDate).isSame(now, 'day');
        
        let deadline;
        let type;

        if (isToday) {
            type = "Instant";
            deadline = moment(now).add(10, 'minutes').toDate();
        } else {
            type = "Preorder";
            // Cutoff Logic
            if (slotGroup.session === "Lunch") {
                deadline = moment(deliveryDate).set({ hour: 11, minute: 0, second: 0 }).toDate();
            } else {
                deadline = moment(deliveryDate).set({ hour: 18, minute: 0, second: 0 }).toDate();
            }
        }

        // Calculate Slot Total and Format Products
        let slotTotalAmount = 0;
        const formattedProducts = slotGroup.products.map(p => {
            const pTotal = p.price * p.Quantity;
            slotTotalAmount += pTotal;
            return {
                foodItemId: p.foodItemId,
                foodName: p.foodname,
                foodImage: p.image,
                foodCategory: p.foodcategory,
                price: p.price, // This should be Hub Price (Today) or Reserved Price (Future) sent from Frontend
                quantity: p.Quantity,
                totalPrice: pTotal
            };
        });

        planEntries.push({
            userId: userId,
            deliveryDate: deliveryDate,
            session: slotGroup.session,
            hubId: slotGroup.hubId || "UNKNOWN",
            products: formattedProducts, // Array of products
            slotTotalAmount: slotTotalAmount,
            status: "Pending Payment",
            orderType: type,
            paymentDeadline: deadline
        });
      }

      // 3. Save to DB
      // We use bulkWrite or insertMany. 
      // NOTE: If a plan already exists for this slot, we might want to update it? 
      // For now, let's assume we append or replace. Simple insert implies appending.
      await MyPlanModel.insertMany(planEntries);

      // 4. Clear Cart
      await CartModel.deleteMany({ userId: userId });

      return res.status(200).json({ 
          success: true, 
          message: "Items moved to My Plan successfully",
          count: planEntries.length
      });

    } catch (error) {
      console.error("Error adding to plan:", error);
      return res.status(500).json({ error: "Internal Server Error" });
    }
  }

  // ... (getMyPlan function remains similar, just fetching the new structure)
  async getMyPlan(req, res) {
      try {
          const { userId } = req.params;
          const planItems = await MyPlanModel.find({ userId: userId })
            .sort({ deliveryDate: 1, session: 1 });
          return res.status(200).json({ success: true, data: planItems });
      } catch (error) {
          console.error("Error fetching plan:", error);
          return res.status(500).json({ error: "Internal Server Error" });
      }
  }
}

module.exports = new MyPlanController();