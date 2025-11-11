// import React, { useContext, useEffect, useMemo, useState } from "react";
// import { FaPlus, FaMinus } from "react-icons/fa6";
// import { Button, Container, Form, Modal, Spinner } from "react-bootstrap";
// import { RxCross2 } from "react-icons/rx";
// import { MdRemoveShoppingCart } from "react-icons/md";
// import "../Styles/Checkout.css";
// import { FaCheck } from "react-icons/fa";
// import { useNavigate, useLocation } from "react-router-dom";
// import { MdOutlineEditLocationAlt } from "react-icons/md";
// import axios from "axios";
// import swal from "sweetalert";
// import moment from "moment";
// import { WalletContext } from "../WalletContext";
// import { BiSolidOffer } from "react-icons/bi";
// import Swal2 from "sweetalert2";
// import DeliverySlots from "./DeliverySlots";
// import "../Styles/Normal.css";

// const Checkout = () => {
//   const navigate = useNavigate();
//   const { wallet, walletSeting } = useContext(WalletContext);
//   const location = useLocation();
//   const data = location?.state;
//   const addresstype = localStorage.getItem("addresstype");
//   const [address, setAddress] = useState({});

//   useMemo(() => {
//     setAddress(
//       addresstype === "apartment"
//         ? JSON.parse(localStorage.getItem("address"))
//         : JSON.parse(localStorage.getItem("coporateaddress"))
//     );
//   }, [addresstype]);

//   const Carts = JSON.parse(localStorage.getItem("cart")) || [];
//   const [cartdata, setCartData] = useState([]);
//   const user = JSON.parse(localStorage.getItem("user"));

//   const [show, setShow] = useState(false);
//   const handleClose = () => setShow(false);
//   const handleShow = () => setShow(true);

//   const [apartmentdata, setapartmentdata] = useState([]);
//   const getapartmentd = async () => {
//     try {
//       let res = await axios.get("http://localhost:7013/api/admin/getapartment");
//       if (res.status === 200) {
//         setapartmentdata(res.data.corporatedata);
//       }
//     } catch (error) {
//       console.log(error);
//     }
//   };

//   const [corporatedata, setcorporatedata] = useState([]);
//   const getCorporatedata = async () => {
//     try {
//       let res = await axios.get("http://localhost:7013/api/admin/getcorporate");
//       if (res.status === 200) {
//         setcorporatedata(res.data.corporatedata);
//       }
//     } catch (error) {
//       console.log(error);
//     }
//   };

//   const getcartData = () => {
//     const getc = JSON.parse(localStorage.getItem("cart")) || [];
//     setCartData(getc);
//   };

//   useEffect(() => {
//     getapartmentd();
//     getCorporatedata();
//     setCartData(Carts);
//   }, []);

//   const updateCartData = (updatedCart) => {
//     localStorage.setItem("cart", JSON.stringify(updatedCart));
//     // setCartData(updatedCart);

//     getcartData();
//     setDiscountWallet(
//       calculateTaxPrice + subtotal + Cutlery <=
//         walletSeting.minCartValueForWallet
//         ? discountWallet
//         : 0
//     );
//   };

//   const debounce = (func, delay) => {
//     let timeoutId;
//     return (...args) => {
//       clearTimeout(timeoutId);
//       timeoutId = setTimeout(() => func(...args), delay);
//     };
//   };

//   let isProcessing = false;

//   const increaseQuantity = (itemdata) => {
//     // Prevent multiple simultaneous operations
//     if (isProcessing) return;
//     isProcessing = true;

//     try {
//       // console.log("increase itemdata", itemdata);

//       if (!itemdata?.offerProduct) {
//         const updatedCart = cartdata.map((item) => {
//           if (item.foodItemId === itemdata?.foodItemId && !item.offerProduct) {
//             if (item.Quantity < item.remainingstock) {
//               item.Quantity += 1;
//               item.totalPrice = Number(item.price) * Number(item.Quantity);
//             } else {
//               Swal2.fire({
//                 toast: true,
//                 position: "bottom",
//                 icon: "error",
//                 title: "Stock Alert",
//                 text: `No more stock available!`,
//                 showConfirmButton: false,
//                 timer: 3000,
//                 timerProgressBar: true,
//                 customClass: {
//                   popup: "me-small-toast",
//                   title: "me-small-toast-title",
//                 },
//               });
//             }
//           }
//           return item;
//         });
//         updateCartData(updatedCart);
//         return;
//       } else {
//         const offerPrXt = cartdata?.find(
//           (ele) => ele.foodItemId === itemdata?.foodItemId && ele.extra == true
//         );
//         if (offerPrXt) {
//           const updatedCart = cartdata.map((item) => {
//             if (
//               item.foodItemId === itemdata?.foodItemId &&
//               item.extra === true
//             ) {
//               if (item.Quantity < item.remainingstock) {
//                 item.Quantity += 1;
//                 item.totalPrice = Number(item.price) * Number(item.Quantity);
//               } else {
//                 Swal2.fire({
//                   toast: true,
//                   position: "bottom",
//                   icon: "error",
//                   title: "Stock Alert",
//                   text: `No more stock available!`,
//                   showConfirmButton: false,
//                   timer: 3000,
//                   timerProgressBar: true,
//                   customClass: {
//                     popup: "me-small-toast",
//                     title: "me-small-toast-title",
//                   },
//                 });
//               }
//             }
//             return item;
//           });

//           updateCartData(updatedCart);
//         } else {
//           const offerPr2 = cartdata?.find(
//             (ele) => ele.foodItemId === itemdata?.foodItemId && !ele.extra
//           );
//           if (offerPr2.offerQ > offerPr2.Quantity) {
//             const updatedCart = cartdata.map((item) => {
//               if (item.foodItemId === itemdata?.foodItemId && !item.extra) {
//                 if (item.Quantity < item.remainingstock) {
//                   item.Quantity += 1;
//                   item.totalPrice = Number(item.price) * Number(item.Quantity);
//                 } else {
//                   Swal2.fire({
//                     toast: true,
//                     position: "bottom",
//                     icon: "error",
//                     title: "Stock Alert",
//                     text: `No more stock available!`,
//                     showConfirmButton: false,
//                     timer: 3000,
//                     timerProgressBar: true,
//                     customClass: {
//                       popup: "me-small-toast",
//                       title: "me-small-toast-title",
//                     },
//                   });
//                 }
//               }
//               return item;
//             });
//             updateCartData(updatedCart);
//           } else {
//             updateCartData([
//               ...cartdata,
//               {
//                 ...itemdata,
//                 Quantity: 1,
//                 remainingstock: itemdata.remainingstock - itemdata.Quantity,
//                 extra: true,
//                 price: itemdata.actualPrice,
//                 offerProduct: false,
//                 totalPrice: Number(itemdata.actualPrice) * 1,
//               },
//             ]);
//           }
//         }
//       }
//     } finally {
//       // Reset processing flag after a short delay
//       setTimeout(() => {
//         isProcessing = false;
//       }, 100);
//     }
//   };

//   const decreaseQuantity = (itemdata) => {
//     // Prevent multiple simultaneous operations
//     if (isProcessing) return;
//     isProcessing = true;

//     try {
//       // Handle offer products (when itemdata itself is an offer product)
//       if (itemdata?.offerProduct) {
//         console.log("Offer==>", itemdata);
//         const updatedCart = cartdata
//           .map((item) => {
//             // Only decrease the exact matching offer product item
//             if (item.foodItemId === itemdata?.foodItemId && item.offerProduct) {
//               if (item.Quantity > 0) {
//                 item.Quantity -= 1;
//                 item.totalPrice = Number(item.price) * Number(item.Quantity);
//               }
//             }
//             return item;
//           })
//           .filter((item) => item.Quantity > 0);
//         updateCartData(updatedCart);
//       }
//       // Handle regular products and extra offer items
//       else {
//         // Check if there's an extra offer item for this product
//         const offerPrXt = cartdata?.find(
//           (ele) => ele.foodItemId === itemdata?.foodItemId && ele.extra === true
//         );
//         if (offerPrXt) {
//           console.log("Offer extra ==>", itemdata);
//           // Decrease the extra offer item first (LIFO - Last In First Out)
//           const updatedStoredCart = cartdata
//             .map((item) => {
//               if (
//                 item.foodItemId === itemdata?.foodItemId &&
//                 item.extra === true
//               ) {
//                 if (item.Quantity > 0) {
//                   item.Quantity -= 1;
//                   item.totalPrice = Number(item.price) * Number(item.Quantity);
//                 }
//               }
//               return item;
//             })
//             .filter((item) => item.Quantity > 0);
//           updateCartData(updatedStoredCart);
//         } else {
//           // No extra items, decrease the regular item
//           // Make sure we're targeting the correct item type
//           console.log("Normal product ==>", itemdata);
//           const updatedExtraCart = cartdata
//             .map((item) => {
//               // Match foodItemId and ensure it's not an extra item and matches offer status
//               if (
//                 item.foodItemId === itemdata?.foodItemId &&
//                 !item.extra &&
//                 item.offerProduct === (itemdata?.offerProduct || false)
//               ) {
//                 if (item.Quantity > 0) {
//                   item.Quantity -= 1;
//                   item.totalPrice = Number(item.price) * Number(item.Quantity);
//                 }
//               }
//               return item;
//             })
//             .filter((item) => item.Quantity > 0);

//           updateCartData(updatedExtraCart);
//         }
//       }
//     } finally {
//       // Reset processing flag after a short delay
//       setTimeout(() => {
//         isProcessing = false;
//       }, 100);
//     }
//   };

//   const debouncedIncreaseQuantity = debounce(increaseQuantity, 300);
//   const debouncedDecreaseQuantity = debounce(decreaseQuantity, 300);

//   const [delivarychargetype, setdelivarychargetype] = useState(0);
//   const [selectedOption, setSelectedOption] = useState("");
//   const handleSelection = (deliveryCharge, option) => {
//     setdelivarychargetype(deliveryCharge);
//     setSelectedOption(option);
//   };

//   const [slotdata, setslotdata] = useState("");
//   const [Cutlery, setCutlery] = useState(0);
//   const [paymentmethod] = useState("Online");
//   const [name, setname] = useState("");
//   const [buildingaddress, setbuildingaddress] = useState("");
//   const [mobilenumber, setmobilenumber] = useState("");
//   const [flat, setFlat] = useState("");
//   const [towerName, setTowerName] = useState("");
//   const [apartmentname, setApartmentname] = useState("");
//   const [couponId, setCouponId] = useState("");
//   const [coupon, setCoupon] = useState(0);
//   const [discountWallet, setDiscountWallet] = useState(0);

