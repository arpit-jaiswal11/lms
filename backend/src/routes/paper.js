const router = require("express")()
const { PaperModel } = require("../models/paper")

router.get("/", async (req, res, next) => {
    try {
      const papers = await PaperModel.find({})
      return res.status(200).json({
        papers: papers.map((paper) => ({
          ...paper.toJSON(),
        })),
      })
    } catch (err) {
      next(err)
    }
})

router.get("/:paperId", async (req, res, next) => {
    try {
      const paper = await PaperModel.findOne({ paperId: req.params.paperId })
      if (paper == null) {
        return res.status(404).json({ error: "Paper not found" })
      }
      return res.status(200).json({
        paper: {
          ...paper.toJSON(),
        },
      })
    } catch (err) {
      next(err)
    }
})

router.post("/", async (req, res, next) => {
    try {
      const paper = await PaperModel.findOne({ paperId: req.body.paperId })
      if (paper != null) {
        return res.status(400).json({ error: "Paper with same ID already found" })
      }
      const newPaper = await PaperModel.create(req.body)
      console.log("Request Done!");
      return res.status(200).json({ paper: newPaper })
    } catch (err) {
      next(err)
    }
})

router.patch("/:paperId", async (req, res, next) => {
    try {
      const paper = await PaperModel.findOne({ paperId: req.params.paperId })
      if (paper == null) {
        return res.status(404).json({ error: "Paper not found" })
      }
      const { _id, paperId, ...rest } = req.body
      const updatedPaper = await paper.update(rest)
      return res.status(200).json({ paper: updatedPaper })
    } catch (err) {
      next(err)
    }
})

router.delete("/:paperId", async (req, res, next) => {
    try {
      const paper = await PaperModel.findOne({ paperId: req.params.paperId })
      if (paper == null) {
        return res.status(404).json({ error: "Paper not found" })
      }
      await paper.delete()
      return res.status(200).json({ success: true })
    } catch (err) {
      next(err)
    }
  })
  
  module.exports = { router }
  
