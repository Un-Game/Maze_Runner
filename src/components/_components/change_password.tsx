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
      <button className="py-[10px] px-[20px] rounded-[5px] bg-cyan-700" type="submit">Save password</button>
    </form>
  );
};
