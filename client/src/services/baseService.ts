type ApiSuccess<T> = T
type ApiValidationError = { message?: string; detail?: string | { [key: string]: unknown } }
type ApiResult<T> = ApiSuccess<T>

export async function handleApiResponse<T>(response: Response): Promise<ApiResult<T>> {
  const contentType = response.headers.get('Content-Type') || ''

  // success
  if (response.ok) {
    if (contentType.includes('application/json')) {
      return response.json()
    }
    return {} as T
  }

  // validation
  let errorMessage = `Error ${response.status}: ${response.statusText}`

  if (contentType.includes('application/json')) {
    const errorBody: ApiValidationError = await response.json().catch(() => ({}))

    if (typeof errorBody.detail === 'string') {
      throw new Error(errorBody.detail)
    } else if (typeof errorBody.message === 'string') {
      throw new Error(errorBody.message)
    }
  }

  // raw eror
  throw new Error(errorMessage)
}