//   const slots = {
//     lunch: [
//       { start: "12:30", end: "12:45" },
//       { start: "12:45", end: "13:00" },
//       { start: "13:00", end: "13:15" },
//       { start: "13:15", end: "13:30" },
//       { start: "13:30", end: "13:45" },
//       { start: "13:45", end: "14:00" },
//       { start: "14:00", end: "14:15" },
//       { start: "14:15", end: "14:30" },
//       { start: "14:30", end: "14:45" },
//     ],
//     dinner: [
//       { start: "19:30", end: "19:45" },
//       { start: "19:45", end: "20:00" },
//       { start: "20:00", end: "20:15" },
//       { start: "20:15", end: "20:30" },
//       { start: "20:30", end: "20:45" },
//       { start: "20:45", end: "21:00" },
//       { start: "21:00", end: "21:15" },
//       { start: "21:15", end: "21:30" },
//     ],
//   };

//   const [availableSlots, setAvailableSlots] = useState([]);
//   const [endstatus, setEndstatus] = useState(false);
//   const [promoCode, setPromoCode] = useState('');
//   const [isWalletSelected, setIsWalletSelected] = useState(false);
//   const applycoupon = async () => {
//     try {
//       if (!couponId) {
//         Swal2.fire({
//           toast: true,
//           position: "bottom",
//           icon: "error",
//           title: "Coupon Alert",
//           text: `Please enter coupon code!`,
//           showConfirmButton: false,
//           timer: 3000,
//           timerProgressBar: true,
//           customClass: {
//             popup: "me-small-toast",
//             title: "me-small-toast-title",
//           },
//         });
//         return;
//       }
//       const config = {
//         url: "/admin/applyCoupon",
//         method: "post",
//         baseURL: "http://localhost:7013/api/",
//         headers: { "content-type": "application/json" },
//         data: {
//           mobileNumber: user?.Mobile,
//           couponName: couponId,
//           cards: cartdata,
//         },
//       };
//       const response = await axios(config);
//       if (response.status === 200) {
//         setCoupon(response.data.discountPrice);
//         Swal2.fire({
//           toast: true,
//           position: "bottom",
//           icon: "success",
//           title: "Applied",
//           text: `Coupon Applied Successfully`,
//           showConfirmButton: false,
//           timer: 3000,
//           timerProgressBar: true,
//           customClass: {
//             popup: "me-small-toast",
//             title: "me-small-toast-title",
//           },
//         });
//       }
//     } catch (error) {
//       Swal2.fire({
//         toast: true,
//         position: "bottom",
//         icon: "error",
//         title: "Warning",
//         text: error?.response?.data.message || "Something went wrong",
//         showConfirmButton: false,
//         timer: 3000,
//         timerProgressBar: true,
//         customClass: {
//           popup: "me-small-toast",
//           title: "me-small-toast-title",
//         },
//       });

//       setCoupon(0);
//       setCouponId("");
//     }
//   };

//   const [adcartId, setAdCartId] = useState({});
//   useEffect(() => {
//     const addonedCarts = async () => {
//       try {
//         let res = await axios.post("http://localhost:7013/api/cart/addCart", {
//           userId: user?._id,
//           items: Carts,
//           lastUpdated: Date.now(),
//           username: address?.name,
//           mobile: user?.Mobile,
//           companId: user?.companyId,
//         });
//         if (res.status === 200) {
//           setAdCartId(res.data);
//         }
//       } catch (error) {
//         console.log(error);
//       }
//     };
//     if (Carts.length > 0) {
//       addonedCarts();
//     }
//   }, [JSON.stringify(Carts)]);

//   const validateSlotAndCart = async () => {
//     try {
//       const cartResponse = await axios.get(
//         "http://localhost:7013/api/admin/getFoodItemsUnBlocks",
//         {
//           cartItems: cartdata,
//           slot: slotdata,
//         }
//       );
//       if (!cartResponse.status === 200) {
//         let soldOutItems = cartResponse.data.data || [];
//         let card = cartdata.map((prevCart) =>
//           updateCartDataWithStock(prevCart, soldOutItems)
//         );
//         if (card.length > 0) {
//           Swal2.fire({
//             toast: true,
//             position: "bottom",
//             icon: "error",
//             title: "Items Sold Out",
//             text: `The following items are sold out: ${card
//               .map((item) => item.foodname)
//               .join(", ")}. Please remove them from your cart.`,
//             showConfirmButton: false,
//             timer: 3000,
//             timerProgressBar: true,
//             customClass: {
//               popup: "me-small-toast",
//               title: "me-small-toast-title",
//             },
//           });

//           return false;
//         }
//       }
//       return true;
//     } catch (error) {
//       Swal2.fire({
//         toast: true,
//         position: "bottom",
//         icon: "info",
//         title: "Slot",
//         text: `Failed to validate slot or cart. Please try again.`,
//         showConfirmButton: false,
//         timer: 3000,
//         timerProgressBar: true,
//         customClass: {
//           popup: "me-small-toast",
//           title: "me-small-toast-title",
//         },
//       });

//       return false;
//     }
//   };

//   const appLyOffferCustome = async (
//     customerName,
//     phone,
//     totalOrders,
//     product,
//     cartValue,
//     offerPrice,
//     location
//   ) => {
//     try {
//       await axios.post("http://localhost:7013/api/admin/createreports", {
//         customerName,
//         phone,
//         totalOrders,
//         product,
//         cartValue,
//         offerPrice,
//         location,
//       });
//     } catch (error) {
//       console.log(error);
//     }
//   };

//   const [loading, setLoading] = useState(false);
//   const placeorder = async () => {
//     try {
//       setLoading(true);
//       if (Carts.length < 1) {
//         setLoading(false);
//         Swal2.fire({
//           toast: true,
//           position: "bottom",
//           icon: "info",
//           title: "Cart Alert",
//           text: `Please add items to cart`,
//           showConfirmButton: false,
//           timer: 3000,
//           timerProgressBar: true,
//           customClass: {
//             popup: "me-small-toast",
//             title: "me-small-toast-title",
//           },
//         });
//         return;
//       }

//       if (!selectedOption && addresstype !== "corporate") {
//         setLoading(false);
//         Swal2.fire({
//           toast: true,
//           position: "bottom",
//           icon: "info",
//           title: "Delivery Type",
//           text: `Please select the delivery type!`,
//           showConfirmButton: false,
//           timer: 3000,
//           timerProgressBar: true,
//           customClass: {
//             popup: "me-small-toast",
//             title: "me-small-toast-title",
//           },
//         });
//         return;
//       }

//       if (!slotdata) {
//         setLoading(false);
//         Swal2.fire({
//           toast: true,
//           position: "bottom",
//           icon: "info",
//           title: "Slot Alert",
//           text: `Please select a delivery slot!`,
//           showConfirmButton: false,
//           timer: 3000,
//           timerProgressBar: true,
//           customClass: {
//             popup: "me-small-toast",
//             title: "me-small-toast-title",
//           },
//         });
//         return;
//       }
//       if (!address?.name) {
//         setLoading(false);
//         Swal2.fire({
//           toast: true,
//           position: "bottom",
//           icon: "info",
//           title: "Address",
//           text: `Please enter your address`,
//           showConfirmButton: false,
//           timer: 3000,
//           timerProgressBar: true,
//           customClass: {
//             popup: "me-small-toast",
//             title: "me-small-toast-title",
//           },
//         });
//         return;
//       }
//       if (!addresstype) {
//         setLoading(false);
//         Swal2.fire({
//           toast: true,
//           position: "bottom",
//           icon: "info",
//           title: "Address type",
//           text: `Please select the address type!`,
//           showConfirmButton: false,
//           timer: 3000,
//           timerProgressBar: true,
//           customClass: {
//             popup: "me-small-toast",
//             title: "me-small-toast-title",
//           },
//         });
//         return;
//       }

//       const isValid = await validateSlotAndCart();
//       if (!isValid) {
//         setLoading(false);
//         return;
//       }

//       const totalP = (
//         calculateTaxPrice +
//         subtotal +
//         Cutlery +
//         delivarychargetype -
//         discountWallet -
//         coupon
//       ).toFixed(2);
//       if (totalP < 0) {
//         setLoading(false);
//         Swal2.fire({
//           toast: true,
//           position: "bottom",
//           icon: "error",
//           title: "Order Amount",
//           text: `Invalid order amount`,
//           showConfirmButton: false,
//           timer: 3000,
//           timerProgressBar: true,
//           customClass: {
//             popup: "me-small-toast",
//             title: "me-small-toast-title",
//           },
//         });
//         return;
//       }

//       const checkMin = cartdata.find((ele) => ele.offerProduct === true);

//       if (checkMin && checkMin.minCart && checkMin.minCart > subtotal) {
//         setLoading(false);

//         return Swal2.fire({
//           toast: true,
//           position: "bottom",
//           icon: "info",
//           title: "Cart",
//           text: `₹${checkMin.minCart} needed - ${checkMin.foodname} | Cart: ₹${subtotal}`,
//           showConfirmButton: false,
//           timer: 3000,
//           timerProgressBar: true,
//           customClass: {
//             popup: "me-small-toast",
//             title: "me-small-toast-title",
//           },
//         });
//       }

//       const formattedProducts = cartdata.map((item) => ({
//         foodItemId: item.foodItemId,
//         totalPrice: item.totalPrice,
//         quantity: item.Quantity,
//       }));

//       const generateUniqueId = () => {
//         const timestamp = Date.now().toString().slice(-4);
//         const randomNumber = Math.floor(1000 + Math.random() * 9000);
//         return `${address?.prefixcode}${timestamp}${randomNumber}`;
//       };

//       const config = {
//         url: "/admin/addfoodorder",
//         method: "post",
//         baseURL: "http://localhost:7013/api/",
//         headers: { "content-type": "application/json" },
//         data: {
//           customerId: user?._id,
//           allProduct: formattedProducts,
//           Placedon: new Date(),
//           delivarylocation: address?.apartmentname,
//           username: address?.name,
//           Mobilenumber: Number(user?.Mobile),
//           paymentmethod: paymentmethod,
//           delivarytype: Number(delivarychargetype || 0),
//           payid: "pay001",
//           addressline: `${address?.name} ${addresstype === "apartment" ? `${address?.flatno},` : ""
//             } ${addresstype === "apartment" ? `${address?.towerName},` : ""} ${address?.mobilenumber
//             }`,
//           subTotal: subtotal,
//           foodtotal: Number(data?.total),
//           allTotal: totalP,
//           tax: calculateTaxPrice,
//           slot: slotdata,
//           status: "Cooking",
//           Cutlery: Number(Cutlery),
//           approximatetime: address?.approximatetime,
//           orderdelivarytype: addresstype,
//           orderstatus: "Scheduled",
//           apartment: address?.apartmentname,
//           prefixcode: address?.prefixcode,
//           orderid: generateUniqueId(),
//           deliveryMethod: selectedOption,
//           coupon: coupon,
//           couponId: couponId,
//           discountWallet: discountWallet,
//           cartId: adcartId?.cartId,
//           cart_id: adcartId?.data,
//           companyId: user?.companyId,
//           companyName: user?.companyName,
//           customerType: user?.status,
//         },
//       };

