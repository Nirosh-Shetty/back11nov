import { useState, useEffect, useContext, useRef } from "react";
import "../Styles/Banner.css";

import { Button, Modal, Form, InputGroup } from "react-bootstrap";
import { FaEye, FaEyeSlash } from "react-icons/fa";

import axios from "axios";
import { useNavigate } from "react-router-dom";
// import TextField from "@mui/material/TextField";
// import Autocomplete from "@mui/material/Autocomplete";
import ApartmentIcon from "@mui/icons-material/Apartment"; // Icon to represent apartments
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
// import Nav from "react-bootstrap/Nav";
// import { MdAccountCircle } from "react-icons/md";
// import { MdOutlineLogout } from "react-icons/md";
import { FaLock } from "react-icons/fa";
// import { BiMessageDetail } from "react-icons/bi";
// import { IoLogoYoutube, IoSearchCircleOutline } from "react-icons/io5";
// import { ImSpoonKnife } from "react-icons/im";
// import Offcanvas from "react-bootstrap/Offcanvas";
// import { IoMdHeart } from "react-icons/io";
// import { GrDocumentUser } from "react-icons/gr";
import Swal2 from "sweetalert2";
import swal from "sweetalert";

import { FaSquareWhatsapp } from "react-icons/fa6";
import { WalletContext } from "../WalletContext";

import Selectlocation from "../assets/selectlocation.svg";
import UserIcons from "../assets/userp.svg";

