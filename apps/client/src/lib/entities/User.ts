export default interface UserEntity {
  createdAt: Date;
  firstName: string;
  lastName: string;
  email: string;
  id: string;
  _count: {
    products: number;
  };
}
