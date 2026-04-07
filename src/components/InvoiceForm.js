import React, { useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import Card from 'react-bootstrap/Card';
import InvoiceItem from './InvoiceItem';
import InvoiceModal from './InvoiceModal';
import InputGroup from 'react-bootstrap/InputGroup';

const InvoiceForm = () => {
  // --- State Management ---
  const [isOpen, setIsOpen] = useState(false);
  const [items, setItems] = useState([
    { id: '0', name: '', description: '', price: '1.00', quantity: 1 }
  ]);

  const [formData, setFormData] = useState({
    currency: '$',
    currentDate: new Date().toLocaleDateString(),
    invoiceNumber: 1,
    dateOfIssue: '',
    billTo: '',
    billToEmail: '',
    billToAddress: '',
    billFrom: '',
    billFromEmail: '',
    billFromAddress: '',
    notes: '',
    taxRate: '',
    discountRate: ''
  });

  // --- Derived State (Calculations) ---
  // These automatically recalculate whenever items or rates change
  const subTotal = items.reduce((acc, item) => {
    return acc + (parseFloat(item.price || 0) * parseInt(item.quantity || 0));
  }, 0);

  const taxAmount = subTotal * (parseFloat(formData.taxRate || 0) / 100);
  const discountAmount = subTotal * (parseFloat(formData.discountRate || 0) / 100);
  const total = subTotal - discountAmount + taxAmount;

  // --- Event Handlers ---
  const handleRowDel = (itemToDelete) => {
    setItems(items.filter(item => item.id !== itemToDelete.id));
  };

  const handleAddEvent = () => {
    const id = (+new Date() + Math.floor(Math.random() * 999999)).toString(36);
    const newItem = { id, name: '', price: '1.00', description: '', quantity: 1 };
    setItems([...items, newItem]);
  };

  const onItemizedItemEdit = (evt) => {
    const { id, name, value } = evt.target;
    setItems(items.map(item => 
      item.id === id ? { ...item, [name]: value } : item
    ));
  };

  const editField = (event) => {
    const { name, value } = event.target;
    setFormData(prevData => ({ ...prevData, [name]: value }));
  };

  const onCurrencyChange = (event) => {
    setFormData(prevData => ({ ...prevData, currency: event.target.value }));
  };

  const openModal = (event) => {
    event.preventDefault();
    setIsOpen(true);
  };

  const closeModal = () => setIsOpen(false);

  return (
    <Form onSubmit={openModal}>
      <Row>
        <Col md={8} lg={9}>
          <Card className="p-4 p-xl-5 my-3 my-xl-4 shadow-sm">
            <div className="d-flex flex-row align-items-start justify-content-between mb-3">
              <div className="d-flex flex-column">
                <div className="d-flex flex-column">
                  <div className="mb-2">
                    <span className="fw-bold">Current&nbsp;Date:&nbsp;</span>
                    <span className="current-date">{formData.currentDate}</span>
                  </div>
                </div>
                <div className="d-flex flex-row align-items-center">
                  <span className="fw-bold d-block me-2">Due&nbsp;Date:</span>
                  <Form.Control 
                    type="date" 
                    value={formData.dateOfIssue} 
                    name="dateOfIssue" 
                    onChange={editField} 
                    style={{ maxWidth: '150px' }} 
                    required 
                  />
                </div>
              </div>
              <div className="d-flex flex-row align-items-center">
                <span className="fw-bold me-2">Invoice&nbsp;Number:&nbsp;</span>
                <Form.Control 
                  type="number" 
                  value={formData.invoiceNumber} 
                  name="invoiceNumber" 
                  onChange={editField} 
                  min="1" 
                  style={{ maxWidth: '70px' }} 
                  required 
                />
              </div>
            </div>
            <hr className="my-4" />
            <Row className="mb-5">
              <Col>
                <Form.Label className="fw-bold">Bill to:</Form.Label>
                <Form.Control placeholder="Who is this invoice to?" rows={3} value={formData.billTo} type="text" name="billTo" className="my-2" onChange={editField} autoComplete="name" required />
                <Form.Control placeholder="Email address" value={formData.billToEmail} type="email" name="billToEmail" className="my-2" onChange={editField} autoComplete="email" required />
                <Form.Control placeholder="Billing address" value={formData.billToAddress} type="text" name="billToAddress" className="my-2" autoComplete="address" onChange={editField} required />
              </Col>
              <Col>
                <Form.Label className="fw-bold">Bill from:</Form.Label>
                <Form.Control placeholder="Who is this invoice from?" rows={3} value={formData.billFrom} type="text" name="billFrom" className="my-2" onChange={editField} autoComplete="name" required />
                <Form.Control placeholder="Email address" value={formData.billFromEmail} type="email" name="billFromEmail" className="my-2" onChange={editField} autoComplete="email" required />
                <Form.Control placeholder="Billing address" value={formData.billFromAddress} type="text" name="billFromAddress" className="my-2" autoComplete="address" onChange={editField} required />
              </Col>
            </Row>
            <InvoiceItem 
              onItemizedItemEdit={onItemizedItemEdit} 
              onRowAdd={handleAddEvent} 
              onRowDel={handleRowDel} 
              currency={formData.currency} 
              items={items} 
            />
            <Row className="mt-4 justify-content-end">
              <Col lg={6}>
                <div className="d-flex flex-row align-items-start justify-content-between">
                  <span className="fw-bold">Subtotal:</span>
                  <span>{formData.currency}{subTotal.toFixed(2)}</span>
                </div>
                <div className="d-flex flex-row align-items-start justify-content-between mt-2">
                  <span className="fw-bold">Discount:</span>
                  <span>
                    <span className="small text-muted me-1">({formData.discountRate || 0}%)</span>
                    {formData.currency}{discountAmount.toFixed(2)}
                  </span>
                </div>
                <div className="d-flex flex-row align-items-start justify-content-between mt-2">
                  <span className="fw-bold">Tax:</span>
                  <span>
                    <span className="small text-muted me-1">({formData.taxRate || 0}%)</span>
                    {formData.currency}{taxAmount.toFixed(2)}
                  </span>
                </div>
                <hr />
                <div className="d-flex flex-row align-items-start justify-content-between" style={{ fontSize: '1.125rem' }}>
                  <span className="fw-bold">Total:</span>
                  <span className="fw-bold text-primary">{formData.currency}{total.toFixed(2)}</span>
                </div>
              </Col>
            </Row>
            <hr className="my-4" />
            <Form.Label className="fw-bold">Notes:</Form.Label>
            <Form.Control 
              placeholder="Thanks for your business!" 
              name="notes" 
              value={formData.notes} 
              onChange={editField} 
              as="textarea" 
              className="my-2" 
              rows={2} 
            />
          </Card>
        </Col>
        <Col md={4} lg={3}>
          <div className="sticky-top pt-md-3 pt-xl-4">
            <Button variant="primary" type="submit" className="d-block w-100 mb-3 fw-bold">
              Review Invoice
            </Button>
            
            {/* Modal Info Object combines formData and calculated totals */}
            <InvoiceModal 
              showModal={isOpen} 
              closeModal={closeModal} 
              info={{ ...formData, subTotal, taxAmmount: taxAmount, discountAmmount: discountAmount, total }} 
              items={items} 
              currency={formData.currency} 
              subTotal={subTotal.toFixed(2)} 
              taxAmmount={taxAmount.toFixed(2)} 
              discountAmmount={discountAmount.toFixed(2)} 
              total={total.toFixed(2)} 
            />
            
            <Form.Group className="mb-3">
              <Form.Label className="fw-bold">Currency:</Form.Label>
              <Form.Select 
                onChange={onCurrencyChange} 
                className="btn btn-light my-1" 
                aria-label="Change Currency"
                value={formData.currency}
              >
                <option value="$">USD (United States Dollar)</option>
                <option value="£">GBP (British Pound Sterling)</option>
                <option value="¥">JPY (Japanese Yen)</option>
                <option value="$">CAD (Canadian Dollar)</option>
                <option value="$">AUD (Australian Dollar)</option>
                <option value="$">SGD (Singapore Dollar)</option>
                <option value="¥">CNY (Chinese Renminbi)</option>
                <option value="₿">BTC (Bitcoin)</option>
              </Form.Select>
            </Form.Group>
            <Form.Group className="my-3">
              <Form.Label className="fw-bold">Tax rate:</Form.Label>
              <InputGroup className="my-1 flex-nowrap">
                <Form.Control 
                  name="taxRate" 
                  type="number" 
                  value={formData.taxRate} 
                  onChange={editField} 
                  className="bg-white border" 
                  placeholder="0.0" 
                  min="0.00" 
                  step="0.01" 
                  max="100.00" 
                />
                <InputGroup.Text className="bg-light fw-bold text-secondary small">
                  %
                </InputGroup.Text>
              </InputGroup>
            </Form.Group>
            <Form.Group className="my-3">
              <Form.Label className="fw-bold">Discount rate:</Form.Label>
              <InputGroup className="my-1 flex-nowrap">
                <Form.Control 
                  name="discountRate" 
                  type="number" 
                  value={formData.discountRate} 
                  onChange={editField} 
                  className="bg-white border" 
                  placeholder="0.0" 
                  min="0.00" 
                  step="0.01" 
                  max="100.00" 
                />
                <InputGroup.Text className="bg-light fw-bold text-secondary small">
                  %
                </InputGroup.Text>
              </InputGroup>
            </Form.Group>
          </div>
        </Col>
      </Row>
    </Form>
  );
};

export default InvoiceForm;