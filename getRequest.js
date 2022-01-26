const fetch = require('node-fetch');
const crypto = require('crypto')

const checkResponseStatus = (res) => {
    if(res.ok){
        return res
    }
    else {
        throw new Error(`The HTTP status of the reponse: ${res.status} (${res.statusText})`)
    }
}

const getRequest = async (apiKey, secretKey, endpoint, path, parameters) => {
    const options = {headers: {}};
    let nonce = Date.now().toString();
    let parametersAndNonce = parameters + ((parameters != '') ? '&' : '') + 'timestamp=' + nonce ;
    let signature = crypto.createHmac('sha256', secretKey).update(parametersAndNonce).digest('hex');
    let snap
    message = parametersAndNonce + '&signature=' + signature;
    options.headers['X-MBX-APIKEY'] = apiKey;
    console.log(`${endpoint}${path}?${message}`);
    const makeRequest = await fetch(`${endpoint}${path}?${message}`, options)
                .then(checkResponseStatus)
                .then(response => response.json())
                .then(json => snap = json)
                .catch(err => console.log(err))
    return snap
}

module.exports = getRequest