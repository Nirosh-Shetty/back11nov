import { useState } from 'react';
import { Drawer } from 'antd';
import moment from 'moment';
import { FaAngleUp, FaAngleDown, FaTimes } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import "../Styles/MultiCartDrawer.css";

const MultiCartDrawer = ({ 
    groupedCarts, 
    overallSubtotal, 
    overallTotalItems, 
    onJumpToSlot // Function to set selectedDate/Session in Home.jsx
}) => {
    const navigate = useNavigate();
    const [isDrawerOpen, setIsDrawerOpen] = useState(false);

    // Helper to format date for display (e.g., "Today")
    const formatSlotDate = (date) => {
        const today = moment().startOf('day');
        const tomorrow = moment().add(1, 'days').startOf('day');
        const dateMoment = moment(date).startOf('day');
        
        if (dateMoment.isSame(today)) {
            return "Today";
        }
        if (dateMoment.isSame(tomorrow)) {
            return "Tomorrow";
        }
        return moment(date).format('MMM D'); // e.g., Nov 8
    };

    // Action when the user clicks 'Details' in the drawer
    const handleSlotDetailClick = (slot) => {
        // 1. Call the function passed from Home.jsx to update selectedDate/Session
        // IMPORTANT: The Home component doesn't explicitly pass deliveryDate/session info, 
        // but we'll assume the 'slot' object provides the necessary info to switch context.
        onJumpToSlot(slot.date, slot.session); 
        // console.log("Jumping to slot:", slot.date, slot.session);
        // 2. Close the drawer
        setIsDrawerOpen(false); 
    };
    
    // Action for the 'Proceed to Checkout' button
    const handleCheckout = () => {
        setIsDrawerOpen(false);
        navigate("/checkout"); // Assuming this triggers the logic in Home to validate/checkout
    };
    
    // Safety check: Only render the floating bar if there are items
    if (overallTotalItems === 0) {
        return null;
    }

    return (
        <>
            {/* 1. BOTTOM BAR (Always visible) - Trigger to open the drawer */}
            <div className="cartbutton-manager" onClick={() => setIsDrawerOpen(true)}>
                <div className="cartbtn">
                    <div className="d-flex justify-content-around align-items-center w-100">
                        <div className="d-flex gap-1 align-items-center">
                            <p className="cart-slot-type">
                                {groupedCarts.length} {groupedCarts.length > 1 ? 'SLOTS' : 'SLOT'}
                            </p>
                            <div className="cart-items-price">
                                {overallTotalItems} items | ₹{overallSubtotal.toFixed(0)}
                            </div>
                        </div>
                        
                        <div className="d-flex gap-1 align-content-center viewcartbtn-trigger">
                            <div className="my-meal-icon">
                                <FaAngleUp size={20} color="white" /> 
                            </div>
                            <div className="my-meal-text">View All Meals</div>
                        </div>
                    </div>
                </div>
            </div>

            {/* 2. DRAWER (Expanded View) */}
            <Drawer
                placement="bottom"
                closable={false}
                onClose={() => setIsDrawerOpen(false)}
                open={isDrawerOpen}
                height={Math.min(500, groupedCarts.length * 80 + 150)} 
                className="multi-cart-drawer"
            >
                {/* Close Handle at the top */}
                <div className="close-handle-bar" onClick={() => setIsDrawerOpen(false)}>
                    <FaTimes size={20} color="#777" />
                </div>
                
                {/* Header with Title and Item Count */}
                <div className="multi-cart-header">
                    <h3>Your Meals</h3>
                    <span className="total-items-header">
                        {overallTotalItems} {overallTotalItems === 1 ? 'Item' : 'Items'}
                    </span>
                </div>

                {/* Slot List Container */}
                <div className="slot-list-container">
                    {groupedCarts.map((slot, index) => (
                        <div key={index} className="cart-slot-item-summary">
                            <div className="slot-title-details">
                                <div className="slot-session-date">
                                    <span className="session-name">{slot.session}</span>
                                    <span className="date-name">- {formatSlotDate(slot.date)}</span>
                                </div>
                                <span className="item-count-small">
                                    {slot.totalItems} {slot.totalItems > 1 ? 'items' : 'item'}
                                </span>
                            </div>

                            <div className="slot-summary-actions">
                                <span className="slot-price">₹{slot.subtotal.toFixed(0)}</span>
                                <button 
                                    className="slot-view-btn btn btn-sm btn-primary"
                                    onClick={() => handleSlotDetailClick(slot)}
                                >
                                    Details
                                </button>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Footer Summary & Checkout Button */}
                <div className="multi-cart-footer-summary">
                    <div className="summary-row">
                        <span className="summary-label">Total for All Slots</span>
                        <span className="summary-price">₹{overallSubtotal.toFixed(0)}</span>
                    </div>
                    
                    <button 
                        className="btn btn-success btn-lg checkout-btn w-100 mt-2"
                        onClick={handleCheckout}
                    >
                        Proceed to Checkout
                    </button>
                </div>
            </Drawer>
        </>
    );
};

export default MultiCartDrawer;