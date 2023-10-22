import axios from 'axios'

export default axios({
    baseURL: 'http://localhost:5000/graphql',
    headers: {
        Authorization: 'Bearer ' + localStorage.getItem('token')
    }
})