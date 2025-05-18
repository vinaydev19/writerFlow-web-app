import { asyncHandler } from "../utils/asyncHandler"
import { ApiResponse } from "../utils/ApiResponse.js"
import { ApiError } from "../utils/ApiError.js"
import { User } from "../models/user.model.js"
import { sendVerificationCode } from "../utils/EmailSender.js"





const userRegister = asyncHandler(async (req, res) => {
    const { username, password, email } = req.body

    if (!username || !password || !email) {
        throw new ApiError(401, "all fields are required")
    }

    const userExist = await User.findOne({ email })

    if (userExist) {
        throw new ApiError(409, "user is already exist with is email")
    }

    const verficationToken = Math.floor(1000 + Math.random() * 9000);

    const createUser = await User.create({
        username,
        password,
        email,
        verficationToken,
        verficationTokenExpiresAt: Date.now() + 24 * 60 * 60 * 1000,
    })

    const user = await User.findById(createUser._id).select("-password -refreshToken")

    if (!user) {
        throw new ApiError(401, "something want wrong while register the user")
    }

    await sendVerificationCode(user.email, verficationToken)

    res.status(200).json(new ApiResponse(200, { user }, "user register successfully"))
})


export { userRegister }