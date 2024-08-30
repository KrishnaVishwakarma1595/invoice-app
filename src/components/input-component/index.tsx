import React from 'react';

const Input = ({    
    inputType = 'text',
    fieldLabel = '',
    inputName = '',
    fieldPlaceholder = '',
    inputCustomStyle = {},
    customClass = '',
    showLabel = true,
    inputValue = '',
    handleChange,
    onKeypress,
    hasError,
} : {    
    inputType: string,
    fieldLabel?: string,
    inputName: string,
    fieldPlaceholder?: string,
    inputCustomStyle?: any,
    customClass?: string,
    showLabel?: boolean,
    inputValue: any,
    handleChange: any,
    onKeypress?: any
    hasError?: boolean,
}) => {
    return (
        <div className='formField'>
            {
                showLabel ? (
                    <label htmlFor={`inp-${fieldLabel.toLowerCase().split(' ').join("-")}`} 
                    className={`fieldLabel ${hasError ? 'labelErr' : ''}`}>
                        {fieldLabel}
                    </label>
                ) : null
            }
            <input type={inputType} id={`inp-${fieldLabel.toLowerCase().split(' ').join("-")}`} 
            className={`formInputField ${customClass ?? ''} ${hasError ? 'fieldErr' : ''}`}
            name={inputName} 
            placeholder={fieldPlaceholder} 
            style={{ ...inputCustomStyle }}
            value={inputValue}
            onChange={handleChange}
            onKeyPress={onKeypress}
            min={inputType === 'date' ? new Date().toISOString().split("T")[0]: undefined}
            />
        </div>
    );
}

export default Input;