import { VehicleDecorator } from "./VehicleDecorator";

export class CameraReculDecorator extends VehicleDecorator {
  getDescription(): string {
    return this.decoratedVehicle.getDescription() + " + Caméra de recul";
  }

  getPrice(): number {
    return this.decoratedVehicle.getPrice() + 100000;
  }
}
