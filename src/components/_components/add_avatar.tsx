'use client'

import { useUser } from "@/context/UserProvider";
import { updateUser } from "@/utils/userRequest";
import axios from "axios";
import { useFormik } from "formik";
import { ChangeEvent, useState } from "react";
import { Input } from "../ui/input";

const CLOUDINARY_CLOUD_NAME = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
const CLOUDINARY_API_KEY = process.env.NEXT_PUBLIC_CLOUDINARY_API_KEY;
const CLOUDINARY_UPLOAD_PRESET = process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET;
const API_URL = `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/image/upload`;

export const AddAvatar = () => {
  const [data, setData] = useState<File | null>(null);
  const [prevImg, setPrevImg] = useState<string | undefined>();
  const user = useUser();
  console.log(user);

  const uploadCloudinary = async () => {
    if (!data) alert("Please insert photo");

    try {
      const file = new FormData();
      file.append("file", data as File);
      file.append("upload_preset", CLOUDINARY_UPLOAD_PRESET as string);
      file.append("api_key", CLOUDINARY_API_KEY as string);

      const response = await axios.post(API_URL, file, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      console.log("this is response with secure url ", response);

      return response.data.secure_url;
    } catch (error) {
      console.log(error);
      throw error;
      //  toast
    }
  };

  const handleUploadImg = (e: ChangeEvent<HTMLInputElement>) => {
    const files = e?.target?.files;
    if (!files) return;

    const file = files[0];
    setData(file);

    const reader = new FileReader();
    reader.onload = () => {
      setPrevImg(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = async (values) => {
    try {
      console.log("values here ", values);
      let avatarUrl = values.avatar;

      if (data) {
        avatarUrl = await uploadCloudinary();
        if (avatarUrl) {
          formik.setFieldValue("avatar", avatarUrl); 
        }
      }

      const updatedUser = await updateUser(values.id, {
        password: values.password,
        avatar: avatarUrl,
        exp: values.exp,
      });

      console.log(updatedUser);
    } catch (error) {
      console.log(error);
    }
  };

  const formik = useFormik({
    initialValues: {
      id: user._id,
      avatar: user.avatar,
      password: user.password,
      exp: user.exp
    },
    onSubmit: handleSubmit,
  });

  return (

    <form onSubmit={formik.handleSubmit} className="flex flex-col items-center justify-center" >
      <div className="relative w-50 h-50">
        <img
          src={prevImg || formik.values.avatar || "/default-avatar.png"}
          alt="Avatar Preview"
          className="w-50 h-50 rounded-full object-cover border-2 border-gray-300"
        />
        <Input
          id="avatar-upload"
          type="file"
          onChange={handleUploadImg}
          className="absolute inset-0 opacity-0 cursor-pointer rounded-full w-full h-full"
        />
      </div>
      <button type="submit"
        className="bg-black w-[180px] h-[80px] flex justify-center items-center rounded-[20px] border-2 border-cyan-400 shadow-[0_0_20px_#00ffff] hover:scale-105 hover:shadow-[0_0_40px_#00ffff] transition-transform duration-300 m-[30px] "
      >
        <span className="text-[24px] bg-gradient-to-b from-blue-800 via-blue-500 to-white bg-clip-text text-transparent whitespace-nowrap">
          Save Avatar
        </span>
      </button>

    </form>
  )
}