//       const offerconfig = {
//         url: "/admin/createreports",
//         method: "post",
//         baseURL: "http://localhost:7013/api/",
//         headers: { "content-type": "application/json" },
//         data: {
//           customerName: address?.name,
//           phone: user?.Mobile,
//           totalOrders: totalP,
//           product: checkMin?.foodname,
//           cartValue: subtotal,
//           offerPrice: checkMin?.totalPrice,
//           location: address?.apartmentname,
//         },
//       };

//       const config1 = {
//         url: "/user/addpaymentphonepay",
//         method: "post",
//         baseURL: "http://localhost:7013/api/",
//         headers: { "content-type": "application/json" },
//         data: {
//           userId: user?._id,
//           username: address?.name,
//           Mobile: user?.Mobile,
//           amount: totalP,
//           config: JSON.stringify(config),
//           cartId: adcartId?.cartId,
//           cart_id: adcartId?.data,
//           offerconfig: checkMin ? JSON.stringify(offerconfig) : null,
//         },
//       };
//       // const res = await axios(config);
//       const res = await axios(totalP == 0 ? config : config1);
//       if (res.status === 200) {
//         if (totalP == 0) {
//           if (checkMin) {
//             appLyOffferCustome(
//               address?.name,
//               user?.Mobile,
//               totalP,
//               checkMin?.foodname,
//               subtotal,
//               checkMin?.totalPrice,
//               address?.apartmentname
//             );
//           }
//           Swal2.fire({
//             toast: true,
//             position: "bottom",
//             icon: "success",
//             title: "Order",
//             text: "Order Successfully Done",
//             showConfirmButton: false,
//             timer: 3000,
//             timerProgressBar: true,
//             customClass: {
//               popup: "me-small-toast",
//               title: "me-small-toast-title",
//             },
//           });

//           setLoading(false);
//           localStorage.removeItem("cart");
//           setTimeout(() => {
//             navigate("/orders");
//           }, 600);
//         } else {
//           setLoading(false);
//           window.location.assign(res.data?.url?.url);
//         }
//       }
//     } catch (error) {
//       console.log(error);
//       setLoading(false);
//       Swal2.fire({
//         toast: true,
//         position: "bottom",
//         icon: "error",
//         title: "Warning",
//         text: "Order not complete",
//         showConfirmButton: false,
//         timer: 3000,
//         timerProgressBar: true,
//         customClass: {
//           popup: "me-small-toast",
//           title: "me-small-toast-title",
//         },
//       });
//     }
//   };

//   const getSelectedAddress = async (id) => {
//     setApartmentname(id);
//     try {
//       let res = await axios.get(
//         `http://localhost:7013/api/user/getSelectedAddressByUserIDAddressID/${user?._id}/${id}`
//       );
//       if (res.status === 200) {
//         let am = res.data.getdata;
//         setname(am?.Name || "");
//         setmobilenumber(am?.Number || "");
//         setTowerName(am?.towerName || "");
//         setFlat(am?.fletNumber || "");
//       }
//     } catch (error) {
//       console.log(error);
//     }
//   };

//   const saveSelectedAddress = async (data) => {
//     try {
//       if (!user) return;
//       await axios.post(`http://localhost:7013/api/user/addressadd`, {
//         Name: name,
//         Number: mobilenumber,
//         userId: user?._id,
//         ApartmentName: data?.apartmentname,
//         addresstype: addresstype,
//         addressid: data?._id,
//         fletNumber: flat,
//         towerName: towerName,
//       });
//     } catch (error) {
//       console.log(error);
//     }
//   };

//   const Handeledata = () => {
//     if (!apartmentname) {
//       return alert("Please Select Apartment");
//     }
//     if (!name) {
//       return alert("Please Enter Name!");
//     }
//     if (!mobilenumber) {
//       return alert("Please Enter Mobile Number!");
//     }
//     if (addresstype === "apartment" && !flat) {
//       return alert("Please Enter flat number");
//     }
//     if (addresstype === "apartment" && !towerName) {
//       return alert("Please Enter Tower Name");
//     }

//     const Savedaddress = {
//       _id: (addresstype === "apartment" ? apartmentdata : corporatedata)?.find(
//         (data) => data?.Apartmentname === apartmentname
//       )?._id,
//       apartmentname: (addresstype === "apartment"
//         ? apartmentdata
//         : corporatedata
//       )?.find((data) => data?.Apartmentname === apartmentname)?.Apartmentname,
//       approximatetime: (addresstype === "apartment"
//         ? apartmentdata
//         : corporatedata
//       )?.find((data) => data?.Apartmentname === apartmentname)?.approximatetime,
//       Delivarycharge: (addresstype === "apartment"
//         ? apartmentdata
//         : corporatedata
//       )?.find((data) => data?.Apartmentname === apartmentname)
//         ?.apartmentdelivaryprice,
//       doordelivarycharge: (addresstype === "apartment"
//         ? apartmentdata
//         : corporatedata
//       )?.find((data) => data?.Apartmentname === apartmentname)
//         ?.doordelivaryprice,
//       buildingaddress: buildingaddress,
//       flatno: flat,
//       name: name,
//       towerName: towerName,
//       mobilenumber: mobilenumber,
//       prefixcode: (addresstype === "apartment"
//         ? apartmentdata
//         : corporatedata
//       )?.find((data) => data?.Apartmentname === apartmentname)?.prefixcode,
//       lunchSlots: (addresstype === "apartment"
//         ? apartmentdata
//         : corporatedata
//       )?.find((data) => data?.Apartmentname === apartmentname)?.lunchSlots,
//       dinnerSlots: (addresstype === "apartment"
//         ? apartmentdata
//         : corporatedata
//       )?.find((data) => data?.Apartmentname === apartmentname)?.dinnerSlots,
//       deliverypoint: (addresstype === "apartment"
//         ? apartmentdata
//         : corporatedata
//       )?.find((data) => data?.Apartmentname === apartmentname)?.deliverypoint,
//     };

//     addresstype === "apartment"
//       ? localStorage.setItem("address", JSON.stringify(Savedaddress))
//       : sessionStorage.setItem("coporateaddress", JSON.stringify(Savedaddress));
//     setAddress(Savedaddress);
//     sessionStorage.setItem("Savedaddress", JSON.stringify(Savedaddress));
//     saveSelectedAddress(Savedaddress);

//     handleClose();
//   };

//   const updateCartDataWithStock = (cartData, foodItemData, address) => {
//     const location = `${address?.apartmentname}, ${address?.Address}, ${address?.pincode}`;

//     const updatedCart = cartData
//       .map((cartItem) => {
//         const matchedFood = foodItemData.find(
//           (food) => food._id === cartItem.foodItemId
//         );

//         if (matchedFood) {
//           const matchedLocation = matchedFood.locationPrice?.find((loc) =>
//             loc.loccationAdreess?.includes(location)
//           );

//           if (matchedLocation) {
//             return {
//               ...cartItem,
//               price: cartItem.offerProduct
//                 ? cartItem.price
//                 : matchedLocation.foodprice,
//               remainingstock: matchedLocation.Remainingstock,
//               locationInfo: {
//                 hubId: matchedLocation.hubId,
//                 hubName: matchedLocation.hubName,
//               },
//             };
//           }
//         }

//         return null; // remove items that don't match any location
//       })
//       .filter(Boolean);

//     localStorage.setItem("cart", JSON.stringify(updatedCart));
//     return updatedCart;
//   };

//   const filterOutLowStockItems = (foodItemData) => {
//     setCartData((prevCart) => {
//       const updatedCart = updateCartDataWithStock(
//         prevCart,
//         foodItemData,
//         address
//       );
//       return updatedCart;
//     });
//   };

//   const validateCartWithAddress = (
//     address,
//     cartdata,
//     setCartData,
//     foodItemData
//   ) => {
//     if (!address || !cartdata?.length || !foodItemData?.length) return;

//     // Fix: Build location string correctly based on address structure
//     let location = "";

//     if (address?.apartmentname) {
//       // For saved addresses from localStorage/sessionStorage
//       location = address.apartmentname;
//     } else if (address?.Apartmentname) {
//       // For addresses from API response
//       location = address.Apartmentname;
//     }

//     // console.log("Validating with location:", location);
//     // console.log("Available food items:", foodItemData.length);

//     const validItems = [];
//     const removedItems = [];
//     const updatedItems = [];

//     cartdata.forEach((cartItem) => {
//       const foodItem = foodItemData.find(
//         (item) => item._id === cartItem.foodItemId
//       );

//       if (!foodItem) {
//         console.log(`Food item not found for ID: ${cartItem.foodItemId}`);
//         removedItems.push(cartItem.foodname);
//         return;
//       }

//       // console.log(`Checking ${cartItem.foodname} - Location prices:`, foodItem.locationPrice);

//       // Check if location exists in any of the locationPrice entries
//       const matchedLocation = foodItem.locationPrice?.find((loc) => {
//         const locationAddresses = loc.loccationAdreess || [];
//         // console.log(`Checking addresses:`, locationAddresses, `Against: ${location}`);

//         // Check if location matches any address in the array
//         return locationAddresses.some(
//           (addr) =>
//             addr.includes(location) ||
//             location.includes(addr.split(",")[0].trim())
//         );
//       });

//       if (matchedLocation && matchedLocation.Remainingstock > 0) {
//         const newQty = Math.min(
//           cartItem.Quantity,
//           matchedLocation.Remainingstock
//         );
//         const newPrice = cartItem.offerProduct
//           ? cartItem.price
//           : matchedLocation.foodprice;

//         validItems.push({
//           ...cartItem,
//           price: newPrice,
//           totalPrice: newPrice * newQty,
//           remainingstock: matchedLocation.Remainingstock,
//           Quantity: newQty,
//         });

//         if (cartItem.price !== newPrice || cartItem.Quantity !== newQty) {
//           updatedItems.push(cartItem.foodname);
//         }

//         console.log(`✅ ${cartItem.foodname} - Available at ${location}`);
//       } else {
//         console.log(`❌ ${cartItem.foodname} - Not available at ${location}`);
//         removedItems.push(cartItem.foodname);
//       }
//     });

//     console.log("Validation result:", {
//       original: cartdata.length,
//       valid: validItems.length,
//       removed: removedItems.length,
//       updated: updatedItems.length,
//     });

