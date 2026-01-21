import { VehicleDecorator } from "./VehicleDecorator";

export class ToitOuvrantDecorator extends VehicleDecorator {
  getDescription(): string {
    return this.decoratedVehicle.getDescription() + " + Toit ouvrant";
  }

  getPrice(): number {
    return this.decoratedVehicle.getPrice() + 300000;
  }
}
