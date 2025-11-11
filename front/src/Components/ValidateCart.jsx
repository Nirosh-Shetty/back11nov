// Short Cart Address Validation - All Features
import { useEffect } from 'react';
import Swal2 from 'sweetalert2';

// Main validation function
const ValidateCart = (address, Carts, setCarts, fooditemdata) => {
  if (!address || !Carts?.length || !fooditemdata?.length) return;

  const location = `${address?.apartmentname || address?.Apartmentname}, ${address?.Address || address?.address}, ${address?.pincode}`;
  const validItems = [];
  const removedItems = [];
  const updatedItems = [];

  Carts.forEach(cartItem => {
    const foodItem = fooditemdata.find(item => item._id === cartItem.foodItemId);
    const matchedLocation = foodItem?.locationPrice?.find(loc => 
      loc.loccationAdreess?.includes(location)
    );

    if (matchedLocation?.Remainingstock > 0) {
      const newQty = Math.min(cartItem.Quantity, matchedLocation.Remainingstock);
      const newPrice = matchedLocation.foodprice;
      
      validItems.push({
        ...cartItem,
        price: newPrice,
        totalPrice: newPrice * newQty,
        remainingstock: matchedLocation.Remainingstock,
        Quantity: newQty
      });

      if (cartItem.price !== newPrice || cartItem.Quantity !== newQty) {
        updatedItems.push(cartItem.foodname);
      }
    } else {
      removedItems.push(cartItem.foodname);
    }
  });

  // Show notification if changes
  if (removedItems.length || updatedItems.length) {
    let msg = '';
    if (removedItems.length) msg += `Removed: ${removedItems.join(', ')}<br/>`;
    if (updatedItems.length) msg += `Updated: ${updatedItems.join(', ')}`;
    
    Swal2.fire({
      title: 'Cart Updated',
      html: msg,
      icon: 'info',
      toast: true,
      position: 'bottom',
      timer: 3000,
      showConfirmButton: false,
      timerProgressBar: true,
      customClass: {
        popup: 'me-small-toast',
        title: 'me-small-toast-title'
      }

    });
  }

  setCarts(validItems);
  localStorage.setItem("cart", JSON.stringify(validItems));
};


export default ValidateCart;