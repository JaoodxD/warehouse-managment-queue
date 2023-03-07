import orderRepositoryService from "./orderRepository/index.js";
import StatusHandlerService from "./statusHandler/index.js";
import WarehouseService from "./warehouse/index.js";

export default {
  orderRepository: orderRepositoryService,
  statusHandler: StatusHandlerService,
  warehouse: WarehouseService
}
