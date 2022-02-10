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

const postRequest = async (apiKey, secretKey, endpoint, path, parameters) => {
    
    let nonce = Date.now().toString();
    let parametersAndNonce = parameters + ((parameters != '') ? '&' : '') + 'timestamp=' + nonce ;
    let signature = crypto.createHmac('sha256', secretKey).update(parametersAndNonce).digest('hex');
    let jsonResponse
    message = parametersAndNonce + '&signature=' + signature;
    console.log(typeof message);
    const options = {
        method: 'post',
        headers: {},
        body: message
    };
    
    options.headers['X-MBX-APIKEY'] = apiKey;
    console.log('options: ',options);
    console.log(`${endpoint}${path}`);
    const makeRequest = await fetch(`${endpoint}${path}`, options)
                .then(checkResponseStatus)
                .then(response => response.json())
                .then(json => jsonResponse = json)
                .catch(err => console.log(err))
    return jsonResponse
}

module.exports = postRequest