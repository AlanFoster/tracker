import React, {useState} from 'react'
import {useContent} from '@thoughtbot/superglue'
import {useAppSelector} from '@javascript/store'
import AscentForm from "./AscentForm"
import {Dialog, DialogContent, DialogTitle} from "@mui/material";

export default function SessionsIndex() {
    const {editAscentForm, backPath} = useContent() as any
    const flash = useAppSelector((state) => state.flash)
    const validationErrors = useAppSelector((state) => state.flash.postFormErrors)

    return (
        <Dialog open={true}>
            <DialogTitle>Edit Ascent</DialogTitle>
            <DialogContent>
                {flash.notice && <p>{flash.notice}</p>}
                {flash.alert && <p>{flash.alert}</p>}

                <AscentForm
                    ascentForm={editAscentForm}
                    validationErrors={validationErrors}
                />
            </DialogContent>
        </Dialog>
    )
}
