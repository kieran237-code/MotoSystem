import { IVehicle } from "./IVehicle";

export abstract class VehicleDecorator implements IVehicle {
  protected decoratedVehicle: IVehicle;

  constructor(vehicle: IVehicle) {
    this.decoratedVehicle = vehicle;
  }

  abstract getDescription(): string;
  abstract getPrice(): number;
}
