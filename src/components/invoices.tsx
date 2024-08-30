import React, { useEffect, useRef, useState } from 'react';
import Styles from '../styles/invoice.module.css';
import Button from './button-component';
import InvoiceCard from './invoice-list-card';
import InvoiceForm from './invoice-form';
import { FullInvoice } from '../models/invoice-form';
import { API_HOST } from '../constants/config';

interface Filters{
    draft:boolean,
    pending:boolean,
    paid:boolean,
}

const Invoices = () => {
    const [allinvoices, setAllInvoices] = useState<FullInvoice[]>([]);
    const [filteredinvoices, setFilteredInvoices] = useState<FullInvoice[]>([]);
    const [openForm, setFormOpen] = useState<boolean>(false);
    const [openFilter, setOpenFilter] = useState<boolean>(false);
    const [filters, setFitlers] = useState<Filters>({
        draft:false,
        pending:false,
        paid:false,
    })
    const dropdownRef = useRef<HTMLDivElement>(null);
    
    const fetchInvoices = async () => {
        const result = await fetch(API_HOST + '/api/invoices');
        const res = await result.json();
        console.log('Res', res);
        setAllInvoices(res.invoices.reverse());    
    }

    const onSave = () => {
        fetchInvoices();
    }

    const handleClickOutside = (event: MouseEvent) => {
        if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
            setOpenFilter(false);
        }
    };

    const handleFilter = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFitlers({
            ...filters,
            [e.target.name]: e.target.checked
        });
        if(e.target.checked){
            const filterRes = [...allinvoices.filter((invoice:FullInvoice) => invoice.status === e.target.name)];
            setFilteredInvoices([
                ...filteredinvoices,
                ...filterRes
            ]);
        } else {           
            const filterRes = [...filteredinvoices.filter((invoice:FullInvoice) => invoice.status !== e.target.name)];
            setFilteredInvoices([
                ...filterRes
            ]);
        }
    }

    useEffect(() => {
        fetchInvoices();
    }, [])

    useEffect(() => {
        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);
  

    return (
        <section id='invoices'>
            <div className={`${Styles.listContainer}`}>
                <div className={`${Styles.listHeader}`}>
                    <div className='d-flex flex-column'>
                        <h1 style={{ margin: 0 }}>Invoices</h1>
                        <p>{allinvoices.length || 0} invoices</p>
                    </div>
                    <div className='d-flex align-items-center' style={{ gap: 40 }}>
                        <div ref={dropdownRef} onClick={() => setOpenFilter(true)} 
                        className='d-flex align-items-center' style={{ gap: 14, position: 'relative', cursor: 'pointer' }}>
                            <span className='fs15 fw-700 blackColor'>Filter by status</span>
                            <img src='/icon-arrow-down.svg' alt='' />
                            {
                                openFilter ? (
                                    <div className={Styles.filterInvoice}>
                                        <ul className='d-flex flex-column' style={{ padding: 0, listStyle: 'none', gap: 15 }}>
                                            <li className='d-flex align-items-center' style={{ gap: 13, position: 'relative' }}>
                                                <input onChange={handleFilter} type="checkbox" id="cb_3" name='draft' 
                                                checked={filters.draft} className="form_checkbox" />
                                                <label htmlFor="cb_3">
                                                    <span className='fs15 lh-15 fw-700 blackColor' style={{ paddingLeft: 30 }}>Draft</span>
                                                </label>
                                            </li>
                                            <li className='d-flex align-items-center' style={{ gap: 13, position: 'relative' }}>
                                                <input onChange={handleFilter} type="checkbox" id="cb_4" name='pending' 
                                                checked={filters.pending} className="form_checkbox" />
                                                <label htmlFor="cb_4">
                                                    <span className='fs15 lh-15 fw-700 blackColor' style={{ paddingLeft: 30 }}>Pending</span>
                                                </label>
                                            </li>
                                            <li className='d-flex align-items-center' style={{ gap: 13, position: 'relative' }}>
                                                <input onChange={handleFilter} type="checkbox" id="cb_5" name='paid' 
                                                checked={filters.paid} className="form_checkbox" />
                                                <label htmlFor="cb_5">
                                                    <span className='fs15 lh-15 fw-700 blackColor' style={{ paddingLeft: 30 }}>Paid</span>
                                                </label>
                                            </li>
                                        </ul>
                                    </div>
                                ) : null
                            }
                        </div>
                        <Button id='new-invoice' className='buttonWithIcon' innerText='New Invoice' 
                        withIcon={true} iconSrc='/icon-plus.svg' customStyles={{ width: 'auto' }} 
                        iconStyles={{ 
                            width: 32, 
                            height: 32, 
                            borderRadius: '50%', 
                            display:'flex', 
                            alignItems: 'center', 
                            justifyContent: 'center',
                            backgroundColor: 'var(--white)',
                            marginRight: 16
                        }}
                        iconImageStyle={{
                            width: 10, height: 10
                        }}
                        action={() => setFormOpen(true)}
                        innerTextStyles={{ fontSize: 15, color: 'var(--white)', fontWeight: 700, paddingTop: 2 }}
                        />
                    </div>
                </div>        
            </div>
            {
                filteredinvoices.length ? (
                    <ul className={Styles.invoicesLists}>
                        {
                            filteredinvoices.map((invoice:FullInvoice, index: number) => (
                                <InvoiceCard invoice={invoice} key={index} />
                            ))
                        }
                    </ul>
                ) : null 
            }
            {
                allinvoices.length && filteredinvoices.length === 0 ? (
                    <ul className={Styles.invoicesLists}>
                        {
                            allinvoices.map((invoice:FullInvoice, index: number) => (
                                <InvoiceCard invoice={invoice} key={index} />
                            ))
                        }
                    </ul>
                ) : null
            }
            {
              (allinvoices.length === 0 && filteredinvoices.length === 0) ? (
                    <div className={Styles.emptyInvoicesList}>
                        <img src='/illustration-empty.svg' alt='Empty Illustration' />
                        <h2 className='fs24 fw-700 blackColor'>There is nothing here</h2>
                        <p>
                            Create an invoice by clicking the <b>New Invoice</b> button and get started
                        </p>
                    </div>
                ) : null
            }
            {
                openForm ? 
                <InvoiceForm discardForm={() => setFormOpen(false)} save={onSave} /> : null
            }
        </section>
    );
}

export default Invoices;