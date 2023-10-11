import React, { useState, useEffect } from "react"
import * as dayjs from "dayjs"
import utc from "dayjs/plugin/utc"
import { useParams, useNavigate } from "react-router-dom"
import {
    Paper,
    Container,
    Button,
    TextField,
    FormGroup,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    Typography,
} from "@mui/material"
import { BackendApi } from "../../client/backend-api"
import classes from "./styles.module.css"

export const PaperForm = () => {
    const { paperId } = useParams()
    const navigate = useNavigate()
    const [paper, setPaper] = useState({
        subject: "",
        paperId: paperId || 0,
        semester: 0,
        year: 0,
        path:""
    })
    const [errors, setErrors] = useState({
        subject: "",
        paperId: "",
        semester: "",
        year: "",
        path:""
    })

    const isInvalid =
        paper.subject.trim() === "" || paper.path.trim() === ""

    const formSubmit = (event) => {
        event.preventDefault()
        if (!isInvalid) {
            if (paperId) {
                const newYear = parseInt(paper.year, 10)
                BackendApi.paper
                    .patchPaperById(paperId, {
                        ...paper,
                        year: newYear,
                    })
                    .then(() => navigate(-1))
            } else {
                BackendApi.paper
                    .addPaper({
                        ...paper
                    })
                    .then(() => navigate("/"))
            }
        }
    }

    const updatePaperField = (event) => {
        const field = event.target
        setPaper((paper) => ({ ...paper, [field.name]: field.value }))
    }

    const validateForm = (event) => {
        const { name, value } = event.target
        if (["sunject", "paperId", "year", "semester"].includes(name)) {
            setPaper((prevPaper) => ({ ...prevPaper, [name]: value.trim() }))
            if (!value.trim().length) {
                setErrors({ ...errors, [name]: `${name} can't be empty` })
            } else {
                setErrors({ ...errors, [name]: "" })
            }
        }
        if (["year", "semester"].includes(name)) {
            if (isNaN(Number(value))) {
                setErrors({ ...errors, [name]: "Only numbers are allowed" })
            } else {
                setErrors({ ...errors, [name]: "" })
            }
        }
    }

    useEffect(() => {
        if (paperId) {
            BackendApi.paper.getPaperById(paperId).then(({ paper, error }) => {
                if (error) {
                    navigate("/")
                } else {
                    setPaper(paper)
                }
            })
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [paperId])

    return (
        <>
            <Container component={Paper} className={classes.wrapper}>
                <Typography className={classes.pageHeader} variant="h5">
                    {paperId ? "Update Paper" : "Add Paper"}
                </Typography>
                <form noValidate autoComplete="off" onSubmit={formSubmit}>
                    <FormGroup>
                        <FormControl className={classes.mb2}>
                            <TextField
                                label="Subject"
                                name="subject"
                                required
                                value={paper.subject}
                                onChange={updatePaperField}
                                onBlur={validateForm}
                                error={errors.subject.length > 0}
                                helperText={errors.subject}
                            />
                        </FormControl>
                        <FormControl className={classes.mb2}>
                            <TextField
                                label="Paper ID"
                                name="paperId"
                                required
                                value={paper.paperId}
                                onChange={updatePaperField}
                                onBlur={validateForm}
                                error={errors.paperId.length > 0}
                                helperText={errors.paperId}
                            />
                        </FormControl>
                        <FormControl className={classes.mb2}>
                            <TextField
                                label="Year"
                                name="year"
                                required
                                value={paper.year}
                                onChange={updatePaperField}
                                onBlur={validateForm}
                                error={errors.year.length > 0}
                                helperText={errors.year}
                            />
                        </FormControl>
                        <FormControl className={classes.mb2}>
                            <TextField
                                label="Semester"
                                name="semester"
                                type="number"
                                value={paper.semester}
                                onChange={updatePaperField}
                                onBlur={validateForm}
                                error={errors.semester.length > 0}
                                helperText={errors.semester}
                            />
                        </FormControl>
                        <FormControl className={classes.mb2}>
                            <TextField
                                label="Link"
                                name="path"
                                required
                                value={paper.path}
                                onChange={updatePaperField}
                                onBlur={validateForm}
                                error={errors.path.length > 0}
                                helperText={errors.path}
                            />
                        </FormControl>
                    </FormGroup>
                    <div className={classes.btnContainer}>
                        <Button
                            variant="contained"
                            color="secondary"
                            onClick={() => {
                                navigate(-1)
                            }}
                        >
                            Cancel
                        </Button>
                        <Button type="submit" variant="contained" color="primary" disabled={isInvalid}>
                            {paperId ? "Update Paper" : "Add Paper"}
                        </Button>
                    </div>
                </form>
            </Container>
        </>
    )
}
