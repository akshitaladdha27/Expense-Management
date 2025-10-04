import mongoose from 'mongoose';

const companySchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
  },
  defaultCurrency: {
    type: String,
    required: true,
    uppercase: true,
    trim: true,
  },
}, { timestamps: true });

const Company = mongoose.model('Company', companySchema);

export default Company;