//     // Only show notification and update if there are actual changes
//     if (removedItems.length || updatedItems.length) {
//       let msg = "";
//       if (removedItems.length)
//         msg += `Removed: ${removedItems.join(", ")}<br/>`;
//       if (updatedItems.length) msg += `Updated: ${updatedItems.join(", ")}`;

//       Swal2.fire({
//         title: "Cart Updated for New Location",
//         html: msg,
//         icon: "info",
//         toast: true,
//         position: "bottom",
//         timer: 3000,
//         showConfirmButton: false,
//       });

//       setCartData(validItems);
//       localStorage.setItem("cart", JSON.stringify(validItems));
//     }
//   };

//   const [foodItemData, setFoodItemData] = useState([]);
//   const getfooditems = async (shouldValidate = false) => {
//     try {
//       let res = await axios.get(
//         "http://localhost:7013/api/admin/getFoodItemsUnBlocks"
//       );
//       if (res.status === 200) {
//         const foodItemData = res.data.data;

//         // Only validate if specifically requested and address exists
//         if (shouldValidate && address?.apartmentname && cartdata.length > 0) {
//           validateCartWithAddress(address, cartdata, setCartData, foodItemData);
//         } else {
//           filterOutLowStockItems(foodItemData);
//         }
//       }
//     } catch (error) {
//       console.log(error);
//     }
//   };

//   const [previousAddress, setPreviousAddress] = useState("");

//   // Modified useEffect to only validate on actual address changes
//   useEffect(() => {
//     const currentAddressName = address?.apartmentname || address?.Apartmentname;

//     // Only validate if address actually changed and we have cart items
//     if (
//       currentAddressName &&
//       currentAddressName !== previousAddress &&
//       previousAddress !== "" && // Don't validate on first load
//       cartdata.length > 0
//     ) {
//       // console.log("Address changed from", previousAddress, "to", currentAddressName);
//       getfooditems(true); // Validate cart with new address
//     }

//     setPreviousAddress(currentAddressName);
//   }, [address?.apartmentname, address?.Apartmentname]);

//   // Keep original useEffect for initial load without validation
//   useEffect(() => {
//     getfooditems(false); // Don't validate on initial load
//   }, []);

//   const subtotal = useMemo(() => {
//     return cartdata?.reduce((acc, item) => {
//       return Number(acc) + Number(item.price) * Number(item.Quantity);
//     }, 0);
//   }, [cartdata]);

//   const [gstlist, setGstList] = useState([]);
//   const getGst = async () => {
//     try {
//       let res = await axios.get("http://localhost:7013/api/admin/getgst");
//       if (res.status === 200) {
//         setGstList(res.data.gst);
//       }
//     } catch (error) {
//       console.log(error);
//     }
//   };

//   useEffect(() => {
//     getGst();
//   }, []);

//   const calculateTaxPrice = useMemo(() => {
//     return (gstlist[0]?.TotalGst / 100) * subtotal;
//   }, [subtotal, gstlist]);

//   const [isHandleShowCalled, setIsHandleShowCalled] = useState(false);

//   useEffect(() => {
//     const timeout = setTimeout(() => {
//       const isDataIncomplete =
//         !address?.name ||
//         !addresstype ||
//         !corporatedata?.length ||
//         !apartmentdata?.length;

//       if (!isHandleShowCalled && isDataIncomplete) {
//         getSelectedAddress(address?.apartmentname);
//         setIsHandleShowCalled(true);
//         handleShow();
//       }
//     }, 500);
//     return () => clearTimeout(timeout);
//   }, [address, addresstype, corporatedata, apartmentdata, isHandleShowCalled]);

//   useEffect(() => {
//     if (user?.status == "Employee" && wallet && subtotal) {
//       let maxUsableAmount = calculateTaxPrice + subtotal + Cutlery;
//       let walletBalance = wallet?.balance || 0;
//       let maxWalletUsage = Infinity;

//       let finalAmount = Math.min(
//         walletBalance,
//         maxUsableAmount,
//         maxWalletUsage
//       );
//       setDiscountWallet(finalAmount);
//     }
//   }, [calculateTaxPrice, wallet?.balance, subtotal, Cutlery, user]);

//   const handleApplyWallet = (e) => {
//     if (
//       user?.status == "Employee"
//         ? false
//         : calculateTaxPrice + subtotal + Cutlery <=
//         walletSeting.minCartValueForWallet
//     ) {
//       Swal2.fire({
//         toast: true,
//         position: "bottom",
//         icon: "info",
//         // title: "Apply Wallet Alert",
//         text: `Minimum cart value for wallet use is ₹ ${walletSeting.minCartValueForWallet}`,
//         showConfirmButton: false,
//         timer: 3000,
//         timerProgressBar: true,
//         customClass: {
//           popup: "me-small-toast",
//           title: "me-small-toast-title",
//         },
//       });
//       e.target.checked = false;
//       return;
//     }
//     if (wallet?.balance === 0) {
//       Swal2.fire({
//         toast: true,
//         position: "bottom",
//         icon: "info",
//         text: `Wallet balance is 0`,
//         showConfirmButton: false,
//         timer: 3000,
//         timerProgressBar: true,
//         customClass: {
//           popup: "me-small-toast",
//           title: "me-small-toast-title",
//         },
//       });
//       e.target.checked = false;
//       return;
//     }
//     if (e.target.checked) {
//       let maxUsableAmount = calculateTaxPrice + subtotal + Cutlery;
//       let walletBalance = wallet?.balance || 0;
//       let maxWalletUsage =
//         user?.status == "Employee"
//           ? Infinity
//           : walletSeting?.maxWalletUsagePerOrder || Infinity;
//       let finalAmount = Math.min(
//         walletBalance,
//         maxUsableAmount,
//         maxWalletUsage
//       );
//       setDiscountWallet(finalAmount);
//       Swal2.fire({
//         toast: true,
//         position: "bottom",
//         icon: "success",
//         text: `Wallet Applied Successfully`,
//         showConfirmButton: false,
//         timer: 3000,
//         timerProgressBar: true,
//         customClass: {
//           popup: "me-small-toast",
//           title: "me-small-toast-title",
//         },
//       });
//     } else {
//       Swal2.fire({
//         toast: true,
//         position: "bottom",
//         icon: "success",
//         text: `Wallet Removed Successfully`,
//         showConfirmButton: false,
//         timer: 3000,
//         timerProgressBar: true,
//         customClass: {
//           popup: "me-small-toast",
//           title: "me-small-toast-title",
//         },
//       });
//       setDiscountWallet(0);
//     }
//   };
//   const [showApplyWalletAlert, setShowApplyWalletAlert] = useState(false);
//   return (
//     <div className="mainbg">
//       <Container className="checkoutcontainer">
//         <div className="mobile-banner-updated">
//           <div className="screen-2 mb-3">
//             <div>
//               <svg
//                 xmlns="http://www.w3.org/2000/svg"
//                 width="36"
//                 height="36"
//                 viewBox="0 0 36 36"
//                 fill="none"
//               >
//                 <path
//                   d="M11.7375 19.5002L19.0875 26.8502C19.3875 27.1502 19.5315 27.5002 19.5195 27.9002C19.5075 28.3002 19.351 28.6502 19.05 28.9502C18.75 29.2252 18.4 29.3692 18 29.3822C17.6 29.3952 17.25 29.2512 16.95 28.9502L7.05001 19.0502C6.90001 18.9002 6.79351 18.7377 6.73051 18.5627C6.66751 18.3877 6.63701 18.2002 6.63901 18.0002C6.64101 17.8002 6.67251 17.6127 6.73351 17.4377C6.79451 17.2627 6.90051 17.1002 7.05151 16.9502L16.9515 7.05019C17.2265 6.77519 17.5705 6.6377 17.9835 6.6377C18.3965 6.6377 18.7525 6.77519 19.0515 7.05019C19.3515 7.35019 19.5015 7.7067 19.5015 8.1197C19.5015 8.5327 19.3515 8.8887 19.0515 9.1877L11.7375 16.5002H28.5C28.925 16.5002 29.2815 16.6442 29.5695 16.9322C29.8575 17.2202 30.001 17.5762 30 18.0002C29.999 18.4242 29.855 18.7807 29.568 19.0697C29.281 19.3587 28.925 19.5022 28.5 19.5002H11.7375Z"
//                   fill="#FAFAFA"
//                 />
//               </svg>
//             </div>
//             <h3
//               style={{
//                 color: "#FAFAFA",
//                 fontSize: "28px",
//                 fontStyle: "normal",
//                 fontWeight: "800",
//                 lineHeight: "31px",
//                 letterSpacing: "-0.84px",
//               }}
//             >
//               Checkout
//             </h3>
//           </div>
//         </div>

//         {/* <div className="mycart">
//           <h5>My Cart</h5>
//           <a href="/home">
//             <RxCross2
//               onClick={() => navigate("/home")}
//               style={{ fontSize: "20px" }}
//             />
//           </a>
//         </div> */}

//         <div className="mobile-checkout">
//           <div className="cartproducts">
//             <div className="cartHead mb-2 border-bottom">Dish in Basket</div>
//             <Container>
//               <div className="checkoutcontainer">
//                 {/* <div>
//                   <h3 className="meal-d" style={{ textAlign: "left" }}>
//                     My Meal
//                   </h3>
//                 </div> */}
//                 <div class="cart-container">
//                   <div class="cart-section">
//                     <div class="cart-content">
//                       <div class="cart-header">
//                         <div class="header-content">
//                           <div class="header-left">
//                             <div class="header-title">
//                               <div class="title-text">
//                                 <div class="title-label">From Kitchen</div>
//                               </div>
//                             </div>
//                             <div class="header-right">
//                               <div class="qty-header">
//                                 <div class="qty-text">
//                                   <div class="title-label">Qty</div>
//                                 </div>
//                               </div>
//                               <div class="price-text">
//                                 <div class="title-label">Price</div>
//                               </div>
//                             </div>
//                           </div>
//                         </div>
//                       </div>

