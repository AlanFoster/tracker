import React, {useState} from 'react'
import {useContent} from '@thoughtbot/superglue'
import {useAppSelector} from '@javascript/store'
import {Box, Dialog, DialogContent, DialogTitle, IconButton, Stack, Typography} from "@mui/material";
import {FieldBase, TextField, Form, SubmitButton} from "@javascript/components";
import RemoveIcon from "@mui/icons-material/Remove";
import AddIcon from "@mui/icons-material/Add";

export default function SessionForm({sessionForm, validationErrors, showModal, onClose}) {
    const {form, extras, inputs} = sessionForm

    if (!showModal) {
        return undefined;
    }

    return (
        showModal &&
        <Dialog
            open={showModal}
            onClose={onClose}
        >
            <DialogTitle>New Session</DialogTitle>
            <DialogContent>
                <>
                    {/*<pre>{JSON.stringify(sessionForm, null, 4)}</pre>*/}
                    {/*<pre>{JSON.stringify(validationErrors, null, 4)}</pre>*/}

                    <Form {...form} extras={extras} validationErrors={validationErrors} data-sg-visit>
                        <Stack
                            spacing={2}
                            paddingTop={1}
                            width={400}
                        >
                            <TextField
                                {...inputs.description}
                                label='Description'
                                errorKey='description'
                            />
                            <SubmitButton variant='contained' {...inputs.submit} />
                        </Stack>
                    </Form>
                </>
            </DialogContent>
        </Dialog>
    )
}
