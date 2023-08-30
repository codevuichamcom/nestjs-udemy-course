export interface ProfileResponseInterface {
  user: {
    email: string;
    bio: string;
    image: string;
    following?: boolean;
  };
}
