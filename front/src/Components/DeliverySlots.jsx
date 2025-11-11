import React, { useEffect, useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Modal } from 'react-bootstrap';
import { PiWarningCircleBold } from "react-icons/pi";
import { IoCloseCircleOutline } from 'react-icons/io5';
import moment from 'moment';

const DeliverySlots = ({ availableSlots, setAvailableSlots, address, setSlotdata }) => {
    const [selectedSlot, setSelectedSlot] = useState('');
    const [showFAQModal, setShowFAQModal] = useState(false);
    const SloteType = moment().hour() < 14 ? "lunch" : "dinner";
    const [showNotAvailableModal, setShowNotAvailableModal] = useState(false);
    const lunchSlots = address?.lunchSlots ? address?.lunchSlots?.map((slot) => {
        const [start, end] = slot.time.split("-");
        const [startHour, startMinute] = start.split(":");

        const [endHour, endMinute] = end.split(":");
        return {
            start: (startHour < 10 ? 12 + Number(startHour) : startHour) + ":" + startMinute,
            end: (endHour < 10 ? 12 + Number(endHour) : endHour) + ":" + endMinute?.slice(0, 2),
            available: slot.active
        }
    }) : [];
    const dinnerSlots = address?.dinnerSlots ? address?.dinnerSlots?.map((slot) => {
        const [start, end] = slot?.time?.split("-");
        const [startHour, startMinute] = start.split(":");
        const [endHour, endMinute] = end.split(":");
        return {
            start: (startHour < 10 ? 12 + Number(startHour) : startHour) + ":" + startMinute,
            end: (endHour < 10 ? 12 + Number(endHour) : endHour) + ":" + endMinute?.slice(0, 2),
            available: slot.active
        }
    }) : [];
    const slots = {
        lunch: lunchSlots?.length > 0 ? lunchSlots : [
            { start: "12:30", end: "12:45", available: true },
            { start: "12:45", end: "13:00", available: true },
            { start: "13:00", end: "13:15", available: true },
            { start: "13:15", end: "13:30", available: true },
            { start: "13:30", end: "13:45", available: true },
            { start: "13:45", end: "14:00", available: true },
            { start: "14:00", end: "14:15", available: true },
            { start: "14:15", end: "14:30", available: true },
            { start: "14:30", end: "14:45", available: true },
        ],
        dinner: dinnerSlots?.length > 0 ? dinnerSlots : [
            { start: "19:30", end: "19:45", available: true },
            { start: "19:45", end: "20:00", available: true },
            { start: "20:00", end: "20:15", available: true },
            { start: "20:15", end: "20:30", available: true },
            { start: "20:30", end: "20:45", available: true },
            { start: "20:45", end: "21:00", available: true },
            { start: "21:00", end: "21:15", available: true },
            { start: "21:15", end: "21:30", available: true },
        ],
    };

    const formatTo12Hour = (time, type) => {
        const [hour, minute] = time.split(":").map(Number);
        const suffix = hour >= 12 ? "PM" : "AM";
        const formattedHour = hour > 12 ? hour - 12 : hour === 0 ? 12 : hour;
        const formattedMinute = minute < 10 ? `0${minute}` : minute;
        const formateHour = formattedHour < 10 ? `0${formattedHour}` : formattedHour;
        if (type === "start") {
            return `${formateHour}:${formattedMinute}`;
        } else {
            return `${formateHour}:${formattedMinute} ${suffix}`;
        }

    };

    const formatSlotRange = (startTime, endTime) => {
        const formattedStart = formatTo12Hour(startTime, "start");
        const formattedEnd = formatTo12Hour(endTime, "end");
        return `${formattedStart} - ${formattedEnd}`;
    };

    const getDynamicSlots = (currentTime, approximatetime) => {
        if (!currentTime || !moment(currentTime, "HH:mm", true).isValid()) {
            console.error("Invalid currentTime format:", currentTime);
            return [];
        }

        const approxTime = Number(approximatetime) || 40;
        if (approxTime < 0) {
            console.error("Invalid approximatetime:", approximatetime);
            return [];
        }

        const currentMoment = moment(currentTime, "HH:mm");
        const deliveryTime = currentMoment.clone().add(approxTime, "minutes");

        // ✅ Use current time to decide slot type
        const slotType = currentMoment.hour() < 14 ? "lunch" : "dinner";
        const baseSlots = slots[slotType];

        const slotsToShow = [];

        baseSlots.forEach((slot) => {
            const slotStart = moment(slot.start, "HH:mm");
            const slotEnd = moment(slot.end, "HH:mm");

            if (
                deliveryTime.isSameOrAfter(slotStart) &&
                deliveryTime.isBefore(slotEnd)
            ) {
                // console.log(" If slot",slot);
                slotsToShow.push(slot);
            } else if (slotStart.isAfter(deliveryTime)) {
                // console.log(" Else if slot",slot);
                slotsToShow.push(slot);
            } else {
                // console.log(" Else else slot",slot);
                slotsToShow.push({ ...slot, available: false });
            }
        });

        return slotsToShow;
    };

    const AddressType=localStorage.getItem("addresstype");

    useEffect(() => {
        const getCurrentTimeSlots = () => {
            const current = new Date();
            // const hours = current.getHours();
            const minutes = current.getMinutes();
            const hours = 12
            // const minutes = 30;

            // const AddressType=localStorage.getItem("addresstype");
            // const endTime=AddressType==="corporate"?"20:00":"21:00";
            const time = `${hours < 10 ? "0" + hours : hours}:${minutes < 10 ? "0" + minutes : minutes
                }`;
            let slotsToShow = [];

            // console.log("Current time:", time, "Approx time:", address?.approximatetime);

            // Lunch: 7:00 AM - 2:00 PM
            if (time >= "07:00" && time < "12:00") {
                slotsToShow = slots.lunch;
            }
            else if (time >= "12:00" && time <= "14:00") {
                slotsToShow = getDynamicSlots(time, parseInt(address?.approximatetime) || 30, address?.lunchSlots);
            }
            // Dinner: 2:00 PM - 9:00 PM
            else if (time >= "14:00" && time < "19:00") {
                slotsToShow = slots.dinner;
            } else if (time >= "19:00" && time <= "21:00") {
                slotsToShow = getDynamicSlots(time, parseInt(address?.approximatetime) || 30, address?.dinnerSlots);
            } else {
                // setEndstatus(true);
                slotsToShow = [];
            }

            // console.log("slotsToShow", slotsToShow);
            setAvailableSlots(
                slotsToShow.map((slot, index) => {
                    return {
                        id: (index + 1),
                        available: slot.available,
                        time: typeof slot === "string" ? slot : formatSlotRange(slot.start, slot.end),

                    }
                })
                //   typeof slot === "string" ? slot : formatSlotRange(slot.start, slot.end)}

            );
        };

        getCurrentTimeSlots();
        const interval = setInterval(getCurrentTimeSlots, 60000);
        return () => clearInterval(interval);
    }, [address?.approximatetime]);


    const [showBeforeEndTime, setShowBeforeEndTime] = useState("00:00");
    const handleSlotSelect = (time, available) => {
        if (available) {
            setSelectedSlot(time);
            setSlotdata(time);
        } else {
            const [startTime, endTime] = time.split("-");
            const [hours, minutes] = startTime.split(":");
            const formattedHours = Number(hours) < 10 ? Number(hours) + 12 : hours;
            const formattedMinutes = minutes < 10 ? `0${minutes}` : minutes;
            const currentTime = moment(`${formattedHours}:${formattedMinutes}`, "HH:mm")
            const beforeEndTime = currentTime.clone().subtract(address?.approximatetime || 30, "minutes");
            setShowBeforeEndTime(formatTo12Hour(beforeEndTime.format("HH:mm"), "end"));

            // console.log("beforeEndTime", beforeEndTime);
            // setShowBeforeEndTime(beforeEndTime);
            setShowNotAvailableModal(true);
        }
    };

    const handleFAQClick = () => {
        setShowFAQModal(true);
    };

    // console.log("SloteType",SloteType);
    const checkAvailableSlots = () => {
        if(AddressType==="apartment"){
            return false;
        }else if(SloteType==="lunch" && lunchSlots.length>0){
            return true;
        }else if(SloteType==="dinner" && dinnerSlots.length>0){
            return true;
        }

        return false;
    }


   

    // if availableSlots is empty then show the slots from the address
    return (
        <div className="container-fluid p-0 mt-2">
            {/* Header */}
            {availableSlots.length > 0 ? (<>
                <button className="available-slots">
                    Available Slots
                </button>

                {/* Content */}
                {checkAvailableSlots() && (
                <div className="note-delivery">
                    <p className="text-muted mb-0" style={{ fontSize: '14px' }}>
                        Our riders deliver in 5-min slots, being on-time at delivery points helps us{' '}
                        <span className="fw-semibold text-dark">keep your deliveries free</span>{' '}
                        <span style={{ fontSize: '16px' }}>😇</span>
                    </p>
                </div>)}

                {/* Time Slots Grid */}
                <div className="time-slots-box">
                    {availableSlots.map((slot) => (
                        <button key={slot.id}
                            className={`time-slot-item ${slot.available
                                ? selectedSlot === slot.time
                                    ? 'time-slot-item-selected'
                                    : 'time-slot-item-unselected'
                                : 'time-slot-item-disabled'
                                } ${!slot.available ? 'disabled' : ''}`}
                            onClick={() => handleSlotSelect(slot.time, slot.available)}
                            disabled={false}
                        >
                            {slot.time}
                        </button>
                    ))}
                </div>

                {/* Bottom Navigation */}
               {checkAvailableSlots() && (
                <div className="delivery-point-box">
                    <div className="delivery-point-item">
                        <span className="delivery-point-item-text">
                            Drop Point:
                        </span>
                        {/* <span className="delivery-point-item-text">:</span> */}
                        <span className="delivery-point-item-security">
                            {address?.deliverypoint || "Security entry Point"}
                        </span>
                    </div>
                    <div className="delivery-point-item-faq" onClick={handleFAQClick}>
                        Delivery <span className="delivery-point-item-faq-text">FAQs</span>
                        <sup><PiWarningCircleBold color='#F91D0F' height={24} width={6} /></sup>
                    </div>
                </div>
           
            )}
            </>) : (<div className="">
                No available slots at the moment. Please try again during
                operational hours (7:00 AM - 9:00 PM).
            </div>)}


            {/* FAQ Bootstrap Modal */}

            <Modal show={showFAQModal} onHide={() => setShowFAQModal(false)} centered>
                <div className="faq-modal-body">
                    <div className="faq-modal-body-header">
                        <div className="faq-modal-body-header-text">
                            <span className="faq-modal-body-header-text-title">🛵{" "} On-time or on us</span>
                            <span className="faq-modal-body-header-text-description">
                                If our rider misses slot, 💸 <span className="faq-modal-body-header-text-description-amount">₹100</span> is credited <span className="faq-modal-body-header-text-description-wallet">to your wallet</span> & your food will be delivered in the next slot.
                            </span>
                        </div>
                        <IoCloseCircleOutline height={30} width={30} onClick={() => setShowFAQModal(false)} className='faq-modal-body-header-close' />
                    </div>

                    <div className="faq-missed-pickup">
                        <div className="faq-missed-pickup-text">
                            🔄{" "} Missed your pickup?
                        </div>
                        <div className="faq-missed-pickup-description">
                            <u>If it’s not the last slot</u>, you can still collect it in the next slot.
                        </div>
                    </div>
                </div>
            </Modal>


            <Modal show={showNotAvailableModal} onHide={() => setShowNotAvailableModal(false)} centered className='not-available-modal'>
                <div className="not-available-content">
                    <div className="not-available-content-header">
                        <h5 className="">⏰ Oops, you just missed this slot</h5>
                        <IoCloseCircleOutline height={30} width={30} onClick={() => setShowNotAvailableModal(false)} className='not-available-content-header-close' />
                    </div>

                    <p className="">
                        Please place your order before <b>{showBeforeEndTime}</b>  next time
                    </p>
                </div>

            </Modal>
        </div>
    );
};

export default DeliverySlots;