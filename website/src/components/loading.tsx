import { useState } from "react"
import { Button, Spinner } from "react-bootstrap"

export const LoadingSpinner = () => <Spinner size="sm" role="status" variant="light"></Spinner>;
export const PageLoadingSpinner = () => <div className="jumbotron"><Spinner size="lg" role="status" variant="light"></Spinner></div>;