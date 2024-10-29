const express = require('express');
const Order = require('../models/Order');
const { authMiddleware } = require('../middleware/auth');
const XLSX = require('xlsx');

const router = express.Router();

router.post('/', async (req, res) => {
  try {
    const { items, tableNumber, totalPrice } = req.body;
    
    // Validate input
    if (!items || !Array.isArray(items) || items.length === 0 || !tableNumber || !totalPrice) {
      return res.status(400).json({ message: 'Invalid order data' });
    }

    // Ensure each item has the required fields, including image
    const validatedItems = items.map(item => ({
      menuItem: item.menuItem,
      name: item.name,
      price: item.price,
      quantity: item.quantity,
      image: item.image
    }));

    const order = new Order({ items: validatedItems, tableNumber, totalPrice });
    const savedOrder = await order.save();
    res.status(201).json(savedOrder);
  } catch (error) {
    console.error('Error creating order:', error);
    res.status(500).json({ message: 'Error creating order', error: error.message });
  }
});

router.get('/', authMiddleware, async (req, res) => {
  try {
    const orders = await Order.find().populate('items.menuItem');
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching orders' });
  }
});

router.patch('/:id', authMiddleware, async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    const order = await Order.findByIdAndUpdate(id, { status }, { new: true });
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }
    res.json(order);
  } catch (error) {
    res.status(500).json({ message: 'Error updating order' });
  }
});

router.get('/active', authMiddleware, async (req, res) => {
  try {
    const activeOrders = await Order.find({ status: 'pending' })
      .sort({ timestamp: -1 })
      .lean(); // Use lean() for better performance
    res.json(activeOrders);
  } catch (error) {
    console.error('Error fetching active orders:', error);
    res.status(500).json({ message: 'Error fetching active orders' });
  }
});

// Separate route for monthly orders
router.get('/monthly', authMiddleware, async (req, res) => {
  try {
    // Get first day of current month
    const currentDate = new Date();
    const firstDayOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
    
    // Fetch orders for current month
    const orders = await Order.find({
      timestamp: { $gte: firstDayOfMonth }
    }).lean();

    // Format orders for Excel
    const formattedOrders = orders.map(order => ({
      'Order ID': order._id.toString(),
      'Date': new Date(order.timestamp).toLocaleDateString(),
      'Time': new Date(order.timestamp).toLocaleTimeString(),
      'Table Number': order.tableNumber,
      'Total Amount': order.totalPrice.toFixed(2),
      'Items': order.items.map(item => 
        `${item.name} (x${item.quantity})`
      ).join(', '),
      'Status': order.status
    }));

    // Create workbook and worksheet
    const wb = XLSX.utils.book_new();
    const ws = XLSX.utils.json_to_sheet(formattedOrders);

    // Add worksheet to workbook
    XLSX.utils.book_append_sheet(wb, ws, 'Monthly Orders');

    // Generate buffer
    const buffer = XLSX.write(wb, { type: 'buffer', bookType: 'xlsx' });

    // Set headers for file download
    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    res.setHeader('Content-Disposition', `attachment; filename=monthly-orders-${new Date().toISOString().slice(0,7)}.xlsx`);
    
    // Send buffer
    res.send(buffer);
  } catch (error) {
    console.error('Error generating monthly report:', error);
    res.status(500).json({ message: 'Error generating monthly report' });
  }
});

// Regular order by ID route
router.get('/:id', async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }
    res.json(order);
  } catch (error) {
    console.error('Error fetching order:', error);
    res.status(500).json({ message: 'Error fetching order', error: error.message });
  }
});

router.delete('/:id', authMiddleware, async (req, res) => {
  try {
    const { id } = req.params;
    const order = await Order.findByIdAndDelete(id);
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }
    res.status(204).send();
  } catch (error) {
    console.error('Error deleting order:', error);
    res.status(500).json({ message: 'Error deleting order' });
  }
});

module.exports = router;
