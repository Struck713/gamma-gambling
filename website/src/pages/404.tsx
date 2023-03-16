import { Alert } from 'react-bootstrap';

const Error = () => {
  return (
    <>
      <div style={{ margin: '1rem' }}>
        <Alert key="warning" variant="danger">
          Ummm... it&apos;s telling me this page doesn&apos;t exist..?
        </Alert>
      </div>
    </>
  )
}

export default Error;