//                       {/* <!-- Item 1 --> */}
//                       <div class="cart-item">
//                         <div class="veg-indicator">
//                           <svg
//                             xmlns="http://www.w3.org/2000/svg"
//                             width="15"
//                             height="14"
//                             viewBox="0 0 15 14"
//                             fill="none"
//                           >
//                             <path
//                               d="M11.5799 1.7199C12.2426 1.7199 12.7799 2.25716 12.7799 2.9199V11.0799C12.7799 11.7426 12.2426 12.2799 11.5799 12.2799H3.4199C2.75716 12.2799 2.2199 11.7426 2.2199 11.0799V2.9199C2.2199 2.25716 2.75716 1.7199 3.4199 1.7199H11.5799ZM14.0999 1.5999C14.0999 0.937159 13.5626 0.399902 12.8999 0.399902H2.0999C1.43716 0.399902 0.899902 0.937161 0.899902 1.5999V12.3999C0.899902 13.0626 1.43716 13.5999 2.0999 13.5999H12.8999C13.5626 13.5999 14.0999 13.0626 14.0999 12.3999V1.5999ZM8.60279 4.29355C8.18722 3.3238 6.81247 3.32376 6.39684 4.29347L4.25649 9.28716C3.91709 10.079 4.49728 10.9599 5.35879 10.9599C5.97643 10.9599 6.71154 10.9599 7.4999 10.9599C8.2881 10.9599 9.02297 10.9599 9.64041 10.9599C10.5019 10.9599 11.0821 10.0791 10.7427 9.28724L8.60279 4.29355Z"
//                               fill="#990100"
//                             />
//                           </svg>
//                         </div>
//                         <div class="item-content">
//                           <div class="item-details">
//                             <div class="item-name">
//                               <div class="item-name-text">
//                                 Andhra Dum BiryaniAndhra
//                               </div>
//                             </div>
//                             <div class="item-tags">
//                               <div class="portion-tag">
//                                 <div class="portion-text">
//                                   <div class="portion-label">1 Portion</div>
//                                 </div>
//                               </div>
//                               <div class="edit-tag">
//                                 <div class="edit-text">
//                                   <div class="edit-label">Edit quantity</div>
//                                 </div>
//                                 <svg
//                                   xmlns="http://www.w3.org/2000/svg"
//                                   width="12"
//                                   height="12"
//                                   viewBox="0 0 12 12"
//                                   fill="none"
//                                 >
//                                   <path
//                                     d="M4.94444 0.5C5.05772 0.500126 5.16668 0.543502 5.24905 0.621266C5.33142 0.69903 5.38099 0.805313 5.38763 0.918398C5.39427 1.03148 5.35748 1.14284 5.28477 1.2297C5.21206 1.31657 5.10893 1.3724 4.99644 1.38578L4.94444 1.38889H1.38889V7.61111H7.61111V4.05556C7.61124 3.94228 7.65461 3.83332 7.73238 3.75095C7.81014 3.66858 7.91642 3.61901 8.02951 3.61237C8.14259 3.60573 8.25395 3.64252 8.34081 3.71523C8.42768 3.78794 8.48351 3.89107 8.49689 4.00356L8.5 4.05556V7.61111C8.50007 7.83537 8.41538 8.05136 8.26289 8.2158C8.11041 8.38024 7.9014 8.48096 7.67778 8.49778L7.61111 8.5H1.38889C1.16463 8.50007 0.948637 8.41538 0.784201 8.26289C0.619765 8.11041 0.519042 7.9014 0.502222 7.67778L0.5 7.61111V1.38889C0.499929 1.16463 0.584625 0.948637 0.73711 0.784201C0.889594 0.619765 1.0986 0.519041 1.32222 0.502222L1.38889 0.5H4.94444ZM7.71911 0.652444C7.79909 0.572734 7.90642 0.526456 8.01928 0.52301C8.13215 0.519563 8.2421 0.559207 8.32679 0.633888C8.41149 0.70857 8.46458 0.81269 8.47529 0.9251C8.486 1.03751 8.45352 1.14978 8.38444 1.23911L8.34756 1.28133L3.94756 5.68089C3.86757 5.7606 3.76025 5.80688 3.64739 5.81032C3.53452 5.81377 3.42457 5.77413 3.33988 5.69945C3.25518 5.62476 3.20209 5.52064 3.19138 5.40823C3.18067 5.29582 3.21315 5.18355 3.28222 5.09422L3.31911 5.05244L7.71911 0.652444Z"
//                                     fill="#6B6B6B"
//                                   />
//                                 </svg>
//                               </div>
//                             </div>
//                           </div>
//                           <div class="item-controls">
//                             <div class="quantity-control">
//                               <div class="quantity-btn">
//                                 <div class="btn-text">-</div>
//                               </div>
//                               <div class="quantity-display">
//                                 <div class="quantity-text">1</div>
//                               </div>
//                               <div class="quantity-btn">
//                                 <div class="btn-text">+</div>
//                               </div>
//                             </div>
//                             <div class="price-container vertical">
//                               <div class="original-price">
//                                 <div class="price-line"></div>
//                                 <div class="original-price-content">
//                                   <div class="original-currency">
//                                     <div class="original-currency-text">₹</div>
//                                   </div>
//                                   <div class="original-amount">
//                                     <div class="original-amount-text">189</div>
//                                   </div>
//                                 </div>
//                               </div>
//                               <div class="current-price">
//                                 <div class="current-currency">
//                                   <div class="current-currency-text">₹</div>
//                                 </div>
//                                 <div class="current-amount">
//                                   <div class="current-amount-text">159</div>
//                                 </div>
//                               </div>
//                             </div>
//                           </div>
//                         </div>
//                       </div>

//                       {/* <!-- Item 2 --> */}
//                       <div class="cart-item">
//                         <div class="veg-indicator">
//                           <svg
//                             xmlns="http://www.w3.org/2000/svg"
//                             width="15"
//                             height="14"
//                             viewBox="0 0 15 14"
//                             fill="none"
//                           >
//                             <g clip-path="url(#clip0_2767_14906)">
//                               <path
//                                 d="M11.5799 1.7199C12.2426 1.7199 12.7799 2.25716 12.7799 2.9199V11.0799C12.7799 11.7426 12.2426 12.2799 11.5799 12.2799H3.4199C2.75716 12.2799 2.2199 11.7426 2.2199 11.0799V2.9199C2.2199 2.25716 2.75716 1.7199 3.4199 1.7199H11.5799ZM14.0999 1.5999C14.0999 0.937159 13.5626 0.399902 12.8999 0.399902H2.0999C1.43716 0.399902 0.899902 0.937161 0.899902 1.5999V12.3999C0.899902 13.0626 1.43716 13.5999 2.0999 13.5999H12.8999C13.5626 13.5999 14.0999 13.0626 14.0999 12.3999V1.5999ZM7.4999 3.0399C5.3153 3.0399 3.5399 4.8153 3.5399 6.9999C3.5399 9.1845 5.3153 10.9599 7.4999 10.9599C9.6845 10.9599 11.4599 9.1845 11.4599 6.9999C11.4599 4.8153 9.6845 3.0399 7.4999 3.0399Z"
//                                 fill="#009900"
//                               />
//                             </g>
//                             <defs>
//                               <clipPath id="clip0_2767_14906">
//                                 <rect
//                                   width="13.2"
//                                   height="13.2"
//                                   fill="white"
//                                   transform="translate(0.899902 0.399902)"
//                                 />
//                               </clipPath>
//                             </defs>
//                           </svg>
//                         </div>
//                         <div class="item-content">
//                           <div class="item-details">
//                             <div class="item-name">
//                               <div class="item-name-text">
//                                 Andhra Dum BiryaniAndhra
//                               </div>
//                             </div>
//                             <div class="item-tags">
//                               <div class="portion-tag">
//                                 <div class="portion-text">
//                                   <div class="portion-label">1 Portion</div>
//                                 </div>
//                               </div>
//                               <div class="edit-tag">
//                                 <div class="edit-text">
//                                   <div class="edit-label">Edit quantity</div>
//                                 </div>
//                                 <svg
//                                   xmlns="http://www.w3.org/2000/svg"
//                                   width="12"
//                                   height="12"
//                                   viewBox="0 0 12 12"
//                                   fill="none"
//                                 >
//                                   <path
//                                     d="M4.94444 0.5C5.05772 0.500126 5.16668 0.543502 5.24905 0.621266C5.33142 0.69903 5.38099 0.805313 5.38763 0.918398C5.39427 1.03148 5.35748 1.14284 5.28477 1.2297C5.21206 1.31657 5.10893 1.3724 4.99644 1.38578L4.94444 1.38889H1.38889V7.61111H7.61111V4.05556C7.61124 3.94228 7.65461 3.83332 7.73238 3.75095C7.81014 3.66858 7.91642 3.61901 8.02951 3.61237C8.14259 3.60573 8.25395 3.64252 8.34081 3.71523C8.42768 3.78794 8.48351 3.89107 8.49689 4.00356L8.5 4.05556V7.61111C8.50007 7.83537 8.41538 8.05136 8.26289 8.2158C8.11041 8.38024 7.9014 8.48096 7.67778 8.49778L7.61111 8.5H1.38889C1.16463 8.50007 0.948637 8.41538 0.784201 8.26289C0.619765 8.11041 0.519042 7.9014 0.502222 7.67778L0.5 7.61111V1.38889C0.499929 1.16463 0.584625 0.948637 0.73711 0.784201C0.889594 0.619765 1.0986 0.519041 1.32222 0.502222L1.38889 0.5H4.94444ZM7.71911 0.652444C7.79909 0.572734 7.90642 0.526456 8.01928 0.52301C8.13215 0.519563 8.2421 0.559207 8.32679 0.633888C8.41149 0.70857 8.46458 0.81269 8.47529 0.9251C8.486 1.03751 8.45352 1.14978 8.38444 1.23911L8.34756 1.28133L3.94756 5.68089C3.86757 5.7606 3.76025 5.80688 3.64739 5.81032C3.53452 5.81377 3.42457 5.77413 3.33988 5.69945C3.25518 5.62476 3.20209 5.52064 3.19138 5.40823C3.18067 5.29582 3.21315 5.18355 3.28222 5.09422L3.31911 5.05244L7.71911 0.652444Z"
//                                     fill="#6B6B6B"
//                                   />
//                                 </svg>
//                               </div>
//                             </div>
//                           </div>
//                           <div class="item-controls">
//                             <div class="quantity-control">
//                               <div class="quantity-btn">
//                                 <div class="btn-text">-</div>
//                               </div>
//                               <div class="quantity-display">
//                                 <div class="quantity-text">1</div>
//                               </div>
//                               <div class="quantity-btn">
//                                 <div class="btn-text">+</div>
//                               </div>
//                             </div>
//                             <div class="price-container vertical">
//                               <div class="current-price">
//                                 <div class="current-currency">
//                                   <div class="current-currency-text">₹</div>
//                                 </div>
//                                 <div class="current-amount">
//                                   <div class="current-amount-text">159</div>
//                                 </div>
//                               </div>
//                             </div>
//                           </div>
//                         </div>
//                       </div>
//                     </div>
//                   </div>

