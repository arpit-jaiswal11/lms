const apiV1 = require("express")()
const { router: bookRouter } = require("./book")
const { router: userRouter } = require("./users")
const { router: paperRouter} = require("./paper")

apiV1.use("/book", bookRouter)
apiV1.use("/user", userRouter)
apiV1.use("/paper", paperRouter)

module.exports = { apiV1 }
