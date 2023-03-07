export default class WarehouseService {
  bus;
  #warehouse;
  constructor({ bus }) {
    this.bus = bus;
    this.#warehouse = new Map();
  }

  assembleOrder(payload) {
    
  }

  disassembleOrder(payload) {

  }
};
