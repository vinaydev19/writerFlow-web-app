import { asyncHandler } from "../utils/asyncHandler.js"
import { ApiResponse } from "../utils/ApiResponse.js"
import { ApiError } from "../utils/ApiError.js"
import { User } from "../models/user.model.js"
import { sendVerificationCode, sendWalcomeEmail } from "../utils/EmailSender.js"


const option = {
    httpOnly: true,
    secure: true,
    sameSite: "lax",
};

const generateAccessAndRefreshToken = async (userId) => {
    try {
        const user = await User.findById(userId)
        const accessToken = user.generateAccessToken
        const refreshToken = user.generateRefreshToken

        user.refreshToken = refreshToken

        await user.save({ validateBeforeSave: false })

        return { accessToken, refreshToken }
    } catch (error) {
        throw new ApiError(500, "something want wrong while generator access and refresh token")
    }
}

const userRegister = asyncHandler(async (req, res) => {
    const { username, password, email, fullName } = req.body

    if (!username || !password || !email || !fullName) {
        throw new ApiError(400, "all fields are required")
    }

    const userExist = await User.findOne({ email })

    if (userExist) {
        throw new ApiError(409, "user is already exist with is email")
    }

    const verficationToken = Math.floor(1000 + Math.random() * 9000);

    const createUser = await User.create({
        username,
        fullName,
        password,
        email,
        verficationToken,
        verficationTokenExpiresAt: Date.now() + 24 * 60 * 60 * 1000,
    })

    const user = await User.findById(createUser._id).select("-password -refreshToken")

    if (!user) {
        throw new ApiError(500, "something want wrong while register the user")
    }

    await sendVerificationCode(user.email, verficationToken)

    res.status(200).json(new ApiResponse(200, { user }, "user register successfully"))
})

const userVerfication = asyncHandler(async (req, res) => {
    const { code } = req.body

    if (!code) {
        throw new ApiError(400, "Pls Enter a Verifcation Code")
    }

    const user = await User.findOne({ code })

    if (!user) {
        throw new ApiError(400, "verifcation code is invaild or expired")
    }

    user.isVerified = true
    user.verficationToken = undefined
    user.verficationTokenExpiresAt = undefined
    await user.save({ validateBeforeSave: false })
    await sendWalcomeEmail(user.fullName, user.email)


    res.status(200).json(new ApiResponse(200, "code is verify successfully"))
})

const userLogin = asyncHandler(async (req, res) => {
    const { username, password, email } = req.body

    if ((!username && !email) || !password) {
        throw new ApiError(401, "all fields are required")
    }

    const findUser = await User.findOne({ email })

    if (!findUser) {
        throw new ApiError(404, "user not found")
    }

    const isPasswordCorrect = await findUser.isPasswordCorrect(password)

    if (!isPasswordCorrect) {
        throw new ApiError(400, "password is Incorrect")
    }

    const { accessToken, refreshToken } = generateAccessAndRefreshToken(findUser._id)

    const user = await User.findById(findUser._id).select("-password -refreshToken")

    return res
        .status(200)
        .cookie("accessToken", accessToken, option)
        .cookie("refreshToken", refreshToken, option)
        .json(
            new ApiResponse(
                200,
                { user: user, accessToken, refreshToken },
                "user login successfully"
            )
        );

})

const userlogout = asyncHandler(async (req, res) => {
    await User.findByIdAndUpdate(
        req.user._id,
        {
            $unset: {
                refreshToken: 1
            }
        },
        {
            new: true
        }
    )

    return res
        .status(200)
        .clearCookie("accessToken", option)
        .clearCookie("refreshToken", option)
        .json(new ApiResponse(200, {}, "user logout successfully"));
})



export { userRegister, userVerfication, userLogin, userlogout }