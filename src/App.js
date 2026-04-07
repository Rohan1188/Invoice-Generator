import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';
import Container from 'react-bootstrap/Container';
import Navbar from 'react-bootstrap/Navbar';
import InvoiceForm from './components/InvoiceForm';

const App = () => {
  return (
    // min-vh-100 ensures the app takes full screen height, pushing the footer to the bottom
    // bg-light gives a soft gray background so the white invoice cards pop out
    <div className="App d-flex flex-column min-vh-100 bg-light">
      
      {/* Professional Navbar Header */}
      <Navbar bg="dark" variant="dark" expand="lg" className="shadow-sm mb-4">
        <Container>
          <Navbar.Brand className="fw-bold fs-4 d-flex align-items-center">
            <span className="me-2">🧾</span> Pro Invoice Generator
          </Navbar.Brand>
        </Container>
      </Navbar>

      {/* Main Invoice Content */}
      <Container className="flex-grow-1">
        <InvoiceForm />
      </Container>

      {/* Professional Footer */}
      <footer className="mt-auto py-3 bg-dark text-white-50 text-center shadow-lg">
        <Container>
          <small className="fw-bold">
            &copy; {new Date().getFullYear()} Pro Invoice. All rights reserved.
          </small>
        </Container>
      </footer>
      
    </div>
  );
};

export default App;