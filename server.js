const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors'); // Import cors

const app = express();
const PORT = 3000;

const mongoURI = 'mongodb+srv://cuong:XRkZ6iGJTr3z1ouI@cluster0.yfgvo.azure.mongodb.net/?retryWrites=true&w=majority';

mongoose.connect(mongoURI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('MongoDB connected successfully'))
.catch(err => console.error('MongoDB connection error:', err));
// Define the schema and model
const orderSchema = new mongoose.Schema({
  trackingNumber: String,
  carrier: String,
  sendDate: String,
  deliveryDate: String,
  status: String,
  sender: String,
  receiver: String,
  item: String,
  weight: String,
  cost: String,
  costCNY: String
});

const Order = mongoose.model('Order', orderSchema);

// Middleware
app.use(cors()); // Enable CORS
app.use(bodyParser.json());
app.use(express.static('public'));

// API để lấy tất cả đơn hàng
app.get('/orders', async (req, res) => {
  try {
    const orders = await Order.find();
    res.json(orders);
  } catch (err) {
    console.error('Error reading data:', err);
    res.status(500).send('Error reading data');
  }
});

// API để thêm đơn hàng mới
app.post('/orders', async (req, res) => {
  try {
    const newOrder = new Order(req.body);
    await newOrder.save();
    res.status(201).json(newOrder);
  } catch (err) {
    console.error('Error saving data:', err);
    res.status(500).send('Error saving data');
  }
});

// API để xóa đơn hàng
app.delete('/orders/:trackingNumber', async (req, res) => {
  try {
    const { trackingNumber } = req.params;
    await Order.deleteOne({ trackingNumber });
    res.status(204).end();
  } catch (err) {
    console.error('Error deleting data:', err);
    res.status(500).send('Error deleting data');
  }
});

// Khởi động server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
