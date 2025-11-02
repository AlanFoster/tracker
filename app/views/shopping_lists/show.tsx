import React from 'react'
import {useContent, useStreamSource, unproxy} from '@thoughtbot/superglue'
import ItemsList from '@javascript/components/ItemsList'
import {Form, TextField, SubmitButton} from '@javascript/components'
import {useAppSelector} from '@javascript/store'

export default function ShoppingListsShow() {
    const content = useContent()
    const {header, newItemForm, totalCost, streamFromShopping} = content
    const {form, extras, inputs} = newItemForm
    const flash = useAppSelector((state) => state.flash)

    // Subscribe to real-time updates
    const {connected} = useStreamSource(streamFromShopping)

    // Get the raw content and pass fragment reference for items
    // to prevent parent re-renders
    const itemsRef = unproxy(content).items

    return (
        <div>
            <h1>{header.title}</h1>
            {flash.notice && <p>{flash.notice}</p>}
            {flash.alert && <p>{flash.alert}</p>}

            <button>
                <a href="/shopping_list?props_at=data.totalCost" data-sg-remote>
                    Refresh Cost
                </a>
            </button>

            <a href="/shopping_list?props_at=data.items" data-sg-remote>
                Refresh List
            </a>

            <div>{totalCost.message} {totalCost.amount}</div>

            <div>
                {connected ? '🟢 Live Updates' : '🔴 Connecting...'}
            </div>

            <ItemsList itemsRef={itemsRef} />

            <Form {...form} extras={extras} data-sg-remote>
                <TextField {...inputs.name} />
                <SubmitButton {...inputs.submit} />
            </Form>
        </div>
    )
}
