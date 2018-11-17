'use strict';

module.context.use('/',require('./routes/invoice') , 'invoice');
module.context.use('/',require('./routes/invoiceByCustomerKey') , 'invoice');
