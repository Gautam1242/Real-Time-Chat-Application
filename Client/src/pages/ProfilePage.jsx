import React, { useState } from "react";
import assets from "../assets/assets";
import { useNavigate } from "react-router-dom";

const ProfilePage = () => {
  const [file, setFile] = useState(null);
  const navigate = useNavigate();
  const [name, setName] = useState("Gautam Shah");
  const [bio, setBio] = useState("Hi everyone , I am using quick chat .");

  const handleSubmti = async (e) => {
    e.preventDefault();
    navigate("/");
  };
  return (
    <div className="min-h-screen bg-cover bg-no-repeat flex items-center justify-center">
      <div className="w-5/6 max-w-2xl backdrop-blur-2xl text-gray-300 border-2 border-gray-600 flex items-center justify-between max-sm:flex-col-reverse rounded-lg">
        <form
          onSubmit={handleSubmti}
          className="flex flex-col gap-5 p-10 flex-1"
        >
          <h3 className="text-lg">Profile Details</h3>
          <label
            htmlFor="avatar"
            className="flex items-center gap-3 cursor-pointer"
          >
            <input
              onChange={(e) => setFile(e.target.files[0])}
              type="file"
              id="avatar"
              accept=".png,.jpg,.jpeg"
              hidden
            />
            <img
              src={file ? URL.createObjectURL(file) : assets.avatar_icon}
              className={`w-12 h-12 ${file && "rounded-full"}`}
              alt=""
            />
            upload profile image
          </label>

          <input
            onChange={(e) => setName(e.target.value)}
            value={name}
            className="p-2 border border-gray-500 rounded-md focus:outline-none focus:ring-2 focus:ring-violet-500"
            type="text"
            placeholder="Enter your name"
            required
          />

          <textarea
            onChange={(e) => setBio(e.target.value)}
            value={bio}
            className="p-2 border border-gray-500 rounded-md focus:outline-none focus:ring-2 focus:ring-violet-500"
            rows={4}
            placeholder="Write profile bio"
            required
          ></textarea>

          <button
            className="bg-gradient-to-r from-purple-400 to-violet-600 text-white p-2 rounded-full text-lg cursor-pointer"
            type="submit"
          >
            Save
          </button>
        </form>
        <img
          src={assets.logo_icon}
          className="max-w-44 aspect-square rounded-full mx-10 max-sm:mt-10"
          alt=""
        />
      </div>
    </div>
  );
};

export default ProfilePage;
