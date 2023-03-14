import { STATUSES, FiniteStateMachine } from './finiteStateMachine.js';
import { locks } from 'web-locks';

const wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
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
    if (!oldStatus) return;
    locks.request('warehouse', async () => {
      await wait(1000);
      console.log('\n##INSIDE WEB-LOCKS');
      const machine = new FiniteStateMachine(oldStatus);
      machine.changeState(newStatus);
    });
  }
}
