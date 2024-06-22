export default interface NotificationEntity {
  id: string;
  type: "reaction" | "bookmark" | "comment" | "follow";
  content: string;
  link: string;
  read: boolean;
  createdAt: Date;
  updatedAt: Date;
}