//                   <div class="cart-footer">
//                     <div class="add-more-section">
//                       <div class="add-more-btn">
//                         <div class="add-more-content">
//                           <div class="add-more-text-container">
//                             <svg
//                               xmlns="http://www.w3.org/2000/svg"
//                               width="18"
//                               height="18"
//                               viewBox="0 0 18 18"
//                               fill="none"
//                             >
//                               <path
//                                 d="M9 3C12.3082 3 15 5.69175 15 9C15 12.3082 12.3082 15 9 15C5.69175 15 3 12.3082 3 9C3 5.69175 5.69175 3 9 3ZM9 1.5C4.85775 1.5 1.5 4.85775 1.5 9C1.5 13.1423 4.85775 16.5 9 16.5C13.1423 16.5 16.5 13.1423 16.5 9C16.5 4.85775 13.1423 1.5 9 1.5ZM12.75 8.25H9.75V5.25H8.25V8.25H5.25V9.75H8.25V12.75H9.75V9.75H12.75V8.25Z"
//                                 fill="black"
//                               />
//                             </svg>

//                             <div class="add-more-text">
//                               <div class="add-more-label">Add More</div>
//                             </div>
//                           </div>
//                         </div>
//                       </div>
//                     </div>
//                     <div class="total-section">
//                       <div class="total-label-container">
//                         <div class="total-label">Total</div>
//                       </div>
//                       <div class="total-price-section">
//                         <div class="total-price-container">
//                           <div class="total-price-content">
//                             <div class="total-original-price">
//                               <div class="price-line"></div>
//                               <div class="original-price-content">
//                                 <div class="original-currency">
//                                   <div class="original-currency-text">₹</div>
//                                 </div>
//                                 <div class="original-amount">
//                                   <div class="original-amount-text">189</div>
//                                 </div>
//                               </div>
//                             </div>
//                             <div class="total-current-price">
//                               <div class="current-currency">
//                                 <div class="current-currency-text">₹</div>
//                               </div>
//                               <div class="current-amount">
//                                 <div class="current-amount-text">159</div>
//                               </div>
//                             </div>
//                           </div>
//                         </div>
//                       </div>
//                     </div>
//                   </div>
//                   {cartdata?.map((item, i) => (
//                     <div
//                       className="d-flex justify-content-between mb-2"
//                       key={i}
//                     >
//                       <div className="w-50">
//                         <div className="d-flex gap-2 w-100 align-items-center">
//                           <div
//                             className={
//                               item?.foodcategory === "Veg" ? "veg" : "non-veg"
//                             }
//                           ></div>
//                           <div className="chekout-p-name">
//                             {" "}
//                             {item.offerProduct && (
//                               <BiSolidOffer color="green" />
//                             )}{" "}
//                             {item?.foodname}
//                           </div>
//                         </div>
//                       </div>
//                       <div className="d-flex uprdiv w-50 align-items-center justify-content-between">
//                         <span className="btnDiv">
//                           <div className="increment">
//                             <FaMinus
//                               onClick={() => debouncedDecreaseQuantity(item)}
//                               className="plusbtn"
//                             />
//                           </div>
//                           {item?.Quantity}

//                           <div className="increment">
//                             <FaPlus
//                               onClick={() => debouncedIncreaseQuantity(item)}
//                               className="plusbtn"
//                             />
//                           </div>
//                         </span>
//                         <div style={{ fontWeight: 700 }}>
//                           ₹{item?.price * item.Quantity}
//                         </div>
//                       </div>
//                     </div>
//                   ))}
//                   {cartdata?.length === 0 && (
//                     <div className="text-center">
//                       <MdRemoveShoppingCart style={{ fontSize: "18px" }} /> No
//                       items in cart
//                     </div>
//                   )}
//                   {/*  */}
//                   {addresstype !== "corporate" && (
//                     <div className="deliverycard">
//                       <div className="deliveryHead">
//                         <span style={{ fontWeight: 700 }}>
//                           Choose Delivery Type
//                         </span>
//                       </div>
//                       <div className="maincard">
//                         {addresstype === "apartment" ? (
//                           <>
//                             <div
//                               className={`leftcard ${selectedOption === "Door" ? "active" : ""
//                                 }`}
//                               onClick={() =>
//                                 handleSelection(
//                                   address?.doordelivarycharge,
//                                   "Door"
//                                 )
//                               }
//                             >
//                               {selectedOption === "Door" && (
//                                 <div className="top-right-icon">
//                                   <FaCheck />
//                                 </div>
//                               )}
//                               <div className="top">
//                                 <div className="icon">
//                                   <img src="/Assets/door2.png" alt="" />
//                                 </div>
//                               </div>
//                               <div className="center mt-1">
//                                 {address?.doordelivarycharge > 0 ? (
//                                   <b>₹ {address?.doordelivarycharge}</b>
//                                 ) : (
//                                   <b
//                                     style={{
//                                       backgroundColor: "#355f2e",
//                                       borderRadius: "5px",
//                                       padding: "1px 8px",
//                                       color: "white",
//                                       marginTop: "5px",
//                                     }}
//                                   >
//                                     FREE
//                                   </b>
//                                 )}
//                               </div>
//                               <div className="bottom">
//                                 <div className="icon">
//                                   <h6>Deliver to Doors</h6>
//                                 </div>
//                               </div>
//                             </div>
//                             <div
//                               className={`rightcard ${selectedOption === "Gate/Tower" ? "active" : ""
//                                 }`}
//                               onClick={() =>
//                                 handleSelection(
//                                   address?.Delivarycharge,
//                                   "Gate/Tower"
//                                 )
//                               }
//                             >
//                               {selectedOption === "Gate/Tower" && (
//                                 <div className="top-right-icon">
//                                   <FaCheck />
//                                 </div>
//                               )}
//                               <div className="top">
//                                 <div className="icon">
//                                   <img src="/Assets/guard.png" alt="" />
//                                 </div>
//                               </div>
//                               <div className="center mt-1">
//                                 {address?.Delivarycharge > 0 ? (
//                                   <b>₹ {address?.Delivarycharge}</b>
//                                 ) : (
//                                   <b
//                                     style={{
//                                       backgroundColor: "#355f2e",
//                                       borderRadius: "5px",
//                                       padding: "1px 8px",
//                                       color: "white",
//                                       marginTop: "5px",
//                                     }}
//                                   >
//                                     FREE
//                                   </b>
//                                 )}
//                               </div>
//                               <div className="bottom">
//                                 <div className="icon">
//                                   <h6>Deliver to Gate</h6>
//                                 </div>
//                               </div>
//                             </div>
//                           </>
//                         ) : (
//                           <div
//                             className={`rightcard ${selectedOption === "Gate/Tower" ? "active" : ""
//                               }`}
//                             onClick={() =>
//                               handleSelection(
//                                 address?.Delivarycharge,
//                                 "Gate/Tower"
//                               )
//                             }
//                           >
//                             {selectedOption === "Gate/Tower" && (
//                               <div className="top-right-icon">
//                                 <FaCheck />
//                               </div>
//                             )}
//                             <div className="top">
//                               <div className="icon">
//                                 <img src="/Assets/guard.png" alt="" />
//                               </div>
//                             </div>
//                             <div className="center mt-1">
//                               {address?.Delivarycharge > 0 ? (
//                                 <b>₹ {address?.Delivarycharge}</b>
//                               ) : (
//                                 <b
//                                   style={{
//                                     backgroundColor: "#355f2e",
//                                     borderRadius: "5px",
//                                     padding: "1px 8px",
//                                     color: "white",
//                                     marginTop: "5px",
//                                   }}
//                                 >
//                                   FREE
//                                 </b>
//                               )}
//                             </div>
//                             <div className="bottom">
//                               <div className="icon">
//                                 <h6>Deliver to Gate</h6>
//                               </div>
//                             </div>
//                           </div>
//                         )}
//                       </div>
//                     </div>
//                   )}
//                   <div>
//                     <h4 style={{ color: "#2C2C2C" }}>Delivery Details</h4>
//                   </div>

//                   <div className="cutleryDiv">
//                     <div class="profile-containerss">
//                       <div style={{
//                         display: "flex",
//                         alignItems: "center",
//                         gap: "8px"

//                       }}>
//                         <div class="avatar-section">
//                           <svg xmlns="http://www.w3.org/2000/svg" width="18" height="24" viewBox="0 0 18 24" fill="none">
//                             <path d="M5.92773 1.05176C7.2033 0.630423 8.5611 0.517405 9.88867 0.722656C11.2161 0.927937 12.4758 1.44566 13.5645 2.23242C14.6532 3.0193 15.5399 4.05387 16.1514 5.25C16.7627 6.44603 17.0818 7.77007 17.082 9.11328C17.082 10.8912 16.5358 12.5395 15.6035 13.9023L15.4121 14.1709L9.85254 21.582L8.58984 23.2637L7.32812 21.582L1.76953 14.1709C0.969689 13.0919 0.437164 11.8384 0.21582 10.5137C-0.0054937 9.18868 0.0912114 7.8294 0.49707 6.54883C0.902943 5.26836 1.60672 4.10204 2.55078 3.14648C3.49486 2.19097 4.65227 1.47306 5.92773 1.05176ZM9.59277 2.64648C8.57019 2.48805 7.52473 2.57535 6.54199 2.89941C5.55903 3.2236 4.66631 3.7758 3.93848 4.51172C3.21077 5.24753 2.66781 6.14552 2.35449 7.13184C2.04118 8.11832 1.96689 9.16551 2.13672 10.1865C2.28532 11.0799 2.61714 11.9313 3.11035 12.6875L3.33203 13.0059L8.51074 19.9121L8.59082 20.0186L8.6709 19.9121L13.8496 13.0059C14.6862 11.8808 15.1368 10.5153 15.1338 9.11328C15.1338 8.07824 14.8889 7.05747 14.418 6.13574C13.9471 5.21414 13.2644 4.41705 12.4258 3.81055C11.5871 3.20399 10.6156 2.80503 9.59277 2.64648ZM8.59082 6.34961C9.32378 6.34961 10.0266 6.6409 10.5449 7.15918C11.0632 7.67746 11.3545 8.38032 11.3545 9.11328C11.3545 9.8462 11.0632 10.5491 10.5449 11.0674C10.0266 11.5856 9.32374 11.877 8.59082 11.877C7.8579 11.8769 7.15498 11.5856 6.63672 11.0674C6.11846 10.5491 5.82718 9.8462 5.82715 9.11328C5.82715 8.38037 6.1185 7.67745 6.63672 7.15918C7.15498 6.64092 7.85789 6.34963 8.59082 6.34961Z" fill="#2C2C2C" stroke="white" stroke-width="0.2" />
//                           </svg>
//                         </div>
//                         <div class="user-infos">
//                           <div class="heading-section" >
//                             <div class="user-namess">Manyata J</div>
//                           </div>
//                           <div class="caption-section" data-text-role="Caption">
//                             <div class="user-detailss">Mr Username | +91-9087654321</div>
//                           </div>
//                         </div>
//                       </div>
//                       <div class="content-section">

