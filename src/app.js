import services from './services/index.js';

import { Bus } from './infra/bus/index.js';

const bus = new Bus();
for (const [name, ServiceConstructor] of Object.entries(services)) {
  const service = new ServiceConstructor(bus);
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

console.log({ order });
