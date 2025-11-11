import React, { useContext, useEffect, useMemo, useRef, useState } from "react";
import { Card, Carousel, Container } from "react-bootstrap";
import { FaEye, FaEyeSlash, FaLock, FaUser } from "react-icons/fa";
import { Button, Dropdown, Form, InputGroup, Modal } from "react-bootstrap";
import { FaPlus, FaMinus, FaSquareWhatsapp } from "react-icons/fa6";
import "../Styles/Home.css";
import Banner from "./Banner";
import { useNavigate } from "react-router-dom";
import { BsCart3 } from "react-icons/bs";
import { HiMiniShoppingBag } from "react-icons/hi2";
import axios from "axios";
import { MdArrowBackIosNew } from "react-icons/md";
import { Drawer } from "antd";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Autocomplete from "@mui/material/Autocomplete";
import TextField from "@mui/material/TextField";
import ApartmentIcon from "@mui/icons-material/Apartment";
import swal from "sweetalert";
import CoinBalance from "./CoinBalance";
import Lottie from "lottie-react";
import partybomb from "./../assets/Animation - 1741012219735.json";
import { WalletContext } from "../WalletContext";
import RatingModal from "./RatingModal";
import { BiSolidOffer } from "react-icons/bi";
import Swal2 from "sweetalert2";
import ValidateCart from "./ValidateCart";
import moment from "moment";
import MyMeal from "../assets/mymeal.svg";
import IsVeg from "../assets/isVeg=yes.svg";
import IsNonVeg from "../assets/isVeg=no.svg";


