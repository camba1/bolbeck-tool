import Controller from '@ember/controller';
import { computed } from '@ember/object';

export default Controller.extend({
  queryParams: ['qname', 'qstate', 'qcity', 'qkey'],
  qname: null,
  qstate: null,
  qcity: null,
  qkey: null,

  name: computed.oneWay('qname'),
  state: computed.oneWay('qstate'),
  city: computed.oneWay('qcity'),
  key: computed.oneWay('qkey')
});
