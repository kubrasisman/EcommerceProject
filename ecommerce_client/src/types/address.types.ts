export interface Address {
  id: number
  owner: {
    id: number
    firstName: string
    lastName: string
    email: string
  }
  addressTitle: string
  street: string
  city: string
  country: string
  postalCode: string
  phoneNumber: string
}

export interface CreateAddressDto {
  owner?: number
  addressTitle: string
  street: string
  city: string
  country: string
  postalCode: string
  phoneNumber: string
}