//                         <div class="change-button">
//                           <div class="change-icon">
//                             <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" fill="none">
//                               <path d="M12.7869 4.06006C13.0026 4.06408 13.197 4.13649 13.3679 4.27393L13.4402 4.3374L13.4421 4.33936L14.0691 4.96729H14.0701C14.2584 5.15512 14.3562 5.37816 14.3562 5.63135C14.3561 5.88443 14.2583 6.10722 14.0701 6.29541L8.06909 12.2964L8.12964 12.356L7.97827 12.3872L7.92847 12.437L7.89526 12.4038L6.14429 12.7642L6.14331 12.7632C5.99732 12.7977 5.86495 12.7583 5.75757 12.6509C5.6507 12.5438 5.61079 12.4117 5.64526 12.2661L6.00366 10.5142L5.97144 10.4819L6.02124 10.4312L6.05249 10.2798L6.11304 10.3394L12.1277 4.33936C12.3159 4.15164 12.537 4.05551 12.7869 4.06006ZM3.90894 4.93896C4.82094 5.04553 5.51534 5.25975 5.98022 5.59033L6.14624 5.72217C6.50712 6.04333 6.68917 6.46017 6.68921 6.96631C6.68921 7.46798 6.48149 7.87559 6.07202 8.18018C5.66644 8.48179 5.09567 8.65629 4.37183 8.71533L4.3728 8.71631C3.56599 8.78862 2.97488 8.95356 2.58765 9.20166C2.20735 9.44537 2.02278 9.7739 2.02319 10.1958L2.03003 10.3452C2.06267 10.6821 2.20957 10.9385 2.46753 11.1235C2.76926 11.3398 3.255 11.4829 3.93921 11.5415L4.03296 11.5493L4.03101 11.6431L4.01538 12.3101L4.01245 12.4146L3.90894 12.4077C3.02682 12.3515 2.34286 12.14 1.86987 11.7622C1.39341 11.3812 1.15698 10.8553 1.15698 10.1958C1.15698 9.53364 1.4429 8.99511 2.00562 8.5874C2.56435 8.18297 3.33478 7.93994 4.3064 7.8501C4.8365 7.80039 5.22055 7.69624 5.46948 7.54639C5.71114 7.40131 5.823 7.21012 5.823 6.96631C5.82295 6.63775 5.67929 6.38651 5.37964 6.20361C5.07099 6.01541 4.55566 5.87468 3.82104 5.7915L3.72241 5.78076L3.73218 5.68213L3.79761 5.02881L3.80835 4.92725L3.90894 4.93896ZM12.7771 4.99463C12.7176 4.99466 12.671 5.01448 12.6306 5.05518H12.6296L7.20581 10.4771L7.9314 11.2026L13.3542 5.78076C13.3953 5.73967 13.4148 5.69221 13.4148 5.6333C13.4148 5.58902 13.4041 5.55139 13.3816 5.51807L13.3552 5.48584L12.9236 5.05518C12.883 5.01429 12.8361 4.99463 12.7771 4.99463Z" fill="#6B6B6B" stroke="#6B6B6B" stroke-width="0.2" />
//                             </svg>
//                           </div>
//                           <div class="change-badge" data-text-role="Badge/Chip">
//                             <div class="change-text">Change</div>
//                           </div>
//                         </div>
//                       </div>
//                     </div>
//                     <div className="passage-p">
//                       <p className="cutleryDivoi">Our riders deliver in 5-min slots, being on-time at delivery points, helps us keep your deliveries free 😇 </p>
//                     </div>
//                     <DeliverySlots
//                       availableSlots={availableSlots}
//                       setAvailableSlots={setAvailableSlots}
//                       slotdata={slotdata}
//                       address={address}
//                       setSlotdata={setslotdata}
//                     />
//                            <div class="header-containers">
//               <div class="left-section">
//                 <div class="delivery-label" data-text-role="Button/Label">
//                   <div class="delivery-text">Delivery Point:</div>
//                 </div>
//                 <div class="security-badge">
//                   <div class="security-text">Security entry Point</div>
//                 </div>
//               </div>
//               <div class="right-section">
//                 <div class="faq-content">
//                   <div class="faq-text-container">
//                     <span class="faq-text-normal">Delivery </span><span class="faq-text-bold">FAQs</span>
//                   </div>
//                   <div class="notification-icon">
//                     <svg xmlns="http://www.w3.org/2000/svg" width="6" height="6" viewBox="0 0 6 6" fill="none">
//                       <path d="M2.7 2.1H3.3V1.5H2.7M3 5.4C1.677 5.4 0.6 4.323 0.6 3C0.6 1.677 1.677 0.6 3 0.6C4.323 0.6 5.4 1.677 5.4 3C5.4 4.323 4.323 5.4 3 5.4ZM3 0C2.60603 0 2.21593 0.0775973 1.85195 0.228361C1.48797 0.379126 1.15726 0.600104 0.87868 0.87868C0.316071 1.44129 0 2.20435 0 3C0 3.79565 0.316071 4.55871 0.87868 5.12132C1.15726 5.3999 1.48797 5.62087 1.85195 5.77164C2.21593 5.9224 2.60603 6 3 6C3.79565 6 4.55871 5.68393 5.12132 5.12132C5.68393 4.55871 6 3.79565 6 3C6 2.60603 5.9224 2.21593 5.77164 1.85195C5.62087 1.48797 5.3999 1.15726 5.12132 0.87868C4.84274 0.600104 4.51203 0.379126 4.14805 0.228361C3.78407 0.0775973 3.39397 0 3 0ZM2.7 4.5H3.3V2.7H2.7V4.5Z" fill="#F91D0F" />
//                     </svg>
//                   </div>
//                 </div>
//               </div>
//             </div>
//             <div className="icon-p">
             
//                 <div><svg xmlns="http://www.w3.org/2000/svg" width="26" height="26" viewBox="0 0 26 26" fill="none">
//   <path d="M10.6 13.8H1.85333C1.62702 13.8 1.40997 13.7101 1.24994 13.5501C1.0899 13.39 1 13.173 1 12.9467V1.85333C1 1.62702 1.0899 1.40997 1.24994 1.24994C1.40997 1.0899 1.62702 1 1.85333 1H13M16.2 4.2C16.2 3.35131 16.5371 2.53737 17.1373 1.93726C17.7374 1.33714 18.5513 1 19.4 1C20.2487 1 21.0626 1.33714 21.6627 1.93726C22.2629 2.53737 22.6 3.35131 22.6 4.2H13.5333M22.024 7.144C21.7276 7.56395 21.3344 7.90631 20.8776 8.14212C20.4209 8.37792 19.914 8.50022 19.4 8.49867C18.885 8.49902 18.3776 8.37508 17.9208 8.13738C17.464 7.89969 17.0712 7.55525 16.776 7.13333M25 15.6667C25 14.9313 24.8552 14.2031 24.5737 13.5236C24.2923 12.8442 23.8798 12.2269 23.3598 11.7069C22.8398 11.1869 22.2225 10.7744 21.543 10.4929C20.8636 10.2115 20.1354 10.0667 19.4 10.0667C18.6646 10.0667 17.9364 10.2115 17.257 10.4929C16.5775 10.7744 15.9602 11.1869 15.4402 11.7069C14.9202 12.2269 14.5077 12.8442 14.2263 13.5236C13.9448 14.2031 13.8 14.9313 13.8 15.6667V17H16.2L17 25H21.8L22.6 17H25V15.6667Z" stroke="black" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
// </svg></div>
             
//               <div className="ypt-0">
//                 <input className="fehew" type="text" placeholder="Enter delivery instructions ..." />
//                  <div className="tip-rider">
//                  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 18 18" fill="none">
//   <path d="M9 3C12.3083 3 15 5.69175 15 9C15 12.3083 12.3083 15 9 15C5.69175 15 3 12.3083 3 9C3 5.69175 5.69175 3 9 3ZM9 1.5C4.85775 1.5 1.5 4.85775 1.5 9C1.5 13.1423 4.85775 16.5 9 16.5C13.1423 16.5 16.5 13.1423 16.5 9C16.5 4.85775 13.1423 1.5 9 1.5ZM12.75 8.25H9.75V5.25H8.25V8.25H5.25V9.75H8.25V12.75H9.75V9.75H12.75V8.25Z" fill="#FAFAFA"/>
// </svg>
// <div className="p-rider">Tip your rider</div>
//                  </div>
//               </div>
//               </div>
//                   </div>
           
//                 </div>
           
//               </div>
              
//             </Container>
          
//           </div>
//       <div >
//      <h4 className="spply-s">Apply &  Save</h4> 
     
//      <div className="promo-wallet-container">
//       {/* Promo Code Section */}
//       <div className="promo-section">
//         {/* Discount Icon */}
//         <div className="discount-icon">
//           <svg width="20" height="20" viewBox="0 0 24 24" fill="white">
//             <path d="M12.79 21L3 11.21v2c0 .45.54.67.85.35l.79-.79l.79.79c.31.31.85.09.85-.35v-2.83l8.5 8.5c.39.39 1.02.39 1.41 0l.79-.79c.39-.39.39-1.02 0-1.41L7.48 8.48H10c.45 0 .67-.54.35-.85l-.79-.79l.79-.79c.31-.31.09-.85-.35-.85H7.17l8.5-8.5c.39-.39.39-1.02 0-1.41l-.79-.79c-.39-.39-1.02-.39-1.41 0L3 11.21z" />
//           </svg>
//         </div>

//         {/* Input Field */}
//         <div className="input-container">
//           <input
//             type="text"
//             placeholder="Enter your promo code"
//             value={promoCode}
//             onChange={(e) => setPromoCode(e.target.value)}
//             className="promo-input"
//           />
//           {/* <Search className="search-icon" /> */}
//           <div className="search-icon">
//           <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" fill="none">
//   <path d="M13.0667 14L8.86667 9.8C8.53333 10.0667 8.15 10.2778 7.71667 10.4333C7.28333 10.5889 6.82222 10.6667 6.33333 10.6667C5.12222 10.6667 4.09733 10.2471 3.25867 9.408C2.42 8.56889 2.00044 7.544 2 6.33333C1.99956 5.12267 2.41911 4.09778 3.25867 3.25867C4.09822 2.41956 5.12311 2 6.33333 2C7.54356 2 8.56867 2.41956 9.40867 3.25867C10.2487 4.09778 10.668 5.12267 10.6667 6.33333C10.6667 6.82222 10.5889 7.28333 10.4333 7.71667C10.2778 8.15 10.0667 8.53333 9.8 8.86667L14 13.0667L13.0667 14ZM6.33333 9.33333C7.16667 9.33333 7.87511 9.04178 8.45867 8.45867C9.04222 7.87556 9.33378 7.16711 9.33333 6.33333C9.33289 5.49956 9.04133 4.79133 8.45867 4.20867C7.876 3.626 7.16756 3.33422 6.33333 3.33333C5.49911 3.33244 4.79089 3.62422 4.20867 4.20867C3.62644 4.79311 3.33467 5.50133 3.33333 6.33333C3.332 7.16533 3.62378 7.87378 4.20867 8.45867C4.79356 9.04356 5.50178 9.33511 6.33333 9.33333Z" fill="#6B6B6B"/>
// </svg>
//           </div>
//         </div>

