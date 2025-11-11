const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const { ObjectId } = mongoose.Schema.Types;

const ReferralSchema = new mongoose.Schema({
  referredBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Userlist',
    default: null
  },
  status: {
    type: String,
    enum: ["pending", "success"],
    default: "pending"
  },
  successDate: {
    type: Date,
    default: null
  }
}, { _id: false });

// Address Schema
const AddressSchema = new mongoose.Schema({
  addressType: {
    type: String,
    enum: ["Home", "PG", "School", "Work"],
    required: true
  },
  // Type-specific name fields
  homeName: {
    type: String,
    default: ""
  },
  apartmentName: {
    type: String,
    default: ""
  },
  schoolName: {
    type: String,
    default: ""
  },
  companyName: {
    type: String,
    default: ""
  },
  // Common address fields
  houseName: {
    type: String,
    required: true
  },
  fullAddress: {
    type: String,
    required: true
  },
  location: {
    type: {
      type: String,
      enum: ['Point'],
      default: 'Point'
    },
    coordinates: {
      type: [Number], // [longitude, latitude]
      required: true
    }
  },
  landmark: {
    type: String,
    default: ""
  },
  floor: {
    type: String,
    default: ""
  },
  // PG specific fields
  towerBlock: {
    type: String,
    default: ""
  },
  flat: {
    type: String,
    default: ""
  },
  // School specific fields
  studentInformation: {
    studentName: { type: String, default: "" },
    studentClass: { type: String, default: "" },
    studentSection: { type: String, default: "" }
  },
  // Work specific field
  floorNo: {
    type: String,
    default: ""
  },
  isDefault: {
    type: Boolean,
    default: false
  },
  isActive: {
    type: Boolean,
    default: true
  }
}, { timestamps: true });


const Customer = new Schema(
  {
    Fname: {
      type: String,
    },

    Mobile: {
      type: Number,
    },

    Email: {
      type: String,
    },
    ApartmentId:{
        type:ObjectId,
        // required:true
    },
    Flatno: {
      type: String,
    },

    otp: {
      type: Number,
    },

    Address: {
      type: String,
    },

    studentInformation: {
  studentName: { type: String },
  studentClass: { type: String },
  studentSection: { type: String },
},
  
    profileImage: {
      type: String,
    },

    BlockCustomer: {
      type: Boolean,
      default: true,
    },
    token: {
      type: String,
    },
    Nooforders: {
      type: Number,
    },
    Lastorderdate: {
      type: String,
    },
    lastorderamount: {
      type: Number,
    },
    lastLogin:{
      type:String,
    },
    companyId:{
      type: String,
    },
    employeeId:{
      type: String,
    },
    companyName:{
      type: String,
    },
    subsidyAmount:{
      type: Number,
      default:0
    },
    totalOrder:{
      type:Number,
      default:0
    },
    
    status:{
      type: String,
      default:"Normal",
    },
    customReferralReward: {
      type: Number,
      default: null // Default to null, meaning "use the global setting"
    },
     referral: {
      type: ReferralSchema,
      default: null // Default to null for users who were not referred
    },
    referralEarnings: {
      type: Number,
      default: 0
    },
   referralCode: {
      type: String,
      unique: true,
      sparse: true 
    },
    acquisition_channel:{
      type:String,
      enum:["organic","refer","socialMedia"], //you can add more
      default:"organic"
    },
    // Add addresses array to store multiple addresses
    addresses: [AddressSchema],
    // Keep the original Address field for backward compatibility
    primaryAddress: {
      type: ObjectId,
      ref: 'Address'
    }
  },
  { timestamps: true }
);

const CustomerModel = mongoose.model("Customer", Customer);
module.exports = CustomerModel;
