import express from "express";
import { UserModel } from "../model/users";
import { JWTAuth, verifyRefreshToken } from "../auth/tools";
import { JWTAuthMiddleware } from "../middlewares/JWTAuthMiddleware";
import { Request, Response } from "express";
import createError from "http-errors";

const usersRouter = express.Router();

usersRouter.route("/login").post(async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await UserModel.checkCredentials(email, password);

    if (user) {
      const token = await JWTAuth(user);
      console.log(token);

      res.cookie("accessToken", token.accessToken, {
        httpOnly: true,
        sameSite: "none",
        secure: true
      });
      res.cookie("refreshToken", token.refreshToken, {
        httpOnly: true,
        sameSite: "none",
        secure: true
      });

      res.send("success");
    } else {
      res
        .status(404)
        .send({ success: false, message: "Credentials are not correct" });
    }
  } catch (error) {
    res.status(404).send({ success: false, error: error });
  }
});

usersRouter.route("/register").post(async (req: Request, res: Response) => {
  try {
    const createUser = new UserModel({ ...req.body, role: "normal" });

    if (createUser) {
      await createUser.save();

      const tokens = await JWTAuth(createUser);

      res.status(201).send({ success: true, user: createUser._id, tokens });
    } else {
      res.status(400).send({
        success: false,
        message: "Something Went Wrong in the creation of the user",
      });
    }
  } catch (error) {
    res.status(400).send({ success: false, error: error });
  }
});

usersRouter.post("/refreshToken", async (req, res, next) => {
  try {
    if (!req.cookies.refreshToken)
      next(createError(400, "Refresh Token not provided"));
    else {
      const token = await verifyRefreshToken(req.cookies.refreshToken);
      res.cookie("accessToken", token.accessToken, {
        httpOnly: true,
        sameSite: "none",
        secure: true,
      });

      res.cookie("refreshToken", token.refreshToken, {
        httpOnly: true,
        sameSite: "none",
        secure: true,
      });

      res.send("success");
    }
  } catch (error) {
    next(error);
  }
});

usersRouter.post("/logout", JWTAuthMiddleware, async (req, res, next) => {
  try {
    const user = req.user;
    user.refreshToken = "";
    await user.save();
    res.cookie("accessToken", "", {
      httpOnly: true,
      sameSite: "none",
      secure: true,
    });

    res.cookie("refreshToken", "", {
      httpOnly: true,
      sameSite: "none",
      secure: true,
    });

    res.send("logged out!");
  } catch (error) {
    console.log("error");
    next(error);
  }
});

usersRouter
  .route("/me")
  .get(JWTAuthMiddleware, async (req, res, next) => {
    try {
      const getUser = await UserModel.findById(req.user._id)
        .populate({path: "programs",
      populate: {path: 'prouser'}})

      res.send(getUser);
    } catch (error) {
      next(error);
    }
  })
  .put(JWTAuthMiddleware, async (req, res, next) => {
    try {
      const user = await UserModel.findByIdAndUpdate(req.user._id, {
        ...req.body,
      });
      res.status(200).send({ success: true, user: user });
    } catch (error) {
      next(error);
    }
  })
  .delete(JWTAuthMiddleware, async (req, res, next) => {
    try {
    } catch (error) {
      next(error);
    }
  });

export default usersRouter;
