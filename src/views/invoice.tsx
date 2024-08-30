import React, { useEffect, useState } from 'react';
import { Link, NavigateFunction, useNavigate, useParams } from 'react-router-dom';
import Styles from '../styles/invoice-details.module.css';
import Button from '../components/button-component';
import { FullInvoice, ItemCart } from '../models/invoice-form';
import InvoiceForm from '../components/invoice-form';
import InvoiceDelete from '../components/modals/invoice-delete';
import { API_HOST } from '../constants/config';

const Invoice = () => {
    const navigate:NavigateFunction = useNavigate();
    const [invoice, setInvoice] = useState<FullInvoice | null>(null);
    const [openForm, setFormOpen] = useState<boolean>(false);
    const [openModal, setModal] = useState<boolean>(false);
    const { invoiceId } = useParams();

    const markInvoiceAsPaid = async() => {
        // console.log('invoice', invoice);
        const result = await fetch(API_HOST + '/api/markaspaid', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ id: invoice?._id})
        });
        const res = await result.json();
        setInvoice(res.invoice);
    }
    
    const getInvoiceById = async() => {
        const result = await fetch(API_HOST + '/api/invoices/'+invoiceId);
        const res = await result.json();
        setInvoice(res.invoices[0]);
    }

    const onSave = () => {
        getInvoiceById();
    }

    const onInvoiceDelete = async() => {
        const result = await fetch(API_HOST + '/api/removeinvoice/', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ id: invoice?._id})
        });
        const res = await result.json();
        console.log(res.removed);
        setModal(false);
        navigate('/')
    }

    useEffect(() => {
        getInvoiceById();
    }, [])

    return (
        <section id='invoice-details'>
            <Link to={'/'} className={Styles.goBack}>
                <img src='/icon-arrow-left.svg' alt='' style={{ width: 8 }} />
                <span className='fs15 fw-700 blackColor' style={{ lineHeight: '15px' }}>Go back</span>
            </Link>
            <div className={Styles.invoiceDetails}>
                <div className={Styles.invoiceActions}>
                    <div className='d-flex align-items-center'>
                        <span className='fs13 fw-500 lh-15' style={{ color: 'var(--due-date)'}}>Status</span>
                        <div className={`invoiceStatus ${invoice?.status}`} style={{ margin: '0px 0px 0px 20px'}}>
                            <span></span>
                            <span>{invoice?.status || "Pending"}</span>
                        </div>
                    </div>
                    <div className={Styles.actionCTAs}>
                        {
                            invoice?.status !== 'paid' ? (
                                <Button id='edit' innerText='Edit' className='editButton' 
                                action={() => setFormOpen(true)} />
                            ): null
                        }
                        <Button id='delete' innerText='Delete' className='deleteButton' action={() => setModal(true)} />
                        {
                            invoice?.status !== 'paid' ? (
                                <Button id='mark-paid' innerText='Mark as Paid' className='buttonWithIcon' 
                                customStyles={{
                                    color: 'var(--white)',
                                    padding: '18px 24px 15px',                            
                                }} action={markInvoiceAsPaid}
                                innerTextStyles={{ fontSize: 15, color: 'var(--white)', fontWeight: 700, lineHeight: "15px" }}
                                />
                            ): null
                        }
                    </div>
                </div>
                <div className={Styles.invoiceInfo}>
                    <div className={Styles.invoiceIdnAddress}>
                        <div className={'d-flex flex-column'} style={{ gap: 7 }}>
                            <span className='fs15 fw-700 lh-24 blackColor'><span className='hashColor'>#</span>{invoice?.id || 'RT3080'}</span>
                            <span className='fs13 lh-15 fw-500' style={{ color: 'var(--due-date)'}}>{invoice?.description}</span>
                        </div>
                        <div className='d-flex flex-column align-items-end' style={{ textAlign: 'right' }}>
                            <span className='fs13 lh-18 fw-500' style={{ color: 'var(--due-date)'}}>{invoice?.senderAddress.street}</span>
                            <span className='fs13 lh-18 fw-500' style={{ color: 'var(--due-date)'}}>{invoice?.senderAddress.city} </span>
                            <span className='fs13 lh-18 fw-500' style={{ color: 'var(--due-date)'}}>{invoice?.senderAddress.postCode}</span>
                            <span className='fs13 lh-18 fw-500' style={{ color: 'var(--due-date)'}}>{invoice?.senderAddress.country}</span>
                        </div>
                    </div>
                    <div className={Styles.invoiceToDetails}>
                        <div className='d-flex flex-column' style={{ gap: 31 }}>
                            <div className='d-flex flex-column' style={{ gap: 13 }}>
                                <span className='fs13 fw-500 lh-15' style={{ color: 'var(--due-date)'}}>Invoice Date</span>
                                <span className='fs15 lh-20 fw-700 blackColor'>
                                    {
                                        new Date(invoice?.createdAt.toString() || new Date().toISOString().split('T')[0])
                                        .toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })
                                    }
                                </span>
                            </div>
                            <div className='d-flex flex-column' style={{ gap: 13 }}>
                                <span className='fs13 fw-500 lh-15' style={{ color: 'var(--due-date)'}}>Payment Due</span>
                                <span className='fs15 lh-20 fw-700 blackColor'>
                                    {
                                        new Date(invoice?.paymentDue.toString() || new Date().toISOString().split('T')[0])
                                        .toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })
                                    }
                                </span>
                            </div>
                        </div>
                        <div className='d-flex flex-column' style={{ gap: 13 }}>
                            <span className='fs13 fw-500 lh-15' style={{ color: 'var(--due-date)'}}>Bill To</span>
                            <span className='fs15 lh-20 fw-700 blackColor'>
                                {invoice?.clientName}
                            </span>
                            <div className='d-flex flex-column align-items-start' style={{ textAlign: 'left' }}>
                                <span className='fs13 lh-18 fw-500' style={{ color: 'var(--due-date)'}}>
                                    {invoice?.clientAddress.street}
                                </span>
                                <span className='fs13 lh-18 fw-500' style={{ color: 'var(--due-date)'}}>
                                    {invoice?.clientAddress.city}
                                </span>
                                <span className='fs13 lh-18 fw-500' style={{ color: 'var(--due-date)'}}>
                                    {invoice?.clientAddress.postCode}
                                </span>
                                <span className='fs13 lh-18 fw-500' style={{ color: 'var(--due-date)'}}>
                                    {invoice?.clientAddress.country}
                                </span>
                            </div>
                        </div>
                        <div className='d-flex flex-column' style={{ gap: 13 }}>
                            <span className='fs13 fw-500 lh-15' style={{ color: 'var(--due-date)'}}>Sent to</span>
                            <span className='fs15 lh-20 fw-700 blackColor'>{invoice?.clientEmail}</span>
                        </div>
                    </div>
                    <div>
                        <div className={Styles.itemsList}>
                            <div className={Styles.itemGrid}>
                                <span className={Styles.itemGray}>Item Name</span>
                                <span className={Styles.itemGray} style={{ textAlign: 'center' }}>QTY.</span>
                                <span className={Styles.itemGray} style={{ textAlign: 'right' }}>Price</span>
                                <span className={Styles.itemGray} style={{ textAlign: 'right' }}>Total</span>
                            </div>
                            {
                                invoice?.items.length && invoice.items.map((item: ItemCart, index: number) => (
                                    <div className={Styles.itemGrid} key={index}>
                                        <div className='d-flex flex-column align-items-start' style={{ gap: 8 }}>
                                            <span className={`${Styles.itemBold} blackColor`}>{item.name}</span>
                                            <span className={`${Styles.itemBold}`} style={{ color: 'var(--due-date)', textAlign: 'center' }}>
                                                {item.quantity} x £ {item.price}
                                            </span>
                                        </div>
                                        <span className={`${Styles.itemBold}`} style={{ color: 'var(--due-date)', textAlign: 'center' }}>{item.quantity}</span>
                                        <span className={`${Styles.itemBold}`} style={{ color: 'var(--due-date)', textAlign: 'right' }}>£ {item.price}</span>
                                        <span className={`${Styles.itemBold} blackColor`} style={{ textAlign: 'right' }}>£ {item.total}</span>
                                    </div>
                                ))
                            }
                        </div>
                        <div className={Styles.invoiceTotalAmount}>
                            <span className='fs13 lh-18 fw-500 whiteColor'>Amount Due</span>
                            <span className='fs24 lh-32 fw-700 whiteColor'>£ {invoice?.total}</span>
                        </div>
                    </div>
                </div>
            </div>
            {
                openForm ? 
                <InvoiceForm discardForm={() => setFormOpen(false)} save={onSave} invoice={invoice} /> : null
            }
            {
                openModal ? (
                    <InvoiceDelete onCancel={setModal} onDelete={onInvoiceDelete} invoiceId={invoiceId || ''} />
                ) : null
            }
        </section>
    );
}

export default Invoice;