import { Dispatch, SetStateAction, createContext, useContext } from "react";
import UserEntity from "@/lib/entities/User";

export interface AuthData {
  loaded: boolean;
  authenticated: boolean;
  user: UserEntity;
  setUser: Dispatch<SetStateAction<UserEntity>>;
  setAuthenticated: Dispatch<SetStateAction<boolean>>;
}

export const AuthContext = createContext<AuthData>({
  loaded: false,
  authenticated: false,
  user: {
    firstName: "Unknown",
    lastName: "User",
    email: "mrunknown@watchman.com",
    id: "",
    createdAt: new Date(),
    _count: {
      products: 0,
    },
  },
  setUser: () => {},
  setAuthenticated: () => {},
});

export const useAuthContext = () => useContext(AuthContext);
