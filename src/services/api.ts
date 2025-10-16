export async function fetchData<T>(
    url: string,
    method: string = "GET",
    token?: string | null,
    body?: unknown
): Promise<T> {
    const API_URL = process.env.NEXT_PUBLIC_API_URL;

    const headers: HeadersInit = {
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
    }

    const options: RequestInit = {
        method,
        headers,
        ...(body ? { body: JSON.stringify(body), headers: {...headers, 'Content-Type':'application/json'} } : {})
    }

    const response = await fetch(`${API_URL}${url}`, options);
    
    // Verificar se a resposta foi bem-sucedida
    if (!response.ok) {
        const errorData = await response.json().catch(() => ({ message: 'Erro desconhecido' }));
        throw new Error(errorData.message || `Erro ${response.status}: ${response.statusText}`);
    }
    
    const json = await response.json();
    return json;
}