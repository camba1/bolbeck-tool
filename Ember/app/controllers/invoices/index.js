import Controller from '@ember/controller';
import { computed } from '@ember/object';

export default Controller.extend({
  queryParams: ['qcustomerName', 'qinvoiceDate', 'q_key'],
  qcustomerName: null,
  qinvoiceDate: null,
  q_key: null,

  customerName: computed.oneWay('qcustomerName'),
  invoiceDate: computed.oneWay('qinvoiceDate'),
  key: computed.oneWay('q_key')
});
