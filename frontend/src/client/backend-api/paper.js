const PaperApi = {
    getAllPapers: async () => {
      const res = await fetch("/v1/paper", { method: "GET" })
      return res.json()
    },
    getPaperById: async (paperId) => {
      const res = await fetch(`/v1/paper/${paperId}`, { method: "GET" })
      return res.json()
    },
    addPaper: async (data) => {
      const res = await fetch("/v1/paper", {
        method: "POST",
        body: JSON.stringify(data),
        headers: { "Content-Type": "application/json" },
      })
      return res.json()
    },
    patchPaperById: async (paperId, data) => {
      const res = await fetch(`/v1/paper/${paperId}`, {
        method: "PATCH",
        body: JSON.stringify(data),
        headers: { "Content-Type": "application/json" },
      })
      return res.json()
    },
    deletePaper: async (paperId) => {
      const res = await fetch(`/v1/paper/${paperId}`, { method: "DELETE" })
      return res.json()
    },
  }
  
  module.exports = { PaperApi }
  