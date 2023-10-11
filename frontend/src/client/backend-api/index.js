const { BookApi } = require("./book")
const { UserApi } = require("./user")
const { PaperApi } = require("./paper")

const BackendApi = {
  book: BookApi,
  user: UserApi,
  paper: PaperApi,
}

module.exports = { BackendApi }
