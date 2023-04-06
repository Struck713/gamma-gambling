import { Button } from "react-bootstrap";
import toast, { Toaster } from "react-hot-toast";

const notify = () => toast.error('hey');

const ToastTest = () => {
    return (<>
        <Button onClick={notify}>Toast!</Button>
    </>)
}

export default ToastTest;