interface Address {
  street: string
  city: string
  state: string
  postalcode: string
  country: string
}

const apiUrl = 'https://nominatim.openstreetmap.org/search'

export const searchAddress = async (address: string): Promise<Address | null> => {
  const url = `${apiUrl}?format=json&q=${encodeURIComponent(address)}&addressdetails=1`

  const response = await fetch(url)

  if (!response.ok) throw new Error('Error searching address')

  const results = await response.json()

  if (results.length > 0) {
    const addressDetails = results[0].address
    return {
      street: addressDetails.street || null,
      city: addressDetails.city || null,
      state: addressDetails.state || null,
      postalcode: addressDetails.postalcode || null,
      country: addressDetails.country || null,
    }
  } else {
    throw new Error('No results found')
  }
}
