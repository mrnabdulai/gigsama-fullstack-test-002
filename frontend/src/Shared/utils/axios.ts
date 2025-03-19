import axios from 'axios';
import Cookies from 'js-cookie';

const BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:4000/";
//Bullet proof to make sure that token is everywhere no need to worry about token issues any
export const authHeader = () => ({
    ...(Cookies.get('token') ? { Authorization: `Bearer ${Cookies.get('token')}` } : {}),
});
const client = axios.create({
    baseURL: BASE_URL,
    headers: {
        ...authHeader(),
        'Content-Type': 'application/json',
        'Accept': 'application/json',
    },
});

class AxiosDataService {
    static get<T>(path = '', params = {},) {
        return client<T>({
            method: 'GET',
            url: path,

            params,
            headers: { ...authHeader() },
        });
    }
    static post<T>(path = '', data = {}, optionalHeader = {}) {
        return client<T>({
            method: 'POST',
            url: path,
            data,
            headers: { ...authHeader(), ...optionalHeader },
        });
    }

    static patch(path = '', data = {}) {
        return client({
            method: 'PATCH',
            url: path,
            data: JSON.stringify(data),
            headers: { ...authHeader() },
        });
    }

    static put(path = '', data = {}) {
        return client({
            method: 'PUT',
            url: path,
            data: JSON.stringify(data),
            headers: { ...authHeader() },
        });
    }
    static delete(path = '',) {
        return client({
            method: 'DELETE',
            url: path,
            headers: { ...authHeader() },
        });
    }
}


export { AxiosDataService };