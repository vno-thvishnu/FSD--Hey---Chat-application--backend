import UserModel from "../Models/UserModel.js";
import bcrypt from "bcrypt";
// const cloudinary = require('cloudinary').v2;
// const cloudinary = require('../utils/cloudinary');
// import cloudinary from '../cloudinary.js'
import cloudinary from "cloudinary";

cloudinary.config({ 
  cloud_name: "dor3vskgy", 
  api_key: "968286853185925", 
  api_secret: "0iL6Gi9yiDJwGNyk5u7JntzRBkk" 
});

export const getUser = async (req, res) => {
  const id = req.params.id;

  try {
    const user = await UserModel.findById(id);

    if (user) {
      const { password, ...otherDetails } = user._doc;

      res.status(200).json({otherDetails,message:"finded"});
    } else {
      res.status(404).json("No such user Exists");
    }
  } catch (error) {
    res.status(500).json(error);
  }
};


export const getAllUsers = async (req, res) => {

  try {
    let users = await UserModel.find();
    users = users.map((user)=>{
      const {password, ...otherDetails} = user._doc
      return otherDetails
    })
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json(error);
  }
};

export const updateUser = async (req, res) => {
  const id = req.params.id;
  const { currentUserId, currentUserAdminStatus, password } = req.body;
  if (id === currentUserId || currentUserAdminStatus) {
    try {
      if (password) {
        const salt = await bcrypt.genSalt(10);
        req.body.password = await bcrypt.hash(password, salt);
      }

      const user = await UserModel.findByIdAndUpdate(id, req.body, {
        new: true,
      });

  if(user){
    const { password, ...otherDetails } = user._doc;

    res.status(200).json({otherDetails});
  }
    } catch (error) {
      res.status(500).json(error);
    }
  } else {
    res
      .status(403)
      .json("Access Denied!  you can only update your own profile");
  }
};

export const deleteUser = async (req, res) => {
  const id = req.params.id;
  const { currentUserId, currentUserAdminStatus } = req.body;
  if (id === currentUserId || currentUserAdminStatus) {
    try {
      await UserModel.findByIdAndDelete(id);
      res.status(200).json("User deleted Successfully");
    } catch (error) {
      res.status(500).json(error);
    }
  } else {
    res.status(403).json("Access Denied! you can only delete your own profile");
  }
};

export const followUser = async (req, res) => {
  const id = req.params.id;
  const { currentUserId } = req.body;

  if (currentUserId === id) {
    res.status(200).json("Action forbidden");
  } else {
    try {
      const followUser = await UserModel.findById(id);
      const followingUser = await UserModel.findById(currentUserId);
      if (!followUser.followers.includes(currentUserId)) {
        await followUser.updateOne({ $push: { followers: currentUserId } });
        await followingUser.updateOne({ $push: { following: id } });
        res.status(200).json("User followed!");
      } else {
        res.status(200).json("User is Already followed by you");
      }
    } catch (error) {
      res.status(500).json(error);
    }
  }
};

export const unFollowUser = async (req, res) => {
    const id = req.params.id;
    const { currentUserId } = req.body;
  
    if (currentUserId === id) {
      res.status(200).json("Action forbidden");
    } else {
      try {
        const followUser = await UserModel.findById(id);
        const followingUser = await UserModel.findById(currentUserId);
        if (followUser.followers.includes(currentUserId)) {
          await followUser.updateOne({ $pull: { followers: currentUserId } });
          await followingUser.updateOne({ $pull: { following: id } });
          res.status(200).json("User unfollowed!");
        } else {
          res.status(200).json("User is not followed by you");
        }
      } catch (error) {
        res.status(500).json(error);
      }
    }
  };


export const removeImages=async(req,res)=>{
    try {
  const id = req.params.id;

      const {profileImage_publicId,coverImage_publicId}=req.body

      if(profileImage_publicId ){

//         const user = await UserModel.findByIdAndUpdate(id, req.body, {
//           new: true,
//         });
// if(user){
  // const myArray = profileImage_publicId.split("/");
  // console.log(myArray)
  // console.log(myArray[1])

  const dlt=await cloudinary.uploader.destroy(profileImage_publicId);
  res.status(200).json(dlt);

// }
      }
      if(coverImage_publicId ){
        const dlt=await cloudinary.uploader.destroy(coverImage_publicId);
        res.status(200).json(dlt);

      }
      
    } catch (error) {
      res.status(500).json(error);
      
    }
  }