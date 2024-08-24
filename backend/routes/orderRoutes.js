// import express from 'express';
// import { addOrderItems, getMyOrders } from '../controllers/orderController.js';
// //import { protect } from '../middlewares/authMiddleware.js';
// import {protect} from '../middlewares/authMiddleware.js';
// const router = express.Router();

// router.route('/').post(protect, addOrderItems);
// router.route('/myorders').get(protect, getMyOrders);

// export default router;
import express from 'express';
import { addOrderItems, getMyOrders, getOrderById, updateOrderToDelivered, updateOrderToPaid } from '../controllers/orderController.js';
import { protect,Admin } from '../middlewares/authmiddleware.js';

const router = express.Router();

router.route('/').post(protect, addOrderItems);
router.route('/myorders').get(protect, getMyOrders);
router.route('/:id').get(protect, getOrderById)
router.route('/pay/:id').put(protect, updateOrderToPaid)
router.route('/deliver/:id').put(protect, Admin, updateOrderToDelivered)

export default router;
