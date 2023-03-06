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
      status: 'New',
      payload
    };
    this.#orders.set(newId, newOrder);
    this.bus.emit('order.create', { newId });
    return true;
  }

  getOrderInfo({ id }) {
    const order = this.#orders.get(id);
    if (!order) throw new Error('No order exists with such identifier');
    this.bus.emit('order.read', { id });
    return order;
  }

  changeOrderStatus({ id, newStatus }) {
    const order = this.getOrderInfo({ id });
    const { status: oldStatus } = order;
    order.status = newStatus;
    this.bus.emit('order.update', { id, oldStatus, newStatus });
  }

  addOrderProduct(payload) {

  }

  removeOrderProduct(payload) {

  }

  removeOrder({ id }) {
    this.bus.emit('order.delete', { id });
    return this.#orders.delete(id);
  }
}
