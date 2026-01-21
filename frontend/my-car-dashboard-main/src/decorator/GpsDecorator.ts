import { VehicleDecorator } from "./VehicleDecorator";

export class GpsDecorator extends VehicleDecorator {
  getDescription(): string {
    return this.decoratedVehicle.getDescription() + " + GPS intégré";
  }

  getPrice(): number {
    return this.decoratedVehicle.getPrice() + 150000;
  }
}
