import React, { useState } from 'react';
import DateSessionSelector from './DateSessionSelector';
import moment from 'moment';

const MultiSessionCart = ({ cartItems, onDateSessionChange }) => {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [selectedSession, setSelectedSession] = useState("Lunch");

  // Group cart items by date and session
  const groupedItems = cartItems.reduce((acc, item) => {
    const dateKey = item.deliveryDate ? moment(item.deliveryDate).format('YYYY-MM-DD') : 'unscheduled';
    const sessionKey = item.session || 'unscheduled';
    
    if (!acc[dateKey]) {
      acc[dateKey] = {};
    }
    if (!acc[dateKey][sessionKey]) {
      acc[dateKey][sessionKey] = [];
    }
    acc[dateKey][sessionKey].push(item);
    return acc;
  }, {});

  const handleDateSessionChange = (date, session) => {
    setSelectedDate(date);
    setSelectedSession(session);
    if (onDateSessionChange) {
      onDateSessionChange(date, session);
    }
  };

  // Get items for current selection
  const getCurrentItems = () => {
    const dateKey = moment(selectedDate).format('YYYY-MM-DD');
    return (groupedItems[dateKey]?.[selectedSession] || []);
  };

  const currentItems = getCurrentItems();

  return (
    <div className="multi-session-cart">
      <DateSessionSelector 
        currentDate={selectedDate}
        currentSession={selectedSession}
        onChange={handleDateSessionChange}
      />
      
      <div className="cart-items-container">
        {currentItems.length === 0 ? (
          <div className="no-items">
            No items in cart for {selectedSession} on {moment(selectedDate).format('MMM D, YYYY')}
          </div>
        ) : (
          <div className="cart-items">
            {currentItems.map((item, index) => (
              <div key={index} className="cart-item">
                <div className="item-details">
                  <h4>{item.name}</h4>
                  <p>Quantity: {item.quantity}</p>
                  <p>₹{item.totalPrice}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <style jsx>{`
        .multi-session-cart {
          padding: 15px;
          background: white;
          border-radius: 8px;
          box-shadow: 0 2px 4px rgba(0,0,0,0.1);
        }

        .cart-items-container {
          margin-top: 20px;
        }

        .no-items {
          text-align: center;
          padding: 20px;
          color: #666;
        }

        .cart-item {
          padding: 15px;
          border-bottom: 1px solid #eee;
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .item-details h4 {
          margin: 0 0 5px 0;
          color: #333;
        }

        .item-details p {
          margin: 5px 0;
          color: #666;
        }
      `}</style>
    </div>
  );
};

export default MultiSessionCart;