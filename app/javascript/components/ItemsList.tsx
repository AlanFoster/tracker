import React, { useContext } from 'react'
import { useContent, useSetFragment, unproxy, NavigationContext } from '@thoughtbot/superglue'

const Item = ({ itemRef }) => {
    const {
        id,
        name,
        completed,
        detailPath,
    } = useContent(itemRef)
    const set = useSetFragment()
    const { remote } = useContext(NavigationContext)

    const handleToggle = (currentState) => {
        // Optimistic update - immediate UI feedback on specific item fragment
        set(`item_${id}`, (draft) => {
            draft.completed = !currentState
        })

        // Sync with server (this would trigger streaming to other users)
        remote(`/items/${id}`, { method: 'PATCH' })
            .catch(() => {
                // Revert on error
                set(`item_${id}`, (draft) => {
                    draft.completed = currentState
                })
            })
    }

    return (
        <li>
            {completed ? "✅"  : "❌"}
            <button onClick={() => handleToggle(completed)}>
                Toggle
            </button>
            {name}
            <a href={detailPath} data-sg-visit>Details</a>
        </li>
    )
}

export default function ItemsList({ itemsRef }) {
    const items = useContent(itemsRef)

    return (
        <ul>
            {unproxy(items).map(itemRef => (
                <Item key={itemRef.__id} itemRef={itemRef} />
            ))}
        </ul>
    )
}
