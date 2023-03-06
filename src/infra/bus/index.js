import { EventEmitter } from 'node:events';
export default class Bus {
  #ee;
  #services;
  constructor() {
    this.#ee = new EventEmitter;
    this.#services = new Map();
  }

  subscribe(eventName, handler) {
    this.#ee.on(eventName, handler);
    return true;
  }

  publish(eventName, payload) {
    return this.#ee.emit(eventName, payload);
  }

  command(commandName, payload) {
    const [serviceName, cmdName] = commandName.split('.');
    const service = this.#services.get(serviceName);
    if (!service) throw new Error(`No such service: ${serviceName}`);
    if (!service[cmdName]) throw new Error(`No command "${cmd}" on ${serviceName} service`);
    return service[cmdName](payload);
  }

  registerService(name, service) {
    this.#services.set(name, service);
  }
}
