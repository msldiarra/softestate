import jwt_decode from 'jwt-decode';
import request from 'reqwest';
import when from 'when';

class Auth {

    logout() {
        localStorage.removeItem('user');
    }

    login(login, password) {

        return this.handleAuth(when(request({
            url: 'http://localhost:3001/api/authenticate',
            method: 'POST',
            crossOrigin: true,
            type: 'json',
            data: {
                login: login, password: password
            }
        })));
    }

    handleAuth(loginPromise) {

        return loginPromise
            .then(function(response) {
                if(response.success) {
                    localStorage.setItem('user', JSON.stringify(jwt_decode(response.token)));
                    return true;
                }
                else { return false }
            });
    }

    getUserId() {
        return JSON.parse(localStorage.getItem('user')).id
    }


}

export default new Auth();
