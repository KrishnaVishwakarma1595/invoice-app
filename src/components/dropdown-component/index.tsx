import React, { useState } from 'react';
import { SelectPicker, Stack } from 'rsuite';

const DropDownComponent = ({
    dropDownValue,
    onChange,
} : {
    dropDownValue: number,
    onChange:(a:number) => void
}) => {

    const [open, setOpen] = useState<boolean>(false);
    const [value, setValue] = useState<string>(`Net ${dropDownValue} Days`);

    const onSelect = (value: string) => {
        setValue(value);
        onChange(parseInt(value.split(' ')[1]));
    }

    return (
        <div className='formField'>
            <label htmlFor={`inp-payment-terms`} className='fieldLabel'>
                Payment Terms
            </label>
            <div className='formInputField' style={{
                display: 'flex',
                justifyContent:'space-between',
                alignItems: 'center',
                position:'relative',
                cursor: 'pointer'
            }} onClick={() => setOpen(!open)}>
                <span>{ value }</span>
                <span>
                    <img src='/icon-arrow-down.svg' alt='' style={open ? { rotate: '180deg' } : {}} />
                </span>
                {
                    open ? (
                        <div className='dropdownBox'>
                            <span className='custom-list-item' 
                            onClick={() => onSelect('Net 1 Day')}>Net 1 Day</span>
                            <hr style={{ borderStyle: 'solid', borderColor: 'var(--dd-hr)'}} />
                            <span className='custom-list-item' 
                            onClick={() => onSelect('Net 7 Days')}>Net 7 Days</span>
                            <hr style={{ borderStyle: 'solid', borderColor: 'var(--dd-hr)'}} />
                            <span className='custom-list-item' 
                            onClick={() => onSelect('Net 14 Days')}>Net 14 Days</span>
                            <hr style={{ borderStyle: 'solid', borderColor: 'var(--dd-hr)'}} />
                            <span className='custom-list-item' 
                            onClick={() => onSelect('Net 30 Days')}>Net 30 Days</span>
                        </div>
                    ) : null
                }
            </div>
        </div>
    );
}

export default DropDownComponent;