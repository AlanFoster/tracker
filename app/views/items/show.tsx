import React from 'react'
import { useContent } from '@thoughtbot/superglue'

export default function ItemsShow() {
    const { itemDetails, backPath } = useContent()

    return (
        <div>
            <h1>{itemDetails.name}</h1>
            <p>Status: {itemDetails.completed ? 'Completed' : 'Pending'}</p>
            <p>Added: {itemDetails.addedAt}</p>
            <a href={backPath}>← Back to list</a>
        </div>
    )
}
