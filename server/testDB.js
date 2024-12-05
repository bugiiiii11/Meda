const mongoose = require('mongoose');
require('dotenv').config();

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('MongoDB connected successfully!');
    
    // Create a simple test schema
    const TestSchema = new mongoose.Schema({
      name: String,
      date: { type: Date, default: Date.now }
    });
    
    // Create model
    const Test = mongoose.model('Test', TestSchema);
    
    // Create test document
    const testDoc = new Test({
      name: 'Test Connection'
    });
    
    // Save to database
    await testDoc.save();
    console.log('Test document saved successfully!');
    
    // Find the document
    const found = await Test.findOne({ name: 'Test Connection' });
    console.log('Found document:', found);
    
    // Clean up - delete the test document
    await Test.deleteOne({ name: 'Test Connection' });
    console.log('Test document cleaned up');
    
    // Close connection
    await mongoose.connection.close();
    console.log('MongoDB connection closed');
  } catch (error) {
    console.error('MongoDB connection error:', error);
  }
};

connectDB();