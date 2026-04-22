import userModel from "../models/UserModel.js"
import jwt from "jsonwebtoken"
import bcrypt from "bcrypt"
import validator from "validator"

//LOGIN
const loginUser = async(req,res) => {
    const {email,password} = req.body;
    try{
        const user = await userModel.findOne({email});

        if(!user){
            return res.json({success:false,message:"User doesn't exist"})
        }

        const isMatch = await bcrypt.compare(password,user.password)

        if(!isMatch){
            return res.json({success:false,message:"Invalid Credentials"})
        }

        const token = createToken(user._id);
        res.json({success:true,token})

    } catch(error){
        console.log(error);
        res.json({success:false,message:"Error"});
    }
}

const createToken = (id) => {
    return jwt.sign({id},process.env.JWT_SECRET)
}
//REGISTER USER
const regUser = async(req,res) => {
    const {name,password,email} = req.body;
    try{
        //CHECKING IF USER EXISTS
        const exist = await userModel.findOne({email});
        if(exist){
            return res.json({success:false,message:"User already exists"})
        }
        //VALIDATIONG EMAIL AND STRONG PASSWORD
        if(!validator.isEmail(email)){
            return res.json({success:false,message:"Please Enter valid Email"})
        }

        if(password.length < 8){
            return res.json({success:false,message:"Please Enter strong password"})
        }

        //ENCRYPT PASSOWRD
        const salt = await bcrypt.genSalt(10)
        const hashedP = await bcrypt.hash(password,salt);

        const newUser = new userModel({
            name:name,
            email:email,
            password:hashedP
        })

        const user = await newUser.save()
        const token = createToken(user._id)
        res.json({success:true,token})
    } catch(error){
        console.log(error);
        res.json({success:false,message:"Error"});
    }
}

export {loginUser,regUser};