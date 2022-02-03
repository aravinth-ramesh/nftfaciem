import React from 'react'
import EmptyHeader from './EmptyHeader'

const EmptyLayout = (props) => {
    return (
        <>
            <EmptyHeader />
            {props.children}
        </>
    )
}

export default EmptyLayout
