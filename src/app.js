import services from './services/index.js';
import { Bus } from './infra/bus/index.js';
import { STATUSES } from './services/statusHandler/finiteStateMachine.js';

const bus = new Bus();
for (const [name, ServiceConstructor] of Object.entries(services)) {
  const service = new ServiceConstructor({ bus });
  bus.registerService(name, service);
}

const order = bus.command('orderRepository.createOrder', {
  orderedItems: [
    {
      name: 'Coca-Cola',
      amount: 1
    },
    {
      name: 'Hamburger',
      amount: 2
    }
  ]
});

const { id } = order;

bus.command('orderRepository.addOrderProduct', {
  id: order.id,
  product: {
    name: 'Coca-Cola',
    amount: 2
  }
});

bus.command('orderRepository.removeOrderProduct', {
  id,
  product: {
    name: 'Coca-Cola',
    amount: 3
  }
});

const updatedOrder = bus.command('orderRepository.getOrder',
  { id });

console.dir({ updatedOrder }, { depth: null });

bus.command('orderRepository.changeOrderStatus',
  { id, newStatus: STATUSES.Принят });
bus.command('orderRepository.changeOrderStatus',
  { id, newStatus: STATUSES.Передан });
bus.command('orderRepository.changeOrderStatus',
  { id, newStatus: STATUSES.Возврат });
