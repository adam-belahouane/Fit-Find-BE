import express from "express";
import mongoose  from "mongoose";
import { JWTAuthMiddleware, JWTAuthMiddlewarePro } from "../../middlewares/JWTAuthMiddleware";
import { ProUserModel } from "../../model/professionalUser";
import { ProgramModel } from "../../model/programs";
import { UserModel } from "../../model/users";
import dotenv from "dotenv";

dotenv.config();
const stripe = require("stripe")(process.env.STRIPE_PRIVATE_KEY)
const programsRouter = express.Router();

programsRouter.post("/payForProgram", JWTAuthMiddleware, async (req, res, next) => {
    try {
        const session = await stripe.checkout.sessions.create({
            line_items : [{
                price_data: {
                    currency: 'GBP',
                    product_data: {
                        name: req.body.title
                    },
                    unit_amount: req.body.price,
                },
                quantity: 1,
            }],
            payment_method_types: ['card'],
            mode: 'payment',
            success_url: process.env.FE_URL + "confirmed/" + req.body.id,
            cancel_url: process.env.FE_URL + "cancel"
        })

        res.json({url: session.url})
        
    } catch (error) {
        console.log(error)
    }
})

programsRouter.post("/addToUser/:productId", JWTAuthMiddleware, async( req: any, res, next) => {
    try {
        const getUser = await UserModel.findById(req.user.id)
        getUser?.programs.push( new mongoose.Types.ObjectId(req.params.productId) )
        await getUser?.save()

        res.status(201).send(getUser)
    } catch (error) {
        console.log(error);
        
    }
})

programsRouter.post(
  "/newProgram",
  JWTAuthMiddlewarePro,
  async (req: any, res, next) => {
    try {
      const newProgram = new ProgramModel({
        ...req.body,
        prouser: req.user._id,
      });
      if (newProgram) {
        await newProgram.save();

        const getProUser = await ProUserModel.findById(req.user._id);
        getProUser?.programs.push(newProgram._id);
        await getProUser?.save();

        res.status(201).send({ success: true, data: newProgram });
      } else {
        res.status(400).send({
          success: false,
          message: "Something Went Wrong in the creation of the program",
        });
      }
    } catch (error) {
      console.log(error);
    }
  }
);

export default programsRouter;
