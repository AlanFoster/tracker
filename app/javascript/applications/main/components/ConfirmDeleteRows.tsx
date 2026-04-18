import React, { useRef, useState } from 'react';
import { Form } from '@javascript/components/Inputs';
import {
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle,
} from "@mui/material";

export interface ConfirmDeleteRowsProps {
    deleteForm: { batchDeleteName: string }
    ids: number[]
    onCancel: () => undefined
}

export default function ConfirmDeleteRows({ deleteForm, ids, onCancel }: ConfirmDeleteRowsProps) {
    const [open, setOpen] = useState(true);
    const [isLoading, setIsLoading] = useState(false)
    const formRef = useRef(null);
    const { batchDeleteName, form, extras } = deleteForm || { form: {}, extras: {} };

    const handleClose = () => {
        setOpen(false);
        if (onCancel) {
            onCancel()
        }
    }

    const handleDelete = (e) => {
        setIsLoading(true)
        formRef.current?.submit();
        e.stopPropagation();
    };

    return (
        <Dialog open={open} onClose={handleClose} keepMounted>
            {/* Hidden form that triggers the deletion */}
            <Form ref={formRef} {...form} extras={extras} data-sg-remote>
                {ids.map(id => <input type="hidden" name={batchDeleteName} key={id} value={id}/>)}
            </Form>

            <DialogTitle>Confirm Delete</DialogTitle>

            <DialogContent>
                <DialogContentText>
                    Are you sure you want to delete {ids.length} items? This action cannot be undone.
                </DialogContentText>
            </DialogContent>

            <DialogActions>
                <Button onClick={handleClose}>Cancel</Button>
                <Button onClick={handleDelete} color="error" variant="contained" loading={isLoading}>
                    Delete
                </Button>
            </DialogActions>
        </Dialog>
    );
}
