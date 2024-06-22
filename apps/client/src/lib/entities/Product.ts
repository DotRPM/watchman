import { DetailsEntity } from "./Details";

export default interface ProductEntity extends DetailsEntity {
  id: string;
  createdAt: Date;
  updatedAt: Date;
  updates: number[];
  threshold: number;
  interval: number;
}
