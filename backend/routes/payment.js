const express = require("express");
const router = express.Router();

const PaytmChecksum = require('../PaytmChecksum');
const Config = require('../config');
var https = require('https');


//Route 1: initiate transaction API
router.post('/initiate', (req, res) => {
    var paytmParams = {};

    paytmParams.body = {
        "requestType": "Payment",
        "mid": Config.MID,
        "websiteName": Config.WEBSITE,
        "orderId": req.body.orderId,
        "callbackUrl": "http://localhost:5000/api/payment/callback",
        "txnAmount": {
            "value": req.body.amount,
            "currency": "INR",
        },
        "userInfo": {
            "custId": "CUST_001",
        }
        // "enablePaymentMode": [{
        //     "mode":"UPI",
        //     "channel":["UPI","UPIPUSH"]
        // }, 
        // {
        //     "mode":"BALANCE"   
        // },
        // {
        //     "mode":"CREDIT_CARD",
        //     "channel":["VISA", "MASTER", "AMEX"]
        // }, 
        // {
        //     "mode":"DEBIT_CARD",
        //     "channel":["VISA", "MASTER", "AMEX"]
        // }]
    };

    PaytmChecksum.generateSignature(JSON.stringify(paytmParams.body), Config.MKEY).then(function (checksum) {
        paytmParams.head = {
            "signature": checksum
        };

        var post_data = JSON.stringify(paytmParams);

        var options = {

            /* for Staging */
            hostname: Config.ENV,
            port: 443,
            path: '/theia/api/v1/initiateTransaction?mid=' + Config.MID + '&orderId=' + req.body.orderId,
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Content-Length': post_data.length
            }
        };

        var response = "";
        var post_req = https.request(options, function (post_res) {
            post_res.on('data', function (chunk) {
                response += chunk;
            });

            post_res.on('end', function () {
                var obj = JSON.parse(response);
                // var data = obj.body.txnToken 
                var data = { env: Config.ENV, mid: Config.MID, amount: req.body.amount , orderid: req.body.orderId, txntoken: obj.body.txnToken }

                res.json(data);
            });
        });
        post_req.write(post_data);
        post_req.end();
    });
});

// Route 2: Update initial transaction api.
router.post('/update', (req, res) =>{
    var paytmParams = {};

    paytmParams.body = {
        "txnAmount"    : {
            "value"    : req.body.amount,
            "currency" : "INR",
        },
        "userInfo"     : {
            "custId"   : "CUST_001",
        },
    };

    /*
    * Generate checksum by parameters we have in body
    * Find your Merchant Key in your Paytm Dashboard at https://dashboard.paytm.com/next/apikeys 
    */
    PaytmChecksum.generateSignature(JSON.stringify(paytmParams.body),  Config.MKEY).then(function(checksum){

        paytmParams.head = {
            "txnToken"     : req.body.txntoken,
            "signature"    : checksum
        };
        var post_data = JSON.stringify(paytmParams);

        var options = {

            /* for Staging */
            hostname: 'securegw-stage.paytm.in',

            /* for Production */
            // hostname: 'securegw.paytm.in',

            port: 443,
            path   : '/theia/api/v1/updateTransactionDetail?mid='+ Config.MID +'&orderId='+ req.body.orderId,
            method : 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Content-Length': post_data.length
            }
        };

        var response = "";
        var post_req = https.request(options, function(post_res) {
            post_res.on('data', function (chunk) {
                response += chunk;
            });

            post_res.on('end', function(){
                console.log('Response: ', response);
            });
        });

        post_req.write(post_data);
        post_req.end();
    });
})


//Route 3: Callback
router.post('/callback', (req, res) => {
    let body = '';
    req.on('data', chunk => {
        body += chunk.toString();
    });
    req.on('end', () => {

        var postbodyjson = parse(body);
        postbodyjson = JSON.parse(JSON.stringify(postbodyjson));

        var checksum = postbodyjson.CHECKSUMHASH;
        delete postbodyjson['CHECKSUMHASH'];

        var verifyChecksum = PaytmChecksum.verifySignature(postbodyjson, Config.MKEY, checksum);
        if (verifyChecksum) {
            res.render(__dirname + '/callback.html', { verifySignature: "true", data: postbodyjson });
        }
        else {
            res.render(__dirname + '/callback.html', { verifySignature: "false", data: postbodyjson });
        }

    });

})
router.get('/txnstatus', (req, res) => {
    var paytmParams = {};
    /* body parameters */
    paytmParams.body = {
        "mid": Config.MID,
        /* Enter your order id which needs to be check status for */
        "orderId": req.body.orderId,
    };
    PaytmChecksum.generateSignature(JSON.stringify(paytmParams.body), Config.MKEY).then(function (checksum) {
        /* head parameters */
        paytmParams.head = {
            "signature": checksum
        };
        /* prepare JSON string for request */
        var post_data = JSON.stringify(paytmParams);

        var options = {
            hostname: Config.ENV,
            port: 443,
            path: '/v3/order/status',
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Content-Length': post_data.length
            }
        };
        var response = "";
        var post_req = https.request(options, function (post_res) {
            post_res.on('data', function (chunk) {
                response += chunk;
            });

            post_res.on('end', function () {
                var obj = JSON.parse(response);
                res.render(__dirname + '/txnstatus.html', { data: obj.body, msg: obj.body.resultInfo.resultMsg });
            });
        });
        post_req.write(post_data);
        post_req.end();
    });

})


module.exports = router;