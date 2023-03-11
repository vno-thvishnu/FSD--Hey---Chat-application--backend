import UserModel from "../Models/UserModel.js";
import bcrypt from "bcrypt"
export const registerUser=async(req, res)=>{
    delete req.body.confirmpassword;
    const {username,password,firstname,lastname,profileImage,coverImage}=req.body;
    const findUsername=await UserModel.findOne({username:username})
    const findfirstname=await UserModel.findOne({firstname:firstname})
    try{
if( !findUsername && !findfirstname){
    const salt=await bcrypt.genSalt(10)
const hashpassword =await bcrypt.hash(password,salt)

    const newUser = new UserModel({username,password:hashpassword,firstname,lastname,profileImage,coverImage})



    
        await newUser.save();
        res.status(200).json({message:"Registered Successfully"})
}else{
if(findUsername && !findfirstname){
    res.status(200).json({message: "Email-id already in use"})

}else if(findfirstname && !findUsername){
    res.status(200).json({message:"Firstname already in use"})

}else if(findUsername && username){
    res.status(200).json({message:"Email-id or Firstname already in use"})

}
}
// throwSomeObj();
    }catch(error){
res.status(500).json({message: error.message})
    }
}

export const loginUser= async(req,res)=>{
    const{username,password}=req.body
    try {
        const user=await UserModel.findOne({username:username})
        if(user){

            const validity=await bcrypt.compare(password,user.password)
    //   const { password, ...otherDetails } = user._doc;

            // validity?
            
            // res.status(200).json(user) : 
            // res.status(400).json("Username or Password incorrect")
if(validity){
      const { password, ...otherDetails } = user._doc;
            res.status(200).json({otherDetails,message:"Login Successfully"})  


}else{
            res.status(200).json({message:"Username or Password incorrect"})

}

        }else{
            res.status(200).json({message:"User does not exists"})
        }
    } catch (error) {
res.status(500).json({message: error.message})
        
    }
}