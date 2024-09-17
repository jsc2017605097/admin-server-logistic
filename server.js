const express = require('express');
const fs = require('fs');
const path = require('path');
const bodyParser = require('body-parser');
const cors = require('cors'); // Import cors

const app = express();
const PORT = process.env.PORT || 3000;
const DATA_FILE = path.join(__dirname, 'orders.json');

// Middleware
app.use(cors()); // Enable CORS
app.use(bodyParser.json());
app.use(express.static('public'));

// Đọc dữ liệu từ file JSON
function readJSONFile() {
  return new Promise((resolve, reject) => {
    fs.readFile(DATA_FILE, 'utf8', (err, data) => {
      if (err) reject(err);
      else resolve(JSON.parse(data));
    });
  });
}

// Ghi dữ liệu vào file JSON
function writeJSONFile(data) {
  return new Promise((resolve, reject) => {
    fs.writeFile(DATA_FILE, JSON.stringify(data, null, 2), 'utf8', (err) => {
      if (err) reject(err);
      else resolve();
    });
  });
}

// API để lấy tất cả đơn hàng
app.get('/orders', async (req, res) => {
  try {
    const data = await readJSONFile();
    res.json(data);
  } catch (err) {
    res.status(500).send('Error reading data');
  }
});

// API để thêm đơn hàng mới
app.post('/orders', async (req, res) => {
  try {
    const newOrder = req.body;
    const data = await readJSONFile();
    data.push(newOrder);
    await writeJSONFile(data);
    res.status(201).json(newOrder);
  } catch (err) {
    res.status(500).send('Error saving data');
  }
});

// API để xóa đơn hàng
app.delete('/orders/:trackingNumber', async (req, res) => {
  try {
    const { trackingNumber } = req.params;
    const data = await readJSONFile();
    const updatedData = data.filter(order => order.trackingNumber !== trackingNumber);
    await writeJSONFile(updatedData);
    res.status(204).end();
  } catch (err) {
    res.status(500).send('Error deleting data');
  }
});

// Khởi động server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
