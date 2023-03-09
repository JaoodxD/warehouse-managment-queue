import { STATUSES, FiniteStateMachine } from './finiteStateMachine.js';
export default class StatusHandlerService {
  bus;
  constructor({ bus }) {
    this.bus = bus;
    bus.subscribe('order.updateStatus', this.handleStatusChange.bind(this));
  }

  handleStatusChange({ id, oldStatus, newStatus }) {
    console.log(`Processing status change of order ${id}: ${oldStatus} -> ${newStatus}`);
    const order = this.bus.command('orderRepository.getOrder', { id });
    const { status } = order;
  }
}
