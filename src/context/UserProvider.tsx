"use client";

import React, {
  createContext,
  useState,
  useEffect,
  useContext,
  ReactNode,
} from "react";
import { jwtDecode } from "jwt-decode";
import axios from "axios";

type User = {
  _id: string;
  exp: number;
  level: number;
  [key: string]: any;
};

type UserContextType = {
  user: User | null;
  updateUser: (updates: Partial<User>) => Promise<void>;
};

const UserContext = createContext<UserContextType | null>(null);

export const useUser = () => useContext(UserContext);

interface UserProviderProps {
  children: ReactNode;
}

export const UserProvider = ({ children }: UserProviderProps) => {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const fetchUser = async (_id: string) => {
      try {
        const res = await axios.get(
          `https://maze-runner-backend-1.onrender.com/user/${_id}`
        );
        setUser(res.data);
      } catch (error) {
        console.error("Fetch user error:", error);
        setUser(null);
      }
    };

    const token = localStorage.getItem("token");
    if (token) {
      try {
        const decoded = jwtDecode(token) as { user?: { _id?: string } };
        const _id = decoded?.user ?._id;
        if (_id) {
          fetchUser(_id);
        } else {
          console.error("Token missing _id");
          setUser(null);
        }
      } catch (error) {
        console.error("Failed to decode token:", error);
        setUser(null);
      }
    }
  }, []);

  const updateUser = async (updates: Partial<User>) => {
    if (!user?._id) return;

    try {
      const res = await axios.put(
        `http://localhost:999/user/${user._id}`,
        updates
      );
      setUser((prev) => ({ ...prev, ...res.data }));
    } catch (error) {
      console.error("Failed to update user:", error);
    }
  };

  return (
    <UserContext.Provider value={{ user, updateUser }}>
      {children}
    </UserContext.Provider>
  );
};