const Home = ({ selectArea, setSelectArea, Carts, setCarts }) => {
  const navigate = useNavigate();
  const { wallet, transactions, loading, walletSeting, getorderByCustomerId } =
    useContext(WalletContext);

  // console.log("wallet wallet", wallet);

  const [loader, setloader] = useState(false);

  const addresstype = localStorage.getItem("addresstype");

  const address = JSON.parse(
    localStorage.getItem(
      addresstype === "apartment" ? "address" : "coporateaddress"
    )
  );

  const [cartCount, setCartCount] = useState(0);
  const [isCartVisible, setIsCartVisible] = useState(false);

  const handleShow = () => {
    setCartCount(cartCount + 1);
    setIsCartVisible(true);
  };

  const [foodData, setFoodData] = useState({});
  const [open, setOpen] = useState(false);

  const showDrawer = (food) => {
    setFoodData(food);
    console.log(food);
    setOpen(true);
  };

  const onClose = () => {
    setOpen(false);
  };

  const [show4, setShow4] = useState(false);

  const handleShow4 = () => setShow4(true);
  const handleClose4 = () => setShow4(false);

  const [show3, setShow3] = useState(false);

  const handleClose3 = () => setShow3(false);
  const handleShow3 = () => {
    handleClose4();
    setShow3(true);
  };

  // otp
  const [show2, setShow2] = useState(false);
  const handleClose2 = () => setShow2(false);
  const handleShow2 = () => setShow2(true);

  const [fooditemdata, setfooditemdata] = useState([]);
  const getfooditems = async () => {
    if (fooditemdata.length < 0) {
      setloader(true);
    }

    try {
      let res = await axios.get(
        "https://dailydish.in/api/admin/getFoodItemsUnBlocks"
      );
      if (res.status === 200) {
        setfooditemdata(res.data.data);
        setloader(false);
      }
    } catch (error) {
      setloader(false);
      swal({
        title: "Error",
        text: "Check your internet connection!",
        icon: "error",
        buttons: "Try Again",
      });
      console.log(error);
    }
  };

  const user = JSON.parse(localStorage.getItem("user"));
  // Track "view_menu" event once per page load (dev-safe + context)
  const sentViewMenuRef = useRef(false);

  useEffect(() => {
    // extra guard: if GA isn't loaded yet, skip
    if (!window.gtag) return;

    // dev/prod-safe guard (prevents Strict Mode double count)
    if (sentViewMenuRef.current || sessionStorage.getItem('dd_view_menu_fired') === '1') return;

    window.gtag('event', 'view_menu', {
      user_type: user && user._id ? 'logged_in' : 'guest',
      user_id: user?._id,                  // optional
      page_path: window.location.pathname + window.location.search,
      page_location: window.location.href,
    });

    sentViewMenuRef.current = true;
    sessionStorage.setItem('dd_view_menu_fired', '1');
    }, []); // fire once per mount

  const addCart1 = async (item, checkOf, matchedLocation) => {
    // console.log("check  ===>",checkOf,matchedLocation);

    if (!user) {
      Swal2.fire({
        toast: true,
        position: "bottom",
        icon: "info",
        title: `Please login!`,
        showConfirmButton: false,
        timer: 3000,
        timerProgressBar: true,
        customClass: {
          popup: "me-small-toast",
          title: "me-small-toast-title",
        },
      });
      setTimeout(() => {
        navigate("/", { replace: true });
      }, 1000);
      return;
    }

    if (!matchedLocation || matchedLocation?.Remainingstock === 0) {
      Swal2.fire({
        toast: true,
        position: "bottom",
        icon: "info",
        title: `Product is out of stock`,
        showConfirmButton: false,
        timer: 3000,
        timerProgressBar: true,
        customClass: {
          popup: "me-small-toast",
          title: "me-small-toast-title",
        },
      });
      return;
    }

    if (checkOf && !user) {
      Swal2.fire({
        toast: true,
        position: "bottom",
        icon: "info",
        title: `Please login!`,
        showConfirmButton: false,
        timer: 3000,
        timerProgressBar: true,
        customClass: {
          popup: "me-small-toast",
          title: "me-small-toast-title",
        },
      });
      return;
    }

    const newCartItem = {
      foodItemId: item?._id,
      price: checkOf ? checkOf?.price : matchedLocation?.foodprice,
      totalPrice: checkOf ? checkOf?.price : matchedLocation?.foodprice,
      image: item?.Foodgallery[0]?.image2,
      unit: item?.unit,
      foodname: item?.foodname,
      quantity: item?.quantity,
      Quantity: 1,
      gst: item?.gst,
      discount: item?.discount,
      foodcategory: item?.foodcategory,
      remainingstock: matchedLocation?.Remainingstock,
      offerProduct: !!checkOf,
      minCart: checkOf?.minCart || 0,
      actualPrice: matchedLocation?.foodprice,
      offerQ: 1,
    };

    const cart = JSON.parse(localStorage.getItem("cart"));
    const cartArray = Array.isArray(cart) ? cart : [];

    const itemIndex = cartArray.findIndex(
      (cartItem) => cartItem?.foodItemId === newCartItem?.foodItemId
    );

    if (itemIndex === -1) {
      cartArray.push(newCartItem);
      localStorage.setItem("cart", JSON.stringify(cartArray));
      setCarts(cartArray);
      handleShow();
    } else {
      Swal2.fire({
        toast: true,
        position: "bottom",
        icon: "info",
        title: `Item is already in cart`,
        showConfirmButton: false,
        timer: 3000,
        timerProgressBar: true,
        customClass: {
          popup: "me-small-toast",
          title: "me-small-toast-title",
        },
      });
    }
  };

  const [cart, setCart] = useState([]);

  // Fetch data from local storage on component mount and whenever cart changes
  useEffect(() => {
    const storedCart = JSON.parse(localStorage.getItem("cart")) || [];
    setCart(storedCart);

    const addonedCarts = async () => {
      try {
        let res = await axios.post(
          "https://dailydish.in/api/cart/addCart",
          {
            userId: user?._id,
            items: storedCart,
            lastUpdated: Date.now,
            username: user?.Fname,
            mobile: user?.Mobile,
          }
        );
      } catch (error) {
        console.log(error);
      }
    };
    if (Carts && Carts.length > 0) {
      addonedCarts();
    }

    // setCart(Carts)
  }, [JSON.stringify(Carts)]);

  // Function to update local storage and state
  const updateCartData = (updatedCart) => {
    localStorage.setItem("cart", JSON.stringify(updatedCart));
    setCart(updatedCart); // Update local state
    setCarts(updatedCart); // Update parent state
  };

  const increaseQuantity = (foodItemId, checkOf, item, matchedLocation) => {
    console.log("increaseQuantity called:", {
      foodItemId,
      checkOf,
      item: item?.foodname,
      matchedLocation,
    });
    const maxStock = matchedLocation?.Remainingstock || 0;

    if (!checkOf) {
      // Regular cart item increase
      const updatedCart = Carts.map((cartItem) => {
        if (cartItem.foodItemId === foodItemId) {
          if (cartItem.Quantity < maxStock) {
            return {
              ...cartItem,
              Quantity: cartItem.Quantity + 1,
              totalPrice: cartItem.price * (cartItem.Quantity + 1),
            };
          } else {
            Swal2.fire({
              toast: true,
              position: "bottom",
              icon: "info",
              title: `No more stock available!`,
              showConfirmButton: false,
              timer: 3000,
              timerProgressBar: true,
              customClass: {
                popup: "me-small-toast",
                title: "me-small-toast-title",
              },
            });
          }
        }
        return cartItem;
      });

      updateCartData(updatedCart);
    } else {
      // Offer cart logic
      const offerPr = Carts.find((ele) => ele.foodItemId == foodItemId);

      if (offerPr && offerPr.offerQ > offerPr.Quantity) {
        // Increase regular offer item
        const updatedCart = Carts.map((cartItem) => {
          if (cartItem.foodItemId === foodItemId) {
            if (cartItem.Quantity < maxStock) {
              return {
                ...cartItem,
                Quantity: cartItem.Quantity + 1,
                totalPrice: cartItem.price * (cartItem.Quantity + 1),
              };
            } else {
              Swal2.fire({
                toast: true,
                position: "bottom",
                icon: "info",
                title: `No more stock available!`,
                showConfirmButton: false,
                timer: 3000,
                timerProgressBar: true,
                customClass: {
                  popup: "me-small-toast",
                  title: "me-small-toast-title",
                },
              });
            }
          }
          return cartItem;
        });

        updateCartData(updatedCart);
      } else {
        // Check if extra item exists
        const offerPrXt = Carts?.find(
          (ele) => ele.foodItemId === foodItemId && ele.extra === true
        );

        if (offerPrXt) {
          // Increase extra item
          const updatedCart = Carts.map((cartItem) => {
            if (cartItem.foodItemId === foodItemId && cartItem.extra === true) {
              if (cartItem.Quantity < maxStock) {
                return {
                  ...cartItem,
                  Quantity: cartItem.Quantity + 1,
                  totalPrice: cartItem.price * (cartItem.Quantity + 1),
                };
              } else {
                Swal2.fire({
                  toast: true,
                  position: "bottom",
                  icon: "info",
                  title: `No more stock available!`,
                  showConfirmButton: false,
                  timer: 3000,
                  timerProgressBar: true,
                  customClass: {
                    popup: "me-small-toast",
                    title: "me-small-toast-title",
                  },
                });
              }
            }
            return cartItem;
          });

          updateCartData(updatedCart);
        } else {
          // Add new extra item
          updateCartData([
            ...Carts,
            {
              foodItemId: item?._id,
              price: matchedLocation?.foodprice,
              totalPrice: matchedLocation?.foodprice,
              image: item?.Foodgallery[0]?.image2,
              unit: item?.unit,
              foodname: item?.foodname,
              quantity: item?.quantity,
              Quantity: 1,
              gst: item?.gst,
              discount: item?.discount,
              foodcategory: item?.foodcategory,
              remainingstock: maxStock,
              offerProduct: false,
              minCart: 0,
              actualPrice: matchedLocation?.foodprice,
              offerQ: 0,
              extra: true,
            },
          ]);
        }
      }
    }
  };

  const [show, setShow] = useState(true);
  const [expiryDays, setExpiryDays] = useState(0);

  // Function to decrease quantity
  const decreaseQuantity = (foodItemId, checkOf, matchedLocation) => {
    console.log("decreaseQuantity called:", {
      foodItemId,
      checkOf,
      matchedLocation,
    });
    if (!checkOf) {
      // Regular cart item decrease
      const updatedCart = Carts.map((item) => {
        if (item.foodItemId === foodItemId && item.Quantity > 0) {
          return {
            ...item,
            Quantity: item.Quantity - 1,
            totalPrice: item.price * (item.Quantity - 1),
          };
        }
        return item;
      }).filter((item) => item.Quantity > 0); // Remove items with 0 quantity

      updateCartData(updatedCart);
    } else {
      // Offer cart logic
      const offerPr = Carts.find((ele) => ele.foodItemId == foodItemId);

      if (offerPr && offerPr.offerQ > offerPr.Quantity) {
        // Handle regular offer item decrease
        const updatedCart = Carts.map((item) => {
          if (item.foodItemId === foodItemId && item.Quantity > 0) {
            const newQuantity = item.Quantity - 1;
            // Calculate offer price correctly
            let newTotalPrice;
            if (newQuantity <= offerPr.offerQ) {
              // Still within offer quantity, use offer price
              newTotalPrice = offerPr.price * newQuantity;
            } else {
              // Beyond offer quantity, use regular price
              newTotalPrice = offerPr.actualPrice * newQuantity;
            }

            return {
              ...item,
              Quantity: newQuantity,
              totalPrice: newTotalPrice,
            };
          }
          return item;
        }).filter((item) => item.Quantity > 0);

        updateCartData(updatedCart);
      } else {
        // Handle extra item decrease
        const offerExtraItem = Carts?.find(
          (ele) => ele.foodItemId === foodItemId && ele.extra === true
        );

        if (offerExtraItem) {
          const updatedCart = Carts.map((item) => {
            if (
              item.foodItemId === foodItemId &&
              item.extra === true &&
              item.Quantity > 0
            ) {
              return {
                ...item,
                Quantity: item.Quantity - 1,
                totalPrice: item.price * (item.Quantity - 1),
              };
            }
            return item;
          }).filter((item) => item.Quantity > 0);

          updateCartData(updatedCart);
        } else {
          // Handle regular item decrease when not in offer mode
          const updatedCart = Carts.map((item) => {
            if (item.foodItemId === foodItemId && item.Quantity > 0) {
              return {
                ...item,
                Quantity: item.Quantity - 1,
                totalPrice: item.price * (item.Quantity - 1),
              };
            }
            return item;
          }).filter((item) => item.Quantity > 0);

          updateCartData(updatedCart);
        }
      }
    }
  };

  const isAddressReady = () => {
    const addresstype1 = localStorage.getItem("addresstype");
    if (!addresstype1) return false;

    const addressKey =
      addresstype1 === "apartment" ? "address" : "coporateaddress";
    const addressRaw = localStorage.getItem(addressKey);

    if (!addressRaw) return false;

    try {
      const address1 = JSON.parse(addressRaw);
      if (!address1) return false;

      const apartmentname =
        address1?.apartmentname || address1?.Apartmentname || "";
      const addressField = address1?.Address || address1?.address || "";
      const pincode = address1?.pincode || "";

      return apartmentname && addressField && pincode;
    } catch (error) {
      return false;
    }
  };

  useEffect(() => {
    if (Carts?.length > 0) {
      handleShow();
    }

    // Only call getAllOffer if address is ready
    if (isAddressReady() && user?._id) {
      getAllOffer();
    }
  }, [user?._id, address?.apartmentname]);

  const d = new Date();
  let subtotal = 0;
  let total = 0;
  let tax = 0;

  if (Carts?.length !== 0) {
    for (let i = 0; i < Carts?.length; i++) {
      subtotal =
        subtotal +
        (Carts[i]?.totalPrice * Carts[i]?.Quantity -
          Math.round(
            Number(Carts[i]?.price * Carts[i]?.Quantity) * (Carts[i]?.gst / 100)
          ));
      total = total + Carts[i]?.totalPrice * Carts[i]?.Quantity;
      tax =
        tax +
        Math.round(
          Number(Carts[i]?.price * Carts[i]?.Quantity) * (Carts[i]?.gst / 100)
        );
    }
  }
  const goToCheckout = () => {
    const address =
      addresstype == "apartment"
        ? JSON.parse(localStorage.getItem("address"))
        : JSON.parse(localStorage.getItem("coporateaddress"));
    if (!address) {
      Swal2.fire({
        toast: true,
        position: "bottom",
        icon: "info",
        title: `Please Select ${addresstype}`,
        showConfirmButton: false,
        timer: 3000,
        timerProgressBar: true,
        customClass: {
          popup: "me-small-toast",
          title: "me-small-toast-title",
        },
      });
      return;
    }
    const checkMin = Carts.find((ele) => ele.offerProduct === true);

    if (checkMin && checkMin.minCart && checkMin.minCart > total) {
      return Swal2.fire({
        toast: true,
        position: "bottom",
        icon: "info",
        title: `₹${checkMin.minCart} needed - ${checkMin.foodname} | Cart: ₹${total}`,
        showConfirmButton: false,
        timer: 3000,
        timerProgressBar: true,
        customClass: {
          popup: "me-small-toast",
          title: "me-small-toast-title",
        },
      });
    }

    navigate("/checkout", {
      state: {
        newsubtotal,
        total,
        tax,
      },
    });
  };

  const cutoffTime = new Date();
  cutoffTime.setHours(12, 30, 0);
  const [gifUrl, setGifUrl] = useState("");
  const [message, setMessage] = useState("");
  const [AllOffer, setAllOffer] = useState([]);

  const SloteType = moment().hour() < 14 ? "lunch" : "dinner";

  const getAllOffer = async () => {
    try {
      const addresstype1 = localStorage.getItem("addresstype");

      const addressRaw = localStorage.getItem(
        addresstype1 === "apartment" ? "address" : "coporateaddress"
      );

      if (!addressRaw) {
        console.warn("Address not found in localStorage");
        return;
      }

      let address1;
      try {
        address1 = JSON.parse(addressRaw);
      } catch (parseError) {
        console.error("Failed to parse address from localStorage:", parseError);
        return;
      }

      // Add comprehensive null checks
      if (!address1) {
        console.warn("Parsed address is null or undefined");
        return;
      }

      // Build location with fallbacks
      const apartmentname =
        address1?.apartmentname || address1?.Apartmentname || "";
      const addressField = address1?.Address || address1?.address || "";
      const pincode = address1?.pincode || "";

      // Only proceed if we have essential data
      if (!apartmentname || !addressField || !pincode) {
        console.warn("Missing essential address components:", {
          apartmentname,
          addressField,
          pincode,
        });
        return;
      }

      const location = `${apartmentname}, ${addressField}, ${pincode}`;
    

      if (user?._id && location) {
        const response = await axios.put(
          "https://dailydish.in/api/admin/getuseroffer",
          {
            id: user._id,
            location,
            addressRaw,
            selectArea,
          }
        );

        console.log("Response:", response.data);

        if (response.status === 200 && response.data?.data) {
          setAllOffer(response.data.data);
        } else {
          console.warn("Offer data not found:", response.data);
        }
      }
    } catch (error) {
      console.log("getAllOffer error:", error);
      setAllOffer([]);
    }
  };

  // console.log("AllOffer==>", AllOffer);

  useEffect(() => {
    const checkTime = () => {
      const now = new Date();
      const currentTimeInMinutes = now.getHours() * 60 + now.getMinutes(); // Convert current time to minutes
      // Define the time ranges in minutes
      const lunchStart = 7 * 60; // 7:00 AM
      const lunchPrepStart = 9 * 60; // 9:00 AM
      const lunchCookingStart = 11 * 60; // 11:00 AM
      const lunchEnd = 14 * 60; // 12:30 PM

      const dinnerStart = 14 * 60; // 2:00 PM
      const dinnerPrepStart = 16 * 60 + 30; // 4:30 PM
      const dinnerCookingStart = 18 * 60; // 6:00 PM
      const dinnerEnd = 21 * 60; // 9:30 PM

      const shopCloseTime = 21 * 60; // 10:00 PM

      // Free time range for instant delivery
      const freeTimeStart = 12 * 60 + 30; // 12:30 PM
      const freeTimeEnd = 15 * 60; // 3:00 PM

      if (
        currentTimeInMinutes >= lunchStart &&
        currentTimeInMinutes < lunchPrepStart
      ) {
        setGifUrl("sourcing.gif");
        setMessage(
          "Sourcing Quality Ingredients. Orders placed now will be delivered at your selected slot."
        );
      } else if (
        currentTimeInMinutes >= lunchPrepStart &&
        currentTimeInMinutes < lunchCookingStart
      ) {
        setGifUrl("cuttingveg.gif");
        setMessage(
          "Preparing ingredients. Orders placed now will be delivered at your selected slot."
        );
      } else if (
        currentTimeInMinutes >= lunchCookingStart &&
        currentTimeInMinutes < lunchEnd
      ) {
        setGifUrl("cookinggif.gif");
        setMessage(
          "Cooking your meal. Orders placed now will be delivered at your selected slot."
        );

        // } else if (
        //   (currentTimeInMinutes >= freeTimeStart &&
        //     currentTimeInMinutes < freeTimeEnd) ||
        //   (currentTimeInMinutes > dinnerEnd &&
        //     currentTimeInMinutes <= shopCloseTime)
        // ) {
        //   setGifUrl("instantdelivery.gif");
        //   setMessage(
        //     "Instant Delivery available now! Place your order and get it delivered immediately."
        //   );
      } else if (
        currentTimeInMinutes >= dinnerStart &&
        currentTimeInMinutes < dinnerPrepStart
      ) {
        setGifUrl("sourcing.gif");
        setMessage(
          "Sourcing Quality Ingredients. Orders placed now will be delivered at your selected slot."
        );
      } else if (
        currentTimeInMinutes >= dinnerPrepStart &&
        currentTimeInMinutes < dinnerCookingStart
      ) {
        setGifUrl("cuttingveg.gif");
        setMessage(
          "Preparing ingredients. Orders placed now will be delivered at your selected slot."
        );
      } else if (
        currentTimeInMinutes >= dinnerCookingStart &&
        currentTimeInMinutes <= dinnerEnd
      ) {
        setGifUrl("cookinggif.gif");
        setMessage(
          "Cooking your meal. Orders placed now will be delivered at your selected slot."
        );
      } else if (currentTimeInMinutes >= shopCloseTime) {
        setGifUrl("Closed.gif");
        setMessage(
          "The Store is now closed. Operating hours: Lunch: 7:00 AM - 02:00 PM, Dinner: 2:00 PM - 9:00 PM."
        );
      } else {
        setGifUrl("Closed.gif");
        setMessage(
          "Orders are currently closed. Lunch: 7:00 AM - 02:00 PM. Dinner: 2:00 PM - 9:00 PM."
        );
      }
    };
    // Check the time initially and set up an interval to check every minute
    checkTime();
    const interval = setInterval(checkTime, 60000);
    // Clean up the interval on component unmount
    return () => clearInterval(interval);
  }, []);

  //Registration modal
  const [Fname, setFname] = useState("");
  const [Mobile, setMobile] = useState("");
  const [Address, setAddress] = useState("");
  const [Flatno, setFlatno] = useState("");
  const [OTP, setOTP] = useState(["", "", "", ""]);
  const [PasswordShow, setPasswordShow] = useState(false);

  const userLogin = async () => {
    if (!Mobile) {
      return Swal2.fire({
        toast: true,
        position: "bottom",
        icon: "info",
        title: `Enter Your Mobile Number`,
        showConfirmButton: false,
        timer: 3000,
        timerProgressBar: true,
        customClass: {
          popup: "me-small-toast",
          title: "me-small-toast-title",
        },
      });
    }
    setloader(true);
    try {
      const config = {
        url: "/User/Sendotp",
        method: "post",
        baseURL: "https://dailydish.in/api",

        headers: { "content-type": "application/json" },
        data: {
          Mobile: Mobile,
        },
      };

      const res = await axios(config);
      if (res.status === 401) {
        return Swal2.fire({
          toast: true,
          position: "bottom",
          icon: "error",
          title: `Invalid Mobile Number`,
          showConfirmButton: false,
          timer: 3000,
          timerProgressBar: true,
          customClass: {
            popup: "me-small-toast",
            title: "me-small-toast-title",
          },
        });
      }
      if (res.status === 402) {
        return Swal2.fire({
          toast: true,
          position: "bottom",
          icon: "error",
          title: `Something went wrong`,
          showConfirmButton: false,
          timer: 3000,
          timerProgressBar: true,
          customClass: {
            popup: "me-small-toast",
            title: "me-small-toast-title",
          },
        });
      }
      if (res.status === 200) {
        setloader(false);
        handleClose3();
        handleShow2();
      }
    } catch (error) {
      setloader(false);
      Swal2.fire({
        toast: true,
        position: "bottom",
        icon: "error",
        title: error.response.data.error || `Something went wrong!`,
        showConfirmButton: false,
        timer: 3000,
        timerProgressBar: true,
        customClass: {
          popup: "me-small-toast",
          title: "me-small-toast-title",
        },
      });
      console.log("error", error.message);
    }
  };

  function validateIndianMobileNumber(mobileNumber) {
    // Regex to validate Indian mobile number
    const regex = /^[6-9]\d{9}$/;

    // Test the mobile number against the regex
    return regex.test(mobileNumber);
  }

  // Daily$K@BhF

  // Verify OTP
  const verifyOTP = async () => {
    try {
      if (!OTP) {
        return Swal2.fire({
          toast: true,
          position: "bottom",
          icon: "error",
          title: `Enter a valid OTP`,
          showConfirmButton: false,
          timer: 3000,
          timerProgressBar: true,
          customClass: {
            popup: "me-small-toast",
            title: "me-small-toast-title",
          },
        });
      }
      const config = {
        url: "User/mobileotpverification",
        method: "post",
        baseURL: "https://dailydish.in/api/",
        header: { "content-type": "application/json" },
        data: {
          Mobile: Mobile,
          otp: OTP,
        },
      };
      const res = await axios(config);
      if (res.status === 200) {
        localStorage.setItem("user", JSON.stringify(res.data.details));
        // alert("OTP verified successfully");
        Swal2.fire({
          toast: true,
          position: "bottom",
          icon: "success",
          title: `OTP verified successfully`,
          showConfirmButton: false,
          timer: 3000,
          timerProgressBar: true,
          customClass: {
            popup: "me-small-toast",
            title: "me-small-toast-title",
          },
        });

        if (!address) {
          handleClose2();
          handleClose3();
          return navigate("/home");
        }
        navigate("/home");
        handleClose2();
        setOTP("");
        setMobile(" ");
      }
    } catch (error) {
      // console.log(error);
      Swal2.fire({
        toast: true,
        position: "bottom",
        icon: "error",
        title: error.response.data.error || `Something went wrong!`,
        showConfirmButton: false,
        timer: 3000,
        timerProgressBar: true,
        customClass: {
          popup: "me-small-toast",
          title: "me-small-toast-title",
        },
      });
      // alert(error.response.data.error);
    }
  };

  const newsubtotal = useMemo(() => {
    return cart.reduce((acc, item) => {
      return acc + Number(item?.price) * Number(item?.Quantity);
    }, 0);
  }, [cart]);

  const totalQuantity = useMemo(() => {
    return cart.reduce((acc, item) => {
      return acc + Number(item?.Quantity);
    }, 0);
  }, [cart]);

  useEffect(() => {
    getfooditems();
  }, [cart]);

  const getCartQuantity = (itemId) => {
    return Carts?.filter((cartItem) => cartItem?.foodItemId === itemId)?.reduce(
      (total, curr) => total + curr?.Quantity,
      0
    );
  };

  useEffect(() => {
    if (address && Carts.length && fooditemdata.length) {
      ValidateCart(address, cart, setCarts, fooditemdata);
    }
  }, [address?.apartmentname, address?.Address, address?.pincode]);
  return (
    <div>
      <ToastContainer />

      <div>
        <Banner
          selectArea={selectArea}
          setSelectArea={setSelectArea}
          Carts={Carts}
          getAllOffer={getAllOffer}
        />
      </div>

      {wallet?.balance > 0 && show && (
        <div style={{ position: "relative" }}>
          {user && !address && (
            <div
              style={{
                position: "absolute",
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                backgroundColor: "#f9f8f6",
                zIndex: 10,
                pointerEvents: "none",
                opacity: 0.8,
              }}
            ></div>
          )}
          <CoinBalance
            wallet={wallet}
            transactions={transactions}
            expiryDays={expiryDays}
            setExpiryDays={setExpiryDays}
            setShow={setShow}
          />
        </div>
      )}

      <div style={{ position: "relative" }}>
        {user && !address && (
          <div
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              backgroundColor: "#f9f8f6",
              zIndex: 10,
              pointerEvents: "none",
              opacity: 0.8,
            }}
          ></div>
        )}
        <Container>
          <RatingModal />

          {AllOffer?.length > 0 ? (
            <div className="maincontainer">
              <div
                className="d-flex gap-3 mb-2 messageDiv  rounded-2 mt-3 justify-content-center"
                style={{
                  backgroundColor: "white",
                  padding: "5px",
                  height: "50px",
                }}
              >
                <p
                  className="mb-0 typewriter-desc"
                  style={{
                    color: "#6B8E23",
                    fontSize: "1rem",
                    textShadow: "1px 1px 3px rgba(0, 0, 0, 0.5)",
                    lineHeight: "1.6",
                    textAlign: "center",
                    // display:"flex",
                    // textWrap:"wrap"
                  }}
                >
                  🥳 {AllOffer[0]?.foodname} @ Just ₹{AllOffer[0]?.price}
                </p>
              </div>
            </div>
          ) : null}

          {/* <div className="maincontainer ">

          <div
            className="d-flex gap-3 mb-2 messageDiv  rounded-2"
            style={{ backgroundColor: "white", padding: "5px" }}
          >
            <div>
              <img
                src={`Assets/${gifUrl}`}
                alt="fdfdfds"
                className="praparing-food"
              />
            </div>

            <div>
              <div className="prepare-food-text">{message}</div>
            </div>
          </div>
        </div> */}

          {loader ? (
            <div
              className="d-flex justify-content-center align-item-center"
              style={{
                position: "fixed",
                top: "50%",
                left: "50%",
                transform: "translate(-50%, -50%)",
                zIndex: 9999,
              }}
            >
              <div class="lds-ripple">
                <div></div>
                <div></div>
              </div>
              {/* <Lottie animationData ={partybomb} /> */}
            </div>
          ) : null}
          {/* {loader ? (
          <div
            className="d-flex justify-content-center align-item-center"
            style={{
              position: "fixed",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              zIndex: 9999,
            }}
          >
            <Lottie animationData={partybomb} />
          </div>
        ) : null} */}
        </Container>
      </div>
      <div style={{ position: "relative" }}>
        {user && !address && (
          <div
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              backgroundColor: "#f9f8f6",
              zIndex: 10,
              pointerEvents: "none",
              opacity: 0.8,
            }}
          ></div>
        )}
        <div className="maincontainer mt-2">
          <div className="mobile-product-box " style={{ marginBottom: "70px" }}>
            <div className="d-flex gap-1 mb-2 flex-column">
              <div className="row ">
                {fooditemdata
                  ?.filter((ele) => {
                    if (address) {
                      const location = `${address?.apartmentname}, ${address?.Address}, ${address?.pincode}`;
                      const productLocation = ele.locationPrice || [];

                      return productLocation.some((item) =>
                        (item?.loccationAdreess || []).includes(location)
                      );
                    } else {
                      return true;
                    }
                  })
                  ?.sort((a, b) => {
                    if (address) {
                      const location = `${address?.apartmentname}, ${address?.Address}, ${address?.pincode}`;

                      // Find matching location price entries for both items
                      const aLocationPrice = a.locationPrice?.find((item) =>
                        (item?.loccationAdreess || []).includes(location)
                      );
                      const bLocationPrice = b.locationPrice?.find((item) =>
                        (item?.loccationAdreess || []).includes(location)
                      );

                      // Get priority values (default to 0 if not found)
                      const aPriority = aLocationPrice?.Priority || 0;
                      const bPriority = bLocationPrice?.Priority || 0;

                      // Sort by priority in ascending order
                      return aPriority - bPriority;
                    }
                    return 0; // No sorting when address is not provided
                  })
                  ?.map((item, i) => {
                    const location = `${address?.apartmentname}, ${address?.Address}, ${address?.pincode}`;
                    let matchedLocation = item.locationPrice?.find((loc) =>
                      loc.loccationAdreess?.includes(location)
                    );
                    const checkOf = AllOffer?.find(
                      (ele) => ele?.foodItemId == item?._id?.toString()
                    );
                    if (!matchedLocation) {
                      matchedLocation = item;
                    }
                    return (
                      <div
                        key={item._id?.toString() || i}
                        className="col-6 col-md-6 mb-2 d-flex justify-content-center"
                      >
                        <div className="mobl-product-card">
                          <div className="productborder">
                            <div className="prduct-box rounded-1">
                              <div
                                onClick={() => showDrawer(item)}
                                className="imagebg"
                              >
                                {item?.foodcategory === "Veg" ? (
                                  <img
                                    src={IsVeg}
                                    alt="IsVeg"
                                    className="isVegIcon"
                                  />
                                ) : (
                                  <img
                                    src={IsNonVeg}
                                    alt="IsNonVeg"
                                    className="isVegIcon"
                                  />
                                )}
                                <img
                                  src={`${item?.Foodgallery[0]?.image2}`}
                                  alt=""
                                  className="mbl-product-img"
                                />
                              </div>
                            </div>
                            <div className="food-name-container">
                              <p className="food-name">{item?.foodname}</p>
                              <small className="food-unit">{item?.unit}</small>
                            </div>

                            <div className="productprice">
                              {checkOf ? (
                                <p className="d-flex gap-1">
                                  <span className="offer-price">
                                    <b>₹</b>
                                    {matchedLocation?.foodprice}
                                  </span>
                                  <span>₹</span>
                                  {checkOf?.price}{" "}
                                </p>
                              ) : (
                                <p className="d-flex gap-1">
                                  <b>₹</b>
                                  {matchedLocation?.foodprice ||
                                    item?.foodprice}
                                </p>
                              )}
                            </div>

                            {address && (
                              <div className="parentdivqty">
                                <div className="h-100 d-flex justify-content-center align-items-center">
                                  <span
                                    style={{
                                      background:
                                        matchedLocation?.Remainingstock &&
                                        "rgba(255, 179, 0, 0.25)",
                                    }}
                                  >
                                    {checkOf && <BiSolidOffer color="green" />}{" "}
                                    {matchedLocation?.Remainingstock || 0}{" "}
                                    servings Left
                                  </span>
                                </div>
                              </div>
                            )}

                            <div className="d-flex justify-content-center mb-2">
                              {getCartQuantity(item?._id) === 0 ? (
                                // Item not in cart
                                address &&
                                (matchedLocation?.Remainingstock <= 0 ||
                                  !matchedLocation?.Remainingstock) ? (
                                  // Sold Out Button
                                  <button className="sold-out-btn" disabled>
                                    <span className="sold-out-btn-text">
                                      Sold Out
                                    </span>
                                  </button>
                                ) : gifUrl === "Closed.gif" ? (
                                  <button
                                    className="add-to-cart-btn-disabled"
                                    disabled
                                  >
                                    <span className="add-to-cart-btn-text">
                                      {" "}
                                      Add
                                    </span>
                                    <FaPlus className="add-to-cart-btn-icon" />
                                  </button>
                                ) : (
                                  <button
                                    className="add-to-cart-btn"
                                    onClick={() =>
                                      addCart1(item, checkOf, matchedLocation)
                                    }
                                    disabled={user && !address}
                                    style={{
                                      opacity: user && !address ? 0.5 : 1,
                                    }}
                                  >
                                    <span className="add-to-cart-btn-text">
                                      {" "}
                                      Add{" "}
                                    </span>
                                    <span className="add-to-cart-btn-icon">
                                      {" "}
                                      <FaPlus />
                                    </span>
                                  </button>
                                )
                              ) : getCartQuantity(item?._id) > 0 ? (
                                // Item in cart with quantity
                                <button className="increaseBtn">
                                  <div
                                    className="faplus"
                                    onClick={() =>
                                      !(user && !address) &&
                                      decreaseQuantity(
                                        item?._id,
                                        checkOf,
                                        matchedLocation
                                      )
                                    }
                                    style={{
                                      opacity: user && !address ? 0.5 : 1,
                                      pointerEvents:
                                        user && !address ? "none" : "auto",
                                    }}
                                  >
                                    <FaMinus />
                                  </div>
                                  <div className="faQuantity">
                                    {getCartQuantity(item?._id)}
                                  </div>
                                  <div
                                    className="faplus"
                                    onClick={() =>
                                      !(user && !address) &&
                                      increaseQuantity(
                                        item?._id,
                                        checkOf,
                                        item,
                                        matchedLocation
                                      )
                                    }
                                    style={{
                                      opacity: user && !address ? 0.5 : 1,
                                      pointerEvents:
                                        user && !address ? "none" : "auto",
                                    }}
                                  >
                                    <FaPlus />
                                  </div>
                                </button>
                              ) : matchedLocation?.Remainingstock <= 0 ||
                                !matchedLocation?.Remainingstock ? (
                                // Sold Out button (for items in cart but quantity is 0)
                                <button className="sold-out-btn" disabled>
                                  <span className="sold-out-btn-text">
                                    Sold Out
                                  </span>
                                </button>
                              ) : gifUrl === "Closed.gif" ? (
                                <button className="add-to-cart-btn" disabled>
                                  <span className="add-to-cart-btn-text">
                                    {" "}
                                    Add{" "}
                                  </span>
                                  <span className="add-to-cart-btn-icon">
                                    {" "}
                                    <FaPlus />
                                  </span>
                                </button>
                              ) : (
                                <button
                                  className="add-to-cart-btn"
                                  onClick={() =>
                                    addCart1(item, checkOf, matchedLocation)
                                  }
                                  disabled={user && !address}
                                  style={{
                                    opacity: user && !address ? 0.5 : 1,
                                  }}
                                >
                                  <span className="add-to-cart-btn-text">
                                    {" "}
                                    Add{" "}
                                  </span>
                                  <span className="add-to-cart-btn-icon">
                                    {" "}
                                    <FaPlus />
                                  </span>
                                </button>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
              </div>
            </div>
            <div className="col-md-12">
              <p className="copyright-text">
                © CULINARY CRAVINGS CONVENIENCE PVT LTD all rights reserved.
              </p>
            </div>
          </div>
        </div>

        {Carts?.length > 0 && (
          <div className="cartbutton">
            <div className="cartbtn">
              <div className="d-flex justify-content-around align-items-center">
                <div className="d-flex gap-1 align-items-center">
                  <p className="cart-slot-type">{SloteType}</p>
                  <div className="cart-items-price">
                    {totalQuantity} items | ₹{newsubtotal}
                  </div>
                </div>
                {user ? (
                  <a
                    onClick={() => {
                      if (!(user && !address)) {
                        goToCheckout();
                      }
                    }}
                    style={{
                      color: "unset",
                      textDecoration: "none",
                      opacity: user && !address ? 0.5 : 1,
                      pointerEvents: user && !address ? "none" : "auto",
                    }}
                  >
                    <div className="d-flex gap-1 align-content-center ">
                      <div className="my-meal-icon">
                        <img src={MyMeal} alt="My Meal" />
                        <div className="red-icon"></div>
                      </div>

                      <div className="my-meal-text">My Meal</div>
                    </div>
                  </a>
                ) : (
                  <div
                    className="d-flex gap-2 viewcartbtn"
                    onClick={() => {
                      const address =
                        addresstype == "apartment"
                          ? JSON.parse(localStorage.getItem("address"))
                          : JSON.parse(localStorage.getItem("coporateaddress"));
                      if (!address) {
                        Swal2.fire({
                          toast: true,
                          position: "bottom",
                          icon: "info",
                          title: `Please sign in to your account`,
                          showConfirmButton: false,
                          timer: 3000,
                          timerProgressBar: true,
                          customClass: {
                            popup: "me-small-toast",
                            title: "me-small-toast-title",
                          },
                        });
                        // return;
                      }
                      navigate("/", { replace: true });
                    }}
                  >
                    <div className="my-meal-icon">
                      <img src={MyMeal} alt="My Meal" />
                      <div className="red-icon"></div>
                    </div>

                    <div className="my-meal-text">My Meal</div>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        <Modal show={show3} backdrop="static" onHide={handleClose3}>
          <Modal.Header closeButton>
            <Modal.Title className="d-flex align-items-center gap-1">
              <FaLock color="#6B8E23" /> <span>Welcome to Dailydish</span>{" "}
            </Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form>
              <div className="login-whatsappwithicon">
                <FaSquareWhatsapp size={42} color="green" />

                <Form.Control
                  type="number"
                  placeholder="Enter Your WhatsApp Number"
                  value={Mobile}
                  onChange={(e) => setMobile(e.target.value)}
                />
              </div>

              <Button
                variant=""
                style={{
                  width: "100%",
                  marginTop: "24px",
                  backgroundColor: "#6B8E23",
                  color: "white",
                  textAlign: "center",
                }}
                onClick={() => {
                  if (!validateIndianMobileNumber(Mobile)) {
                    Swal2.fire({
                      toast: true,
                      position: "bottom",
                      icon: "error",
                      title: `Invalid mobile number`,
                      showConfirmButton: false,
                      timer: 3000,
                      timerProgressBar: true,
                      customClass: {
                        popup: "me-small-toast",
                        title: "me-small-toast-title",
                      },
                    });
                    return;
                  }
                  userLogin();
                }}
              >
                Send otp
              </Button>
            </Form>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={handleClose3}>
              Close
            </Button>
          </Modal.Footer>
        </Modal>

        <Modal
          show={show2}
          onHide={handleClose2}
          size="sm"
          style={{
            zIndex: "99999",
            position: "absolute",
            top: "30%",
            left: "0%",
          }}
        >
          <Modal.Header closeButton>
            <Modal.Title>Enter OTP</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <span style={{ fontSize: "13px" }}>
              An OTP has been sent to your Phone Number
            </span>
            <div className="d-flex gap-1 mt-3 mb-3">
              <InputGroup className="mb-2" style={{ background: "white" }}>
                <Form.Control
                  type={PasswordShow ? "text" : "password"}
                  className="login-input"
                  placeholder="Enter OTP"
                  aria-describedby="basic-addon1"
                  onChange={(e) => setOTP(e.target.value)}
                />
                <Button
                  variant=""
                  style={{ borderRadius: "0px", border: "1px solid black" }}
                  onClick={() => setPasswordShow(!PasswordShow)}
                  className="passbtn"
                >
                  {PasswordShow ? <FaEye /> : <FaEyeSlash />}
                </Button>
              </InputGroup>
            </div>
            <div>
              <Button
                variant=""
                style={{
                  width: "100%",
                  marginTop: "24px",
                  backgroundColor: "#6B8E23",
                  color: "white",
                  textAlign: "center",
                }}
                onClick={verifyOTP}
              >
                Continue
              </Button>
            </div>
          </Modal.Body>
        </Modal>

        <Drawer
          placement="bottom"
          closable={false}
          onClose={onClose}
          open={open}
          key="bottom"
          height={600}
          className="description-product"
        >
          <div className="modal-container-food">
            <button className="custom-close-btn" onClick={onClose}>
              ×
            </button>
            <div className="modern-food-item">
              <div className="food-image-container">
                {/* Loading spinner */}
                <div className="image-loading-spinner" id="image-spinner"></div>

                {foodData?.Foodgallery?.length > 0 && (
                  <img
                    src={`${foodData.Foodgallery[0].image2}`}
                    alt={foodData?.foodname}
                    className="modern-food-image"
                    onLoad={() => {
                      // Hide spinner and show image when loaded
                      const spinner = document.getElementById("image-spinner");
                      const image =
                        document.querySelector(".modern-food-image");
                      if (spinner) spinner.classList.add("hidden");
                      if (image) image.classList.add("loaded");
                    }}
                    onError={() => {
                      // Hide spinner even if image fails to load
                      const spinner = document.getElementById("image-spinner");
                      if (spinner) spinner.classList.add("hidden");
                    }}
                  />
                )}
                <div className="food-category-icon">
                  {foodData?.foodcategory === "Veg" ? (
                    <img src={IsVeg} alt="IsVeg" className="isVegIcon" />
                  ) : (
                    <img src={IsNonVeg} alt="IsNonVeg" className="isVegIcon" />
                  )}
                </div>
              </div>

              <div className="food-details">
                <h2 className="food-title">{foodData?.foodname}</h2>
                <p className="food-description">{foodData?.fooddescription}</p>

                {/* Define matchedLocation and checkOffer here for use in the UI and handlers */}
                {(() => {
                  const currentLocationString = `${address?.apartmentname}, ${address?.Address}, ${address?.pincode}`;

                  const matchedLocation = foodData?.locationPrice?.find(
                    // Corrected property to locationPrice
                    (locationItem) =>
                      locationItem?.loccationAdreess?.includes(
                        currentLocationString
                      )
                  );

                  const checkOffer = AllOffer?.find(
                    (offer) =>
                      offer?.locationId?._id === address?._id &&
                      offer?.products
                        ?.map((product) => product._id)
                        .includes(foodData?._id)
                  );

                  // Get the correct price to display
                  const currentPrice = checkOffer
                    ? checkOffer.price // Use offer price
                    : matchedLocation?.foodprice || foodData?.foodprice; // Use location price or default

                  // Get the correct original price (usually the matched location price when there is an offer)
                  const originalPrice = matchedLocation?.foodprice;

                  // Get the stock count to display
                  const stockCount = matchedLocation?.Remainingstock || 0;

                  return (
                    <>
                      <div className="pricing-section">
                        <div className="pricing-display">
                          {/* Display the correct current price */}
                          <span className="current-price">₹{currentPrice}</span>
                          {/* Display the original price if an offer is active */}
                          {checkOffer && (
                            <span
                              className="original-price"
                              style={{ marginLeft: "10px" }}
                            >
                              ₹{originalPrice}
                            </span>
                          )}
                        </div>
                        <div className="availability-banner">
                          {/* CORRECTED: Displaying stock from matchedLocation */}
                          {stockCount > 0 ? (
                            <>
                              {checkOffer && (
                                <BiSolidOffer
                                  color="green"
                                  style={{ marginRight: "5px" }}
                                />
                              )}{" "}
                              {stockCount} servings left!
                            </>
                          ) : (
                            "Sold Out"
                          )}
                        </div>
                      </div>

                      {/* Check if item is in cart */}
                      {getCartQuantity(foodData?._id) > 0 ? (
                        // Item in cart with quantity controls
                        <div className="increaseBtn">
                          {/* Decrease Quantity Button */}
                          <div
                            className="faplus"
                            onClick={() => {
                              if (!(user && !address)) {
                                decreaseQuantity(
                                  foodData?._id,
                                  checkOffer,
                                  matchedLocation
                                );
                              }
                            }}
                            style={{
                              opacity: user && !address ? 0.5 : 1,
                              pointerEvents: user && !address ? "none" : "auto",
                            }}
                          >
                            <FaMinus />
                          </div>
                          {/* Quantity Display */}
                          <div className="faQuantity">
                            {getCartQuantity(foodData?._id)}
                          </div>
                          {/* Increase Quantity Button */}
                          <div
                            className="faplus"
                            onClick={() => {
                              if (!(user && !address)) {
                                increaseQuantity(
                                  foodData?._id,
                                  checkOffer,
                                  foodData,
                                  matchedLocation
                                );
                              }
                            }}
                            style={{
                              opacity: user && !address ? 0.5 : 1,
                              pointerEvents: user && !address ? "none" : "auto",
                            }}
                          >
                            <FaPlus />
                          </div>
                        </div>
                      ) : // Add to cart button (handling Sold Out state)
                      stockCount > 0 && gifUrl !== "Closed.gif" ? (
                        <button
                          className="add-to-plate-btn"
                          onClick={() => {
                            addCart1(foodData, checkOffer, matchedLocation);
                          }}
                          disabled={user && !address}
                          style={{
                            opacity: user && !address ? 0.5 : 1,
                            pointerEvents: user && !address ? "none" : "auto",
                          }}
                        >
                          <span>Add to plate</span>
                          <div className="plate-icon">🍽️</div>
                        </button>
                      ) : (
                        // Sold Out / Closed Button
                        <button
                          className={
                            gifUrl === "Closed.gif"
                              ? "add-to-cart-btn-disabled"
                              : "sold-out-btn"
                          }
                          disabled
                        >
                          <span className="add-to-cart-btn-text">
                            {gifUrl === "Closed.gif" ? "Closed" : "Sold Out"}
                          </span>
                        </button>
                      )}
                    </>
                  );
                })()}

                {/* <div className="information-section">
              <h3 className="section-title">
                Key Highlights
                <span className="section-line"></span>
              </h3>
              <ul className="highlights-list">
                <li>Marinated 12 hrs in creamy yogurt & hand-crushed spices</li>
                <li>Aged Basmati rice infused with saffron milk</li>
                <li>Dum-cooked in earthen handi for that smoky finish</li>
              </ul>
            </div> */}
              </div>
            </div>
          </div>
        </Drawer>
      </div>
    </div>
  );
};

export default Home;