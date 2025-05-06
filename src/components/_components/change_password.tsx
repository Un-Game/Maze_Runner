"use client";

import { useUser } from "@/context/UserProvider";
import { updatePassword } from "@/utils/userRequest";
import { useFormik } from "formik";
import { Input } from "../ui/input";
import { useState } from "react";

export const ChangePassword = () => {
  const user = useUser();
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (values: { id: string; password: string }) => {

    if (values.password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    try {
      await updatePassword(values.id, values.password);
      formik.resetForm();
      setConfirmPassword("");
    } catch (err) {
      console.error("Update failed:", err);
      setError("Something went wrong. Please try again.");
    }
  };

  const formik = useFormik({
    initialValues: {
      id: user._id,
      password: "",
    },
    onSubmit: handleSubmit,
  });

  return (
    <form onSubmit={formik.handleSubmit} className="flex flex-col items-center relative">
      <label htmlFor="password" className="text-white mb-2 text-lg">New Password</label>
      <Input
        id="password"
        name="password"
        type="password"
        onChange={formik.handleChange}
        value={formik.values.password}
        className="w-[300px] mb-4 p-4 rounded-lg border border-cyan-400 text-black"
        placeholder="Enter new password"
      />

      <label htmlFor="confirm-password" className="text-white mb-2 text-lg">Confirm Password</label>
      <Input
        id="confirm-password"
        name="confirmPassword"
        type="password"
        onChange={(e) => setConfirmPassword(e.target.value)}
        value={confirmPassword}
        className="w-[300px] mb-4 p-4 rounded-lg border border-cyan-400 text-black"
        placeholder="Confirm new password"
      />
      {error && <div className="text-red-500 mb-2 text-sm">{error}</div>}
      <button
        type="submit"
        className="bg-black w-[200px] h-[80px] flex justify-center items-center rounded-[20px] border-2 border-cyan-400 shadow-[0_0_20px_#00ffff] hover:scale-105 hover:shadow-[0_0_40px_#00ffff] transition-transform duration-300 m-[30px]"
      >
        <span className="text-[24px] bg-gradient-to-b from-blue-800 via-blue-500 to-white bg-clip-text text-transparent whitespace-nowrap">
          Save Password
        </span>
      </button>
    </form>
  );
};
