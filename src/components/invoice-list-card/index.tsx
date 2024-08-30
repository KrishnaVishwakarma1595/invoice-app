import React from 'react';
import Styles from '../../styles/invoice-card.module.css';
import { Link } from 'react-router-dom';
import { FullInvoice } from '../../models/invoice-form';

const InvoiceCard = ({
    invoice
} : {
    invoice: FullInvoice
}) => {
    
    return (
        <li>
            <Link to={`invoice/${invoice.id}`} className={`${Styles.invoiceCard}`}>               
                <span className={Styles.invoiceId}>
                    <span className='hashColor'>#</span>{invoice.id}
                </span>
                <span className={Styles.invoiceDueDate}>
                    <span>Due</span> {new Date(invoice.paymentDue.toString()).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}
                </span>
                <span className={Styles.invoiceClientName}>
                    {invoice.clientName}
                </span>
                <div className='d-flex flex-column' style={{ gap: 9 }}>
                    <span className={`${Styles.invoiceMobieDueDate}`}>
                        <span>Due</span> {new Date(invoice.paymentDue.toString()).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}
                    </span>
                    <span className={Styles.invoiceTotal}>
                        £ {invoice.total}
                    </span>
                </div>
                <div className={`${Styles.invoiceToStats}`}>
                    <div className={`invoiceStatus ${invoice.status === 'paid' ? 'paid' : ''}
                    ${invoice.status === 'draft' ? 'draft' : ''} ${invoice.status === 'pending' ? 'pending' : ''}`}>
                        <span></span>
                        <span>{invoice.status}</span>
                    </div>
                    <img src='/icon-arrow-right.svg' alt='' />
                </div>
            </Link>
        </li>
    );
}

export default InvoiceCard;