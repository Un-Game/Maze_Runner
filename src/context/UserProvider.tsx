"use client";

import React, { createContext, useState, useEffect, useContext } from "react";
import { jwtDecode } from "jwt-decode";
import axios from "axios";

const UserContext = createContext(null);

export const useUser = () => useContext(UserContext);

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [userId, setUserId] = useState(null);

  const refetchUser = async (_id: string) => {
    try {
      const res = await axios.get(`https://maze-runner-backend-1.onrender.com/user/${_id}`);
      // const res = await axios.get(`http://localhost:999/user/${_id}`);
      setUser(res.data);
    } catch (error) {
      console.error("Fetch user error:", error);
      setUser(null);
    }
  };

  useEffect(() => {
    const fetchUser = async (_id: string) => {
      try {
        const res = await axios.get(`https://maze-runner-backend-1.onrender.com/user/${_id}`);
        // const res = await axios.get(`http://localhost:999/user/${_id}`);
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
        const { _id } = decoded?.user || {};
        if (_id) {

          fetchUser(_id);

          console.log(_id);
          setUserId(_id);
          refetchUser(_id);

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

  return <UserContext.Provider value={{ user, refetchUser: () => refetchUser(userId) }}>{children}</UserContext.Provider>;
};
