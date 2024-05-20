import cron from 'node-cron';
import db from '../models/index.js'
import Sequelize from 'sequelize'
import Stripe from 'stripe'

const { Op } = Sequelize
const stripe = new Stripe(process.env.SECRET_KEY, { apiVersion: '2023-08-16' })


const task = cron.schedule('0 23 * * *', () => {
    processPayment()
}, {
  scheduled: true,
});

const processPayment = async () => {
    try {
        
        const currentDate = new Date();
        const results = await db.pendingTransfers.findAll({
          where: {
            dateDeposite: { [Op.lt]: currentDate },
            status: { [Op.notIn]: ['SUCCESS', 'CANCELLED'] },
          },
          include: [
            {
              model: db.User, 
              as: 'pendingTransferUser'
            },            
            {
              model: db.User, 
              as: 'pendingTransfersPurchasedBy'
            },
            {
              model: db.Checkout, 
              as: 'pendingTransfesOrder'
            }
          ]
        });

        const groupedResults = results.reduce((acc, result) => {
          const userId = result.pendingTransferUser.id; 
          if (!acc[userId]) {
            acc[userId] = [];
          }
          acc[userId].push(result);
          return acc;
        }, {});

        for (const userId in groupedResults) {
          const userResults = groupedResults[userId];
          let total = 0
          let purchaser = ''
          let orderIds = ''
          let transferGroup = ''
          for (const result of userResults) {
            total = total + result.amount
            purchaser = !purchaser ? result.pendingTransfersPurchasedBy.first_name : purchaser.includes(result.pendingTransfersPurchasedBy.first_name) ? purchaser : purchaser + " | " + result.pendingTransfersPurchasedBy.first_name
            orderIds = !orderIds ? "#" + result.pendingTransfesOrder.id : orderIds.includes(result.pendingTransfesOrder.id) ? orderIds : orderIds + ' | #' + result.pendingTransfesOrder.id
            transferGroup = !transferGroup ? "#" + result.transfer_group : orderIds.includes(result.transfer_group) ? transferGroup : transferGroup + '_' + result.transfer_group
          }

          let connnectedAccount = await stripe.accounts.retrieve(userResults[0].pendingTransferUser?.stripe_account_id)
          if (connnectedAccount.charges_enabled) {
            try {
                let transfer = await stripe.transfers.create({
                    amount: total,
                    currency: 'usd',
                    destination: userResults[0].pendingTransferUser?.stripe_account_id,
                    transfer_group: transferGroup,
                    description: `${purchaser} buy the product for Order ${orderIds} at ${userResults[0].createdAt}`,
                })
                
                for (const result of userResults) {
                    db.pendingTransfers.update(
                        { status: 'SUCCESS', remarks: '', transaction_id: transfer.id},
                        { where: { id: result.id}
                        }
                    )
                }
                
            } catch (error) {
                console.log(error)
                for (const result of userResults) {
                    db.pendingTransfers.update(
                        { status: 'FAILED', remarks: 'Error : ' + error },
                        { where: { id: result.id } }
                    )
                }
            }
            }
        }
    } catch (error) {
      console.error('Error occured while processing payment', error);
    }
}

export default task;