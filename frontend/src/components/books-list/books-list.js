import { useState, useEffect } from "react"
import { Link, Link as RouterLink } from "react-router-dom"
import {
  Button,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Modal,
  Card,
  CardContent,
  CardActions,
  Typography,
  TablePagination,
} from "@mui/material"
import { BackendApi } from "../../client/backend-api"
import { useUser } from "../../context/user-context"
import classes from "./styles.module.css"

export const BooksList = () => {
  const [books, setBooks] = useState([])
  const [borrowedBook, setBorrowedBook] = useState([])
  const [page, setPage] = useState(0)
  const [rowsPerPage, setRowsPerPage] = useState(10)
  const [activeBookIsbn, setActiveBookIsbn] = useState("")
  const [openModal, setOpenModal] = useState(false)
  const [activePaperId, setActivePaperId] = useState("")
  const { isAdmin, user } = useUser()

  const [papers, setPapers] = useState([])

  const fetchPapers = async () => {
    const { papers } = await BackendApi.paper.getAllPapers()
    setPapers(papers)
  }

  const deletePaper = () => {
    if (activePaperId && papers.length) {
      BackendApi.paper.deletePaper(activePaperId).then(({ success }) => {
        fetchPapers().catch(console.error)
        setOpenModal(false)
        setActivePaperId("")
      })
    }
  }

  const fetchBooks = async () => {
    const { books } = await BackendApi.book.getAllBooks()
    setBooks(books)
  }

  const fetchUserBook = async () => {
    const { books } = await BackendApi.user.getBorrowBook()
    setBorrowedBook(books)
  }

  const deleteBook = () => {
    if (activeBookIsbn && books.length) {
      BackendApi.book.deleteBook(activeBookIsbn).then(({ success }) => {
        fetchBooks().catch(console.error)
        setOpenModal(false)
        setActiveBookIsbn("")
      })
    }
  }

  useEffect(() => {
    fetchBooks().catch(console.error)
    fetchUserBook().catch(console.error)
  }, [user])

  useEffect(() => {
    fetchPapers().catch(console.error)
  }, [user])

  return (
    <>
      <div className={`${classes.pageHeader} ${classes.mb2}`}>
        <Typography variant="h5">Book List</Typography>
        {isAdmin && (
          <Button variant="contained" color="primary" component={RouterLink} to="/admin/books/add">
            Add Book
          </Button>
        )}
      </div>
      {books.length > 0 ? (
        <>
          <div className={classes.tableContainer}>
            <TableContainer component={Paper}>
              <Table stickyHeader>
                <TableHead>
                  <TableRow>
                    <TableCell>Name</TableCell>
                    <TableCell align="right">ISBN</TableCell>
                    <TableCell>Category</TableCell>
                    <TableCell align="right">Quantity</TableCell>
                    <TableCell align="right">Available</TableCell>
                    <TableCell align="right">Price</TableCell>
                    <TableCell>Action</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {(rowsPerPage > 0
                    ? books.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                    : books
                  ).map((book) => (
                    <TableRow key={book.isbn}>
                      <TableCell component="th" scope="row">
                        {book.name}
                      </TableCell>
                      <TableCell align="right">{book.isbn}</TableCell>
                      <TableCell>{book.category}</TableCell>
                      <TableCell align="right">{book.quantity}</TableCell>
                      <TableCell align="right">{book.availableQuantity}</TableCell>
                      <TableCell align="right">{`$${book.price}`}</TableCell>
                      <TableCell>
                        <div className={classes.actionsContainer}>
                          <Button
                            variant="contained"
                            component={RouterLink}
                            size="small"
                            to={`/books/${book.isbn}`}
                          >
                            View
                          </Button>
                          {isAdmin && (
                            <>
                              <Button
                                variant="contained"
                                color="primary"
                                component={RouterLink}
                                size="small"
                                to={`/admin/books/${book.isbn}/edit`}
                              >
                                Edit
                              </Button>
                              <Button
                                variant="contained"
                                color="secondary"
                                size="small"
                                onClick={(e) => {
                                  setActiveBookIsbn(book.isbn)
                                  setOpenModal(true)
                                }}
                              >
                                Delete
                              </Button>
                            </>
                          )}
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
            <TablePagination
              onRowsPerPageChange={(e) => {
                setRowsPerPage(parseInt(e.target.value, 10))
                setPage(0)
              }}
              component="div"
              count={books.length}
              rowsPerPage={rowsPerPage}
              page={page}
              onPageChange={(e, newPage) => setPage(newPage)}
            />
            <Modal open={openModal} onClose={(e) => setOpenModal(false)}>
              <Card className={classes.conf_modal}>
                <CardContent>
                  <h2>Are you sure?</h2>
                </CardContent>
                <CardActions className={classes.conf_modal_actions}>
                  <Button variant="contained" onClick={() => setOpenModal(false)}>
                    Cancel
                  </Button>
                  <Button variant="contained" color="secondary" onClick={deleteBook}>
                    Delete
                  </Button>
                </CardActions>
              </Card>
            </Modal>
          </div>
        </>
      ) : (
        <Typography variant="h5">No books found!</Typography>
      )}

      {user && !isAdmin && (
        <>
          <div className={`${classes.pageHeader} ${classes.mb2}`}>
            <Typography variant="h5">Borrowed Books</Typography>
          </div>
          {borrowedBook.length > 0 ? (
            <>
              <div className={classes.tableContainer}>
                <TableContainer component={Paper}>
                  <Table stickyHeader>
                    <TableHead>
                      <TableRow>
                        <TableCell>Name</TableCell>
                        <TableCell align="right">ISBN</TableCell>
                        <TableCell>Category</TableCell>
                        <TableCell align="right">Price</TableCell>
                        <TableCell></TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {borrowedBook.map((book) => (
                        <TableRow key={book.isbn}>
                          <TableCell component="th" scope="row">
                            {book.name}
                          </TableCell>
                          <TableCell align="right">{book.isbn}</TableCell>
                          <TableCell>{book.category}</TableCell>
                          <TableCell align="right">{`$${book.price}`}</TableCell>
                          <TableCell>
                            <div className={classes.actionsContainer}>
                              <Button
                                variant="contained"
                                component={RouterLink}
                                size="small"
                                to={`/books/${book.isbn}`}
                              >
                                View
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              </div>
            </>
          ) : (
            <Typography variant="h5">No books issued!</Typography>
          )}
        </>
      )}

      <div className={`${classes.pageHeader} ${classes.mb2}`}>
        <Typography variant="h5">Paper List</Typography>
        {isAdmin && (
          <Button variant="contained" color="primary" component={RouterLink} to="/admin/papers/add">
            Add Paper
          </Button>
        )}
      </div>
      {papers.length > 0 ? (
        <>
          <div className={classes.tableContainer}>
            <TableContainer component={Paper}>
              <Table stickyHeader>
                <TableHead>
                  <TableRow>
                    <TableCell>Subject</TableCell>
                    <TableCell align="right">Paper ID</TableCell>
                    <TableCell>Semester</TableCell>
                    <TableCell align="right">Year</TableCell>
                    <TableCell>Action</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {(rowsPerPage > 0
                    ? papers.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                    : papers
                  ).map((paper) => (
                    <TableRow key={paper.paperId}>
                      <TableCell component="th" scope="row">
                        {paper.subject}
                      </TableCell>
                      <TableCell align="right">{paper.paperId}</TableCell>
                      <TableCell>{paper.semester}</TableCell>
                      <TableCell align="right">{paper.year}</TableCell>
                      <TableCell>
                        <div className={classes.actionsContainer}>
                          <a
                            href={paper.path}
                            rel="noopener noreferrer"
                          >
                            <Button
                            variant="contained"
                          >
                            View
                          </Button>
                          </a>
                          {isAdmin && (
                            <>
                              <Button
                                variant="contained"
                                color="primary"
                                component={RouterLink}
                                size="small"
                                to={`/admin/papers/${paper.paperId}/edit`}
                              >
                                Edit
                              </Button>
                              <Button
                                variant="contained"
                                color="secondary"
                                size="small"
                                onClick={(e) => {
                                  setActivePaperId(paper.paperId)
                                  setOpenModal(true)
                                }}
                              >
                                Delete
                              </Button>
                            </>
                          )}
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
            <TablePagination
              onRowsPerPageChange={(e) => {
                setRowsPerPage(parseInt(e.target.value, 10))
                setPage(0)
              }}
              component="div"
              count={papers.length}
              rowsPerPage={rowsPerPage}
              page={page}
              onPageChange={(e, newPage) => setPage(newPage)}
            />
            <Modal open={openModal} onClose={(e) => setOpenModal(false)}>
              <Card className={classes.conf_modal}>
                <CardContent>
                  <h2>Are you sure?</h2>
                </CardContent>
                <CardActions className={classes.conf_modal_actions}>
                  <Button variant="contained" onClick={() => setOpenModal(false)}>
                    Cancel
                  </Button>
                  <Button variant="contained" color="secondary" onClick={deletePaper}>
                    Delete
                  </Button>
                </CardActions>
              </Card>
            </Modal>
          </div>
        </>
      ) : (
        <Typography variant="h5">No Papers found!</Typography>
      )}
    </>
  )
}
