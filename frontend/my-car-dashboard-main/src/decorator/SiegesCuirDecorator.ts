import { VehicleDecorator } from "./VehicleDecorator";

export class SiegesCuirDecorator extends VehicleDecorator {
  getDescription(): string {
    return this.decoratedVehicle.getDescription() + " + Sièges cuir";
  }

  getPrice(): number {
    return this.decoratedVehicle.getPrice() + 200000;
  }
}
