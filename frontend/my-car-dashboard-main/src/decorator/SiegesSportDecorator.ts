import { VehicleDecorator } from "./VehicleDecorator";

export class SiegesSportDecorator extends VehicleDecorator {
  getDescription(): string {
    return this.decoratedVehicle.getDescription() + " + Sièges sportifs";
  }

  getPrice(): number {
    return this.decoratedVehicle.getPrice() + 250000;
  }
}
