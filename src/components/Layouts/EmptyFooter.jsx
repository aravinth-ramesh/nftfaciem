import React from 'react'
import { Container, Row, Col, Form, InputGroup, FormControl, Button } from 'react-bootstrap'

const EmptyFooter = () => {
    return (
        <>
            <div className="footer-sec">
                <Container>
                    <Row className="align-items-center">
                        <Col md={12}>
                            <div className="footer-logo">
                                {/* <img src="" alt="" /> */}
                                <p className='text-center mb-0'>All Rights Reserved</p>
                            </div>
                        </Col>
                        {/* <Col md={6}>
                            <div className="footer-content">
                                <ul className="list-unstyled">
                                    <li>Terms Of Service</li>
                                <li>Privacy Policy</li>
                                    <li>Contact</li>
                                </ul>
                            </div>
                        </Col> */}
                        {/* <Col md={4}>
                            <Form>
                                <InputGroup className="subcribe-form">
                                    <FormControl

                                        aria-describedby="basic-addon2"
                                    />
                                    <Button className="sub-btn" id="button-addon2">
                                        Subscribe
                                    </Button>
                                </InputGroup>

                            </Form>
                        </Col> */}
                    </Row>
                </Container>
            </div>

        </>
    )
}

export default EmptyFooter
