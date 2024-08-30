import React from 'react';

const Button = ({
    id = 'normal',
    type = 'button',
    className,
    innerText = 'Submit',
    withIcon = false,
    iconSrc = '',
    altText = '',
    customStyles = {},
    iconStyles = {},
    iconImageStyle = {},
    innerTextStyles = {},
    action
}: {
    id: string,
    className: string,
    innerText: string,
    withIcon?: boolean,
    iconSrc?: string,
    altText?: string,
    customStyles?: any,
    iconStyles?: any,
    iconImageStyle?: any,
    innerTextStyles?: any,
    action?: any,
    type?: "button" | "submit" | "reset" | undefined
}) => {
    return (
        <button id={`btn-${id}`} type={type} className={`${className ? className : ''}`} style={{ ...customStyles }}
        onClick={action}>
            {
                withIcon ? (
                    <span style={{ ...iconStyles }}>
                        <img src={`${iconSrc}`} alt='' style={{ ...iconImageStyle }} />
                    </span>
                ) : null
            }
            <span style={{ ...innerTextStyles }}>
                { innerText }
            </span>
        </button>
    );
}

export default Button;