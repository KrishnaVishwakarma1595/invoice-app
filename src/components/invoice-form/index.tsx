import React, { useState } from 'react';
import Styles from '../../styles/invoice-form.module.css';
import Input from '../input-component';
import Button from '../button-component';
import DropDownComponent from '../dropdown-component';
import { FullInvoice, Invoice, ItemCart } from '../../models/invoice-form';
import { validateEmail } from '../../services/utils';
import { API_HOST } from '../../constants/config';
import { Bounce, toast } from 'react-toastify';

const InvoiceForm = ({
    discardForm,
    save,
    invoice,
}:{
    discardForm:(a:boolean) => void,
    save: () => void,
    invoice?: FullInvoice | null
}) => {
    const [itemLists, setItemLists] = useState<ItemCart[]>(invoice?.items || []);
    const [submitted, setSubmisstion] = useState<boolean>(false);    
    const [action, setAction] = useState('');
    const [formData, setFormData] = useState<Invoice>({
        senderStreet: invoice?.senderAddress.street || '',
        senderCity: invoice?.senderAddress.city || '',
        senderPostCode: invoice?.senderAddress.postCode || '',
        senderCountry: invoice?.senderAddress.country || '',
        clientName: invoice?.clientName || '',
        clientEmail: invoice?.clientEmail || '',
        clientStreet: invoice?.clientAddress.street || '',
        clientCity: invoice?.clientAddress.city || '',
        clientPostCode: invoice?.clientAddress.postCode || '',
        clientCountry: invoice?.clientAddress.country || '',
        invoiceDate: invoice?.createdAt || '',
        description: invoice?.description || '',
        paymentTerms: invoice?.paymentTerms || 30
    })
    const [errorState, setErrorState] = useState<any>({
        senderStreet: false,
        senderCity: false,
        senderPostCode: false,
        senderCountry: false,
        clientName: false,
        clientEmail: false,
        clientStreet: false,
        clientCity: false,
        clientPostCode: false,
        clientCountry: false,
        invoiceDate: false,
        description: false,        
    })

    const allowOnlyNumbers = (evt:any) => {
        var charCode = (evt.which) ? evt.which : evt.keyCode;
        if (charCode < 48 || charCode > 57) {
            evt.preventDefault();
        }
    }

    const onItemInputChange = (e: any, label: string, index: number) => {
        const lists:any = [...itemLists];
        lists[index][label as keyof string] = e.target.value;
        if(['quantity', 'price'].includes(label)){
            lists[index]['total'] = lists[index]['quantity'] * lists[index]['price']
        }
        setItemLists([...lists]);
    }

    const onItemAdd = () => {
        const lists:ItemCart[] = [...itemLists];
        lists.push({
            name: '',
            quantity: '',
            price: '',
            total: 0.00
        })
        setItemLists([...lists]);
    }

    const onItemRemove = (listIndex: number) => {
        const lists:ItemCart[] = [...itemLists];
        lists.splice(listIndex, 1);
        console.log('lists', lists);
        setItemLists([...lists]);
    }

    const onInputChange = (e:any) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        })
        if(e.target.name === 'clientEmail'){
            setErrorState({
                ...errorState,
                [e.target.name]: validateEmail(e.target.value) ? false : true
            })
        } else{
            setErrorState({
                ...errorState,
                [e.target.name]: e.target.value ? false : true
            })
        }
    }

    const checkErrorStatus = () => {
        let isError = false;
        if(Object.values(formData).includes('') || itemLists.length === 0){
            isError = true;
        }
        setErrorState({
            ...errorState,
            senderStreet: !formData.senderStreet,
            senderCity: !formData.senderCity,
            senderPostCode: !formData.senderPostCode,
            senderCountry: !formData.senderCountry,
            clientName: !formData.clientName,
            clientEmail: !formData.clientEmail,
            clientStreet: !formData.clientStreet,
            clientCity: !formData.clientCity,
            clientPostCode: !formData.clientPostCode,
            clientCountry: !formData.clientCountry,
            invoiceDate: !formData.invoiceDate,
            description: !formData.description,    
        })
        return isError;
    }

    function generateRandomId(prefix: string, length: number): string {
        const characters = '0123456789';
        let randomPart = '';
    
        for (let i = 0; i < length; i++) {
            randomPart += characters.charAt(Math.floor(Math.random() * characters.length));
        }
    
        return `${prefix}${randomPart}`;
    }

    function getDateAfterDays(days:number, fromDate:String) {
        const resultDate:Date = new Date(fromDate.toString());
        resultDate.setDate(resultDate.getDate() + days);
        return resultDate.toISOString().split('T')[0];
    }

    const onFormSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        console.log('e',e);
        e.preventDefault();
        setSubmisstion(true);
        console.log('formData', formData);
        if(checkErrorStatus()){
            console.log('has error');            
        } else {
            console.log('has no error');    
            const dataToSubmit:any = {
                "id": invoice ? invoice.id : generateRandomId("RT", 4),
                "createdAt": formData.invoiceDate,
                "paymentDue": getDateAfterDays(formData.paymentTerms, formData.invoiceDate),
                "description": formData.description,
                "paymentTerms": formData.paymentTerms,
                "clientName": formData.clientName,
                "clientEmail": formData.clientEmail,
                "status": action,
                "senderAddress": {
                    "street": formData.senderStreet,
                    "city": formData.senderCity,
                    "postCode": formData.senderPostCode,
                    "country": formData.senderCountry
                },
                "clientAddress": {
                    "street": formData.clientStreet,
                    "city": formData.clientCity,
                    "postCode": formData.clientPostCode,
                    "country": formData.clientCountry
                },
                "items": [...itemLists],
                "total": itemLists.map((item:ItemCart) => item.total).reduce((acc:number, curr:number) => acc + curr, 0)
            }
            console.log(dataToSubmit);

            const API_ENDPOINT: String = invoice ? 'updateinvoice' : 'invoices'
            const result = await fetch(API_HOST + '/api/' + API_ENDPOINT, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(invoice ? {
                    id: invoice._id,
                    invoice: dataToSubmit
                } : dataToSubmit)
            })
            const res = await result.json();
            console.log('result res', res);
            save();
            discardForm(false);
            toast.success('Saved changes successfully!', {
                position: "top-right",
                autoClose: 2000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: false,
                progress: undefined,
                theme: "light",
                transition: Bounce,
            });
        }
    }

    return (
        <div className={Styles.invoiceFormContainer}>
            <form className={Styles.formBox} onSubmit={onFormSubmit}>
                <h3 className='fs24 lh-32 fw-700 blackColor'>
                    { invoice ? <span>
                        Edit <span style={{ color: 'var(--dark-gray)'}}>#</span>${invoice.id}
                    </span> : 'New Invoice'}
                </h3>
                <div className={Styles.billingFrom}>
                    <span className='fs15 fw-700 lh-15' style={{ color: 'var(--purple)'}}>Bill From</span>
                    <Input fieldLabel='Street Address' inputType='text' inputValue={formData.senderStreet} 
                    handleChange={onInputChange} inputName='senderStreet' hasError={errorState.senderStreet} />
                    <div className={Styles.inputGridBox}>
                        <Input fieldLabel='City' inputType='text' inputValue={formData.senderCity} 
                        handleChange={onInputChange} inputName='senderCity' 
                        hasError={errorState.senderCity} />
                        <Input fieldLabel='Post Code' inputType='text' inputValue={formData.senderPostCode} 
                        handleChange={onInputChange} inputName='senderPostCode'
                        hasError={errorState.senderPostCode} />
                        <Input fieldLabel='Country' inputType='text' inputValue={formData.senderCountry} 
                        handleChange={onInputChange} inputName='senderCountry'
                        hasError={errorState.senderCountry} />
                    </div>
                </div>
                <div className={Styles.billingTo}>
                    <span className='fs15 fw-700 lh-15' style={{ color: 'var(--purple)'}}>Bill To</span>
                    <Input fieldLabel="Client's Name" inputType='text' inputValue={formData.clientName} 
                    handleChange={onInputChange} inputName='clientName' hasError={errorState.clientName} />
                    <Input fieldLabel="Client's Email" inputType='email' fieldPlaceholder='e.g. email@example.com' 
                    inputValue={formData.clientEmail} handleChange={onInputChange} inputName='clientEmail'
                    hasError={errorState.clientEmail} />
                    <Input fieldLabel='Street Address' inputType='text' inputValue={formData.clientStreet} 
                    handleChange={onInputChange} inputName='clientStreet' hasError={errorState.clientStreet} />
                    <div className={Styles.inputGridBox}>
                        <Input fieldLabel='City' inputType='text' inputValue={formData.clientCity} 
                        handleChange={onInputChange} inputName='clientCity' hasError={errorState.clientCity} />
                        <Input fieldLabel='Post Code' inputType='text' inputValue={formData.clientPostCode} 
                        handleChange={onInputChange} inputName='clientPostCode' hasError={errorState.clientPostCode} />
                        <Input fieldLabel='Country' inputType='text' inputValue={formData.clientCountry} 
                        handleChange={onInputChange} inputName='clientCountry' hasError={errorState.clientCountry} />
                    </div>
                    <div className={Styles.inputGridBox} style={{ gridTemplateColumns: 'repeat(2, 1fr)'}}>                        
                        <Input fieldLabel='Invoice Date' inputType='date' inputCustomStyle={{ height: 49 }} 
                        inputValue={formData.invoiceDate} handleChange={onInputChange}
                        inputName='invoiceDate' hasError={errorState.invoiceDate} />
                        <DropDownComponent dropDownValue={formData.paymentTerms} onChange={(value:number) => {
                            setFormData({ ...formData, paymentTerms: value })
                        }} />
                    </div>
                    <Input fieldLabel='Project Description' inputType='text' fieldPlaceholder='e.g. Graphic Design Service' 
                    inputValue={formData.description} handleChange={onInputChange} inputName='description'
                    hasError={errorState.description} />
                </div>
                <div className={Styles.itemsListContainer}>
                    <span className='fs18 fw-700 lh-132' style={{ color: '#777F98' }}>Item List</span>
                    {/* <div className={Styles.itemGrid}>
                        <span className={Styles.itemGray}>Item Name</span>
                        <span className={Styles.itemGray}>QTY.</span>
                        <span className={Styles.itemGray}>Price</span>
                        <span className={Styles.itemGray}>Total</span>
                        <span></span>
                    </div> */}
                    <div className='d-flex flex-column' style={{ gap: 18 }}>
                        {
                            itemLists.map((item:ItemCart, index: number) => (
                                <div className={Styles.itemsContainer} key={index}>
                                    <Input inputType='text' fieldLabel='Item name' showLabel={true} inputValue={item.name} 
                                    handleChange={(e:any) => onItemInputChange(e, 'name', index)} inputName='name' 
                                    hasError={submitted && !item.name ? true : false} />
                                    <Input showLabel={true} fieldLabel='Qty.' inputType='text' inputValue={item.quantity} 
                                    handleChange={(e:any) => onItemInputChange(e, 'quantity', index)} inputName='quantity' 
                                    onKeypress={allowOnlyNumbers} hasError={submitted && !item.quantity ? true : false} />
                                    <Input showLabel={true} fieldLabel='Price' inputType='text' inputValue={item.price} 
                                    handleChange={(e:any) => onItemInputChange(e, 'price', index)} inputName='price' 
                                    onKeypress={allowOnlyNumbers} hasError={submitted && !item.price ? true : false} />
                                    <div className='d-flex flex-column' style={{gap: 9}}>
                                        <span className={`fieldLabel`}>
                                            Total
                                        </span>
                                        <span className='fs15 fw-700 d-flex justify-content-center align-items-center' 
                                        style={{ 
                                            color: 'var(--gray)', height: 49
                                        }}>
                                            { item.total.toString() }
                                        </span>
                                    </div>
                                    <div className='d-flex flex-column' style={{gap: 9}}>
                                        <span className={`fieldLabel`}>
                                            
                                        </span>
                                        <span className='d-flex justify-content-center align-items-center' 
                                        style={{ cursor: 'pointer', height: 49 }} onClick={() => onItemRemove(index)}>
                                            <img src='/icon-delete.svg' alt='' style={{ marginTop: 11 }} />
                                        </span>
                                    </div>
                                </div>
                            ))
                        }
                    </div>
                    <Button id='add-new-item' className='editButton' innerText='+ Add New Item'
                    customStyles={{ 
                        width: '100%',
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                        marginTop: 15
                    }} action={onItemAdd}
                    />
                </div>
                {
                    Object.values(errorState).includes(true) || (submitted && itemLists.length ===0) ? (
                        <div className='d-flex flex-column' style={{ marginTop: 31 }}>
                            <span className='fs10 fw-600 lh-15' style={{ color: 'var(--red)' }}>
                                - All fields must be added
                            </span>
                            <span className='fs10 fw-600 lh-15' style={{ color: 'var(--red)' }}>
                                - An item must be added
                            </span>
                        </div>
                    ) : null
                }
                <div className={`d-flex align-items-center justify-content-${invoice ? 'end' : 'between'}`} style={{ marginTop: 40, gap: 8 }}>
                    { 
                        !invoice ? (
                            <Button id='discard' className='editButton' innerText='Discard'
                            customStyles={{ 
                                width: 'auto',
                                display: 'flex',
                                justifyContent: 'center',
                                alignItems: 'center',                        
                            }} action={() => discardForm(false)}
                            />
                        ) : null
                    }
                    <div className='d-flex' style={{ gap: 8 }}>
                        {
                            Object.values(formData).filter((item:any) => item !== '').length > 2 && !invoice ? (
                                <Button type='submit' id='save-as-draft' className='editButton' innerText='Save as Draft'
                                customStyles={{ 
                                    width: 'auto',
                                    display: 'flex',
                                    justifyContent: 'center',
                                    alignItems: 'center',                        
                                }} action={() => setAction('draft')}
                                />
                            ) : null
                        }
                        { 
                            invoice ? (
                                <Button id='discard' className='editButton' innerText='Cancel'
                                customStyles={{ 
                                    width: 'auto',
                                    display: 'flex',
                                    justifyContent: 'center',
                                    alignItems: 'center',                        
                                }} action={() => discardForm(false)}
                                />
                            ) : null
                        }
                        <Button type='submit' id='save-and-send' className='buttonWithIcon fs15 lh-15 fw-700' 
                        innerText={invoice ? 'Save Changes' : 'Save & Send'}
                        customStyles={{ 
                            width: '138px',
                            height: 48,
                            display: 'flex',
                            justifyContent: 'center',
                            alignItems: 'center',    
                            padding: '0',
                            color: 'var(--white)',
                        }} action={() => setAction('pending')}
                        />
                    </div>
                </div>
            </form>
        </div>
    );
}

export default InvoiceForm;