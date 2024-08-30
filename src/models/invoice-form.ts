export interface FullInvoice{       
    _id: String,
    id: String,
    createdAt: String,
    paymentDue: String,
    description: String,
    paymentTerms: number 
    clientName: String,
    clientEmail: String,
    senderAddress: {
        street: String,
        city: String,
        postCode: String,
        country: String,
    },
    clientAddress: {
        street: String,
        city: String,
        postCode: String,
        country: String,
    },
    items: ItemCart[],
    status: String,
    total: number   
}

export interface Invoice{        
    senderStreet: String,
    senderCity: String,
    senderPostCode: String,
    senderCountry: String,
    clientName: String,
    clientEmail: String,
    clientStreet: String,
    clientCity: String,
    clientPostCode: String,
    clientCountry: String,
    invoiceDate: String,
    description: String,
    paymentTerms: number    
}

export interface ItemCart{
    name: String,
    quantity: String,
    price: String,
    total: number
}