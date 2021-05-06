const express = require('express');
const router = express.Router();
const cartsCtrl = require('../../controllers/api/carts')

// GET api routes
router.get('/:uid', cartsCtrl.index);
router.post('/', cartsCtrl.create);
router.delete('/', cartsCtrl.delete);
router.post('/', cartsCtrl.addItem);


module.exports = router;
