import React from 'react';
import Button from '../button-component';

const InvoiceDelete = ({
    invoiceId = '',
    onCancel,
    onDelete
} : {
    invoiceId:string,
    onCancel: (a: boolean) => void,
    onDelete: () => void
}) => {
    return (
        <div className='modalOverlay'>
            <div className='modalBody'>
                <span className='fw-700 blackColor fs24 lh-32'>
                    Confirm Deletion
                </span>
                <p className='m-0 fw-500 fs13 lh-22' style={{ color: 'var(--dark-gray)'}}>
                    Are you sure you want to delete invoice #{invoiceId}? This action cannot be undone.
                </p>
                <div className='d-flex align-items-center justify-content-end' style={{ gap: 8 }}>
                    <Button id='discard' className='editButton' innerText='Cancel'
                    customStyles={{ 
                        width: 'auto',
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',                        
                    }} action={() => onCancel(false)}
                    />
                    <Button id='delete' innerText='Delete' className='deleteButton' action={onDelete} />
                </div>
            </div>
        </div>
    );
}

export default InvoiceDelete;