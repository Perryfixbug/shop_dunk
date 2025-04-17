const Bill = require('../../models/bills.model');

exports.getBills = async (req, res) => {
    try{
        const bills = await Bill.find({})
            .populate('userId')
            .populate('items.productId')
        res.json(bills)
    }
    catch(error){
        res.status(500).json({message: error.message})
    }
}

exports.updateBill = async (req, res) => {
    try{
        const { status } = req.body;
        const bill = await Bill.findById(req.params.id);
        if(!bill) return res.status(404).json({message: 'Không tìm thấy hóa đơn'})
        
        // Cập nhật trạng thái hóa đơn
        if(status) bill.status = status;
        await bill.save();
        res.json(bill);
    }catch(error){
        res.status(500).json({message: error.message})
        console.log(error)  
    }
}