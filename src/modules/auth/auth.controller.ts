import type { Request, Response } from "express"
import { authService } from "./auth.service";

const loginUser=async(req:Request,res:Response)=>{
    try {
        const result=await authService.loginUserFromDB(req.body);
        const {refreshToken}=result;
        res.cookie("refreshToken",refreshToken,{
            secure:false,
            httpOnly:true,
            sameSite:'lax'
        })
    res.status(201).json({
      success: true,
      message: "profile createed successfully!",
      data: result
    });
        
    } catch (error:any) {
         res.status(500).json({
      success: false,
      message: error.message,
      error: error,
    });
        
        
    }

}

const refreshToken=async(req:Request,res:Response)=>{
try {
    const result = await authService.generateFreshToken(
      req.cookies.refreshToken,
    );
    res.status(200).json({
      success: true,
      message: "Acess token generated!",
      data: result,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message,
      error: error,
    });
  }
};

export const authController={
    loginUser,refreshToken
}