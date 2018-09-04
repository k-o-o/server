const express = require('express')
const app = express()
const fs = require('fs');
const decodeUriComponent = require('decode-uri-component');

const logMode = true

var filePath = 'log/log.json';

var nielsenLogFilePath = 'log/nielsen.json';
var nielsenLogStack = []

var beaconsLogFilePath = 'log/beacons.json';
var beaconsLogStack = []

var impressionBeaconsLogFilePath = 'log/impression.json';
var impressionBeaconsLogStack = []

var comscoreLogFilePath = 'log/comscore.json';
var comscoreLogStack = []

var print = function(content, visible = false) {
	if(visible || logMode) {
		console.log(content)
	}
}

var dateMarker = function(marker = "Default") {
	return "____________________ " + Date() + " __Marker: " + marker + " _______________"
}

app.get('/comscore', function(req, res) {
	result = {}

	result["end"] = dateMarker('comScore')

	params = req._parsedUrl.query.split('&')
	params.forEach(function(param) {
		paramData = param.split("=")
		result[paramData[0]] = paramData[1]
	})

	comscoreLogStack.unshift(JSON.stringify(result))

	fs.writeFile(comscoreLogFilePath, '[' + comscoreLogStack + ']', function(err) {
	    if(err) {
	        return print(err);
	    }
	    print("The file was saved! Note: " + comscoreLogStack.length);
	});

	res.json({"Status": "OK"})
})

app.get('/nielsen', function(req, res) {
	url = 'https://sandbox-cloudapi.imrworldwide.com/nmapi/v2' + req._parsedUrl.query
	url = decodeUriComponent(url)

	result = url.split('a?b=')

	r = result[1]
	r = JSON.parse(r)
	r["end"] = dateMarker('Nielsen')

	nielsenLogStack.unshift(JSON.stringify(r))

	fs.writeFile(nielsenLogFilePath, '[' + nielsenLogStack + ']', function(err) {
	    if(err) {
	        return print(err);
	    }
		print("The file was saved! Note: " + nielsenLogStack.length + 1);
	});
})

app.get('/beacons/beacon.json', function(req, res) {
	result = {}

	result["end"] = dateMarker('Beacon')

	params = req._parsedUrl.query.split('&')
	params.forEach(function(param) {
		paramData = param.split("=")
		result[paramData[0]] = paramData[1]
	})

	beaconsLogStack.unshift(JSON.stringify(result))

	fs.writeFile(beaconsLogFilePath, '[' + beaconsLogStack + ']', function(err) {
	    if(err) {
	        return print(err);
	    }
	    print("The file was saved! Note: " + beaconsLogStack.length);
	});

	res.json({"Status": "OK"})
})

app.get('/beacons/impression.json', function(req, res) {
	result = {}

	result["end"] = dateMarker('ImpressionBeacon')

	params = req._parsedUrl.query.split('&')
	params.forEach(function(param) {
		paramData = param.split("=")
		result[paramData[0]] = paramData[1]
	})

	impressionBeaconsLogStack.unshift(JSON.stringify(result))

	fs.writeFile(impressionBeaconsLogFilePath, '[' + impressionBeaconsLogStack + ']', function(err) {
	    if(err) {
	        return print(err);
	    }
	    print("The file was saved! Note: " + impressionBeaconsLogStack.length);
	});

	res.json({"Status": "OK"})
})

app.listen(3000, () => console.log('Example app listening on port 3000!'))