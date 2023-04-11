import { useState } from "react"
import { Button, Spinner } from "react-bootstrap"

export const LoadingSpinner = () => {

    const [triggered, setTriggered] = useState(false);

    return <Spinner size="sm" role="status" variant="light"></Spinner>;
}