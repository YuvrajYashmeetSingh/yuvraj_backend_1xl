const Order = require('../models/order');

exports.getOrders = async (req, res) => {
    try {
        const orders = await Order.find().populate('user', 'name email').populate('orderItems.product', 'name price');
        res.json(orders);
    } catch (err) {
        res.status(500).send('Server error');
    }
};

exports.getOrderById = async (req, res) => {
    try {
        const order = await Order.findById(req.params.id).populate('user', 'name email').populate('orderItems.product', 'name price');
        if (!order) return res.status(404).json({ msg: 'Order not found' });
        res.json(order);
    } catch (err) {
        res.status(500).send('Server error');
    }
};

exports.createOrder = async (req, res) => {
    const { orderItems, shippingAddress } = req.body;

    try {
        const newOrder = new Order({
            user: req.user.id,
            orderItems,
            shippingAddress
        });

        const order = await newOrder.save();
        res.json(order);
    } catch (err) {
        res.status(500).send('Server error');
    }
};

exports.updateOrderStatus = async (req, res) => {
    const { status } = req.body;

    try {
        let order = await Order.findById(req.params.id);
        if (!order) return res.status(404).json({ msg: 'Order not found' });

        order.status = status || order.status;

        await order.save();
        res.json(order);
    } catch (err) {
        res.status(500).send('Server error');
    }
};

exports.deleteOrder = async (req, res) => {
    try {
        let order = await Order.findById(req.params.id);
        if (!order) return res.status(404).json({ msg: 'Order not found' });

        await order.remove();
        res.json({ msg: 'Order removed' });
    } catch (err) {
        res.status(500).send('Server error');
    }
};
