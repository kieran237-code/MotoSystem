import { IVehicle } from "./IVehicle";

export class BaseVehicle implements IVehicle {
  constructor(private name: string, private price: number) {}

  getDescription(): string {
    return this.name;
  }

  getPrice(): number {
    return this.price;
  }
}
