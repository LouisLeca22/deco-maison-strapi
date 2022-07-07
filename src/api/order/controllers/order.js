'use strict';

const stripe = require('stripe')('sk_test_51KGWCfCQVu5hGfDjHaFwttIUS76rC2iLo02vjXUisODQXbAMkTQf1TVZ0dPosDUoyVvCtQDJy483AAt30vraDV9b00sbZhUWUA')
/**
 *  order controller
 */

const { createCoreController } = require('@strapi/strapi').factories;

module.exports = createCoreController('api::order.order', ({ strapi }) => ({   
    async create(ctx) {     
        const { address, total, items, stripeTokenId } = ctx.request.body.data; 
        const { id } = ctx.state.user;     
        const payload = { 
            amount: total * 100, 
            currency: 'eur',
            description: `Deco-maison order on ${new Date()} by ${ctx.state.user.username}`,     
            source: stripeTokenId,     
        };
        
        const charge = await stripe.charges.create(payload); 
        ctx.request.body.data = { address, total,items, user:[id] };   
        const order = await super.create(ctx);     
        return order;   
    }, 
}));