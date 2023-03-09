import { STATUSES } from "../statusHandler/finiteStateMachine.js";
export default class orderRepositoryService {
  #orders;
  #lastId;
  constructor({ bus }) {
    this.bus = bus;
    this.#orders = new Map();
    this.#lastId = 0;
  }

  createOrder(payload) {
    const newId = ++this.#lastId;
    const newOrder = {
      id: newId,
      // status: 'Новый',
      payload
    };
    this.#orders.set(newId, newOrder);
    this.changeOrderStatus({ id: newId, newStatus: STATUSES.Новый });
    this.bus.publish('order.create', { newId });
    return newOrder;
  }

  getOrder({ id }) {
    const order = this.#orders.get(id);
    if (!order) throw new Error('No order exists with such identifier');
    this.bus.publish('order.read', { id });
    return order;
  }

  changeOrderStatus({ id, newStatus }) {
    const order = this.getOrder({ id });
    const { status: oldStatus } = order;
    order.status = newStatus;
    this.bus.publish('order.updateStatus', { id, oldStatus, newStatus });
  }

  addOrderProduct({ id, product: { name: productName, amount } }) {
    const order = this.getOrder({ id });
    if (!order) throw new Error('No order exists with such identifier');
    const { orderedItems } = order.payload;
    const orderProduct = orderedItems.find(({ name }) => name === productName);
    if (!orderProduct) {
      return orderedItems.push(product);
    }
    orderProduct.amount += amount;
    return true;
  }

  removeOrderProduct({ id, product: { name: productName, amount } }) {
    const order = this.getOrder({ id });
    if (!order) throw new Error('No order exists with such identifier');
    const { orderedItems } = order.payload;
    const orderProduct = orderedItems.find(({ name }) => name === productName);
    if (!orderProduct) {
      return true;
    }
    orderProduct.amount -= amount;
  }

  removeOrder({ id }) {
    this.bus.publish('order.delete', { id });
    return this.#orders.delete(id);
  }
}