import SearchIcon from "../assets/search.svg";
// import Logo from "../assets/logo-container.svg";
import UserBanner from "./UserBanner";
import ProfileOffcanvas from "./Navbar2";
const Banner = ({ selectArea, setSelectArea, Carts, getAllOffer }) => {
  const addresstype = localStorage.getItem("addresstype");
  const corporateaddress = JSON.parse(localStorage.getItem("coporateaddress"));

  const user = JSON.parse(localStorage.getItem("user"));

  const navigate = useNavigate("");
  const [Fname, setFname] = useState("");
  const [Address, setAddress] = useState("");
  const [Flatno, setFlatno] = useState("");
  const [OTP, setOTP] = useState(["", "", "", ""]);
  const [PasswordShow, setPasswordShow] = useState(false);
  //Address save modal
  const { wallet, walletSeting, rateorder, rateMode } =
    useContext(WalletContext);
  const [show, setShow] = useState(false);
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const [show2, setShow2] = useState(false);
  const handleClose2 = () => setShow2(false);
  const handleShow2 = () => setShow2(true);
  const [showCart, setShowCart] = useState(false);

  const [show3, setShow3] = useState(false);
  const handleClose3 = () => setShow3(false);
  const handleShow3 = () => {
    handleClose4();
    setShow3(true);
  };

  const [show4, setShow4] = useState(false);
  const handleShow4 = () => setShow4(true);
  const handleClose4 = () => setShow4(false);

  const [show5, setShow5] = useState(false);

  const handleClose5 = () => setShow5(false);
  const handleShow5 = () => setShow5(true);
  const [show7, setShow7] = useState(false);
  const handleClose7 = () => setShow7(false);
  const handleShow7 = () => setShow7(true);
  const [Mobile, setMobile] = useState("");
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
    try {
      const config = {
        url: "/User/Sendotp",
        method: "post",
        baseURL: "http://localhost:7013/api",

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
          title: `Error sending OTP`,
          showConfirmButton: false,
          timer: 3000,
          timerProgressBar: true,
          customClass: {
            popup: "me-small-toast",
            title: "me-small-toast-title",
          },
        });
        alert("Error sending OTP");
      }
      if (res.status === 200) {
        handleClose3();
        handleShow7();
      }
    } catch (error) {
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
      // console.log("error", error.message);
    }
  };

  const [show8, setShow8] = useState(false);

  const handleClose8 = () => setShow8(false);
  const handleShow8 = () => setShow8(true);

  const handleShowCart = () => setShowCart(true);

  const phoneNumber = "7204188504"; // Replace with your WhatsApp number
  const message = "Hello! I need assistance."; // Default message

  const whatsappLink = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(
    message
  )}`;

  const logOut = () => {
    swal({
      title: "Yeah!",
      text: "Successfully Logged Out",
      icon: "success",
      button: "Ok!",
    });
    setTimeout(() => {
      window.location.assign("/");
    }, 5000);
    localStorage.clear();
    // localStorage.removeItem("user");
  };

  const [apartmentdata, setapartmentdata] = useState([]);
  const getapartmentd = async () => {
    try {
      let res = await axios.get("http://localhost:7013/api/admin/getapartment");
      if (res.status === 200) {
        setapartmentdata(res.data.corporatedata);
      }
    } catch (error) {
      // console.log(error);
    }
  };

  useEffect(() => {
    getapartmentd();
  }, []);
  const [corporatedata, setcorporatedata] = useState([]);
  const getcorporate = async () => {
    try {
      let res = await axios.get("http://localhost:7013/api/admin/getcorporate");
      if (res.status === 200) {
        setcorporatedata(res.data.corporatedata);
      }
    } catch (error) {
      // console.log(error);
    }
  };

  useEffect(() => {
    getcorporate();
  }, []);

  const [storyLength, setStoryLength] = useState(0);

  useEffect(() => {
    const getAddWebstory = async () => {
      try {
        let res = await axios.get("http://localhost:7013/api/admin/getstories");
        if (res.status === 200) {
          setStoryLength(res.data.getbanner.length);
        }
      } catch (error) {
        // console.log(error);
      }
    };
    getAddWebstory();
  }, []);
  const address = JSON.parse(
    localStorage.getItem(
      addresstype === "apartment" ? "address" : "coporateaddress"
    )
  );

  const Handeledata = (ab, def) => {
    // toast.success("Request Submitted Successfully.");
    try {
      if (ab) {
        if (!user) return navigate("/", { replace: true });
        let data = JSON.parse(ab);
        // console.log("data=====>",data);
        const addressData = {
          Address: data?.Address,
          Delivarycharge: data?.apartmentdelivaryprice,
          doordelivarycharge: data?.doordelivaryprice,
          apartmentname: data?.Apartmentname,
          pincode: data?.pincode,
          approximatetime: data?.approximatetime,
          prefixcode: data?.prefixcode,
          name: ab?.Name || user?.Fname || "",
          flatno: ab?.fletNumber || "",
          mobilenumber: ab?.Number || user?.Mobile || "",
          towerName: ab?.towerName ? ab?.towerName : "",
          lunchSlots: data?.lunchSlots ? data?.lunchSlots : [],
          dinnerSlots: data?.dinnerSlots ? data?.dinnerSlots : [],
          deliverypoint: data?.deliverypoint ? data?.deliverypoint : "",
          locationType: data?.locationType || "",
          hubId:data?.hubId || "",
        };
        if (!def) {
          saveSelectedAddress(data);
        }

        if (addresstype === "apartment") {
          localStorage.setItem("address", JSON.stringify(addressData));
          // setAddress1(data);
        } else {
          localStorage.setItem("coporateaddress", JSON.stringify(addressData));
        }

        // Convert addressData to JSON string and store in localStorage

        setSelectArea(JSON.stringify(addressData));
        // window.location.reload();
        // getAllOffer()
      }
    } catch (error) {
      // console.log(error);
    }
  };

  //Request Location
  const [Name, setName] = useState("");
  const [Number, setNumber] = useState("");
  const [ApartmentName, setApartmentName] = useState("");
  const [Message, setMessage] = useState("");

  function validateIndianMobileNumber(mobileNumber) {
    // Regex to validate Indian mobile number
    const regex = /^[6-9]\d{9}$/;

    // Test the mobile number against the regex
    return regex.test(mobileNumber);
  }

  const Requestaddress = async () => {
    try {
      if (!Name) {
        return alert("Please Add Your Name");
      }

      if (!Number) {
        return alert("Please Add Your Contact Number");
      }
      if (!ApartmentName) {
        return alert("Please Add Apartment Name");
      }
      if (!Message) {
        return alert("Please Add Your Address");
      }

      if (!validateIndianMobileNumber(Number)) {
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
      const config = {
        url: "User/EnquiryEnquiry",
        method: "post",
        baseURL: "http://localhost:7013/api/",
        header: { "content-type": "application/json" },
        data: {
          Name: Name,
          Number: Number,
          ApartmentName: ApartmentName,
          Message: Message,
        },
      };
      const res = await axios(config);
      if (res.status === 200) {
        // alert("Location Add Request Sent. We'll Update You Soon..!");
        toast.success("Request Submitted Successfully.");
        handleClose2();
        setName("");
        setNumber("");
        setApartmentName("");
        setMessage("");
        // navigate("/home")
        // window.location.reload();
      }
    } catch (error) {
      // console.log(error);
    }
  };

  // const currentTime = new Date();
  // const currentMinutes = currentTime.getHours() * 60 + currentTime.getMinutes(); // Convert time to minutes since midnight

  // // Define time slots in minutes
  // const openTime = 7 * 60; // 8:00 AM
  // const lunchMenuEnd = 13 * 60 + 30; // 01:30 PM
  // const lunchDeliveryEnd = 16 * 60; // 4:00 PM
  // const dinnerMenuStart = 14 * 60; // 3:00 PM
  // const dinnerMenuEnd = 22 * 60; // 10:00 PM
  // const closeTime = 22 * 60; // 11:00 PM
  // const shopCloseTime = 22 * 60; // 10:00 PM
  // // Determine which message or menu to show
  // let displayMessage = "";
  // let timeShow = "";

  // if (currentMinutes >= closeTime || currentMinutes < openTime) {
  //   // Before 8:00 AM or after 11:00 PM
  //   displayMessage = "Currently, we are closed";
  //   timeShow = "Ordering resumes at 07:00 AM.";
  // } else if (currentMinutes >= openTime && currentMinutes <= lunchMenuEnd) {
  //   // Between 8:00 AM and 12:30 PM
  //   displayMessage = "Ordering Lunch";
  //   timeShow = "07:00 AM to 02:00 PM";
  // } else if (
  //   currentMinutes > lunchMenuEnd &&
  //   currentMinutes < dinnerMenuStart
  // ) {
  //   // Between 12:30 PM and 3:00 PM
  //   displayMessage = "Ordering Lunch";
  //   timeShow = "Dinner ordering starts at 02:00 PM.";
  // } else if (
  //   currentMinutes >= dinnerMenuStart &&
  //   currentMinutes <= dinnerMenuEnd
  // ) {
  //   // Between 3:00 PM and 8:30 PM
  //   displayMessage = "Ordering Dinner";
  //   timeShow = "02:00 PM to 09:00 PM";
  // } else {
  //   // Between 8:30 PM and 11:00 PM
  //   displayMessage = "Currently, we are closed";
  //   timeShow = "Ordering resumes at 07:00 AM.";
  // }

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
        // return alert("Enter a valid OTP");
      }
      const config = {
        url: "User/mobileotpverification",
        method: "post",
        baseURL: "http://localhost:7013/api/",
        header: { "content-type": "application/json" },
        data: {
          Mobile: Mobile,
          otp: OTP,
        },
      };
      const res = await axios(config);
      if (res.status === 200) {
        // setadmindata(res.data.success);
        localStorage.setItem("user", JSON.stringify(res.data.details));
        sessionStorage.setItem("user", JSON.stringify(res.data.details));
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
        window.location.reload();
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

  const [selectedAddress, setSelectedAddress] = useState({});

  const getSelectedAddress = async () => {
    try {
      let res = await axios.get(
        `http://localhost:7013/api/user/getSelectedAddressByUserIDAddType/${user?._id}/${addresstype}`
      );
      if (res.status === 200) {
        setSelectedAddress(res.data.getdata);

        // console.log("Selected Address",res.data.getdata);
      }
    } catch (error) {
      // console.log(error);
    }
  };

  useEffect(() => {
    if (user) {
      getSelectedAddress();
    }
  }, []);

  useEffect(() => {
    if (selectedAddress) {
      if (addresstype === "apartment") {
        const am = apartmentdata.find(
          (ele) => ele?._id?.toString() === selectedAddress?.addressid
        );
        if (am) {
          Handeledata(JSON.stringify({ ...am, ...selectedAddress }), "def");
        }
      } else {
        const co = corporatedata.find(
          (ele) => ele?._id?.toString() === selectedAddress?.addressid
        );
        if (co) {
          Handeledata(JSON.stringify({ ...co, ...selectedAddress }), "def");
        }
      }
    }
  }, [selectedAddress, addresstype, apartmentdata, corporatedata]);

  const saveSelectedAddress = async (data) => {
    try {
      if (!user) return;
      let res = await axios.post(`http://localhost:7013/api/user/addressadd`, {
        Name: user?.Fname,
        Number: user?.Mobile,
        userId: user?._id,
        ApartmentName: data?.Apartmentname,
        addresstype: addresstype,
        addressid: data?._id,
      });
    } catch (error) {
      // console.log(error);
    }
  };

  const inputRef = useRef(null);
  const [open, setOpen] = useState(false);

  // const user = JSON.parse(localStorage.getItem("user"));

  const [searchValue, setSearchValue] = useState("");

  const [showselectlocation, setShowselectlocation] = useState(false);
  useEffect(() => {
    if (corporateaddress?.apartmentname || address?.apartmentname) {
      setShowselectlocation(false);
    } else {
      setShowselectlocation(true);
    }
  }, [corporateaddress?.apartmentname, address?.apartmentname]);

  return (
    <div>
      <div className="ban-container">
        {/* <ToastContainer /> */}

        <div className="mobile-banner-updated">
          <div className="screen-2 mb-3">
            {/* <div className="d-flex justify-content-between ">
            <div className="d-flex gap-3 profileCard">
              <div
             
                className="profileSection"
                onClick={handleShow8}
              >
                <FaUser className="mobile-user-screen2" />
              </div>
         
              <div className="mobile-user-screen2-title ">
                <div className="text-center">
                  <h6>
                    {displayMessage}
                 
                  </h6>
                
                  <p style={{ fontSize: "13px" }}>{timeShow}</p>
                </div>
              </div>

           
              <div className="trustSection" onClick={handleShow5}>
                <img
                  src="/Assets/trustlogo.png"
                  alt=""
                  srcset=""
                  className="blinking-red-border"
                />
              </div>
            </div>
          </div> */}
            {showselectlocation ? (
              <div className="w-100">
                <div className="d-flex gap-2 align-items-center ">
                  <img src={Selectlocation} alt="select-location" />
                  <p className="select-location-text">Select Location</p>
                </div>

                <div className="locationselector mt-2">
                  {addresstype === "corporate" ? (
                    <div className="custom-autocomplete-wrapper">
                      <div
                        className="custom-autocomplete-input"
                        onFocus={() => setOpen(!open)}
                      >
                        <input
                          ref={inputRef}
                          type="text"
                          value={searchValue}
                          onChange={(e) => {
                            setSearchValue(e.target.value);
                            setOpen(true);
                          }}
                          onFocus={() => setOpen(true)}
                          placeholder={
                            corporateaddress?.apartmentname ||
                            "Find delivery locations near me"
                          }
                          className="autocomplete-input-field"
                        />

                        {corporateaddress?.apartmentname && (
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              Handeledata(JSON.stringify({}));
                              setSearchValue("");
                            }}
                            className="clear-button"
                          >
                            <span>×</span>
                          </button>
                        )}

                        <img
                          src={SearchIcon}
                          alt="search-icon2"
                          className="search-icon"
                        />
                      </div>

                      {open && (
                        <div className="custom-dropdown">
                          {[...corporatedata]
                            .filter((option) =>
                              option?.Apartmentname.toLowerCase().includes(
                                searchValue.toLowerCase()
                              )
                            )
                            .sort((a, b) =>
                              a?.Apartmentname.localeCompare(b?.Apartmentname)
                            )
                            .map((option) => (
                              <div
                                key={option.id}
                                className="dropdown-option"
                                onClick={() => {
                                  Handeledata(JSON.stringify(option));
                                  setSearchValue("");
                                  setOpen(false);
                                }}
                              >
                                <ApartmentIcon className="option-icon" />
                                <span>{option?.Apartmentname}</span>
                              </div>
                            ))}
                          {[...corporatedata].filter((option) =>
                            option?.Apartmentname.toLowerCase().includes(
                              searchValue.toLowerCase()
                            )
                          ).length === 0 && (
                            <div className="no-options">
                              No corporate locations found
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="custom-autocomplete-wrapper">
                      <div
                        className="custom-autocomplete-input"
                        onFocus={() => setOpen(!open)}
                      >
                        <input
                          ref={inputRef}
                          type="text"
                          value={searchValue}
                          onChange={(e) => {
                            setSearchValue(e.target.value);
                            setOpen(true);
                          }}
                          onFocus={() => setOpen(true)}
                          placeholder={
                            address?.apartmentname || "Select Pg/Apartment"
                          }
                          className="autocomplete-input-field"
                        />

                        {address?.apartmentname && (
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              Handeledata(JSON.stringify({}));
                              setSearchValue("");
                            }}
                            className="clear-button"
                          >
                            <span>×</span>
                          </button>
                        )}

                        <img
                          src={SearchIcon}
                          alt="search-icon1"
                          className="search-icon"
                        />
                      </div>

                      {open && (
                        <div className="custom-dropdown">
                          {[...apartmentdata]
                            .filter((option) =>
                              option?.Apartmentname.toLowerCase().includes(
                                searchValue.toLowerCase()
                              )
                            )
                            .sort((a, b) =>
                              a.Apartmentname.localeCompare(b.Apartmentname)
                            )
                            .map((option) => (
                              <div
                                key={option.id}
                                className="dropdown-option"
                                onClick={() => {
                                  Handeledata(JSON.stringify(option));
                                  setSearchValue("");
                                  setOpen(false);
                                }}
                              >
                                <ApartmentIcon className="option-icon" />
                                <span>{option?.Apartmentname}</span>
                              </div>
                            ))}
                          {[...apartmentdata].filter((option) =>
                            option?.Apartmentname.toLowerCase().includes(
                              searchValue.toLowerCase()
                            )
                          ).length === 0 && (
                            <div className="no-options">
                              No apartments found
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <div>
                {/* <img src={Logo} alt="logo" className="custom-logo" /> */}
                <div className="d-flex gap-2 align-items-center mt-2">
                  <img src={Selectlocation} alt="select-location" />
                  <div
                    className="d-flex flex-column cursor-pointer user-details-banner"
                    onClick={() => setShowselectlocation(true)}
                  >
                    <p className="select-location-text ">
                      {corporateaddress?.apartmentname ||
                        address?.apartmentname ||
                        "Select Location"}
                    </p>
                    <p className="select-location-text-small">
                      {user?.Fname} | {user?.Mobile}
                    </p>
                  </div>
                </div>
              </div>
            )}
            <div className="d-flex gap-1 justify-content-between align-items-center">
            {user && ( // Only show if user is logged in
              <button
                className="refer-earn-btn"
                onClick={() => navigate("/refer")}
              >
                <img
                  src="/Assets/gifticon.svg"
                  alt="refer"
                  className="refer-icon"
                />
                <span className="refer-earn-text">Refer & Earn</span>
              </button>
            )}
           
              <img
                src={UserIcons}
                alt="user-icon"
                onClick={handleShow8}
                className="p-2"
              />
            </div>
          </div>

          {!user && (
            <div className="benifits-container mb-3">
              <ul className="benifits-item">
                {/* <img src={BenifitsIcon} alt="benifits-icon" /> */}
                <li className="benifits-text">
                  ✨ Unlock more with an account:
                </li>
                <li className="benifits-text">Wallet bonuses 💰</li>
                <li className="benifits-text">Loyalty discounts 🎁</li>
                <li className="benifits-text">Special member pricing 💡</li>
                <li className="benifits-text">
                  👉 Sign up to redeem (new users only)
                </li>
              </ul>

              <button
                className="signup-button"
                onClick={() => navigate("/", { replace: true })}
              >
                Signup
              </button>
            </div>
          )}

          {/* {(!corporateaddress?.apartmentname && !address?.apartmentname && user) && <div
          className="d-flex justify-content-center align-items-start mt-2"
        >
          <div style={{ width: "100%", maxWidth: "400px" }}>
            <div
              className="p-3 shadow-sm"
              style={{
                backgroundColor: "#6B8E23",
                borderRadius: "15px",
                cursor: "pointer",
              }}
              onClick={handleCardClick}
            >
              <h5 className="text-center text-white mb-0">
                📍 Please select location
              </h5>
            </div>
          </div></div>} */}
        </div>

        {/* Request Aprtment modal */}
        <Modal show={show2} onHide={handleClose2} style={{ zIndex: "99999" }}>
          <Modal.Header closeButton>
            <Modal.Title>Request Add {addresstype}</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form
              onSubmit={(e) => {
                e.preventDefault();
                Requestaddress();
              }}
            >
              <Form.Control
                type="text"
                placeholder="Enter Name"
                style={{ marginTop: "18px" }}
                required
                onChange={(e) => setName(e.target.value)}
              />
              <Form.Control
                type="number"
                placeholder="Enter Contact Number"
                style={{ marginTop: "18px" }}
                required
                onChange={(e) => setNumber(e.target.value)}
                className="numberremove"
              />

              <Form.Control
                type="text"
                placeholder="Enter Apartment Name"
                style={{ marginTop: "18px" }}
                required
                onChange={(e) => setApartmentName(e.target.value)}
              />

              <Form.Control
                type="text"
                placeholder="Enter Address "
                style={{ marginTop: "18px" }}
                onChange={(e) => setMessage(e.target.value)}
              />
              <button
                style={{
                  width: "100%",
                  marginTop: "24px",
                  color: "white",
                  textAlign: "center",
                  height: "30px",
                  borderRadius: "6px",
                  backgroundColor: "orangered",
                }}
                type="submit"
              >
                Send Request
              </button>
            </Form>
          </Modal.Body>
        </Modal>
        <ProfileOffcanvas show={show8} handleClose={handleClose8} />

        {/* <Modal
        show={show4}
        backdrop="static"
        onHide={handleClose4}
        style={{ zIndex: "9999999" }}
      >
        <Modal.Header closeButton>
          <Modal.Title>Register Here</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Control
              type="text"
              placeholder="Enter Full Name"
              style={{ marginTop: "18px" }}
              value={Fname}
              onChange={(e) => {
                setFname(e.target.value);
              }}
            />

            <Form.Control
              type="number"
              placeholder="Enter Phone Number"
              style={{ marginTop: "18px" }}
              value={Mobile}
              onChange={(e) => setMobile(e.target.value)}
            />
            <Form.Control
              type="text"
              placeholder="Enter Flat No,Building Name"
              style={{ marginTop: "18px" }}
              value={Address}
              onChange={(e) => setAddress(e.target.value)}
            />
            <Form.Control
              type="text"
              placeholder="Tower/Phase/Block"
              style={{ marginTop: "18px" }}
              value={Flatno}
              onChange={(e) => setFlatno(e.target.value)}
            />

            <Button
              variant=""
              style={{
                width: "100%",
                marginTop: "24px",
                backgroundColor: "#6B8E23",
                color: "white",
                textAlign: "center",
              }}
              onClick={handleRegister}
            >
              Register
            </Button>
          </Form>
          <h6 className="text-center">Or</h6>
          <Button
            variant=""
            style={{
              width: "100%",
              backgroundColor: "#6B8E23",
              color: "white",
              textAlign: "center",
            }}
            onClick={handleShow3}
          >
            Login
          </Button>
        </Modal.Body>
      </Modal> */}

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
                  userLogin();
                }}
                // onClick={() => navigate("/checkout")}
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
          show={show7}
          onHide={handleClose7}
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
              An OTP has been sent to your whatsapp
            </span>
            <div className="d-flex gap-1 mt-3 mb-3">
              <InputGroup className="mb-2" style={{ background: "white" }}>
                <Form.Control
                  type={PasswordShow ? "text" : "password"}
                  className="login-input"
                  placeholder="Enter OTP"
                  aria-describedby="basic-addon1"
                  // value={OTP}
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
                onClick={verifyOTP}
                style={{
                  width: "100%",
                  marginTop: "24px",
                  backgroundColor: "#6B8E23",
                  color: "white",
                  textAlign: "center",
                }}
              >
                Continue
              </Button>
            </div>
          </Modal.Body>
        </Modal>
      </div>
      <div className="ban-container">
        <div className="mobile-banner" style={{ position: "relative" }}>
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
          <UserBanner />
        </div>
      </div>
    </div>
  );
};

export default Banner;
