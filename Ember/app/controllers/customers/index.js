import Controller from '@ember/controller';
import { computed } from '@ember/object';

export default Controller.extend({
  queryParams: ['qname', 'qstate', 'qcity', 'q_key'],
  qname: null,
  qstate: null,
  qcity: null,
  q_key: null,

  name: computed.oneWay('qname'),
  state: computed.oneWay('qstate'),
  city: computed.oneWay('qcity'),
  key: computed.oneWay('q_key')
});
