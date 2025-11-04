import React, {useState} from 'react'
import {useContent} from '@thoughtbot/superglue'
import {useAppSelector} from '@javascript/store'
import {Box, Dialog, DialogContent, DialogTitle, IconButton, Typography} from "@mui/material";
import {FieldBase, TextField, Form, SubmitButton} from "@javascript/components";
import RemoveIcon from "@mui/icons-material/Remove";
import AddIcon from "@mui/icons-material/Add";

export default function SessionForm({sessionForm, validationErrors, showModal}) {
    const {form, extras, inputs} = sessionForm

    return (
        showModal &&
        <Dialog open={showModal}>
            <DialogTitle>New Session</DialogTitle>
            <DialogContent>
                <>
                    <pre>{JSON.stringify(ascentForm, null, 4)}</pre>
                    <pre>{JSON.stringify(validationErrors, null, 4)}</pre>

                    {/*<Form {...form} extras={extras} validationErrors={validationErrors}>*/}
                    {/*    <TextField {...inputs.description} label='Description' errorKey={inputs.description.name} />*/}
                    {/**/}
                    {/*    <div>*/}
                    {/*        <SubmitButton variant='contained' {...inputs.submit} />*/}
                    {/*    </div>*/}
                    {/*</Form>*/}
                </>
            </DialogContent>
        </Dialog>
    )
}