//         {/* Apply Button */}
//         <button className="apply-btn">Apply</button>
//       </div>

//       {/* Wallet Credit Section */}
//       <div className="wallet-section">
//         {/* Checkbox */}
//         <div
//           className={`wallet-checkbox ${isWalletSelected ? 'selected' : ''}`}
//           onClick={() => setIsWalletSelected(!isWalletSelected)}
//         >
//           {isWalletSelected && (
//             <svg width="14" height="14" viewBox="0 0 20 20" fill="white">
//               <path
//                 fillRule="evenodd"
//                 d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
//                 clipRule="evenodd"
//               />
//             </svg>
//           )}
//         </div>

//         {/* Wallet Credit Text */}
//         <div className="wallet-text">
//           <div className="wallet-header">
//             <span className="wallet-title">Apply Wallet Credit</span>
//             <span className="wallet-amount">(₹125 available)</span>
//           </div>
//           <p className="wallet-subtext">Add ₹59 more to use</p>
//         </div>
//       </div>
//     </div>
//       </div>
//           <div className="addressCard mt-3">
//             <div className="d-flex justify-content-between">
//               <span style={{ fontWeight: 700 }} className="addresselipse">
//                 Delivering To: {address?.apartmentname}
//               </span>
//               <span
//                 onClick={() => {
//                   setFlat(addresstype === "apartment" ? address?.flatno : "");
//                   setTowerName(
//                     addresstype === "apartment" ? address?.towerName : ""
//                   );
//                   setname(address?.name);
//                   setApartmentname(address?.apartmentname);
//                   setmobilenumber(address?.mobilenumber);
//                   handleShow();
//                 }}
//                 style={{ cursor: "pointer" }}
//               >
//                 Change:{" "}
//                 <MdOutlineEditLocationAlt
//                   style={{ color: "#6B8E23", fontSize: "18px" }}
//                 />
//               </span>
//             </div>
//             <div>
//               <div className="d-flex">
//                 {address?.name},{" "}
//                 {addresstype === "apartment" ? `${address?.flatno},` : ""}{" "}
//                 {addresstype === "apartment" ? `${address?.towerName},` : ""}{" "}
//                 {address?.mobilenumber}
//               </div>
//             </div>
//           </div>

//           <div className="cutleryDiv">
//             <input
//               type="text"
//               value={couponId}
//               placeholder="Enter your promo code"
//               onChange={(e) => setCouponId(e.target.value)}
//               style={{
//                 border: "1px solid #6B8E23",
//                 borderRadius: "5px",
//                 width: "80%",
//               }}
//             />
//             <div
//               className="btnDiv"
//               style={{
//                 justifyContent: "center",
//                 cursor: "pointer",
//                 paddingTop: "3px",
//                 height: "28px",
//               }}
//               onClick={() => applycoupon()}
//             >
//               <span>Apply</span>
//             </div>
//           </div>
//           <div className="cutleryDiv">
//             <div>
//               <div className="d-flex">
//                 <input
//                   type="checkbox"
//                   className="form-check-input"
//                   id="customCheckbox1"
//                   name="Apply Wallet"
//                   checked={discountWallet ? true : false}
//                   onChange={(e) => handleApplyWallet(e)}
//                   style={{
//                     border: "1px solid #6B8E23",
//                     backgroundColor: discountWallet ? "#6B8E23" : "white",
//                   }}
//                 />
//                 <label
//                   className="custom-checkbox-label form-check-label"
//                   htmlFor="customCheckbox1"
//                 ></label>
//                 <span style={{ fontWeight: 700, marginLeft: "5px" }}>
//                   Apply Wallet
//                 </span>
//               </div>
//               {user?.status == "Employee" ? (
//                 <p style={{ fontSize: "smaller", marginTop: "5px" }}>
//                   Note: Your wallet balance is ₹ {wallet?.balance}.
//                 </p>
//               ) : (
//                 <p style={{ fontSize: "smaller", marginTop: "5px" }}>
//                   Note: Minimum cart value for wallet use is ₹{" "}
//                   {walletSeting?.minCartValueForWallet}.
//                 </p>
//               )}
//             </div>
//             <div>
//               <span>₹ {(wallet?.balance - discountWallet)?.toFixed(2)}</span>
//             </div>
//           </div>
//           <div className="deliverycard">
//             <div
//               className="deliveryHead w-100 ps-2 border-bottom"
//               style={{ float: "left" }}
//             >
//               <span style={{ fontWeight: 700 }}>Bill Details</span>
//             </div>
//             <div className="maincard2">
//               <div className="d-flex justify-content-between align-items-center w-100 billdetail">
//                 <div>
//                   <div>Sub Total</div>
//                   <div>Tax {`(${gstlist[0]?.TotalGst} %)`}</div>
//                   {Cutlery != 0 && <div>Cutlery</div>}
//                   {coupon != 0 && <div>Coupon Discount</div>}
//                   {selectedOption ? (
//                     <div>{`${selectedOption} Delivery`}</div>
//                   ) : (
//                     ""
//                   )}
//                   {discountWallet != 0 && <div>Wallet Pay</div>}
//                   <div>
//                     <b>Bill total</b>
//                   </div>
//                 </div>
//                 <div className="mb-2">
//                   <div style={{ textAlign: "right" }}>
//                     <div>₹ {subtotal?.toFixed(2)}</div>
//                     <div>₹ {calculateTaxPrice.toFixed(2)}</div>
//                     {Cutlery != 0 && <div>₹ {Cutlery}</div>}
//                     {coupon != 0 && (
//                       <div style={{ color: "green" }}>- ₹ {coupon}</div>
//                     )}
//                     {selectedOption ? <div>₹ {delivarychargetype}</div> : ""}
//                     {discountWallet != 0 && (
//                       <div style={{ color: "green" }}>- ₹ {discountWallet}</div>
//                     )}
//                     <div>
//                       <b>
//                         ₹{" "}
//                         {(
//                           calculateTaxPrice +
//                           subtotal +
//                           Cutlery +
//                           (delivarychargetype || 0) -
//                           discountWallet -
//                           coupon
//                         ).toFixed(2)}
//                       </b>
//                     </div>
//                   </div>
//                 </div>
//               </div>
//             </div>
//           </div>

//           <div>
//             <Button
//               variant=""
//               style={{
//                 width: "100%",
//                 backgroundColor: "#6B8E23",
//                 color: "white",
//               }}
//               onClick={() => placeorder()}
//               className="placeorder"
//               disabled={loading}
//             >
//               {loading ? (
//                 <>
//                   <Spinner animation="border" size="sm" className="me-2" />
//                   Ordering...
//                 </>
//               ) : (
//                 <>
//                   Continue to Pay |{" "}
//                   <b>
//                     ₹{" "}
//                     {(
//                       calculateTaxPrice +
//                       subtotal +
//                       Cutlery +
//                       (delivarychargetype || 0) -
//                       discountWallet -
//                       coupon
//                     ).toFixed(2)}
//                   </b>
//                 </>
//               )}
//             </Button>
//           </div>
//         </div>
//       </Container>

//       <Modal show={show} style={{ zIndex: "99999" }}>
//         <Modal.Header>
//           <Modal.Title>Add Address</Modal.Title>
//         </Modal.Header>
//         <Modal.Body>
//           <Form>
//             {addresstype === "apartment" ? (
//               <select
//                 value={apartmentname}
//                 onChange={(e) => getSelectedAddress(e.target.value)}
//                 className="vi_0 slot"
//                 style={{
//                   color: "black",
//                   width: "180px",
//                   backgroundColor: "transparent",
//                 }}
//               >
//                 <option value="" style={{ color: "black" }} className="option">
//                   Select Pg/Apartment
//                 </option>
//                 {apartmentdata?.map((data, index) => (
//                   <option
//                     key={index}
//                     value={data?.Apartmentname}
//                     style={{ color: "black" }}
//                     className="option"
//                   >
//                     {data?.Apartmentname}
//                   </option>
//                 ))}
//               </select>
//             ) : (
//               <select
//                 value={apartmentname}
//                 onChange={(e) => getSelectedAddress(e.target.value)}
//                 className="vi_0 slot"
//                 style={{
//                   color: "black",
//                   width: "180px",
//                   backgroundColor: "transparent",
//                 }}
//               >
//                 <option value="" style={{ color: "black" }} className="option">
//                   Select Corporate
//                 </option>
//                 {corporatedata?.map((data, index) => (
//                   <option
//                     key={index}
//                     value={data?.Apartmentname}
//                     style={{ color: "black" }}
//                     className="option"
//                   >
//                     {data?.Apartmentname}
//                   </option>
//                 ))}
//               </select>
//             )}
//             <Form.Control
//               type="text"
//               placeholder="Enter Full Name"
//               style={{ marginTop: "18px" }}
//               value={name}
//               onChange={(e) => setname(e.target.value)}
//             />
//             <span style={{ fontSize: "small" }}>
//               Note:- For School enter Name & Class/Section
//             </span>
//             <Form.Control
//               type="number"
//               placeholder="Enter Phone Number"
//               style={{ marginTop: "18px" }}
//               value={mobilenumber}
//               onChange={(e) => setmobilenumber(e.target.value)}
//             />

//             {addresstype === "apartment" ? (
//               <Form.Control
//                 type="text"
//                 value={flat}
//                 placeholder="Enter Flat No"
//                 style={{ marginTop: "18px" }}
//                 onChange={(e) => setFlat(e.target.value)}
//               />
//             ) : null}
//             {addresstype === "apartment" ? (
//               <Form.Control
//                 type="text"
//                 value={towerName}
//                 placeholder="Enter tower name"
//                 style={{ marginTop: "18px" }}
//                 onChange={(e) => setTowerName(e.target.value)}
//               />
//             ) : null}
//             <Button
//               variant=""
//               className="modal-add-btn2"
//               style={{ width: "100%", marginTop: "24px", textAlign: "center" }}
//               onClick={() => Handeledata()}
//             >
//               Save
//             </Button>
//           </Form>
//         </Modal.Body>
//       </Modal>
//     </div>
//   );
// };

// export default Checkout;
