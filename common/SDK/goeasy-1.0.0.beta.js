// [AIV_SHORT]  Build version: 0.19.22 - Thursday, August 29th, 2019, 10:59:01 AM  
 (function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory();
	else if(typeof define === 'function' && define.amd)
		define([], factory);
	else if(typeof exports === 'object')
		exports["GoEasy"] = factory();
	else
		root["GoEasy"] = factory();
})(this, function() {
return /******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;
/******/
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports, __webpack_require__) {

	"use strict";
	
	var io = __webpack_require__(1);
	var uuidv1 = __webpack_require__(35);
	var cfg = __webpack_require__(38);
	
	var goEasy_logs = [];
	var goEasy_debug = false;
	
	var log = function log(content) {
	    if (goEasy_debug) {
	        var logDate = new Date().formatDate("yy-MM-dd hh:mm:ss.S");
	        goEasy_logs.push(logDate + " " + content + "\n");
	    }
	};
	
	var GoEasyDomainNumber = function GoEasyDomainNumber() {
	    this.currentNumber = this.initialCurrentNumber();
	};
	GoEasyDomainNumber.prototype = {
	    maxNumber: cfg.maxNumber,
	    number: function number() {
	        return this.currentNumber;
	    },
	    initialCurrentNumber: function initialCurrentNumber() {
	        var s = this;
	        if (isReactNative() || isWx()) {
	            if (!s.currentNumber) s.currentNumber = randomNumber(1, cfg.maxNumber);
	        } else {
	            s.currentNumber = parseInt(getData("goeasyNode"));
	        }
	
	        if (s.currentNumber > 0 && s.currentNumber < this.maxNumber) {
	            s.currentNumber = s.currentNumber + 1;
	        } else if (s.currentNumber == this.maxNumber) {
	            s.currentNumber = 1;
	        } else {
	            s.currentNumber = Math.floor(Math.random() * this.maxNumber + 1);
	        }
	
	        if (!isReactNative() && !isWx()) {
	            setData("goeasyNode", s.currentNumber);
	        }
	        return s.currentNumber;
	    }
	};
	
	var getCookie = function getCookie(name) {
	    var arr,
	        reg = new RegExp("(^| )" + name + "=([^;]*)(;|$)");
	    if (arr = document.cookie.match(reg)) return unescape(arr[2]);else return null;
	};
	
	var getData = function getData(name) {
	    if (window.localStorage) {
	        return window.localStorage.getItem(name);
	    } else {
	        return getCookie(name);
	    }
	};
	
	var setCookie = function setCookie(name, value) {
	    var Days = 30;
	    var exp = new Date();
	    exp.setTime(exp.getTime() + Days * 24 * 60 * 60 * 1000);
	    document.cookie = name + "=" + escape(value) + ";expires=" + exp.toGMTString();
	};
	
	var setData = function setData(name, value) {
	    if (window.localStorage) {
	        window.localStorage.setItem(name, value);
	    } else {
	        setCookie(name, value);
	    }
	};
	
	var GoEasyArray = function GoEasyArray() {
	    Array.apply(this);
	};
	
	var randomNumber = function randomNumber(m, n) {
	    return Math.floor(Math.random() * (m - n) + n);
	};
	
	var isWx = function isWx() {
	    // var iswx = /MicroMessenger/i.test(navigator.userAgent);
	    // var dev = navigator.userAgent.indexOf('wechatdevtools');
	    // if( (typeof wx !== 'undefined' && iswx) || (typeof wx !== 'undefined' && dev > -1)) return true;
	    // else return false;
	
	    if (typeof wx !== 'undefined' && wx.getLocation) return true;else return false;
	};
	
	var isReactNative = function isReactNative() {
	    if (typeof navigator != 'undefined' && navigator.product == 'ReactNative') {
	        return true;
	    } else return false;
	};
	
	var goEasyDomainNumber = new GoEasyDomainNumber();
	var GoEasy = function GoEasy(config) {
	    log("GoEasy() Create GoEasy object:" + JSON.stringify(config));
	    if (this._isEmpty(config.appkey)) {
	        if (typeof config.onConnectFailed !== "undefined") {
	            config.onConnectFailed({ code: 400, content: 'appkey is required' });
	        }
	        return;
	    }
	    this._copyConfig(config);
	
	    if (typeof config.host === "undefined") {
	        config.onConnectFailed({ code: 400, content: 'host is required' });
	        return;
	    }
	
	    var host = '://' + goEasyDomainNumber.number() + config.host;
	    var fullUri = "";
	    if (isWx() || isReactNative()) {
	        if (isWx()) {
	            // 如果是微信小程序就只能走https
	            fullUri = 'https://wx-' + config.host + ':443';
	        } else {
	            // 如果是react-native 可以走http和https两种
	            if (config.forceTLS) fullUri = 'https' + host + ':443';else fullUri = 'http' + host + ':80';
	        }
	        this.socket = io(fullUri, { transports: ['websocket'] });
	    } else {
	        if (config.forceTLS) {
	            fullUri = 'https' + host + ':443';
	        } else {
	            fullUri = 'http' + host + ':80';
	        }
	        this.socket = io.connect(fullUri);
	    }
	    this._callbackEvents(config);
	};
	GoEasy.goEasyDomainNumber = goEasyDomainNumber;
	GoEasy.isWx = isWx;
	if (isWx()) wx._GoEasy_ = GoEasy;else window._GoEasy_ = GoEasy;
	
	Date.prototype.formatDate = function (fmt) {
	    var o = {
	        "M+": this.getMonth() + 1,
	        "d+": this.getDate(),
	        "h+": this.getHours(),
	        "m+": this.getMinutes(),
	        "s+": this.getSeconds(),
	        "q+": Math.floor((this.getMonth() + 3) / 3),
	        "S": this.getMilliseconds()
	    };
	    if (/(y+)/.test(fmt)) fmt = fmt.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
	    for (var k in o) {
	        if (o.hasOwnProperty(k)) {
	            if (new RegExp("(" + k + ")").test(fmt)) fmt = fmt.replace(RegExp.$1, RegExp.$1.length == 1 ? o[k] : ("00" + o[k]).substr(("" + o[k]).length));
	        }
	    }return fmt;
	};
	
	GoEasyArray.prototype = new Array();
	GoEasyArray.prototype.indexOfGuid = function (val) {
	    for (var i = 0; i < this.length; i++) {
	        if (this[i] == val) return i;
	    }
	    return -1;
	};
	
	GoEasyArray.prototype.unshiftGuid = function (guid) {
	    var contain = false;
	    var index = this.indexOfGuid(guid);
	    if (index > -1) {
	        contain = true;
	        this.splice(index, 1);
	    }
	    this.unshift(guid);
	    while (this.length > 300) {
	        this.pop();
	    }
	    return contain;
	};
	
	GoEasy.prototype = {
	    debug: false,
	    socket: null,
	    authorizeResult: null,
	    channels: [],
	    networkStatus: 'initial', //initial, connected, disconnected
	    subscribeBuffer: [],
	    maxRetries: 3,
	    _manualConnect: false,
	    _manualDisconnectStatus: 'initial', //initial, disconnecting, disconnected
	    authorizeStatus: 'initial', //initial, authorizing, authorized
	    receivedGuids: new GoEasyArray(),
	    _copyConfig: function _copyConfig(origConfig) {
	        this._appkey = origConfig.appkey;
	        this._otp = origConfig.otp;
	
	        if (this._isEmpty(origConfig.userId)) {
	            this._userId = "anonymous-" + Math.floor(Math.random() * 100000 + 1);
	            origConfig.userId = this._userId;
	        } else {
	            this._userId = this._trim(origConfig.userId);
	        }
	
	        if (this._isEmpty(origConfig.username)) {
	            this._username = "";
	            origConfig.username = "";
	        } else {
	            this._username = this._trim(origConfig.username);
	        }
	        if (this._isEmpty(origConfig.userData)) {
	            this._userData = "";
	        } else {
	            this._userData = this._trim(origConfig.userData);
	        }
	        if (origConfig.debug == true) {
	            this.debug = true;
	        }
	    },
	    subscribe: function subscribe(subscription) {
	        log("subscribe() subscribe:" + JSON.stringify(subscription));
	        if (this._isEmpty(subscription.channel)) {
	            log("subscribe() 'channel' is required.");
	            if (typeof subscription.onFailed !== "undefined") {
	                subscription.onFailed({ code: 400, content: 'channel is required' });
	            }
	            return;
	        }
	        this.subscribeBuffer[subscription.channel] = subscription;
	        log("subscribe() add subscription into subscribeBuffer:" + JSON.stringify(this.subscribeBuffer[subscription.channel]));
	        var self = this;
	        if (self.authorizeResult != null && self.networkStatus == "connected") {
	            subscription.checking = true;
	            self.doSubscribeAndCheckAck(subscription);
	        }
	    },
	    doSubscribe: function doSubscribe(subscription) {
	        log("doSubscribe() with subscription:" + JSON.stringify(subscription));
	        var self = this;
	        if (self.authorizeResult.code == 200) {
	
	            if (this._isEmpty(subscription.channel)) {
	                log("doSubscribe() subscribe failed with empty channel");
	                self.sendlogs();
	                subscription.finish = true;
	            } else {
	                var params = { channel: subscription.channel, sid: self.authorizeResult.sid };
	                log("doSubscribe() emit subscribe params:" + JSON.stringify(params));
	                self.socket.emit('subscribe', params, function (subscribeAckData) {
	                    log("doSubscribe() receive subscribe ack:" + JSON.stringify(subscribeAckData));
	                    if (subscription.finish != true) {
	                        //ignore later ack if multiple ack back
	                        subscription.finish = true;
	                        delete self.subscribeBuffer[subscription.channel];
	                        log("doSubscribe() delete subscription from subscribeBuffer:" + JSON.stringify(subscription));
	                        if (subscribeAckData.resultCode == 200) {
	                            self.channels[subscription.channel] = subscription;
	                            if (typeof subscription.onSuccess !== "undefined") {
	                                subscription.onSuccess();
	                            }
	                        } else {
	                            if (typeof subscription.onFailed !== "undefined") {
	                                subscription.onFailed({ code: subscribeAckData.resultCode, content: subscribeAckData.content });
	                            }
	                        }
	                    }
	                });
	            }
	        } else {
	            log("doSubscribe() return with authorize code:" + self.authorizeResult.code);
	        }
	    },
	    doSubscribeAndCheckAck: function doSubscribeAndCheckAck(subscription) {
	        log("doSubscribeAndCheckAck():" + JSON.stringify(subscription));
	        subscription.finish = false;
	        var self = this;
	        self.doSubscribe(subscription);
	        var checkSubscribeAck = setInterval(function () {
	            if (!subscription.finish && self.networkStatus == 'connected') {
	                log("doSubscribeAndCheckAck() retry doSubscribe:" + JSON.stringify(subscription));
	                self.doSubscribe(subscription);
	            } else {
	                log("doSubscribeAndCheckAck() clean doSubscribeAndCheckAck:" + JSON.stringify(subscription));
	                subscription.checking = false;
	                clearInterval(checkSubscribeAck);
	            }
	        }, 1300);
	    },
	    subscribePresence: function subscribePresence(subscription) {
	        if (this._isEmpty(subscription.channel)) {
	            if (typeof subscription.onFailed !== "undefined") {
	                subscription.onFailed({ code: 400, content: 'channel is required' });
	            }
	            return;
	        }
	        subscription.channel = subscription.channel + "_presence";
	        this.subscribe(subscription);
	    },
	    unsubscribe: function unsubscribe(unsubscription) {
	        if (this._isEmpty(unsubscription.channel)) {
	            this.log("'channel' is required.");
	            if (typeof unsubscription.onFailed !== "undefined") {
	                unsubscription.onFailed({ code: 400, content: 'channel is required' });
	            }
	            return;
	        }
	        if (typeof this.channels[unsubscription.channel] == "undefined") {
	            this.log("'channel' is not subscribed.");
	            if (typeof unsubscription.onFailed !== "undefined") {
	                unsubscription.onFailed({ code: 400, content: 'channel[' + unsubscription.channel + '] is not subscribed' });
	            }
	            return;
	        }
	        var self = this;
	        var finishUnsubscribe = false;
	        var retried = 0;
	        function doUnsubscribe() {
	            if (self.authorizeResult.code == 200) {
	                self.socket.emit('unsubscribe', { sid: self.authorizeResult.sid, channel: unsubscription.channel }, function (unsubscribeAckData) {
	                    finishUnsubscribe = true;
	                    if (unsubscribeAckData.resultCode == 200) {
	                        delete self.channels[unsubscription.channel];
	                        log("doUnsubscribe() delete from channels:" + JSON.stringify(unsubscription));
	                        if (typeof unsubscription.onSuccess !== "undefined") {
	                            unsubscription.onSuccess();
	                        }
	                    } else {
	                        if (typeof unsubscription.onFailed !== "undefined") {
	                            unsubscription.onFailed({ code: unsubscribeAckData.resultCode, content: unsubscribeAckData.content });
	                        }
	                    }
	                });
	            } else {
	                finishUnsubscribe = true;
	                if (typeof unsubscription.onFailed !== "undefined") {
	                    unsubscription.onFailed({ code: self.authorizeResult.code, content: self.authorizeResult.content });
	                }
	            }
	        }
	
	        function doUnsubscribeAndCheckAck() {
	            doUnsubscribe();
	            var checkUnsubscribeAck = setInterval(function () {
	                if (!finishUnsubscribe && self.networkStatus == "connected" && retried < 0) {
	                    retried++;
	                    doUnsubscribe();
	                } else if (retried == self.maxRetries) {
	                    clearInterval(checkUnsubscribeAck);
	                    if (typeof unsubscription.onFailed !== "undefined") {
	                        unsubscription.onFailed({ code: 408, content: "Server unreachable or timeout" });
	                    }
	                } else {
	                    clearInterval(checkUnsubscribeAck);
	                }
	            }, 1000);
	        }
	
	        if (this.authorizeResult != null && self.networkStatus == "connected") {
	            doUnsubscribeAndCheckAck();
	        } else {
	            var checkAuthorizeResult = setInterval(function () {
	                if (self.authorizeResult != null && self.networkStatus == "connected") {
	                    clearInterval(checkAuthorizeResult);
	                    doUnsubscribeAndCheckAck();
	                } else {
	                    retried++;
	                    if (retried == self.maxRetries) {
	                        clearInterval(checkAuthorizeResult);
	                        if (typeof unsubscription.onFailed !== "undefined") {
	                            unsubscription.onFailed({ code: 408, content: "Server unreachable or timeout" });
	                        }
	                    }
	                }
	            }, 1000);
	        }
	    },
	    unsubscribePresence: function unsubscribePresence(unsubscription) {
	        if (this._isEmpty(unsubscription.channel)) {
	            if (typeof unsubscription.onFailed !== "undefined") {
	                unsubscription.onFailed({ code: 400, content: 'channel is required' });
	            }
	            return;
	        }
	        unsubscription.channel = unsubscription.channel + "_presence";
	        this.unsubscribe(unsubscription);
	    },
	    publish: function publish(_publish) {
	        if (this._isEmpty(_publish.channel)) {
	            this.log("'channel' is required.");
	            if (typeof _publish.onFailed !== "undefined") {
	                _publish.onFailed({ code: 400, content: 'channel is required' });
	            }
	            return;
	        }
	        if (this._isEmpty(_publish.message)) {
	            this.log("'message' is required.");
	            if (typeof _publish.onFailed !== "undefined") {
	                _publish.onFailed({ code: 400, content: 'message is required' });
	            }
	            return;
	        }
	        var self = this;
	        var finishedPublish = false;
	        var retried = 0;
	        function doPublish(publishGuid) {
	            if (self.authorizeResult.code == 200) {
	                self.socket.emit('publish', { sid: self.authorizeResult.sid, channel: _publish.channel, content: _publish.message, guid: publishGuid, retried: retried }, function (publishAckData) {
	                    finishedPublish = true;
	                    if (publishAckData.resultCode == 200) {
	                        if (typeof _publish.onSuccess !== "undefined") {
	                            _publish.onSuccess();
	                        }
	                    } else {
	                        if (typeof _publish.onFailed !== "undefined") {
	                            _publish.onFailed({ code: publishAckData.resultCode, content: publishAckData.content });
	                        }
	                    }
	                });
	            } else {
	                finishedPublish = true;
	                if (typeof _publish.onFailed !== "undefined") {
	                    _publish.onFailed({ code: self.authorizeResult.code, content: self.authorizeResult.content });
	                }
	            }
	        }
	
	        function doPublishAndCheckAck() {
	            var publishGuid = self.uuid_goeasy();
	            doPublish(publishGuid);
	            var checkPublishAck = setInterval(function () {
	                if (!finishedPublish && retried < self.maxRetries) {
	                    retried++;
	                    doPublish(publishGuid);
	                } else if (retried == self.maxRetries) {
	                    clearInterval(checkPublishAck);
	                    if (typeof _publish.onFailed !== "undefined") {
	                        _publish.onFailed({ code: 408, content: "Server unreachable or timeout" });
	                    }
	                } else {
	                    clearInterval(checkPublishAck);
	                }
	            }, 1000);
	        }
	
	        if (this.authorizeResult != null && self.networkStatus == "connected") {
	            doPublishAndCheckAck();
	        } else {
	            var checkAuthorizeResultAndNetworkStatus = setInterval(function () {
	                if (self.authorizeResult != null && self.networkStatus == "connected") {
	                    clearInterval(checkAuthorizeResultAndNetworkStatus);
	                    doPublishAndCheckAck();
	                } else {
	                    retried++;
	                    if (retried == self.maxRetries) {
	                        clearInterval(checkAuthorizeResultAndNetworkStatus);
	                        if (typeof _publish.onFailed !== "undefined") {
	                            _publish.onFailed({ code: 408, content: "Server unreachable or timeout" });
	                        }
	                    }
	                }
	            }, 1000);
	        }
	    },
	    hereNow: function hereNow(config, callBack) {
	        var paramConfig = { channels: [], includeUsers: false, distinct: false };
	        if (config.channels !== "undefined") {
	            paramConfig.channels = config.channels;
	        }
	        if (config.includeUsers == true) {
	            paramConfig.includeUsers = true;
	        }
	        if (config.distinct == true) {
	            paramConfig.distinct = true;
	        }
	        this.socket.emit("hereNow", paramConfig, function (result) {
	            if (typeof callBack !== "undefined") {
	                callBack(result);
	            }
	        });
	    },
	    history: function history(config, callBack) {
	        if (this._isEmpty(config.channel)) {
	            if (typeof callBack !== "undefined") {
	                callBack({ code: 400, content: "channel is required" });
	            }
	            return;
	        }
	        this.socket.emit("historyMessages", config, function (result) {
	            if (typeof callBack !== "undefined") {
	                callBack(result);
	            }
	        });
	    },
	    disconnect: function disconnect() {
	        var self = this;
	        this._manualDisconnectStatus = "disconnecting";
	        if (this.networkStatus === 'connected' && this.authorizeStatus === 'authorized' && this.authorizeResult.code === 200) {
	            var timeoutCallback = function timeoutCallback() {
	                self.socket.disconnect(); //d5,g5,d6, g6
	            };
	            var successCallback = function successCallback() {
	                self._manualDisconnectStatus = "disconnected"; ///d3, g3
	            };
	            self.tryEmit("manualDisconnect", null, timeoutCallback, successCallback);
	        } else {
	            //b2,b3,b4,c4,d4,e2,e3,e4,f2,f4,g4
	            this.socket.disconnect();
	        }
	    },
	    reconnect: function reconnect() {
	        this._manualConnect = true;
	        this.socket.connect();
	    },
	    tryEmit: function tryEmit(eventName, params, timeoutCallback, successCallback) {
	        var self = this;
	        var finished = false;
	        var retried = 0;
	        doWork();
	        var interval = setInterval(function () {
	            var arrivedMaxRetries = retried === self.maxRetries;
	            if (finished || arrivedMaxRetries) {
	                clearInterval(interval);
	                if (arrivedMaxRetries && typeof timeoutCallback !== "undefined") {
	                    timeoutCallback();
	                }
	            } else {
	                retried++;
	                doWork();
	            }
	        }, 1000);
	
	        function doWork() {
	            self.socket.emit(eventName, params, function (data) {
	                finished = true;
	                if (typeof successCallback !== "undefined") {
	                    successCallback(data);
	                }
	            });
	        }
	    },
	    _callbackEvents: function _callbackEvents(config) {
	        var self = this;
	        this.socket.on('message', function (msg, ackServerCallback) {
	            var message = JSON.parse(msg);
	            if (self.receivedGuids.unshiftGuid(message.i)) {
	                return;
	            }
	            if (message.a) {
	                self.socket.emit('ack', { "publishGuid": message.i });
	            }
	            if (self._endWith(message.n, "presence")) {
	                if (typeof self.channels[message.n].onPresence !== "undefined") {
	                    self.channels[message.n].onPresence(JSON.parse(message.c));
	                }
	            } else {
	                if (typeof self.channels[message.n].onMessage !== "undefined") {
	                    self.channels[message.n].onMessage({ time: message.t, channel: message.n, content: message.c });
	                }
	            }
	        });
	        this.socket.on('connect', function () {
	            //b2,b3,b4,e2,e3,e4
	            if (("disconnecting" === self._manualDisconnectStatus || "disconnected" === self._manualDisconnectStatus) && !self._manualConnect) {
	                return;
	            }
	            self.authorizeStatus = 'authorizing';
	            self.networkStatus = 'connected';
	            var params = { appkey: self._appkey, userId: self._userId, username: self._username, userData: self._userData, startMillis: cfg.startMillis, artifactVersion: "0.19.22", manual: self._manualConnect };
	            if (self.authorizeResult != null) {
	                params.sid = self.authorizeResult.sid;
	            }
	            var authorizeFinished = false;
	            function doAuthorize() {
	                log("doAuthorize() emit authorize params:" + JSON.stringify(params));
	                if (self._isEmpty(params.artifactVersion)) {
	                    self.sendlogs();
	                }
	                self.socket.emit('authorize', params, function (authorizeAckData) {
	                    log("doAuthorize() received authorize ack:" + JSON.stringify(authorizeAckData));
	                    if (!authorizeFinished) {
	                        //ignore later authorize result if multiple authorize emits
	                        authorizeFinished = true;
	                        self.authorizeStatus = "authorized";
	                        self._manualDisconnectStatus = "initial";
	                        if (self.authorizeResult == null) {
	                            self.authorizeResult = {};
	                        }
	                        self.authorizeResult.code = authorizeAckData.resultCode;
	                        self.authorizeResult.content = authorizeAckData.content;
	                        if (authorizeAckData.resultCode == 200) {
	                            if (self.authorizeResult.sid == null) {
	                                //first connect
	                                self.authorizeResult.sid = authorizeAckData.sid;
	                            } else if (self.authorizeResult.sid != authorizeAckData.sid) {
	                                //sid expired and reconnect
	                                self.authorizeResult.sid = authorizeAckData.sid;
	                                for (var channel in self.channels) {
	                                    if (self.channels.hasOwnProperty(channel)) {
	                                        log("doAuthorize() sid expired and will call doSubscribeAndCheckAck from channels:" + JSON.stringify(self.channels[channel]));
	                                        self.doSubscribeAndCheckAck(self.channels[channel]);
	                                    }
	                                }
	                            }
	
	                            for (var bufferSub in self.subscribeBuffer) {
	                                if (self.subscribeBuffer.hasOwnProperty(bufferSub)) {
	                                    log("doAuthorize() will doSubscribeAndCheckAck from subscribeBuffer:" + JSON.stringify(self.subscribeBuffer[bufferSub]));
	                                    self.doSubscribeAndCheckAck(self.subscribeBuffer[bufferSub]);
	                                }
	                            }
	                            if (typeof config.onConnected !== "undefined") {
	                                config.onConnected();
	                            }
	                        } else {
	                            if (typeof config.onConnectFailed !== "undefined") {
	                                config.onConnectFailed({ code: authorizeAckData.resultCode, content: authorizeAckData.content });
	                            }
	                        }
	                    }
	                });
	            }
	            doAuthorize();
	            var checkAuthorizeAck = setInterval(function () {
	                if (!authorizeFinished && self.networkStatus == 'connected') {
	                    doAuthorize();
	                } else {
	                    clearInterval(checkAuthorizeAck);
	                }
	            }, 1300);
	        });
	        this.socket.on('connect_error', function (data) {
	            if (typeof config.onConnectFailed !== "undefined") {
	                config.onConnectFailed({ code: 408, content: data });
	            }
	        });
	        this.socket.on('disconnect', function () {
	            self.networkStatus = 'disconnected';
	            self.authorizeStatus = 'initial';
	            self._manualConnect = false;
	            if (self.authorizeResult == null) {
	                self.authorizeResult = {};
	            }
	            self.authorizeResult.code = 408;
	            self.authorizeResult.content = 'Server unreachable or timeout';
	            if (typeof config.onDisconnected !== "undefined") {
	                config.onDisconnected();
	            }
	        });
	    },
	    _isEmpty: function _isEmpty(text) {
	        return typeof text == "undefined" || text == null || this._trim(text).length == 0;
	    },
	    _trim: function _trim(str) {
	        return str.replace(/(^\s*)|(\s*$)/g, "");
	    },
	    _endWith: function _endWith(str, substr) {
	        var reg = new RegExp(substr + "$");
	        return reg.test(str);
	    },
	    log: function log(message) {
	        if (window["console"] && this.debug) {
	            console.log(message);
	        }
	    },
	    uuid_goeasy: function uuid_goeasy() {
	        return uuidv1();
	    },
	    sendlogs: function sendlogs() {
	        if (goEasy_debug) {
	            this.socket.emit('log', { logs: goEasy_logs });
	        }
	    }
	};
	
	module.exports = GoEasy;

/***/ }),
/* 1 */
/***/ (function(module, exports, __webpack_require__) {

	'use strict';
	
	var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };
	
	/**
	 * Module dependencies.
	 */
	
	var url = __webpack_require__(2);
	var parser = __webpack_require__(5);
	var Manager = __webpack_require__(8);
	var debug = __webpack_require__(4)('socket.io-client');
	
	/**
	 * Module exports.
	 */
	
	module.exports = exports = lookup;
	
	/**
	 * Managers cache.
	 */
	
	var cache = exports.managers = {};
	
	/**
	 * Looks up an existing `Manager` for multiplexing.
	 * If the user summons:
	 *
	 *   `io('http://localhost/a');`
	 *   `io('http://localhost/b');`
	 *
	 * We reuse the existing instance based on same scheme/port/host,
	 * and we initialize sockets for each namespace.
	 *
	 * @api public
	 */
	
	function lookup(uri, opts) {
	  if ((typeof uri === 'undefined' ? 'undefined' : _typeof(uri)) === 'object') {
	    opts = uri;
	    uri = undefined;
	  }
	
	  opts = opts || {};
	
	  var parsed = url(uri);
	  var source = parsed.source;
	  var id = parsed.id;
	  var path = parsed.path;
	  var sameNamespace = cache[id] && path in cache[id].nsps;
	  var newConnection = opts.forceNew || opts['force new connection'] || false === opts.multiplex || sameNamespace;
	
	  var io;
	
	  if (newConnection) {
	
	    io = Manager(source, opts);
	  } else {
	    if (!cache[id]) {
	
	      cache[id] = Manager(source, opts);
	    }
	    io = cache[id];
	  }
	  if (parsed.query && !opts.query) {
	    opts.query = parsed.query;
	  }
	  return io.socket(parsed.path, opts);
	}
	
	/**
	 * Protocol version.
	 *
	 * @api public
	 */
	
	exports.protocol = parser.protocol;
	
	/**
	 * `connect`.
	 *
	 * @param {String} uri
	 * @api public
	 */
	
	exports.connect = lookup;
	
	/**
	 * Expose constructors for standalone build.
	 *
	 * @api public
	 */
	
	exports.Manager = __webpack_require__(8);
	exports.Socket = __webpack_require__(30);

/***/ }),
/* 2 */
/***/ (function(module, exports, __webpack_require__) {

	'use strict';
	
	/**
	 * Module dependencies.
	 */
	
	var parseuri = __webpack_require__(3);
	var debug = __webpack_require__(4)('socket.io-client:url');
	
	/**
	 * Module exports.
	 */
	
	module.exports = url;
	
	/**
	 * URL parser.
	 *
	 * @param {String} url
	 * @param {Object} An object meant to mimic window.location.
	 *                 Defaults to window.location.
	 * @api public
	 */
	
	function url(uri, loc) {
	  var obj = uri;
	
	  // default to window.location
	  loc = loc || typeof location !== 'undefined' && location;
	  if (null == uri) uri = loc.protocol + '//' + loc.host;
	
	  // relative path support
	  if ('string' === typeof uri) {
	    if ('/' === uri.charAt(0)) {
	      if ('/' === uri.charAt(1)) {
	        uri = loc.protocol + uri;
	      } else {
	        uri = loc.host + uri;
	      }
	    }
	
	    if (!/^(https?|wss?):\/\//.test(uri)) {
	
	      if ('undefined' !== typeof loc) {
	        uri = loc.protocol + '//' + uri;
	      } else {
	        uri = 'https://' + uri;
	      }
	    }
	
	    // parse
	
	    obj = parseuri(uri);
	  }
	
	  // make sure we treat `localhost:80` and `localhost` equally
	  if (!obj.port) {
	    if (/^(http|ws)$/.test(obj.protocol)) {
	      obj.port = '80';
	    } else if (/^(http|ws)s$/.test(obj.protocol)) {
	      obj.port = '443';
	    }
	  }
	
	  obj.path = obj.path || '/';
	
	  var ipv6 = obj.host.indexOf(':') !== -1;
	  var host = ipv6 ? '[' + obj.host + ']' : obj.host;
	
	  // define unique id
	  obj.id = obj.protocol + '://' + host + ':' + obj.port;
	  // define href
	  obj.href = obj.protocol + '://' + host + (loc && loc.port === obj.port ? '' : ':' + obj.port);
	
	  return obj;
	}

/***/ }),
/* 3 */
/***/ (function(module, exports) {

	/**
	 * Parses an URI
	 *
	 * @author Steven Levithan <stevenlevithan.com> (MIT license)
	 * @api private
	 */
	
	var re = /^(?:(?![^:@]+:[^:@\/]*@)(http|https|ws|wss):\/\/)?((?:(([^:@]*)(?::([^:@]*))?)?@)?((?:[a-f0-9]{0,4}:){2,7}[a-f0-9]{0,4}|[^:\/?#]*)(?::(\d*))?)(((\/(?:[^?#](?![^?#\/]*\.[^?#\/.]+(?:[?#]|$)))*\/?)?([^?#\/]*))(?:\?([^#]*))?(?:#(.*))?)/;
	
	var parts = [
	    'source', 'protocol', 'authority', 'userInfo', 'user', 'password', 'host', 'port', 'relative', 'path', 'directory', 'file', 'query', 'anchor'
	];
	
	module.exports = function parseuri(str) {
	    var src = str,
	        b = str.indexOf('['),
	        e = str.indexOf(']');
	
	    if (b != -1 && e != -1) {
	        str = str.substring(0, b) + str.substring(b, e).replace(/:/g, ';') + str.substring(e, str.length);
	    }
	
	    var m = re.exec(str || ''),
	        uri = {},
	        i = 14;
	
	    while (i--) {
	        uri[parts[i]] = m[i] || '';
	    }
	
	    if (b != -1 && e != -1) {
	        uri.source = src;
	        uri.host = uri.host.substring(1, uri.host.length - 1).replace(/;/g, ':');
	        uri.authority = uri.authority.replace('[', '').replace(']', '').replace(/;/g, ':');
	        uri.ipv6uri = true;
	    }
	
	    return uri;
	};


/***/ }),
/* 4 */
/***/ (function(module, exports) {

	"use strict";
	
	module.exports = function () {
	  return function () {};
	};

/***/ }),
/* 5 */
/***/ (function(module, exports, __webpack_require__) {

	'use strict';
	
	/**
	 * Module dependencies.
	 */
	
	var debug = __webpack_require__(4)('socket.io-parser');
	var Emitter = __webpack_require__(6);
	// var binary = require('./binary');
	var isArray = __webpack_require__(7);
	// var isBuf = require('./is-buffer');
	
	/**
	 * Protocol version.
	 *
	 * @api public
	 */
	
	exports.protocol = 4;
	
	/**
	 * Packet types.
	 *
	 * @api public
	 */
	
	exports.types = ['CONNECT', 'DISCONNECT', 'EVENT', 'ACK', 'ERROR', 'BINARY_EVENT', 'BINARY_ACK'];
	
	/**
	 * Packet type `connect`.
	 *
	 * @api public
	 */
	
	exports.CONNECT = 0;
	
	/**
	 * Packet type `disconnect`.
	 *
	 * @api public
	 */
	
	exports.DISCONNECT = 1;
	
	/**
	 * Packet type `event`.
	 *
	 * @api public
	 */
	
	exports.EVENT = 2;
	
	/**
	 * Packet type `ack`.
	 *
	 * @api public
	 */
	
	exports.ACK = 3;
	
	/**
	 * Packet type `error`.
	 *
	 * @api public
	 */
	
	exports.ERROR = 4;
	
	/**
	 * Packet type 'binary event'
	 *
	 * @api public
	 */
	
	exports.BINARY_EVENT = 5;
	
	/**
	 * Packet type `binary ack`. For acks with binary arguments.
	 *
	 * @api public
	 */
	
	exports.BINARY_ACK = 6;
	
	/**
	 * Encoder constructor.
	 *
	 * @api public
	 */
	
	exports.Encoder = Encoder;
	
	/**
	 * Decoder constructor.
	 *
	 * @api public
	 */
	
	exports.Decoder = Decoder;
	
	/**
	 * A socket.io Encoder instance
	 *
	 * @api public
	 */
	
	function Encoder() {}
	
	var ERROR_PACKET = exports.ERROR + '"encode error"';
	
	/**
	 * Encode a packet as a single string if non-binary, or as a
	 * buffer sequence, depending on packet type.
	 *
	 * @param {Object} obj - packet object
	 * @param {Function} callback - function to handle encodings (likely engine.write)
	 * @return Calls callback with Array of encodings
	 * @api public
	 */
	
	Encoder.prototype.encode = function (obj, callback) {
	  // debug('encoding packet %j', obj);
	  //
	  // if (exports.BINARY_EVENT === obj.type || exports.BINARY_ACK === obj.type) {
	  //   encodeAsBinary(obj, callback);
	  // } else {
	  var encoding = encodeAsString(obj);
	  callback([encoding]);
	  // }
	};
	
	/**
	 * Encode packet as string.
	 *
	 * @param {Object} packet
	 * @return {String} encoded
	 * @api private
	 */
	
	function encodeAsString(obj) {
	
	  // first is type
	  var str = '' + obj.type;
	
	  // attachments if we have them
	  if (exports.BINARY_EVENT === obj.type || exports.BINARY_ACK === obj.type) {
	    str += obj.attachments + '-';
	  }
	
	  // if we have a namespace other than `/`
	  // we append it followed by a comma `,`
	  if (obj.nsp && '/' !== obj.nsp) {
	    str += obj.nsp + ',';
	  }
	
	  // immediately followed by the id
	  if (null != obj.id) {
	    str += obj.id;
	  }
	
	  // json data
	  if (null != obj.data) {
	    var payload = tryStringify(obj.data);
	    if (payload !== false) {
	      str += payload;
	    } else {
	      return ERROR_PACKET;
	    }
	  }
	
	  return str;
	}
	
	function tryStringify(str) {
	  try {
	    return JSON.stringify(str);
	  } catch (e) {
	    return false;
	  }
	}
	
	/**
	 * Encode packet as 'buffer sequence' by removing blobs, and
	 * deconstructing packet into object with placeholders and
	 * a list of buffers.
	 *
	 * @param {Object} packet
	 * @return {Buffer} encoded
	 * @api private
	 */
	
	// function encodeAsBinary(obj, callback) {
	//
	//   function writeEncoding(bloblessData) {
	//     var deconstruction = binary.deconstructPacket(bloblessData);
	//     var pack = encodeAsString(deconstruction.packet);
	//     var buffers = deconstruction.buffers;
	//
	//     buffers.unshift(pack); // add packet info to beginning of data list
	//     callback(buffers); // write all the buffers
	//   }
	//
	//   binary.removeBlobs(obj, writeEncoding);
	// }
	
	/**
	 * A socket.io Decoder instance
	 *
	 * @return {Object} decoder
	 * @api public
	 */
	
	function Decoder() {
	  this.reconstructor = null;
	}
	
	/**
	 * Mix in `Emitter` with Decoder.
	 */
	
	Emitter(Decoder.prototype);
	
	/**
	 * Decodes an encoded packet string into packet JSON.
	 *
	 * @param {String} obj - encoded packet
	 * @return {Object} packet
	 * @api public
	 */
	
	Decoder.prototype.add = function (obj) {
	  var packet;
	  if (typeof obj === 'string') {
	    packet = decodeString(obj);
	    // if (exports.BINARY_EVENT === packet.type || exports.BINARY_ACK === packet.type) { // binary packet's json
	    //   this.reconstructor = new BinaryReconstructor(packet);
	    //
	    //   // no attachments, labeled binary but no binary data to follow
	    //   if (this.reconstructor.reconPack.attachments === 0) {
	    //     this.emit('decoded', packet);
	    //   }
	    // } else { // non-binary full packet
	    this.emit('decoded', packet);
	    // }
	  }
	  // else if (isBuf(obj) || obj.base64) { // raw binary data
	  //   if (!this.reconstructor) {
	  //     throw new Error('got binary data when not reconstructing a packet');
	  //   } else {
	  //     packet = this.reconstructor.takeBinaryData(obj);
	  //     if (packet) { // received final buffer
	  //       this.reconstructor = null;
	  //       this.emit('decoded', packet);
	  //     }
	  //   }
	  // }
	  else {
	      throw new Error('Unknown type: ' + obj);
	    }
	};
	
	/**
	 * Decode a packet String (JSON data)
	 *
	 * @param {String} str
	 * @return {Object} packet
	 * @api private
	 */
	
	function decodeString(str) {
	  var i = 0;
	  // look up type
	  var p = {
	    type: Number(str.charAt(0))
	  };
	
	  if (null == exports.types[p.type]) {
	    return error('unknown packet type ' + p.type);
	  }
	
	  // look up attachments if type binary
	  if (exports.BINARY_EVENT === p.type || exports.BINARY_ACK === p.type) {
	    var buf = '';
	    while (str.charAt(++i) !== '-') {
	      buf += str.charAt(i);
	      if (i == str.length) break;
	    }
	    if (buf != Number(buf) || str.charAt(i) !== '-') {
	      throw new Error('Illegal attachments');
	    }
	    p.attachments = Number(buf);
	  }
	
	  // look up namespace (if any)
	  if ('/' === str.charAt(i + 1)) {
	    p.nsp = '';
	    while (++i) {
	      var c = str.charAt(i);
	      if (',' === c) break;
	      p.nsp += c;
	      if (i === str.length) break;
	    }
	  } else {
	    p.nsp = '/';
	  }
	
	  // look up id
	  var next = str.charAt(i + 1);
	  if ('' !== next && Number(next) == next) {
	    p.id = '';
	    while (++i) {
	      var c = str.charAt(i);
	      if (null == c || Number(c) != c) {
	        --i;
	        break;
	      }
	      p.id += str.charAt(i);
	      if (i === str.length) break;
	    }
	    p.id = Number(p.id);
	  }
	
	  // look up json data
	  if (str.charAt(++i)) {
	    var payload = tryParse(str.substr(i));
	    var isPayloadValid = payload !== false && (p.type === exports.ERROR || isArray(payload));
	    if (isPayloadValid) {
	      p.data = payload;
	    } else {
	      return error('invalid payload');
	    }
	  }
	
	  return p;
	}
	
	function tryParse(str) {
	  try {
	    return JSON.parse(str);
	  } catch (e) {
	    return false;
	  }
	}
	
	/**
	 * Deallocates a parser's resources
	 *
	 * @api public
	 */
	
	Decoder.prototype.destroy = function () {
	  if (this.reconstructor) {
	    this.reconstructor.finishedReconstruction();
	  }
	};
	
	/**
	 * A manager of a binary event's 'buffer sequence'. Should
	 * be constructed whenever a packet of type BINARY_EVENT is
	 * decoded.
	 *
	 * @param {Object} packet
	 * @return {BinaryReconstructor} initialized reconstructor
	 * @api private
	 */
	
	function BinaryReconstructor(packet) {
	  this.reconPack = packet;
	  this.buffers = [];
	}
	
	/**
	 * Method to be called when binary data received from connection
	 * after a BINARY_EVENT packet.
	 *
	 * @param {Buffer | ArrayBuffer} binData - the raw binary data received
	 * @return {null | Object} returns null if more binary data is expected or
	 *   a reconstructed packet object if all buffers have been received.
	 * @api private
	 */
	
	BinaryReconstructor.prototype.takeBinaryData = function (binData) {
	  this.buffers.push(binData);
	  if (this.buffers.length === this.reconPack.attachments) {
	    // done with buffer list
	    var packet = binary.reconstructPacket(this.reconPack, this.buffers);
	    this.finishedReconstruction();
	    return packet;
	  }
	  return null;
	};
	
	/**
	 * Cleans up binary packet reconstruction variables.
	 *
	 * @api private
	 */
	
	BinaryReconstructor.prototype.finishedReconstruction = function () {
	  this.reconPack = null;
	  this.buffers = [];
	};
	
	function error(msg) {
	  return {
	    type: exports.ERROR,
	    data: 'parser error: ' + msg
	  };
	}

/***/ }),
/* 6 */
/***/ (function(module, exports, __webpack_require__) {

	
	/**
	 * Expose `Emitter`.
	 */
	
	if (true) {
	  module.exports = Emitter;
	}
	
	/**
	 * Initialize a new `Emitter`.
	 *
	 * @api public
	 */
	
	function Emitter(obj) {
	  if (obj) return mixin(obj);
	};
	
	/**
	 * Mixin the emitter properties.
	 *
	 * @param {Object} obj
	 * @return {Object}
	 * @api private
	 */
	
	function mixin(obj) {
	  for (var key in Emitter.prototype) {
	    obj[key] = Emitter.prototype[key];
	  }
	  return obj;
	}
	
	/**
	 * Listen on the given `event` with `fn`.
	 *
	 * @param {String} event
	 * @param {Function} fn
	 * @return {Emitter}
	 * @api public
	 */
	
	Emitter.prototype.on =
	Emitter.prototype.addEventListener = function(event, fn){
	  this._callbacks = this._callbacks || {};
	  (this._callbacks['$' + event] = this._callbacks['$' + event] || [])
	    .push(fn);
	  return this;
	};
	
	/**
	 * Adds an `event` listener that will be invoked a single
	 * time then automatically removed.
	 *
	 * @param {String} event
	 * @param {Function} fn
	 * @return {Emitter}
	 * @api public
	 */
	
	Emitter.prototype.once = function(event, fn){
	  function on() {
	    this.off(event, on);
	    fn.apply(this, arguments);
	  }
	
	  on.fn = fn;
	  this.on(event, on);
	  return this;
	};
	
	/**
	 * Remove the given callback for `event` or all
	 * registered callbacks.
	 *
	 * @param {String} event
	 * @param {Function} fn
	 * @return {Emitter}
	 * @api public
	 */
	
	Emitter.prototype.off =
	Emitter.prototype.removeListener =
	Emitter.prototype.removeAllListeners =
	Emitter.prototype.removeEventListener = function(event, fn){
	  this._callbacks = this._callbacks || {};
	
	  // all
	  if (0 == arguments.length) {
	    this._callbacks = {};
	    return this;
	  }
	
	  // specific event
	  var callbacks = this._callbacks['$' + event];
	  if (!callbacks) return this;
	
	  // remove all handlers
	  if (1 == arguments.length) {
	    delete this._callbacks['$' + event];
	    return this;
	  }
	
	  // remove specific handler
	  var cb;
	  for (var i = 0; i < callbacks.length; i++) {
	    cb = callbacks[i];
	    if (cb === fn || cb.fn === fn) {
	      callbacks.splice(i, 1);
	      break;
	    }
	  }
	  return this;
	};
	
	/**
	 * Emit `event` with the given args.
	 *
	 * @param {String} event
	 * @param {Mixed} ...
	 * @return {Emitter}
	 */
	
	Emitter.prototype.emit = function(event){
	  this._callbacks = this._callbacks || {};
	  var args = [].slice.call(arguments, 1)
	    , callbacks = this._callbacks['$' + event];
	
	  if (callbacks) {
	    callbacks = callbacks.slice(0);
	    for (var i = 0, len = callbacks.length; i < len; ++i) {
	      callbacks[i].apply(this, args);
	    }
	  }
	
	  return this;
	};
	
	/**
	 * Return array of callbacks for `event`.
	 *
	 * @param {String} event
	 * @return {Array}
	 * @api public
	 */
	
	Emitter.prototype.listeners = function(event){
	  this._callbacks = this._callbacks || {};
	  return this._callbacks['$' + event] || [];
	};
	
	/**
	 * Check if this emitter has `event` handlers.
	 *
	 * @param {String} event
	 * @return {Boolean}
	 * @api public
	 */
	
	Emitter.prototype.hasListeners = function(event){
	  return !! this.listeners(event).length;
	};


/***/ }),
/* 7 */
/***/ (function(module, exports) {

	var toString = {}.toString;
	
	module.exports = Array.isArray || function (arr) {
	  return toString.call(arr) == '[object Array]';
	};


/***/ }),
/* 8 */
/***/ (function(module, exports, __webpack_require__) {

	'use strict';
	
	var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };
	
	/**
	 * Module dependencies.
	 */
	
	var eio = __webpack_require__(9);
	var Socket = __webpack_require__(30);
	var Emitter = __webpack_require__(6);
	var parser = __webpack_require__(5);
	var on = __webpack_require__(32);
	var bind = __webpack_require__(33);
	var debug = __webpack_require__(4)('socket.io-client:manager');
	var indexOf = __webpack_require__(29);
	var Backoff = __webpack_require__(34);
	
	/**
	 * IE6+ hasOwnProperty
	 */
	
	var has = Object.prototype.hasOwnProperty;
	
	/**
	 * Module exports
	 */
	
	module.exports = Manager;
	
	/**
	 * `Manager` constructor.
	 *
	 * @param {String} engine instance or engine uri/opts
	 * @param {Object} options
	 * @api public
	 */
	
	function Manager(uri, opts) {
	  if (!(this instanceof Manager)) return new Manager(uri, opts);
	  if (uri && 'object' === (typeof uri === 'undefined' ? 'undefined' : _typeof(uri))) {
	    opts = uri;
	    uri = undefined;
	  }
	  opts = opts || {};
	
	  opts.path = opts.path || '/socket.io';
	  this.nsps = {};
	  this.subs = [];
	  this.opts = opts;
	  this.reconnection(opts.reconnection !== false);
	  this.reconnectionAttempts(opts.reconnectionAttempts || Infinity);
	  this.reconnectionDelay(opts.reconnectionDelay || 1000);
	  this.reconnectionDelayMax(opts.reconnectionDelayMax || 5000);
	  this.randomizationFactor(opts.randomizationFactor || 0.5);
	  this.backoff = new Backoff({
	    min: this.reconnectionDelay(),
	    max: this.reconnectionDelayMax(),
	    jitter: this.randomizationFactor()
	  });
	  this.timeout(null == opts.timeout ? 20000 : opts.timeout);
	  this.readyState = 'closed';
	  this.uri = uri;
	  this.connecting = [];
	  this.lastPing = null;
	  this.encoding = false;
	  this.packetBuffer = [];
	  var _parser = opts.parser || parser;
	  this.encoder = new _parser.Encoder();
	  this.decoder = new _parser.Decoder();
	  this.autoConnect = opts.autoConnect !== false;
	  if (this.autoConnect) this.open();
	}
	
	/**
	 * Propagate given event to sockets and emit on `this`
	 *
	 * @api private
	 */
	
	Manager.prototype.emitAll = function () {
	  this.emit.apply(this, arguments);
	  for (var nsp in this.nsps) {
	    if (has.call(this.nsps, nsp)) {
	      this.nsps[nsp].emit.apply(this.nsps[nsp], arguments);
	    }
	  }
	};
	
	/**
	 * Update `socket.id` of all sockets
	 *
	 * @api private
	 */
	
	Manager.prototype.updateSocketIds = function () {
	  for (var nsp in this.nsps) {
	    if (has.call(this.nsps, nsp)) {
	      this.nsps[nsp].id = this.generateId(nsp);
	    }
	  }
	};
	
	/**
	 * generate `socket.id` for the given `nsp`
	 *
	 * @param {String} nsp
	 * @return {String}
	 * @api private
	 */
	
	Manager.prototype.generateId = function (nsp) {
	  return (nsp === '/' ? '' : nsp + '#') + this.engine.id;
	};
	
	/**
	 * Mix in `Emitter`.
	 */
	
	Emitter(Manager.prototype);
	
	/**
	 * Sets the `reconnection` config.
	 *
	 * @param {Boolean} true/false if it should automatically reconnect
	 * @return {Manager} self or value
	 * @api public
	 */
	
	Manager.prototype.reconnection = function (v) {
	  if (!arguments.length) return this._reconnection;
	  this._reconnection = !!v;
	  return this;
	};
	
	/**
	 * Sets the reconnection attempts config.
	 *
	 * @param {Number} max reconnection attempts before giving up
	 * @return {Manager} self or value
	 * @api public
	 */
	
	Manager.prototype.reconnectionAttempts = function (v) {
	  if (!arguments.length) return this._reconnectionAttempts;
	  this._reconnectionAttempts = v;
	  return this;
	};
	
	/**
	 * Sets the delay between reconnections.
	 *
	 * @param {Number} delay
	 * @return {Manager} self or value
	 * @api public
	 */
	
	Manager.prototype.reconnectionDelay = function (v) {
	  if (!arguments.length) return this._reconnectionDelay;
	  this._reconnectionDelay = v;
	  this.backoff && this.backoff.setMin(v);
	  return this;
	};
	
	Manager.prototype.randomizationFactor = function (v) {
	  if (!arguments.length) return this._randomizationFactor;
	  this._randomizationFactor = v;
	  this.backoff && this.backoff.setJitter(v);
	  return this;
	};
	
	/**
	 * Sets the maximum delay between reconnections.
	 *
	 * @param {Number} delay
	 * @return {Manager} self or value
	 * @api public
	 */
	
	Manager.prototype.reconnectionDelayMax = function (v) {
	  if (!arguments.length) return this._reconnectionDelayMax;
	  this._reconnectionDelayMax = v;
	  this.backoff && this.backoff.setMax(v);
	  return this;
	};
	
	/**
	 * Sets the connection timeout. `false` to disable
	 *
	 * @return {Manager} self or value
	 * @api public
	 */
	
	Manager.prototype.timeout = function (v) {
	  if (!arguments.length) return this._timeout;
	  this._timeout = v;
	  return this;
	};
	
	/**
	 * Starts trying to reconnect if reconnection is enabled and we have not
	 * started reconnecting yet
	 *
	 * @api private
	 */
	
	Manager.prototype.maybeReconnectOnOpen = function () {
	  // Only try to reconnect if it's the first time we're connecting
	  if (!this.reconnecting && this._reconnection && this.backoff.attempts === 0) {
	    // keeps reconnection from firing twice for the same reconnection loop
	    this.reconnect();
	  }
	};
	
	/**
	 * Sets the current transport `socket`.
	 *
	 * @param {Function} optional, callback
	 * @return {Manager} self
	 * @api public
	 */
	
	Manager.prototype.open = Manager.prototype.connect = function (fn, opts) {
	
	  if (~this.readyState.indexOf('open')) return this;
	
	  this.engine = eio(this.uri, this.opts);
	  var socket = this.engine;
	  var self = this;
	  this.readyState = 'opening';
	  this.skipReconnect = false;
	
	  // emit `open`
	  var openSub = on(socket, 'open', function () {
	    self.onopen();
	    fn && fn();
	  });
	
	  // emit `connect_error`
	  var win = window;
	  var errorSub = on(socket, 'error', function (data) {
	
	    // if( !( wx && wx._GoEasy_ && wx._GoEasy_.isWx() ) ) {
	    //   var reg = /[1-9][0-9]*/g;
	    //   var index = parseInt(self.uri.match(reg)[0]);
	    //   var nextIndex = winodw._GoEasy_.goEasyDomainNumber.initialCurrentNumber();
	    //   self.uri = self.uri.replace(index, nextIndex);
	    // }
	
	    if (win) {
	      var reg = /[1-9][0-9]*/g;
	      var index = parseInt(self.uri.match(reg)[0]);
	      var nextIndex = win._GoEasy_.goEasyDomainNumber.initialCurrentNumber();
	      self.uri = self.uri.replace(index, nextIndex);
	    }
	
	    self.cleanup();
	    self.readyState = 'closed';
	    self.emitAll('connect_error', data);
	    if (fn) {
	      var err = new Error('Connection error');
	      err.data = data;
	      fn(err);
	    } else {
	      // Only do this if there is no fn to handle the error
	      self.maybeReconnectOnOpen();
	    }
	  });
	
	  // emit `connect_timeout`
	  if (false !== this._timeout) {
	    var timeout = this._timeout;
	
	    // set timer
	    var timer = setTimeout(function () {
	
	      openSub.destroy();
	      socket.close();
	      socket.emit('error', 'timeout');
	      self.emitAll('connect_timeout', timeout);
	    }, timeout);
	
	    this.subs.push({
	      destroy: function destroy() {
	        clearTimeout(timer);
	      }
	    });
	  }
	
	  this.subs.push(openSub);
	  this.subs.push(errorSub);
	
	  return this;
	};
	
	/**
	 * Called upon transport open.
	 *
	 * @api private
	 */
	
	Manager.prototype.onopen = function () {
	
	  // clear old subs
	  this.cleanup();
	
	  // mark as open
	  this.readyState = 'open';
	  this.emit('open');
	
	  // add new subs
	  var socket = this.engine;
	  this.subs.push(on(socket, 'data', bind(this, 'ondata')));
	  this.subs.push(on(socket, 'ping', bind(this, 'onping')));
	  this.subs.push(on(socket, 'pong', bind(this, 'onpong')));
	  this.subs.push(on(socket, 'error', bind(this, 'onerror')));
	  this.subs.push(on(socket, 'close', bind(this, 'onclose')));
	  this.subs.push(on(this.decoder, 'decoded', bind(this, 'ondecoded')));
	};
	
	/**
	 * Called upon a ping.
	 *
	 * @api private
	 */
	
	Manager.prototype.onping = function () {
	  this.lastPing = new Date();
	  this.emitAll('ping');
	};
	
	/**
	 * Called upon a packet.
	 *
	 * @api private
	 */
	
	Manager.prototype.onpong = function () {
	  this.emitAll('pong', new Date() - this.lastPing);
	};
	
	/**
	 * Called with data.
	 *
	 * @api private
	 */
	
	Manager.prototype.ondata = function (data) {
	  this.decoder.add(data);
	};
	
	/**
	 * Called when parser fully decodes a packet.
	 *
	 * @api private
	 */
	
	Manager.prototype.ondecoded = function (packet) {
	  this.emit('packet', packet);
	};
	
	/**
	 * Called upon socket error.
	 *
	 * @api private
	 */
	
	Manager.prototype.onerror = function (err) {
	
	  this.emitAll('error', err);
	};
	
	/**
	 * Creates a new socket for the given `nsp`.
	 *
	 * @return {Socket}
	 * @api public
	 */
	
	Manager.prototype.socket = function (nsp, opts) {
	  var socket = this.nsps[nsp];
	  if (!socket) {
	    socket = new Socket(this, nsp, opts);
	    this.nsps[nsp] = socket;
	    var self = this;
	    socket.on('connecting', onConnecting);
	    socket.on('connect', function () {
	      socket.id = self.generateId(nsp);
	    });
	
	    if (this.autoConnect) {
	      // manually call here since connecting event is fired before listening
	      onConnecting();
	    }
	  }
	
	  function onConnecting() {
	    if (!~indexOf(self.connecting, socket)) {
	      self.connecting.push(socket);
	    }
	  }
	
	  return socket;
	};
	
	/**
	 * Called upon a socket close.
	 *
	 * @param {Socket} socket
	 */
	
	Manager.prototype.destroy = function (socket) {
	  var index = indexOf(this.connecting, socket);
	  if (~index) this.connecting.splice(index, 1);
	  if (this.connecting.length) return;
	
	  this.close();
	};
	
	/**
	 * Writes a packet.
	 *
	 * @param {Object} packet
	 * @api private
	 */
	
	Manager.prototype.packet = function (packet) {
	
	  var self = this;
	  if (packet.query && packet.type === 0) packet.nsp += '?' + packet.query;
	
	  if (!self.encoding) {
	    // encode, then write to engine with result
	    self.encoding = true;
	    this.encoder.encode(packet, function (encodedPackets) {
	      for (var i = 0; i < encodedPackets.length; i++) {
	        self.engine.write(encodedPackets[i], packet.options);
	      }
	      self.encoding = false;
	      self.processPacketQueue();
	    });
	  } else {
	    // add packet to the queue
	    self.packetBuffer.push(packet);
	  }
	};
	
	/**
	 * If packet buffer is non-empty, begins encoding the
	 * next packet in line.
	 *
	 * @api private
	 */
	
	Manager.prototype.processPacketQueue = function () {
	  if (this.packetBuffer.length > 0 && !this.encoding) {
	    var pack = this.packetBuffer.shift();
	    this.packet(pack);
	  }
	};
	
	/**
	 * Clean up transport subscriptions and packet buffer.
	 *
	 * @api private
	 */
	
	Manager.prototype.cleanup = function () {
	
	  var subsLength = this.subs.length;
	  for (var i = 0; i < subsLength; i++) {
	    var sub = this.subs.shift();
	    sub.destroy();
	  }
	
	  this.packetBuffer = [];
	  this.encoding = false;
	  this.lastPing = null;
	
	  this.decoder.destroy();
	};
	
	/**
	 * Close the current socket.
	 *
	 * @api private
	 */
	
	Manager.prototype.close = Manager.prototype.disconnect = function () {
	
	  this.skipReconnect = true;
	  this.reconnecting = false;
	  if ('opening' === this.readyState) {
	    // `onclose` will not fire because
	    // an open event never happened
	    this.cleanup();
	  }
	  this.backoff.reset();
	  this.readyState = 'closed';
	  if (this.engine) this.engine.close();
	};
	
	/**
	 * Called upon engine close.
	 *
	 * @api private
	 */
	
	Manager.prototype.onclose = function (reason) {
	
	  this.cleanup();
	  this.backoff.reset();
	  this.readyState = 'closed';
	  this.emit('close', reason);
	
	  if (this._reconnection && !this.skipReconnect) {
	    this.reconnect();
	  }
	};
	
	/**
	 * Attempt a reconnection.
	 *
	 * @api private
	 */
	
	Manager.prototype.reconnect = function () {
	  if (this.reconnecting || this.skipReconnect) return this;
	
	  var self = this;
	
	  if (this.backoff.attempts >= this._reconnectionAttempts) {
	
	    this.backoff.reset();
	    this.emitAll('reconnect_failed');
	    this.reconnecting = false;
	  } else {
	    var delay = this.backoff.duration();
	
	    this.reconnecting = true;
	    var timer = setTimeout(function () {
	      if (self.skipReconnect) return;
	
	      self.emitAll('reconnect_attempt', self.backoff.attempts);
	      self.emitAll('reconnecting', self.backoff.attempts);
	
	      // check again for the case socket closed in above events
	      if (self.skipReconnect) return;
	
	      self.open(function (err) {
	        if (err) {
	
	          self.reconnecting = false;
	          self.reconnect();
	          self.emitAll('reconnect_error', err.data);
	        } else {
	
	          self.onreconnect();
	        }
	      });
	    }, delay);
	
	    this.subs.push({
	      destroy: function destroy() {
	        clearTimeout(timer);
	      }
	    });
	  }
	};
	
	/**
	 * Called upon successful reconnect.
	 *
	 * @api private
	 */
	
	Manager.prototype.onreconnect = function () {
	  var attempt = this.backoff.attempts;
	  this.reconnecting = false;
	  this.backoff.reset();
	  this.updateSocketIds();
	  this.emitAll('reconnect', attempt);
	};

/***/ }),
/* 9 */
/***/ (function(module, exports, __webpack_require__) {

	'use strict';
	
	module.exports = __webpack_require__(10);
	
	/**
	 * Exports parser
	 *
	 * @api public
	 *
	 */
	module.exports.parser = __webpack_require__(15);

/***/ }),
/* 10 */
/***/ (function(module, exports, __webpack_require__) {

	'use strict';
	
	var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };
	
	/**
	 * Module dependencies.
	 */
	
	var transports = __webpack_require__(11);
	var Emitter = __webpack_require__(6);
	var debug = __webpack_require__(4)('engine.io-client:socket');
	var index = __webpack_require__(29);
	var parser = __webpack_require__(15);
	var parseuri = __webpack_require__(3);
	var parseqs = __webpack_require__(22);
	
	/**
	 * Module exports.
	 */
	
	module.exports = Socket;
	
	/**
	 * Socket constructor.
	 *
	 * @param {String|Object} uri or options
	 * @param {Object} options
	 * @api public
	 */
	
	function Socket(uri, opts) {
	  if (!(this instanceof Socket)) return new Socket(uri, opts);
	
	  opts = opts || {};
	
	  if (uri && 'object' === (typeof uri === 'undefined' ? 'undefined' : _typeof(uri))) {
	    opts = uri;
	    uri = null;
	  }
	
	  if (uri) {
	    uri = parseuri(uri);
	    opts.hostname = uri.host;
	    opts.secure = uri.protocol === 'https' || uri.protocol === 'wss';
	    opts.port = uri.port;
	    if (uri.query) opts.query = uri.query;
	  } else if (opts.host) {
	    opts.hostname = parseuri(opts.host).host;
	  }
	
	  this.secure = null != opts.secure ? opts.secure : typeof location !== 'undefined' && 'https:' === location.protocol;
	
	  if (opts.hostname && !opts.port) {
	    // if no port is specified manually, use the protocol default
	    opts.port = this.secure ? '443' : '80';
	  }
	
	  this.agent = opts.agent || false;
	  this.hostname = opts.hostname || (typeof location !== 'undefined' ? location.hostname : 'localhost');
	  this.port = opts.port || (typeof location !== 'undefined' && location.port ? location.port : this.secure ? 443 : 80);
	  this.query = opts.query || {};
	  if ('string' === typeof this.query) this.query = parseqs.decode(this.query);
	  this.upgrade = false !== opts.upgrade;
	  this.path = (opts.path || '/engine.io').replace(/\/$/, '') + '/';
	  this.forceJSONP = !!opts.forceJSONP;
	  this.jsonp = false !== opts.jsonp;
	  this.forceBase64 = !!opts.forceBase64;
	  this.enablesXDR = !!opts.enablesXDR;
	  this.timestampParam = opts.timestampParam || 't';
	  this.timestampRequests = opts.timestampRequests;
	  this.transports = opts.transports || ['polling', 'websocket'];
	  this.transportOptions = opts.transportOptions || {};
	  this.readyState = '';
	  this.writeBuffer = [];
	  this.prevBufferLen = 0;
	  this.policyPort = opts.policyPort || 843;
	  this.rememberUpgrade = opts.rememberUpgrade || false;
	  this.binaryType = null;
	  this.onlyBinaryUpgrades = opts.onlyBinaryUpgrades;
	  this.perMessageDeflate = false !== opts.perMessageDeflate ? opts.perMessageDeflate || {} : false;
	
	  if (true === this.perMessageDeflate) this.perMessageDeflate = {};
	  if (this.perMessageDeflate && null == this.perMessageDeflate.threshold) {
	    this.perMessageDeflate.threshold = 1024;
	  }
	
	  // SSL options for Node.js client
	  this.pfx = opts.pfx || null;
	  this.key = opts.key || null;
	  this.passphrase = opts.passphrase || null;
	  this.cert = opts.cert || null;
	  this.ca = opts.ca || null;
	  this.ciphers = opts.ciphers || null;
	  this.rejectUnauthorized = opts.rejectUnauthorized === undefined ? true : opts.rejectUnauthorized;
	  this.forceNode = !!opts.forceNode;
	
	  // detect ReactNative environment
	  this.isReactNative = typeof navigator !== 'undefined' && typeof navigator.product === 'string' && navigator.product.toLowerCase() === 'reactnative';
	
	  // other options for Node.js or ReactNative client
	  if (typeof self === 'undefined' || this.isReactNative) {
	    if (opts.extraHeaders && Object.keys(opts.extraHeaders).length > 0) {
	      this.extraHeaders = opts.extraHeaders;
	    }
	
	    if (opts.localAddress) {
	      this.localAddress = opts.localAddress;
	    }
	  }
	
	  // set on handshake
	  this.id = null;
	  this.upgrades = null;
	  this.pingInterval = null;
	  this.pingTimeout = null;
	
	  // set on heartbeat
	  this.pingIntervalTimer = null;
	  this.pingTimeoutTimer = null;
	
	  this.open();
	}
	
	Socket.priorWebsocketSuccess = false;
	
	/**
	 * Mix in `Emitter`.
	 */
	
	Emitter(Socket.prototype);
	
	/**
	 * Protocol version.
	 *
	 * @api public
	 */
	
	Socket.protocol = parser.protocol; // this is an int
	
	/**
	 * Expose deps for legacy compatibility
	 * and standalone browser access.
	 */
	
	Socket.Socket = Socket;
	Socket.Transport = __webpack_require__(14);
	Socket.transports = __webpack_require__(11);
	Socket.parser = __webpack_require__(15);
	
	/**
	 * Creates transport of the given type.
	 *
	 * @param {String} transport name
	 * @return {Transport}
	 * @api private
	 */
	
	Socket.prototype.createTransport = function (name) {
	
	  var query = clone(this.query);
	
	  // append engine.io protocol identifier
	  query.EIO = parser.protocol;
	
	  // transport name
	  query.transport = name;
	
	  // per-transport options
	  var options = this.transportOptions[name] || {};
	
	  // session id if we already have one
	  if (this.id) query.sid = this.id;
	
	  var transport = new transports[name]({
	    query: query,
	    socket: this,
	    agent: options.agent || this.agent,
	    hostname: options.hostname || this.hostname,
	    port: options.port || this.port,
	    secure: options.secure || this.secure,
	    path: options.path || this.path,
	    forceJSONP: options.forceJSONP || this.forceJSONP,
	    jsonp: options.jsonp || this.jsonp,
	    forceBase64: options.forceBase64 || this.forceBase64,
	    enablesXDR: options.enablesXDR || this.enablesXDR,
	    timestampRequests: options.timestampRequests || this.timestampRequests,
	    timestampParam: options.timestampParam || this.timestampParam,
	    policyPort: options.policyPort || this.policyPort,
	    pfx: options.pfx || this.pfx,
	    key: options.key || this.key,
	    passphrase: options.passphrase || this.passphrase,
	    cert: options.cert || this.cert,
	    ca: options.ca || this.ca,
	    ciphers: options.ciphers || this.ciphers,
	    rejectUnauthorized: options.rejectUnauthorized || this.rejectUnauthorized,
	    perMessageDeflate: options.perMessageDeflate || this.perMessageDeflate,
	    extraHeaders: options.extraHeaders || this.extraHeaders,
	    forceNode: options.forceNode || this.forceNode,
	    localAddress: options.localAddress || this.localAddress,
	    requestTimeout: options.requestTimeout || this.requestTimeout,
	    protocols: options.protocols || void 0,
	    isReactNative: this.isReactNative
	  });
	
	  return transport;
	};
	
	function clone(obj) {
	  var o = {};
	  for (var i in obj) {
	    if (obj.hasOwnProperty(i)) {
	      o[i] = obj[i];
	    }
	  }
	  return o;
	}
	
	/**
	 * Initializes transport to use and starts probe.
	 *
	 * @api private
	 */
	Socket.prototype.open = function () {
	  var transport;
	  if (this.rememberUpgrade && Socket.priorWebsocketSuccess && this.transports.indexOf('websocket') !== -1) {
	    transport = 'websocket';
	  } else if (0 === this.transports.length) {
	    // Emit error on next tick so it can be listened to
	    var self = this;
	    setTimeout(function () {
	      self.emit('error', 'No transports available');
	    }, 0);
	    return;
	  } else {
	    transport = this.transports[0];
	  }
	  this.readyState = 'opening';
	
	  // Retry with the next transport if the transport is disabled (jsonp: false)
	  try {
	    transport = this.createTransport(transport);
	  } catch (e) {
	    this.transports.shift();
	    this.open();
	    return;
	  }
	
	  transport.open();
	  this.setTransport(transport);
	};
	
	/**
	 * Sets the current transport. Disables the existing one (if any).
	 *
	 * @api private
	 */
	
	Socket.prototype.setTransport = function (transport) {
	
	  var self = this;
	
	  if (this.transport) {
	
	    this.transport.removeAllListeners();
	  }
	
	  // set up transport
	  this.transport = transport;
	
	  // set up transport listeners
	  transport.on('drain', function () {
	    self.onDrain();
	  }).on('packet', function (packet) {
	    self.onPacket(packet);
	  }).on('error', function (e) {
	    self.onError(e);
	  }).on('close', function () {
	    self.onClose('transport close');
	  });
	};
	
	/**
	 * Probes a transport.
	 *
	 * @param {String} transport name
	 * @api private
	 */
	
	Socket.prototype.probe = function (name) {
	
	  var transport = this.createTransport(name, { probe: 1 });
	  var failed = false;
	  var self = this;
	
	  Socket.priorWebsocketSuccess = false;
	
	  function onTransportOpen() {
	    if (self.onlyBinaryUpgrades) {
	      var upgradeLosesBinary = !this.supportsBinary && self.transport.supportsBinary;
	      failed = failed || upgradeLosesBinary;
	    }
	    if (failed) return;
	
	    transport.send([{ type: 'ping', data: 'probe' }]);
	    transport.once('packet', function (msg) {
	      if (failed) return;
	      if ('pong' === msg.type && 'probe' === msg.data) {
	
	        self.upgrading = true;
	        self.emit('upgrading', transport);
	        if (!transport) return;
	        Socket.priorWebsocketSuccess = 'websocket' === transport.name;
	
	        self.transport.pause(function () {
	          if (failed) return;
	          if ('closed' === self.readyState) return;
	
	          cleanup();
	
	          self.setTransport(transport);
	          transport.send([{ type: 'upgrade' }]);
	          self.emit('upgrade', transport);
	          transport = null;
	          self.upgrading = false;
	          self.flush();
	        });
	      } else {
	
	        var err = new Error('probe error');
	        err.transport = transport.name;
	        self.emit('upgradeError', err);
	      }
	    });
	  }
	
	  function freezeTransport() {
	    if (failed) return;
	
	    // Any callback called by transport should be ignored since now
	    failed = true;
	
	    cleanup();
	
	    transport.close();
	    transport = null;
	  }
	
	  // Handle any error that happens while probing
	  function onerror(err) {
	    var error = new Error('probe error: ' + err);
	    error.transport = transport.name;
	
	    freezeTransport();
	
	    self.emit('upgradeError', error);
	  }
	
	  function onTransportClose() {
	    onerror('transport closed');
	  }
	
	  // When the socket is closed while we're probing
	  function onclose() {
	    onerror('socket closed');
	  }
	
	  // When the socket is upgraded while we're probing
	  function onupgrade(to) {
	    if (transport && to.name !== transport.name) {
	
	      freezeTransport();
	    }
	  }
	
	  // Remove all listeners on the transport and on self
	  function cleanup() {
	    transport.removeListener('open', onTransportOpen);
	    transport.removeListener('error', onerror);
	    transport.removeListener('close', onTransportClose);
	    self.removeListener('close', onclose);
	    self.removeListener('upgrading', onupgrade);
	  }
	
	  transport.once('open', onTransportOpen);
	  transport.once('error', onerror);
	  transport.once('close', onTransportClose);
	
	  this.once('close', onclose);
	  this.once('upgrading', onupgrade);
	
	  transport.open();
	};
	
	/**
	 * Called when connection is deemed open.
	 *
	 * @api public
	 */
	
	Socket.prototype.onOpen = function () {
	
	  this.readyState = 'open';
	  Socket.priorWebsocketSuccess = 'websocket' === this.transport.name;
	  this.emit('open');
	  this.flush();
	
	  // we check for `readyState` in case an `open`
	  // listener already closed the socket
	  if ('open' === this.readyState && this.upgrade && this.transport.pause) {
	
	    for (var i = 0, l = this.upgrades.length; i < l; i++) {
	      this.probe(this.upgrades[i]);
	    }
	  }
	};
	
	/**
	 * Handles a packet.
	 *
	 * @api private
	 */
	
	Socket.prototype.onPacket = function (packet) {
	  if ('opening' === this.readyState || 'open' === this.readyState || 'closing' === this.readyState) {
	
	    this.emit('packet', packet);
	
	    // Socket is live - any packet counts
	    this.emit('heartbeat');
	
	    switch (packet.type) {
	      case 'open':
	        this.onHandshake(JSON.parse(packet.data));
	        break;
	
	      case 'pong':
	        this.setPing();
	        this.emit('pong');
	        break;
	
	      case 'error':
	        var err = new Error('server error');
	        err.code = packet.data;
	        this.onError(err);
	        break;
	
	      case 'message':
	        this.emit('data', packet.data);
	        this.emit('message', packet.data);
	        break;
	    }
	  } else {}
	};
	
	/**
	 * Called upon handshake completion.
	 *
	 * @param {Object} handshake obj
	 * @api private
	 */
	
	Socket.prototype.onHandshake = function (data) {
	  this.emit('handshake', data);
	  this.id = data.sid;
	  this.transport.query.sid = data.sid;
	  this.upgrades = this.filterUpgrades(data.upgrades);
	  this.pingInterval = data.pingInterval;
	  this.pingTimeout = data.pingTimeout;
	  this.onOpen();
	  // In case open handler closes socket
	  if ('closed' === this.readyState) return;
	  this.setPing();
	
	  // Prolong liveness of socket on heartbeat
	  this.removeListener('heartbeat', this.onHeartbeat);
	  this.on('heartbeat', this.onHeartbeat);
	};
	
	/**
	 * Resets ping timeout.
	 *
	 * @api private
	 */
	
	Socket.prototype.onHeartbeat = function (timeout) {
	  clearTimeout(this.pingTimeoutTimer);
	  var self = this;
	  self.pingTimeoutTimer = setTimeout(function () {
	    if ('closed' === self.readyState) return;
	    self.onClose('ping timeout');
	  }, timeout || self.pingInterval + self.pingTimeout);
	};
	
	/**
	 * Pings server every `this.pingInterval` and expects response
	 * within `this.pingTimeout` or closes connection.
	 *
	 * @api private
	 */
	
	Socket.prototype.setPing = function () {
	  var self = this;
	  clearTimeout(self.pingIntervalTimer);
	  self.pingIntervalTimer = setTimeout(function () {
	
	    self.ping();
	    self.onHeartbeat(self.pingTimeout);
	  }, self.pingInterval);
	};
	
	/**
	* Sends a ping packet.
	*
	* @api private
	*/
	
	Socket.prototype.ping = function () {
	  var self = this;
	  this.sendPacket('ping', function () {
	    self.emit('ping');
	  });
	};
	
	/**
	 * Called on `drain` event
	 *
	 * @api private
	 */
	
	Socket.prototype.onDrain = function () {
	  this.writeBuffer.splice(0, this.prevBufferLen);
	
	  // setting prevBufferLen = 0 is very important
	  // for example, when upgrading, upgrade packet is sent over,
	  // and a nonzero prevBufferLen could cause problems on `drain`
	  this.prevBufferLen = 0;
	
	  if (0 === this.writeBuffer.length) {
	    this.emit('drain');
	  } else {
	    this.flush();
	  }
	};
	
	/**
	 * Flush write buffers.
	 *
	 * @api private
	 */
	
	Socket.prototype.flush = function () {
	  if ('closed' !== this.readyState && this.transport.writable && !this.upgrading && this.writeBuffer.length) {
	
	    this.transport.send(this.writeBuffer);
	    // keep track of current length of writeBuffer
	    // splice writeBuffer and callbackBuffer on `drain`
	    this.prevBufferLen = this.writeBuffer.length;
	    this.emit('flush');
	  }
	};
	
	/**
	 * Sends a message.
	 *
	 * @param {String} message.
	 * @param {Function} callback function.
	 * @param {Object} options.
	 * @return {Socket} for chaining.
	 * @api public
	 */
	
	Socket.prototype.write = Socket.prototype.send = function (msg, options, fn) {
	  this.sendPacket('message', msg, options, fn);
	  return this;
	};
	
	/**
	 * Sends a packet.
	 *
	 * @param {String} packet type.
	 * @param {String} data.
	 * @param {Object} options.
	 * @param {Function} callback function.
	 * @api private
	 */
	
	Socket.prototype.sendPacket = function (type, data, options, fn) {
	  if ('function' === typeof data) {
	    fn = data;
	    data = undefined;
	  }
	
	  if ('function' === typeof options) {
	    fn = options;
	    options = null;
	  }
	
	  if ('closing' === this.readyState || 'closed' === this.readyState) {
	    return;
	  }
	
	  options = options || {};
	  options.compress = false !== options.compress;
	
	  var packet = {
	    type: type,
	    data: data,
	    options: options
	  };
	  this.emit('packetCreate', packet);
	  this.writeBuffer.push(packet);
	  if (fn) this.once('flush', fn);
	  this.flush();
	};
	
	/**
	 * Closes the connection.
	 *
	 * @api private
	 */
	
	Socket.prototype.close = function () {
	  if ('opening' === this.readyState || 'open' === this.readyState) {
	    this.readyState = 'closing';
	
	    var self = this;
	
	    if (this.writeBuffer.length) {
	      this.once('drain', function () {
	        if (this.upgrading) {
	          waitForUpgrade();
	        } else {
	          close();
	        }
	      });
	    } else if (this.upgrading) {
	      waitForUpgrade();
	    } else {
	      close();
	    }
	  }
	
	  function close() {
	    self.onClose('forced close');
	
	    self.transport.close();
	  }
	
	  function cleanupAndClose() {
	    self.removeListener('upgrade', cleanupAndClose);
	    self.removeListener('upgradeError', cleanupAndClose);
	    close();
	  }
	
	  function waitForUpgrade() {
	    // wait for upgrade to finish since we can't send packets while pausing a transport
	    self.once('upgrade', cleanupAndClose);
	    self.once('upgradeError', cleanupAndClose);
	  }
	
	  return this;
	};
	
	/**
	 * Called upon transport error
	 *
	 * @api private
	 */
	
	Socket.prototype.onError = function (err) {
	
	  Socket.priorWebsocketSuccess = false;
	  this.emit('error', err);
	  this.onClose('transport error', err);
	};
	
	/**
	 * Called upon transport close.
	 *
	 * @api private
	 */
	
	Socket.prototype.onClose = function (reason, desc) {
	  if ('opening' === this.readyState || 'open' === this.readyState || 'closing' === this.readyState) {
	
	    var self = this;
	
	    // clear timers
	    clearTimeout(this.pingIntervalTimer);
	    clearTimeout(this.pingTimeoutTimer);
	
	    // stop event from firing again for transport
	    this.transport.removeAllListeners('close');
	
	    // ensure transport won't stay open
	    this.transport.close();
	
	    // ignore further transport communication
	    this.transport.removeAllListeners();
	
	    // set ready state
	    this.readyState = 'closed';
	
	    // clear session id
	    this.id = null;
	
	    // emit close event
	    this.emit('close', reason, desc);
	
	    // clean buffers after, so users can still
	    // grab the buffers on `close` event
	    self.writeBuffer = [];
	    self.prevBufferLen = 0;
	  }
	};
	
	/**
	 * Filters upgrades, returning only those matching client transports.
	 *
	 * @param {Array} server upgrades
	 * @api private
	 *
	 */
	
	Socket.prototype.filterUpgrades = function (upgrades) {
	  var filteredUpgrades = [];
	  for (var i = 0, j = upgrades.length; i < j; i++) {
	    if (~index(this.transports, upgrades[i])) filteredUpgrades.push(upgrades[i]);
	  }
	  return filteredUpgrades;
	};

/***/ }),
/* 11 */
/***/ (function(module, exports, __webpack_require__) {

	'use strict';
	
	/**
	 * Module dependencies
	 */
	
	// var XMLHttpRequest = require('xmlhttprequest-ssl');
	// var XHR = require('./polling-xhr');
	
	var JSONP = __webpack_require__(12);
	var websocket = __webpack_require__(27);
	
	/**
	 * Export transports.
	 */
	
	exports.polling = polling;
	exports.websocket = websocket;
	
	/**
	 * Polling transport polymorphic constructor.
	 * Decides on xhr vs jsonp based on feature detection.
	 *
	 * @api private
	 */
	
	function polling(opts) {
	  var xhr;
	  var xd = false;
	  var xs = false;
	  var jsonp = false !== opts.jsonp;
	
	  if (typeof location !== 'undefined') {
	    var isSSL = 'https:' === location.protocol;
	    var port = location.port;
	
	    // some user agents have empty `location.port`
	    if (!port) {
	      port = isSSL ? 443 : 80;
	    }
	
	    xd = opts.hostname !== location.hostname || port !== opts.port;
	    xs = opts.secure !== isSSL;
	  }
	
	  opts.xdomain = xd;
	  opts.xscheme = xs;
	  // xhr = new XMLHttpRequest(opts);
	  //
	  // if ('open' in xhr && !opts.forceJSONP) {
	  //   return new XHR(opts);
	  // } else {
	  //   if (!jsonp) throw new Error('JSONP disabled');
	  return new JSONP(opts);
	  // }
	}

/***/ }),
/* 12 */
/***/ (function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(global) {'use strict';
	
	/**
	 * Module requirements.
	 */
	
	var Polling = __webpack_require__(13);
	var inherit = __webpack_require__(23);
	
	/**
	 * Module exports.
	 */
	
	module.exports = JSONPPolling;
	
	/**
	 * Cached regular expressions.
	 */
	
	var rNewline = /\n/g;
	var rEscapedNewline = /\\n/g;
	
	/**
	 * Global JSONP callbacks.
	 */
	
	var callbacks;
	
	/**
	 * Noop.
	 */
	
	function empty() {}
	
	/**
	 * Until https://github.com/tc39/proposal-global is shipped.
	 */
	function glob() {
	  return typeof self !== 'undefined' ? self : typeof window !== 'undefined' ? window : typeof global !== 'undefined' ? global : {};
	}
	
	/**
	 * JSONP Polling constructor.
	 *
	 * @param {Object} opts.
	 * @api public
	 */
	
	function JSONPPolling(opts) {
	  Polling.call(this, opts);
	
	  this.query = this.query || {};
	
	  // define global callbacks array if not present
	  // we do this here (lazily) to avoid unneeded global pollution
	  if (!callbacks) {
	    // we need to consider multiple engines in the same page
	    var global = glob();
	    callbacks = global.___eio = global.___eio || [];
	  }
	
	  // callback identifier
	  this.index = callbacks.length;
	
	  // add callback to jsonp global
	  var self = this;
	  callbacks.push(function (msg) {
	    self.onData(msg);
	  });
	
	  // append to query string
	  this.query.j = this.index;
	
	  // prevent spurious errors from being emitted when the window is unloaded
	  if (typeof addEventListener === 'function') {
	    addEventListener('beforeunload', function () {
	      if (self.script) self.script.onerror = empty;
	    }, false);
	  }
	}
	
	/**
	 * Inherits from Polling.
	 */
	
	inherit(JSONPPolling, Polling);
	
	/*
	 * JSONP only supports binary as base64 encoded strings
	 */
	
	JSONPPolling.prototype.supportsBinary = false;
	
	/**
	 * Closes the socket.
	 *
	 * @api private
	 */
	
	JSONPPolling.prototype.doClose = function () {
	  if (this.script) {
	    this.script.parentNode.removeChild(this.script);
	    this.script = null;
	  }
	
	  if (this.form) {
	    this.form.parentNode.removeChild(this.form);
	    this.form = null;
	    this.iframe = null;
	  }
	
	  Polling.prototype.doClose.call(this);
	};
	
	/**
	 * Starts a poll cycle.
	 *
	 * @api private
	 */
	
	JSONPPolling.prototype.doPoll = function () {
	  var self = this;
	  var script = document.createElement('script');
	
	  if (this.script) {
	    this.script.parentNode.removeChild(this.script);
	    this.script = null;
	  }
	
	  script.async = true;
	  script.src = this.uri();
	  script.onerror = function (e) {
	    self.onError('jsonp poll error', e);
	  };
	
	  var insertAt = document.getElementsByTagName('script')[0];
	  if (insertAt) {
	    insertAt.parentNode.insertBefore(script, insertAt);
	  } else {
	    (document.head || document.body).appendChild(script);
	  }
	  this.script = script;
	
	  var isUAgecko = 'undefined' !== typeof navigator && /gecko/i.test(navigator.userAgent);
	
	  if (isUAgecko) {
	    setTimeout(function () {
	      var iframe = document.createElement('iframe');
	      document.body.appendChild(iframe);
	      document.body.removeChild(iframe);
	    }, 100);
	  }
	};
	
	/**
	 * Writes with a hidden iframe.
	 *
	 * @param {String} data to send
	 * @param {Function} called upon flush.
	 * @api private
	 */
	
	JSONPPolling.prototype.doWrite = function (data, fn) {
	  var self = this;
	
	  if (!this.form) {
	    var form = document.createElement('form');
	    var area = document.createElement('textarea');
	    var id = this.iframeId = 'eio_iframe_' + this.index;
	    var iframe;
	
	    form.className = 'socketio';
	    form.style.position = 'absolute';
	    form.style.top = '-1000px';
	    form.style.left = '-1000px';
	    form.target = id;
	    form.method = 'POST';
	    form.setAttribute('accept-charset', 'utf-8');
	    area.name = 'd';
	    form.appendChild(area);
	    document.body.appendChild(form);
	
	    this.form = form;
	    this.area = area;
	  }
	
	  this.form.action = this.uri();
	
	  function complete() {
	    initIframe();
	    fn();
	  }
	
	  function initIframe() {
	    if (self.iframe) {
	      try {
	        self.form.removeChild(self.iframe);
	      } catch (e) {
	        self.onError('jsonp polling iframe removal error', e);
	      }
	    }
	
	    try {
	      // ie6 dynamic iframes with target="" support (thanks Chris Lambacher)
	      var html = '<iframe src="javascript:0" name="' + self.iframeId + '">';
	      iframe = document.createElement(html);
	    } catch (e) {
	      iframe = document.createElement('iframe');
	      iframe.name = self.iframeId;
	      iframe.src = 'javascript:0';
	    }
	
	    iframe.id = self.iframeId;
	
	    self.form.appendChild(iframe);
	    self.iframe = iframe;
	  }
	
	  initIframe();
	
	  // escape \n to prevent it from being converted into \r\n by some UAs
	  // double escaping is required for escaped new lines because unescaping of new lines can be done safely on server-side
	  data = data.replace(rEscapedNewline, '\\\n');
	  this.area.value = data.replace(rNewline, '\\n');
	
	  try {
	    this.form.submit();
	  } catch (e) {}
	
	  if (this.iframe.attachEvent) {
	    this.iframe.onreadystatechange = function () {
	      if (self.iframe.readyState === 'complete') {
	        complete();
	      }
	    };
	  } else {
	    this.iframe.onload = complete;
	  }
	};
	/* WEBPACK VAR INJECTION */}.call(exports, (function() { return this; }())))

/***/ }),
/* 13 */
/***/ (function(module, exports, __webpack_require__) {

	'use strict';
	
	/**
	 * Module dependencies.
	 */
	
	var Transport = __webpack_require__(14);
	var parseqs = __webpack_require__(22);
	var parser = __webpack_require__(15);
	var inherit = __webpack_require__(23);
	var yeast = __webpack_require__(24);
	var debug = __webpack_require__(4)('engine.io-client:polling');
	
	/**
	 * Module exports.
	 */
	
	module.exports = Polling;
	
	/**
	 * Is XHR2 supported?
	 */
	
	var hasXHR2 = function () {
	  var XMLHttpRequest = __webpack_require__(25);
	  var xhr = new XMLHttpRequest({ xdomain: false });
	  return null != xhr.responseType;
	}();
	
	/**
	 * Polling interface.
	 *
	 * @param {Object} opts
	 * @api private
	 */
	
	function Polling(opts) {
	  var forceBase64 = opts && opts.forceBase64;
	  if (!hasXHR2 || forceBase64) {
	    this.supportsBinary = false;
	  }
	  Transport.call(this, opts);
	}
	
	/**
	 * Inherits from Transport.
	 */
	
	inherit(Polling, Transport);
	
	/**
	 * Transport name.
	 */
	
	Polling.prototype.name = 'polling';
	
	/**
	 * Opens the socket (triggers polling). We write a PING message to determine
	 * when the transport is open.
	 *
	 * @api private
	 */
	
	Polling.prototype.doOpen = function () {
	  this.poll();
	};
	
	/**
	 * Pauses polling.
	 *
	 * @param {Function} callback upon buffers are flushed and transport is paused
	 * @api private
	 */
	
	Polling.prototype.pause = function (onPause) {
	  var self = this;
	
	  this.readyState = 'pausing';
	
	  function pause() {
	
	    self.readyState = 'paused';
	    onPause();
	  }
	
	  if (this.polling || !this.writable) {
	    var total = 0;
	
	    if (this.polling) {
	
	      total++;
	      this.once('pollComplete', function () {
	
	        --total || pause();
	      });
	    }
	
	    if (!this.writable) {
	
	      total++;
	      this.once('drain', function () {
	
	        --total || pause();
	      });
	    }
	  } else {
	    pause();
	  }
	};
	
	/**
	 * Starts polling cycle.
	 *
	 * @api public
	 */
	
	Polling.prototype.poll = function () {
	
	  this.polling = true;
	  this.doPoll();
	  this.emit('poll');
	};
	
	/**
	 * Overloads onData to detect payloads.
	 *
	 * @api private
	 */
	
	Polling.prototype.onData = function (data) {
	  var self = this;
	
	  var callback = function callback(packet, index, total) {
	    // if its the first message we consider the transport open
	    if ('opening' === self.readyState) {
	      self.onOpen();
	    }
	
	    // if its a close packet, we close the ongoing requests
	    if ('close' === packet.type) {
	      self.onClose();
	      return false;
	    }
	
	    // otherwise bypass onData and handle the message
	    self.onPacket(packet);
	  };
	
	  // decode payload
	  parser.decodePayload(data, this.socket.binaryType, callback);
	
	  // if an event did not trigger closing
	  if ('closed' !== this.readyState) {
	    // if we got data we're not polling
	    this.polling = false;
	    this.emit('pollComplete');
	
	    if ('open' === this.readyState) {
	      this.poll();
	    } else {}
	  }
	};
	
	/**
	 * For polling, send a close packet.
	 *
	 * @api private
	 */
	
	Polling.prototype.doClose = function () {
	  var self = this;
	
	  function close() {
	
	    self.write([{ type: 'close' }]);
	  }
	
	  if ('open' === this.readyState) {
	
	    close();
	  } else {
	    // in case we're trying to close while
	    // handshaking is in progress (GH-164)
	
	    this.once('open', close);
	  }
	};
	
	/**
	 * Writes a packets payload.
	 *
	 * @param {Array} data packets
	 * @param {Function} drain callback
	 * @api private
	 */
	
	Polling.prototype.write = function (packets) {
	  var self = this;
	  this.writable = false;
	  var callbackfn = function callbackfn() {
	    self.writable = true;
	    self.emit('drain');
	  };
	
	  parser.encodePayload(packets, this.supportsBinary, function (data) {
	    self.doWrite(data, callbackfn);
	  });
	};
	
	/**
	 * Generates uri for connection.
	 *
	 * @api private
	 */
	
	Polling.prototype.uri = function () {
	  var query = this.query || {};
	  var schema = this.secure ? 'https' : 'http';
	  var port = '';
	
	  // cache busting is forced
	  if (false !== this.timestampRequests) {
	    query[this.timestampParam] = yeast();
	  }
	
	  if (!this.supportsBinary && !query.sid) {
	    query.b64 = 1;
	  }
	
	  query = parseqs.encode(query);
	
	  // avoid port if default for schema
	  if (this.port && ('https' === schema && Number(this.port) !== 443 || 'http' === schema && Number(this.port) !== 80)) {
	    port = ':' + this.port;
	  }
	
	  // prepend ? to query
	  if (query.length) {
	    query = '?' + query;
	  }
	
	  var ipv6 = this.hostname.indexOf(':') !== -1;
	  return schema + '://' + (ipv6 ? '[' + this.hostname + ']' : this.hostname) + port + this.path + query;
	};

/***/ }),
/* 14 */
/***/ (function(module, exports, __webpack_require__) {

	'use strict';
	
	/**
	 * Module dependencies.
	 */
	
	var parser = __webpack_require__(15);
	var Emitter = __webpack_require__(6);
	
	/**
	 * Module exports.
	 */
	
	module.exports = Transport;
	
	/**
	 * Transport abstract constructor.
	 *
	 * @param {Object} options.
	 * @api private
	 */
	
	function Transport(opts) {
	  this.path = opts.path;
	  this.hostname = opts.hostname;
	  this.port = opts.port;
	  this.secure = opts.secure;
	  this.query = opts.query;
	  this.timestampParam = opts.timestampParam;
	  this.timestampRequests = opts.timestampRequests;
	  this.readyState = '';
	  this.agent = opts.agent || false;
	  this.socket = opts.socket;
	  this.enablesXDR = opts.enablesXDR;
	
	  // SSL options for Node.js client
	  this.pfx = opts.pfx;
	  this.key = opts.key;
	  this.passphrase = opts.passphrase;
	  this.cert = opts.cert;
	  this.ca = opts.ca;
	  this.ciphers = opts.ciphers;
	  this.rejectUnauthorized = opts.rejectUnauthorized;
	  this.forceNode = opts.forceNode;
	
	  // results of ReactNative environment detection
	  this.isReactNative = opts.isReactNative;
	
	  // other options for Node.js client
	  this.extraHeaders = opts.extraHeaders;
	  this.localAddress = opts.localAddress;
	}
	
	/**
	 * Mix in `Emitter`.
	 */
	
	Emitter(Transport.prototype);
	
	/**
	 * Emits an error.
	 *
	 * @param {String} str
	 * @return {Transport} for chaining
	 * @api public
	 */
	
	Transport.prototype.onError = function (msg, desc) {
	  var err = new Error(msg);
	  err.type = 'TransportError';
	  err.description = desc;
	  this.emit('error', err);
	  return this;
	};
	
	/**
	 * Opens the transport.
	 *
	 * @api public
	 */
	
	Transport.prototype.open = function () {
	  if ('closed' === this.readyState || '' === this.readyState) {
	    this.readyState = 'opening';
	    this.doOpen();
	  }
	
	  return this;
	};
	
	/**
	 * Closes the transport.
	 *
	 * @api private
	 */
	
	Transport.prototype.close = function () {
	  if ('opening' === this.readyState || 'open' === this.readyState) {
	    this.doClose();
	    this.onClose();
	  }
	
	  return this;
	};
	
	/**
	 * Sends multiple packets.
	 *
	 * @param {Array} packets
	 * @api private
	 */
	
	Transport.prototype.send = function (packets) {
	  if ('open' === this.readyState) {
	    this.write(packets);
	  } else {
	    throw new Error('Transport not open');
	  }
	};
	
	/**
	 * Called upon open
	 *
	 * @api private
	 */
	
	Transport.prototype.onOpen = function () {
	  this.readyState = 'open';
	  this.writable = true;
	  this.emit('open');
	};
	
	/**
	 * Called with data.
	 *
	 * @param {String} data
	 * @api private
	 */
	
	Transport.prototype.onData = function (data) {
	  var packet = parser.decodePacket(data, this.socket.binaryType);
	  this.onPacket(packet);
	};
	
	/**
	 * Called with a decoded packet.
	 */
	
	Transport.prototype.onPacket = function (packet) {
	  this.emit('packet', packet);
	};
	
	/**
	 * Called upon close.
	 *
	 * @api private
	 */
	
	Transport.prototype.onClose = function () {
	  this.readyState = 'closed';
	  this.emit('close');
	};

/***/ }),
/* 15 */
/***/ (function(module, exports, __webpack_require__) {

	'use strict';
	
	/**
	 * Module dependencies.
	 */
	var keys = __webpack_require__(16);
	var hasBinary = __webpack_require__(17);
	// var sliceBuffer = require('arraybuffer.slice');
	var after = __webpack_require__(19);
	var utf8 = __webpack_require__(20);
	
	// var base64encoder;
	// if (typeof ArrayBuffer !== 'undefined') {
	//   base64encoder = require('base64-arraybuffer');
	// }
	
	/**
	 * Check if we are running an android browser. That requires us to use
	 * ArrayBuffer with polling transports...
	 *
	 * http://ghinda.net/jpeg-blob-ajax-android/
	 */
	
	var isAndroid = typeof navigator !== 'undefined' && /Android/i.test(navigator.userAgent);
	
	/**
	 * Check if we are running in PhantomJS.
	 * Uploading a Blob with PhantomJS does not work correctly, as reported here:
	 * https://github.com/ariya/phantomjs/issues/11395
	 * @type boolean
	 */
	var isPhantomJS = typeof navigator !== 'undefined' && /PhantomJS/i.test(navigator.userAgent);
	
	/**
	 * When true, avoids using Blobs to encode payloads.
	 * @type boolean
	 */
	var dontSendBlobs = isAndroid || isPhantomJS;
	
	/**
	 * Current protocol version.
	 */
	
	exports.protocol = 3;
	
	/**
	 * Packet types.
	 */
	
	var packets = exports.packets = {
	  open: 0 // non-ws
	  , close: 1 // non-ws
	  , ping: 2,
	  pong: 3,
	  message: 4,
	  upgrade: 5,
	  noop: 6
	};
	
	var packetslist = keys(packets);
	
	/**
	 * Premade error packet.
	 */
	
	var err = { type: 'error', data: 'parser error' };
	
	/**
	 * Create a blob api even for blob builder when vendor prefixes exist
	 */
	
	var Blob = __webpack_require__(21);
	
	/**
	 * Encodes a packet.
	 *
	 *     <packet type id> [ <data> ]
	 *
	 * Example:
	 *
	 *     5hello world
	 *     3
	 *     4
	 *
	 * Binary is encoded in an identical principle
	 *
	 * @api private
	 */
	
	exports.encodePacket = function (packet, supportsBinary, utf8encode, callback) {
	  if (typeof supportsBinary === 'function') {
	    callback = supportsBinary;
	    supportsBinary = false;
	  }
	
	  if (typeof utf8encode === 'function') {
	    callback = utf8encode;
	    utf8encode = null;
	  }
	
	  var data = packet.data === undefined ? undefined : packet.data.buffer || packet.data;
	
	  // if (typeof ArrayBuffer !== 'undefined' && data instanceof ArrayBuffer) {
	  //   return encodeArrayBuffer(packet, supportsBinary, callback);
	  // } else if (typeof Blob !== 'undefined' && data instanceof Blob) {
	  //   return encodeBlob(packet, supportsBinary, callback);
	  // }
	  //
	  // // might be an object with { base64: true, data: dataAsBase64String }
	  // if (data && data.base64) {
	  //   return encodeBase64Object(packet, callback);
	  // }
	
	  // Sending data as a utf-8 string
	  var encoded = packets[packet.type];
	
	  // data fragment is optional
	  if (undefined !== packet.data) {
	    encoded += utf8encode ? utf8.encode(String(packet.data), { strict: false }) : String(packet.data);
	  }
	
	  return callback('' + encoded);
	};
	
	// function encodeBase64Object(packet, callback) {
	//   // packet data is an object { base64: true, data: dataAsBase64String }
	//   var message = 'b' + exports.packets[packet.type] + packet.data.data;
	//   return callback(message);
	// }
	
	/**
	 * Encode packet helpers for binary types
	 */
	
	// function encodeArrayBuffer(packet, supportsBinary, callback) {
	//   if (!supportsBinary) {
	//     return exports.encodeBase64Packet(packet, callback);
	//   }
	//
	//   var data = packet.data;
	//   var contentArray = new Uint8Array(data);
	//   var resultBuffer = new Uint8Array(1 + data.byteLength);
	//
	//   resultBuffer[0] = packets[packet.type];
	//   for (var i = 0; i < contentArray.length; i++) {
	//     resultBuffer[i+1] = contentArray[i];
	//   }
	//
	//   return callback(resultBuffer.buffer);
	// }
	//
	// function encodeBlobAsArrayBuffer(packet, supportsBinary, callback) {
	//   if (!supportsBinary) {
	//     return exports.encodeBase64Packet(packet, callback);
	//   }
	//
	//   var fr = new FileReader();
	//   fr.onload = function() {
	//     exports.encodePacket({ type: packet.type, data: fr.result }, supportsBinary, true, callback);
	//   };
	//   return fr.readAsArrayBuffer(packet.data);
	// }
	//
	// function encodeBlob(packet, supportsBinary, callback) {
	//   if (!supportsBinary) {
	//     return exports.encodeBase64Packet(packet, callback);
	//   }
	//
	//   if (dontSendBlobs) {
	//     return encodeBlobAsArrayBuffer(packet, supportsBinary, callback);
	//   }
	//
	//   var length = new Uint8Array(1);
	//   length[0] = packets[packet.type];
	//   var blob = new Blob([length.buffer, packet.data]);
	//
	//   return callback(blob);
	// }
	
	/**
	 * Encodes a packet with binary data in a base64 string
	 *
	 * @param {Object} packet, has `type` and `data`
	 * @return {String} base64 encoded message
	 */
	
	// exports.encodeBase64Packet = function(packet, callback) {
	//   var message = 'b' + exports.packets[packet.type];
	//   if (typeof Blob !== 'undefined' && packet.data instanceof Blob) {
	//     var fr = new FileReader();
	//     fr.onload = function() {
	//       var b64 = fr.result.split(',')[1];
	//       callback(message + b64);
	//     };
	//     return fr.readAsDataURL(packet.data);
	//   }
	//
	//   var b64data;
	//   try {
	//     b64data = String.fromCharCode.apply(null, new Uint8Array(packet.data));
	//   } catch (e) {
	//     // iPhone Safari doesn't let you apply with typed arrays
	//     var typed = new Uint8Array(packet.data);
	//     var basic = new Array(typed.length);
	//     for (var i = 0; i < typed.length; i++) {
	//       basic[i] = typed[i];
	//     }
	//     b64data = String.fromCharCode.apply(null, basic);
	//   }
	//   message += btoa(b64data);
	//   return callback(message);
	// };
	
	/**
	 * Decodes a packet. Changes format to Blob if requested.
	 *
	 * @return {Object} with `type` and `data` (if any)
	 * @api private
	 */
	
	exports.decodePacket = function (data, binaryType, utf8decode) {
	  if (data === undefined) {
	    return err;
	  }
	  // String data
	  if (typeof data === 'string') {
	    // if (data.charAt(0) === 'b') {
	    //   return exports.decodeBase64Packet(data.substr(1), binaryType);
	    // }
	
	    if (utf8decode) {
	      data = tryDecode(data);
	      if (data === false) {
	        return err;
	      }
	    }
	    var type = data.charAt(0);
	
	    if (Number(type) != type || !packetslist[type]) {
	      return err;
	    }
	
	    if (data.length > 1) {
	      return { type: packetslist[type], data: data.substring(1) };
	    } else {
	      return { type: packetslist[type] };
	    }
	  }
	
	  var asArray = new Uint8Array(data);
	  var type = asArray[0];
	  var rest = sliceBuffer(data, 1);
	  if (Blob && binaryType === 'blob') {
	    rest = new Blob([rest]);
	  }
	  return { type: packetslist[type], data: rest };
	};
	
	function tryDecode(data) {
	  try {
	    data = utf8.decode(data, { strict: false });
	  } catch (e) {
	    return false;
	  }
	  return data;
	}
	
	/**
	 * Decodes a packet encoded in a base64 string
	 *
	 * @param {String} base64 encoded message
	 * @return {Object} with `type` and `data` (if any)
	 */
	
	// exports.decodeBase64Packet = function(msg, binaryType) {
	//   var type = packetslist[msg.charAt(0)];
	//   if (!base64encoder) {
	//     return { type: type, data: { base64: true, data: msg.substr(1) } };
	//   }
	//
	//   var data = base64encoder.decode(msg.substr(1));
	//
	//   if (binaryType === 'blob' && Blob) {
	//     data = new Blob([data]);
	//   }
	//
	//   return { type: type, data: data };
	// };
	
	/**
	 * Encodes multiple messages (payload).
	 *
	 *     <length>:data
	 *
	 * Example:
	 *
	 *     11:hello world2:hi
	 *
	 * If any contents are binary, they will be encoded as base64 strings. Base64
	 * encoded strings are marked with a b before the length specifier
	 *
	 * @param {Array} packets
	 * @api private
	 */
	
	exports.encodePayload = function (packets, supportsBinary, callback) {
	  if (typeof supportsBinary === 'function') {
	    callback = supportsBinary;
	    supportsBinary = null;
	  }
	
	  var isBinary = hasBinary(packets);
	  //
	  // if (supportsBinary && isBinary) {
	  //   if (Blob && !dontSendBlobs) {
	  //     return exports.encodePayloadAsBlob(packets, callback);
	  //   }
	  //
	  //   return exports.encodePayloadAsArrayBuffer(packets, callback);
	  // }
	
	  if (!packets.length) {
	    return callback('0:');
	  }
	
	  function setLengthHeader(message) {
	    return message.length + ':' + message;
	  }
	
	  function encodeOne(packet, doneCallback) {
	    exports.encodePacket(packet, !isBinary ? false : supportsBinary, false, function (message) {
	      doneCallback(null, setLengthHeader(message));
	    });
	  }
	
	  map(packets, encodeOne, function (err, results) {
	    return callback(results.join(''));
	  });
	};
	
	/**
	 * Async array map using after
	 */
	
	function map(ary, each, done) {
	  var result = new Array(ary.length);
	  var next = after(ary.length, done);
	
	  var eachWithIndex = function eachWithIndex(i, el, cb) {
	    each(el, function (error, msg) {
	      result[i] = msg;
	      cb(error, result);
	    });
	  };
	
	  for (var i = 0; i < ary.length; i++) {
	    eachWithIndex(i, ary[i], next);
	  }
	}
	
	/*
	 * Decodes data when a payload is maybe expected. Possible binary contents are
	 * decoded from their base64 representation
	 *
	 * @param {String} data, callback method
	 * @api public
	 */
	
	exports.decodePayload = function (data, binaryType, callback) {
	  // if (typeof data !== 'string') {
	  //   return exports.decodePayloadAsBinary(data, binaryType, callback);
	  // }
	
	  if (typeof binaryType === 'function') {
	    callback = binaryType;
	    binaryType = null;
	  }
	
	  var packet;
	  if (data === '') {
	    // parser error - ignoring payload
	    return callback(err, 0, 1);
	  }
	
	  var length = '',
	      n,
	      msg;
	
	  for (var i = 0, l = data.length; i < l; i++) {
	    var chr = data.charAt(i);
	
	    if (chr !== ':') {
	      length += chr;
	      continue;
	    }
	
	    if (length === '' || length != (n = Number(length))) {
	      // parser error - ignoring payload
	      return callback(err, 0, 1);
	    }
	
	    msg = data.substr(i + 1, n);
	
	    if (length != msg.length) {
	      // parser error - ignoring payload
	      return callback(err, 0, 1);
	    }
	
	    if (msg.length) {
	      packet = exports.decodePacket(msg, binaryType, false);
	
	      if (err.type === packet.type && err.data === packet.data) {
	        // parser error in individual packet - ignoring payload
	        return callback(err, 0, 1);
	      }
	
	      var ret = callback(packet, i + n, l);
	      if (false === ret) return;
	    }
	
	    // advance cursor
	    i += n;
	    length = '';
	  }
	
	  if (length !== '') {
	    // parser error - ignoring payload
	    return callback(err, 0, 1);
	  }
	};
	
	/**
	 * Encodes multiple messages (payload) as binary.
	 *
	 * <1 = binary, 0 = string><number from 0-9><number from 0-9>[...]<number
	 * 255><data>
	 *
	 * Example:
	 * 1 3 255 1 2 3, if the binary contents are interpreted as 8 bit integers
	 *
	 * @param {Array} packets
	 * @return {ArrayBuffer} encoded payload
	 * @api private
	 */
	
	// exports.encodePayloadAsArrayBuffer = function(packets, callback) {
	//   if (!packets.length) {
	//     return callback(new ArrayBuffer(0));
	//   }
	//
	//   function encodeOne(packet, doneCallback) {
	//     exports.encodePacket(packet, true, true, function(data) {
	//       return doneCallback(null, data);
	//     });
	//   }
	//
	//   map(packets, encodeOne, function(err, encodedPackets) {
	//     var totalLength = encodedPackets.reduce(function(acc, p) {
	//       var len;
	//       if (typeof p === 'string'){
	//         len = p.length;
	//       } else {
	//         len = p.byteLength;
	//       }
	//       return acc + len.toString().length + len + 2; // string/binary identifier + separator = 2
	//     }, 0);
	//
	//     var resultArray = new Uint8Array(totalLength);
	//
	//     var bufferIndex = 0;
	//     encodedPackets.forEach(function(p) {
	//       var isString = typeof p === 'string';
	//       var ab = p;
	//       if (isString) {
	//         var view = new Uint8Array(p.length);
	//         for (var i = 0; i < p.length; i++) {
	//           view[i] = p.charCodeAt(i);
	//         }
	//         ab = view.buffer;
	//       }
	//
	//       if (isString) { // not true binary
	//         resultArray[bufferIndex++] = 0;
	//       } else { // true binary
	//         resultArray[bufferIndex++] = 1;
	//       }
	//
	//       var lenStr = ab.byteLength.toString();
	//       for (var i = 0; i < lenStr.length; i++) {
	//         resultArray[bufferIndex++] = parseInt(lenStr[i]);
	//       }
	//       resultArray[bufferIndex++] = 255;
	//
	//       var view = new Uint8Array(ab);
	//       for (var i = 0; i < view.length; i++) {
	//         resultArray[bufferIndex++] = view[i];
	//       }
	//     });
	//
	//     return callback(resultArray.buffer);
	//   });
	// };
	
	/**
	 * Encode as Blob
	 */
	
	// exports.encodePayloadAsBlob = function(packets, callback) {
	//   function encodeOne(packet, doneCallback) {
	//     exports.encodePacket(packet, true, true, function(encoded) {
	//       var binaryIdentifier = new Uint8Array(1);
	//       binaryIdentifier[0] = 1;
	//       if (typeof encoded === 'string') {
	//         var view = new Uint8Array(encoded.length);
	//         for (var i = 0; i < encoded.length; i++) {
	//           view[i] = encoded.charCodeAt(i);
	//         }
	//         encoded = view.buffer;
	//         binaryIdentifier[0] = 0;
	//       }
	//
	//       var len = (encoded instanceof ArrayBuffer)
	//         ? encoded.byteLength
	//         : encoded.size;
	//
	//       var lenStr = len.toString();
	//       var lengthAry = new Uint8Array(lenStr.length + 1);
	//       for (var i = 0; i < lenStr.length; i++) {
	//         lengthAry[i] = parseInt(lenStr[i]);
	//       }
	//       lengthAry[lenStr.length] = 255;
	//
	//       if (Blob) {
	//         var blob = new Blob([binaryIdentifier.buffer, lengthAry.buffer, encoded]);
	//         doneCallback(null, blob);
	//       }
	//     });
	//   }
	//
	//   map(packets, encodeOne, function(err, results) {
	//     return callback(new Blob(results));
	//   });
	// };
	
	/*
	 * Decodes data when a payload is maybe expected. Strings are decoded by
	 * interpreting each byte as a key code for entries marked to start with 0. See
	 * description of encodePayloadAsBinary
	 *
	 * @param {ArrayBuffer} data, callback method
	 * @api public
	 */
	
	// exports.decodePayloadAsBinary = function (data, binaryType, callback) {
	//   if (typeof binaryType === 'function') {
	//     callback = binaryType;
	//     binaryType = null;
	//   }
	//
	//   var bufferTail = data;
	//   var buffers = [];
	//
	//   while (bufferTail.byteLength > 0) {
	//     var tailArray = new Uint8Array(bufferTail);
	//     var isString = tailArray[0] === 0;
	//     var msgLength = '';
	//
	//     for (var i = 1; ; i++) {
	//       if (tailArray[i] === 255) break;
	//
	//       // 310 = char length of Number.MAX_VALUE
	//       if (msgLength.length > 310) {
	//         return callback(err, 0, 1);
	//       }
	//
	//       msgLength += tailArray[i];
	//     }
	//
	//     bufferTail = sliceBuffer(bufferTail, 2 + msgLength.length);
	//     msgLength = parseInt(msgLength);
	//
	//     var msg = sliceBuffer(bufferTail, 0, msgLength);
	//     if (isString) {
	//       try {
	//         msg = String.fromCharCode.apply(null, new Uint8Array(msg));
	//       } catch (e) {
	//         // iPhone Safari doesn't let you apply to typed arrays
	//         var typed = new Uint8Array(msg);
	//         msg = '';
	//         for (var i = 0; i < typed.length; i++) {
	//           msg += String.fromCharCode(typed[i]);
	//         }
	//       }
	//     }
	//
	//     buffers.push(msg);
	//     bufferTail = sliceBuffer(bufferTail, msgLength);
	//   }
	//
	//   var total = buffers.length;
	//   buffers.forEach(function(buffer, i) {
	//     callback(exports.decodePacket(buffer, binaryType, true), i, total);
	//   });
	// };

/***/ }),
/* 16 */
/***/ (function(module, exports) {

	"use strict";
	
	/**
	 * Gets the keys for an object.
	 *
	 * @return {Array} keys
	 * @api private
	 */
	
	module.exports = Object.keys || function keys(obj) {
	  var arr = [];
	  var has = Object.prototype.hasOwnProperty;
	
	  for (var i in obj) {
	    if (has.call(obj, i)) {
	      arr.push(i);
	    }
	  }
	  return arr;
	};

/***/ }),
/* 17 */
/***/ (function(module, exports, __webpack_require__) {

	/* global Blob File */
	
	/*
	 * Module requirements.
	 */
	
	var isArray = __webpack_require__(18);
	
	var toString = Object.prototype.toString;
	var withNativeBlob = typeof Blob === 'function' ||
	                        typeof Blob !== 'undefined' && toString.call(Blob) === '[object BlobConstructor]';
	var withNativeFile = typeof File === 'function' ||
	                        typeof File !== 'undefined' && toString.call(File) === '[object FileConstructor]';
	
	/**
	 * Module exports.
	 */
	
	module.exports = hasBinary;
	
	/**
	 * Checks for binary data.
	 *
	 * Supports Buffer, ArrayBuffer, Blob and File.
	 *
	 * @param {Object} anything
	 * @api public
	 */
	
	function hasBinary (obj) {
	  if (!obj || typeof obj !== 'object') {
	    return false;
	  }
	
	  if (isArray(obj)) {
	    for (var i = 0, l = obj.length; i < l; i++) {
	      if (hasBinary(obj[i])) {
	        return true;
	      }
	    }
	    return false;
	  }
	
	  if ((typeof Buffer === 'function' && Buffer.isBuffer && Buffer.isBuffer(obj)) ||
	    (typeof ArrayBuffer === 'function' && obj instanceof ArrayBuffer) ||
	    (withNativeBlob && obj instanceof Blob) ||
	    (withNativeFile && obj instanceof File)
	  ) {
	    return true;
	  }
	
	  // see: https://github.com/Automattic/has-binary/pull/4
	  if (obj.toJSON && typeof obj.toJSON === 'function' && arguments.length === 1) {
	    return hasBinary(obj.toJSON(), true);
	  }
	
	  for (var key in obj) {
	    if (Object.prototype.hasOwnProperty.call(obj, key) && hasBinary(obj[key])) {
	      return true;
	    }
	  }
	
	  return false;
	}


/***/ }),
/* 18 */
/***/ (function(module, exports) {

	var toString = {}.toString;
	
	module.exports = Array.isArray || function (arr) {
	  return toString.call(arr) == '[object Array]';
	};


/***/ }),
/* 19 */
/***/ (function(module, exports) {

	module.exports = after
	
	function after(count, callback, err_cb) {
	    var bail = false
	    err_cb = err_cb || noop
	    proxy.count = count
	
	    return (count === 0) ? callback() : proxy
	
	    function proxy(err, result) {
	        if (proxy.count <= 0) {
	            throw new Error('after called too many times')
	        }
	        --proxy.count
	
	        // after first error, rest are passed to err_cb
	        if (err) {
	            bail = true
	            callback(err)
	            // future error callbacks will go to error handler
	            callback = err_cb
	        } else if (proxy.count === 0 && !bail) {
	            callback(null, result)
	        }
	    }
	}
	
	function noop() {}


/***/ }),
/* 20 */
/***/ (function(module, exports) {

	'use strict';
	
	/*! https://mths.be/utf8js v2.1.2 by @mathias */
	
	var stringFromCharCode = String.fromCharCode;
	
	// Taken from https://mths.be/punycode
	function ucs2decode(string) {
		var output = [];
		var counter = 0;
		var length = string.length;
		var value;
		var extra;
		while (counter < length) {
			value = string.charCodeAt(counter++);
			if (value >= 0xD800 && value <= 0xDBFF && counter < length) {
				// high surrogate, and there is a next character
				extra = string.charCodeAt(counter++);
				if ((extra & 0xFC00) == 0xDC00) {
					// low surrogate
					output.push(((value & 0x3FF) << 10) + (extra & 0x3FF) + 0x10000);
				} else {
					// unmatched surrogate; only append this code unit, in case the next
					// code unit is the high surrogate of a surrogate pair
					output.push(value);
					counter--;
				}
			} else {
				output.push(value);
			}
		}
		return output;
	}
	
	// Taken from https://mths.be/punycode
	function ucs2encode(array) {
		var length = array.length;
		var index = -1;
		var value;
		var output = '';
		while (++index < length) {
			value = array[index];
			if (value > 0xFFFF) {
				value -= 0x10000;
				output += stringFromCharCode(value >>> 10 & 0x3FF | 0xD800);
				value = 0xDC00 | value & 0x3FF;
			}
			output += stringFromCharCode(value);
		}
		return output;
	}
	
	function checkScalarValue(codePoint, strict) {
		if (codePoint >= 0xD800 && codePoint <= 0xDFFF) {
			if (strict) {
				throw Error('Lone surrogate U+' + codePoint.toString(16).toUpperCase() + ' is not a scalar value');
			}
			return false;
		}
		return true;
	}
	/*--------------------------------------------------------------------------*/
	
	function createByte(codePoint, shift) {
		return stringFromCharCode(codePoint >> shift & 0x3F | 0x80);
	}
	
	function encodeCodePoint(codePoint, strict) {
		if ((codePoint & 0xFFFFFF80) == 0) {
			// 1-byte sequence
			return stringFromCharCode(codePoint);
		}
		var symbol = '';
		if ((codePoint & 0xFFFFF800) == 0) {
			// 2-byte sequence
			symbol = stringFromCharCode(codePoint >> 6 & 0x1F | 0xC0);
		} else if ((codePoint & 0xFFFF0000) == 0) {
			// 3-byte sequence
			if (!checkScalarValue(codePoint, strict)) {
				codePoint = 0xFFFD;
			}
			symbol = stringFromCharCode(codePoint >> 12 & 0x0F | 0xE0);
			symbol += createByte(codePoint, 6);
		} else if ((codePoint & 0xFFE00000) == 0) {
			// 4-byte sequence
			symbol = stringFromCharCode(codePoint >> 18 & 0x07 | 0xF0);
			symbol += createByte(codePoint, 12);
			symbol += createByte(codePoint, 6);
		}
		symbol += stringFromCharCode(codePoint & 0x3F | 0x80);
		return symbol;
	}
	
	function utf8encode(string, opts) {
		opts = opts || {};
		var strict = false !== opts.strict;
	
		var codePoints = ucs2decode(string);
		var length = codePoints.length;
		var index = -1;
		var codePoint;
		var byteString = '';
		while (++index < length) {
			codePoint = codePoints[index];
			byteString += encodeCodePoint(codePoint, strict);
		}
		return byteString;
	}
	
	/*--------------------------------------------------------------------------*/
	
	function readContinuationByte() {
		if (byteIndex >= byteCount) {
			throw Error('Invalid byte index');
		}
	
		var continuationByte = byteArray[byteIndex] & 0xFF;
		byteIndex++;
	
		if ((continuationByte & 0xC0) == 0x80) {
			return continuationByte & 0x3F;
		}
	
		// If we end up here, it’s not a continuation byte
		throw Error('Invalid continuation byte');
	}
	
	function decodeSymbol(strict) {
		var byte1;
		var byte2;
		var byte3;
		var byte4;
		var codePoint;
	
		if (byteIndex > byteCount) {
			throw Error('Invalid byte index');
		}
	
		if (byteIndex == byteCount) {
			return false;
		}
	
		// Read first byte
		byte1 = byteArray[byteIndex] & 0xFF;
		byteIndex++;
	
		// 1-byte sequence (no continuation bytes)
		if ((byte1 & 0x80) == 0) {
			return byte1;
		}
	
		// 2-byte sequence
		if ((byte1 & 0xE0) == 0xC0) {
			byte2 = readContinuationByte();
			codePoint = (byte1 & 0x1F) << 6 | byte2;
			if (codePoint >= 0x80) {
				return codePoint;
			} else {
				throw Error('Invalid continuation byte');
			}
		}
	
		// 3-byte sequence (may include unpaired surrogates)
		if ((byte1 & 0xF0) == 0xE0) {
			byte2 = readContinuationByte();
			byte3 = readContinuationByte();
			codePoint = (byte1 & 0x0F) << 12 | byte2 << 6 | byte3;
			if (codePoint >= 0x0800) {
				return checkScalarValue(codePoint, strict) ? codePoint : 0xFFFD;
			} else {
				throw Error('Invalid continuation byte');
			}
		}
	
		// 4-byte sequence
		if ((byte1 & 0xF8) == 0xF0) {
			byte2 = readContinuationByte();
			byte3 = readContinuationByte();
			byte4 = readContinuationByte();
			codePoint = (byte1 & 0x07) << 0x12 | byte2 << 0x0C | byte3 << 0x06 | byte4;
			if (codePoint >= 0x010000 && codePoint <= 0x10FFFF) {
				return codePoint;
			}
		}
	
		throw Error('Invalid UTF-8 detected');
	}
	
	var byteArray;
	var byteCount;
	var byteIndex;
	function utf8decode(byteString, opts) {
		opts = opts || {};
		var strict = false !== opts.strict;
	
		byteArray = ucs2decode(byteString);
		byteCount = byteArray.length;
		byteIndex = 0;
		var codePoints = [];
		var tmp;
		while ((tmp = decodeSymbol(strict)) !== false) {
			codePoints.push(tmp);
		}
		return ucs2encode(codePoints);
	}
	
	module.exports = {
		version: '2.1.2',
		encode: utf8encode,
		decode: utf8decode
	};

/***/ }),
/* 21 */
/***/ (function(module, exports) {

	/**
	 * Create a blob builder even when vendor prefixes exist
	 */
	
	var BlobBuilder = typeof BlobBuilder !== 'undefined' ? BlobBuilder :
	  typeof WebKitBlobBuilder !== 'undefined' ? WebKitBlobBuilder :
	  typeof MSBlobBuilder !== 'undefined' ? MSBlobBuilder :
	  typeof MozBlobBuilder !== 'undefined' ? MozBlobBuilder : 
	  false;
	
	/**
	 * Check if Blob constructor is supported
	 */
	
	var blobSupported = (function() {
	  try {
	    var a = new Blob(['hi']);
	    return a.size === 2;
	  } catch(e) {
	    return false;
	  }
	})();
	
	/**
	 * Check if Blob constructor supports ArrayBufferViews
	 * Fails in Safari 6, so we need to map to ArrayBuffers there.
	 */
	
	var blobSupportsArrayBufferView = blobSupported && (function() {
	  try {
	    var b = new Blob([new Uint8Array([1,2])]);
	    return b.size === 2;
	  } catch(e) {
	    return false;
	  }
	})();
	
	/**
	 * Check if BlobBuilder is supported
	 */
	
	var blobBuilderSupported = BlobBuilder
	  && BlobBuilder.prototype.append
	  && BlobBuilder.prototype.getBlob;
	
	/**
	 * Helper function that maps ArrayBufferViews to ArrayBuffers
	 * Used by BlobBuilder constructor and old browsers that didn't
	 * support it in the Blob constructor.
	 */
	
	function mapArrayBufferViews(ary) {
	  return ary.map(function(chunk) {
	    if (chunk.buffer instanceof ArrayBuffer) {
	      var buf = chunk.buffer;
	
	      // if this is a subarray, make a copy so we only
	      // include the subarray region from the underlying buffer
	      if (chunk.byteLength !== buf.byteLength) {
	        var copy = new Uint8Array(chunk.byteLength);
	        copy.set(new Uint8Array(buf, chunk.byteOffset, chunk.byteLength));
	        buf = copy.buffer;
	      }
	
	      return buf;
	    }
	
	    return chunk;
	  });
	}
	
	function BlobBuilderConstructor(ary, options) {
	  options = options || {};
	
	  var bb = new BlobBuilder();
	  mapArrayBufferViews(ary).forEach(function(part) {
	    bb.append(part);
	  });
	
	  return (options.type) ? bb.getBlob(options.type) : bb.getBlob();
	};
	
	function BlobConstructor(ary, options) {
	  return new Blob(mapArrayBufferViews(ary), options || {});
	};
	
	if (typeof Blob !== 'undefined') {
	  BlobBuilderConstructor.prototype = Blob.prototype;
	  BlobConstructor.prototype = Blob.prototype;
	}
	
	module.exports = (function() {
	  if (blobSupported) {
	    return blobSupportsArrayBufferView ? Blob : BlobConstructor;
	  } else if (blobBuilderSupported) {
	    return BlobBuilderConstructor;
	  } else {
	    return undefined;
	  }
	})();


/***/ }),
/* 22 */
/***/ (function(module, exports) {

	/**
	 * Compiles a querystring
	 * Returns string representation of the object
	 *
	 * @param {Object}
	 * @api private
	 */
	
	exports.encode = function (obj) {
	  var str = '';
	
	  for (var i in obj) {
	    if (obj.hasOwnProperty(i)) {
	      if (str.length) str += '&';
	      str += encodeURIComponent(i) + '=' + encodeURIComponent(obj[i]);
	    }
	  }
	
	  return str;
	};
	
	/**
	 * Parses a simple querystring into an object
	 *
	 * @param {String} qs
	 * @api private
	 */
	
	exports.decode = function(qs){
	  var qry = {};
	  var pairs = qs.split('&');
	  for (var i = 0, l = pairs.length; i < l; i++) {
	    var pair = pairs[i].split('=');
	    qry[decodeURIComponent(pair[0])] = decodeURIComponent(pair[1]);
	  }
	  return qry;
	};


/***/ }),
/* 23 */
/***/ (function(module, exports) {

	
	module.exports = function(a, b){
	  var fn = function(){};
	  fn.prototype = b.prototype;
	  a.prototype = new fn;
	  a.prototype.constructor = a;
	};

/***/ }),
/* 24 */
/***/ (function(module, exports) {

	'use strict';
	
	var alphabet = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz-_'.split('')
	  , length = 64
	  , map = {}
	  , seed = 0
	  , i = 0
	  , prev;
	
	/**
	 * Return a string representing the specified number.
	 *
	 * @param {Number} num The number to convert.
	 * @returns {String} The string representation of the number.
	 * @api public
	 */
	function encode(num) {
	  var encoded = '';
	
	  do {
	    encoded = alphabet[num % length] + encoded;
	    num = Math.floor(num / length);
	  } while (num > 0);
	
	  return encoded;
	}
	
	/**
	 * Return the integer value specified by the given string.
	 *
	 * @param {String} str The string to convert.
	 * @returns {Number} The integer value represented by the string.
	 * @api public
	 */
	function decode(str) {
	  var decoded = 0;
	
	  for (i = 0; i < str.length; i++) {
	    decoded = decoded * length + map[str.charAt(i)];
	  }
	
	  return decoded;
	}
	
	/**
	 * Yeast: A tiny growing id generator.
	 *
	 * @returns {String} A unique id.
	 * @api public
	 */
	function yeast() {
	  var now = encode(+new Date());
	
	  if (now !== prev) return seed = 0, prev = now;
	  return now +'.'+ encode(seed++);
	}
	
	//
	// Map each character to its index.
	//
	for (; i < length; i++) map[alphabet[i]] = i;
	
	//
	// Expose the `yeast`, `encode` and `decode` functions.
	//
	yeast.encode = encode;
	yeast.decode = decode;
	module.exports = yeast;


/***/ }),
/* 25 */
/***/ (function(module, exports, __webpack_require__) {

	'use strict';
	
	// browser shim for xmlhttprequest module
	
	var hasCORS = __webpack_require__(26);
	
	module.exports = function (opts) {
	  var xdomain = opts.xdomain;
	
	  // scheme must be same when usign XDomainRequest
	  // http://blogs.msdn.com/b/ieinternals/archive/2010/05/13/xdomainrequest-restrictions-limitations-and-workarounds.aspx
	  var xscheme = opts.xscheme;
	
	  // XDomainRequest has a flow of not sending cookie, therefore it should be disabled as a default.
	  // https://github.com/Automattic/engine.io-client/pull/217
	  var enablesXDR = opts.enablesXDR;
	
	  // XMLHttpRequest can be disabled on IE
	  try {
	    if ('undefined' !== typeof XMLHttpRequest && (!xdomain || hasCORS)) {
	      return new XMLHttpRequest();
	    }
	  } catch (e) {}
	
	  // Use XDomainRequest for IE8 if enablesXDR is true
	  // because loading bar keeps flashing when using jsonp-polling
	  // https://github.com/yujiosaka/socke.io-ie8-loading-example
	  try {
	    if ('undefined' !== typeof XDomainRequest && !xscheme && enablesXDR) {
	      return new XDomainRequest();
	    }
	  } catch (e) {}
	
	  if (!xdomain) {
	    try {
	      return new self[['Active'].concat('Object').join('X')]('Microsoft.XMLHTTP');
	    } catch (e) {}
	  }
	};

/***/ }),
/* 26 */
/***/ (function(module, exports) {

	
	/**
	 * Module exports.
	 *
	 * Logic borrowed from Modernizr:
	 *
	 *   - https://github.com/Modernizr/Modernizr/blob/master/feature-detects/cors.js
	 */
	
	try {
	  module.exports = typeof XMLHttpRequest !== 'undefined' &&
	    'withCredentials' in new XMLHttpRequest();
	} catch (err) {
	  // if XMLHttp support is disabled in IE then it will throw
	  // when trying to create
	  module.exports = false;
	}


/***/ }),
/* 27 */
/***/ (function(module, exports, __webpack_require__) {

	'use strict';
	
	/**
	 * Module dependencies.
	 */
	
	var Transport = __webpack_require__(14);
	var parser = __webpack_require__(15);
	var parseqs = __webpack_require__(22);
	var inherit = __webpack_require__(23);
	var yeast = __webpack_require__(24);
	var debug = __webpack_require__(4)('engine.io-client:websocket');
	
	var BrowserWebSocket, NodeWebSocket;
	
	if (typeof wx === "undefined") {
	    if (typeof WebSocket !== 'undefined') {
	        BrowserWebSocket = WebSocket;
	    } else if (typeof self !== 'undefined') {
	        BrowserWebSocket = self.WebSocket || self.MozWebSocket;
	    } else {
	        try {
	            NodeWebSocket = __webpack_require__(28);
	        } catch (e) {}
	    }
	}
	
	/**
	 * Get either the `WebSocket` or `MozWebSocket` globals
	 * in the browser or try to resolve WebSocket-compatible
	 * interface exposed by `ws` for Node-like environment.
	 */
	
	var WebSocketImpl = BrowserWebSocket || NodeWebSocket;
	
	if (typeof wx !== "undefined") {
	    WebSocketImpl = function WebSocket(uri) {
	        var self = this;
	        self.onopen = function () {};
	
	        self.onclose = function () {};
	
	        self.onmessage = function (data) {};
	
	        self.onerror = function (e) {};
	
	        self.send = function (data) {
	            wx.sendSocketMessage({ data: data });
	        };
	
	        self.close = function () {
	            wx.closeSocket();
	        };
	
	        wx.onSocketOpen(function (res) {
	            self.onopen();
	        });
	        wx.onSocketError(function (e) {
	            self.onerror(e);
	        });
	        wx.onSocketMessage(function (res) {
	            self.onmessage(res);
	        });
	        wx.onSocketClose(function (res) {
	            self.onclose();
	        });
	        wx.connectSocket({ url: uri });
	    };
	}
	
	/**
	 * Module exports.
	 */
	
	module.exports = WS;
	
	/**
	 * WebSocket transport constructor.
	 *
	 * @api {Object} connection options
	 * @api public
	 */
	
	function WS(opts) {
	    var forceBase64 = opts && opts.forceBase64;
	    if (forceBase64) {
	        this.supportsBinary = false;
	    }
	    if (typeof wx === "undefined") {
	        this.perMessageDeflate = opts.perMessageDeflate;
	        this.usingBrowserWebSocket = BrowserWebSocket && !opts.forceNode;
	        this.protocols = opts.protocols;
	        if (!this.usingBrowserWebSocket) {
	            WebSocketImpl = NodeWebSocket;
	        }
	    }
	    Transport.call(this, opts);
	}
	
	/**
	 * Inherits from Transport.
	 */
	
	inherit(WS, Transport);
	
	/**
	 * Transport name.
	 *
	 * @api public
	 */
	
	WS.prototype.name = 'websocket';
	
	/*
	 * WebSockets support binary
	 */
	
	WS.prototype.supportsBinary = false;
	
	/**
	 * Opens socket.
	 *
	 * @api private
	 */
	
	WS.prototype.doOpen = function () {
	    if (!this.check()) {
	        // let probe timeout
	        return;
	    }
	
	    var uri = this.uri();
	
	    var protocols;
	    if (typeof wx === "undefined") {
	        protocols = this.protocols;
	    }
	    var opts;
	    if (typeof wx !== "undefined") {
	        opts = {
	            agent: this.agent
	        };
	    } else {
	        opts = {
	            agent: this.agent,
	            perMessageDeflate: this.perMessageDeflate
	        };
	    }
	
	    // SSL options for Node.js client
	    opts.pfx = this.pfx;
	    opts.key = this.key;
	    opts.passphrase = this.passphrase;
	    opts.cert = this.cert;
	    opts.ca = this.ca;
	    opts.ciphers = this.ciphers;
	    opts.rejectUnauthorized = this.rejectUnauthorized;
	    if (this.extraHeaders) {
	        opts.headers = this.extraHeaders;
	    }
	    if (this.localAddress) {
	        opts.localAddress = this.localAddress;
	    }
	
	    try {
	        if (typeof wx !== "undefined") {
	            this.ws = new WebSocketImpl(uri);
	        } else {
	            this.ws = this.usingBrowserWebSocket && !this.isReactNative ? protocols ? new WebSocketImpl(uri, protocols) : new WebSocketImpl(uri) : new WebSocketImpl(uri, protocols, opts);
	        }
	    } catch (err) {
	        return this.emit('error', err);
	    }
	
	    if (this.ws.binaryType === undefined) {
	        this.supportsBinary = false;
	    }
	
	    if (this.ws.supports && this.ws.supports.binary) {
	        this.supportsBinary = true;
	        this.ws.binaryType = 'nodebuffer';
	    } else {
	        this.ws.binaryType = 'arraybuffer';
	    }
	
	    this.addEventListeners();
	};
	
	/**
	 * Adds event listeners to the socket
	 *
	 * @api private
	 */
	
	WS.prototype.addEventListeners = function () {
	    var self = this;
	
	    this.ws.onopen = function () {
	        self.onOpen();
	    };
	    this.ws.onclose = function () {
	        self.onClose();
	    };
	    this.ws.onmessage = function (ev) {
	        self.onData(ev.data);
	    };
	    this.ws.onerror = function (e) {
	        self.onError('websocket error', e);
	    };
	};
	
	/**
	 * Writes data to socket.
	 *
	 * @param {Array} array of packets.
	 * @api private
	 */
	
	WS.prototype.write = function (packets) {
	    var self = this;
	    this.writable = false;
	
	    // encodePacket efficient as it uses WS framing
	    // no need for encodePayload
	    var total = packets.length;
	    for (var i = 0, l = total; i < l; i++) {
	        (function (packet) {
	            parser.encodePacket(packet, self.supportsBinary, function (data) {
	                if (typeof wx !== "undefined") {
	                    try {
	                        self.ws.send(data);
	                    } catch (e) {}
	                } else {
	                    if (!self.usingBrowserWebSocket) {
	                        // always create a new object (GH-437)
	                        var opts = {};
	                        if (packet.options) {
	                            opts.compress = packet.options.compress;
	                        }
	
	                        if (self.perMessageDeflate) {
	                            var len = 'string' === typeof data ? Buffer.byteLength(data) : data.length;
	                            if (len < self.perMessageDeflate.threshold) {
	                                opts.compress = false;
	                            }
	                        }
	                    }
	
	                    // Sometimes the websocket has already been closed but the browser didn't
	                    // have a chance of informing us about it yet, in that case send will
	                    // throw an error
	                    try {
	                        if (self.usingBrowserWebSocket) {
	                            // TypeError is thrown when passing the second argument on Safari
	                            self.ws.send(data);
	                        } else {
	                            self.ws.send(data, opts);
	                        }
	                    } catch (e) {}
	                }
	                --total || done();
	            });
	        })(packets[i]);
	    }
	
	    function done() {
	        self.emit('flush');
	
	        // fake drain
	        // defer to next tick to allow Socket to clear writeBuffer
	        setTimeout(function () {
	            self.writable = true;
	            self.emit('drain');
	        }, 0);
	    }
	};
	
	/**
	 * Called upon close
	 *
	 * @api private
	 */
	
	WS.prototype.onClose = function () {
	    Transport.prototype.onClose.call(this);
	};
	
	/**
	 * Closes socket.
	 *
	 * @api private
	 */
	
	WS.prototype.doClose = function () {
	    if (typeof this.ws !== 'undefined') {
	        this.ws.close();
	    }
	};
	
	/**
	 * Generates uri for connection.
	 *
	 * @api private
	 */
	
	WS.prototype.uri = function () {
	    var query = this.query || {};
	    var schema = this.secure ? 'wss' : 'ws';
	    var port = '';
	
	    // avoid port if default for schema
	    if (this.port && ('wss' === schema && Number(this.port) !== 443 || 'ws' === schema && Number(this.port) !== 80)) {
	        port = ':' + this.port;
	    }
	
	    // append timestamp to URI
	    if (this.timestampRequests) {
	        query[this.timestampParam] = yeast();
	    }
	
	    // communicate binary support capabilities
	    if (!this.supportsBinary) {
	        query.b64 = 1;
	    }
	
	    query = parseqs.encode(query);
	
	    // prepend ? to query
	    if (query.length) {
	        query = '?' + query;
	    }
	
	    var ipv6 = this.hostname.indexOf(':') !== -1;
	    return schema + '://' + (ipv6 ? '[' + this.hostname + ']' : this.hostname) + port + this.path + query;
	};
	
	/**
	 * Feature detection for WebSocket.
	 *
	 * @return {Boolean} whether this transport is available.
	 * @api public
	 */
	
	WS.prototype.check = function () {
	    return !!WebSocketImpl && !('__initialize' in WebSocketImpl && this.name === WS.prototype.name);
	};

/***/ }),
/* 28 */
/***/ (function(module, exports) {

	/* (ignored) */

/***/ }),
/* 29 */
/***/ (function(module, exports) {

	
	var indexOf = [].indexOf;
	
	module.exports = function(arr, obj){
	  if (indexOf) return arr.indexOf(obj);
	  for (var i = 0; i < arr.length; ++i) {
	    if (arr[i] === obj) return i;
	  }
	  return -1;
	};

/***/ }),
/* 30 */
/***/ (function(module, exports, __webpack_require__) {

	'use strict';
	
	var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };
	
	/**
	 * Module dependencies.
	 */
	
	var parser = __webpack_require__(5);
	var Emitter = __webpack_require__(6);
	var toArray = __webpack_require__(31);
	var on = __webpack_require__(32);
	var bind = __webpack_require__(33);
	var debug = __webpack_require__(4)('socket.io-client:socket');
	var parseqs = __webpack_require__(22);
	var hasBin = __webpack_require__(17);
	
	/**
	 * Module exports.
	 */
	
	module.exports = exports = Socket;
	
	/**
	 * Internal events (blacklisted).
	 * These events can't be emitted by the user.
	 *
	 * @api private
	 */
	
	var events = {
	  connect: 1,
	  connect_error: 1,
	  connect_timeout: 1,
	  connecting: 1,
	  disconnect: 1,
	  error: 1,
	  reconnect: 1,
	  reconnect_attempt: 1,
	  reconnect_failed: 1,
	  reconnect_error: 1,
	  reconnecting: 1,
	  ping: 1,
	  pong: 1
	};
	
	/**
	 * Shortcut to `Emitter#emit`.
	 */
	
	var emit = Emitter.prototype.emit;
	
	/**
	 * `Socket` constructor.
	 *
	 * @api public
	 */
	
	function Socket(io, nsp, opts) {
	  this.io = io;
	  this.nsp = nsp;
	  this.json = this; // compat
	  this.ids = 0;
	  this.acks = {};
	  this.receiveBuffer = [];
	  this.sendBuffer = [];
	  this.connected = false;
	  this.disconnected = true;
	  this.flags = {};
	  if (opts && opts.query) {
	    this.query = opts.query;
	  }
	  if (this.io.autoConnect) this.open();
	}
	
	/**
	 * Mix in `Emitter`.
	 */
	
	Emitter(Socket.prototype);
	
	/**
	 * Subscribe to open, close and packet events
	 *
	 * @api private
	 */
	
	Socket.prototype.subEvents = function () {
	  if (this.subs) return;
	
	  var io = this.io;
	  this.subs = [on(io, 'open', bind(this, 'onopen')), on(io, 'packet', bind(this, 'onpacket')), on(io, 'close', bind(this, 'onclose'))];
	};
	
	/**
	 * "Opens" the socket.
	 *
	 * @api public
	 */
	
	Socket.prototype.open = Socket.prototype.connect = function () {
	  if (this.connected) return this;
	
	  this.subEvents();
	  this.io.open(); // ensure open
	  if ('open' === this.io.readyState) this.onopen();
	  this.emit('connecting');
	  return this;
	};
	
	/**
	 * Sends a `message` event.
	 *
	 * @return {Socket} self
	 * @api public
	 */
	
	Socket.prototype.send = function () {
	  var args = toArray(arguments);
	  args.unshift('message');
	  this.emit.apply(this, args);
	  return this;
	};
	
	/**
	 * Override `emit`.
	 * If the event is in `events`, it's emitted normally.
	 *
	 * @param {String} event name
	 * @return {Socket} self
	 * @api public
	 */
	
	Socket.prototype.emit = function (ev) {
	  if (events.hasOwnProperty(ev)) {
	    emit.apply(this, arguments);
	    return this;
	  }
	
	  var args = toArray(arguments);
	  var packet = {
	    type: (this.flags.binary !== undefined ? this.flags.binary : hasBin(args)) ? parser.BINARY_EVENT : parser.EVENT,
	    data: args
	  };
	
	  packet.options = {};
	  packet.options.compress = !this.flags || false !== this.flags.compress;
	
	  // event ack callback
	  if ('function' === typeof args[args.length - 1]) {
	
	    this.acks[this.ids] = args.pop();
	    packet.id = this.ids++;
	  }
	
	  if (this.connected) {
	    this.packet(packet);
	  } else {
	    this.sendBuffer.push(packet);
	  }
	
	  this.flags = {};
	
	  return this;
	};
	
	/**
	 * Sends a packet.
	 *
	 * @param {Object} packet
	 * @api private
	 */
	
	Socket.prototype.packet = function (packet) {
	  packet.nsp = this.nsp;
	  this.io.packet(packet);
	};
	
	/**
	 * Called upon engine `open`.
	 *
	 * @api private
	 */
	
	Socket.prototype.onopen = function () {
	
	  // write connect packet if necessary
	  if ('/' !== this.nsp) {
	    if (this.query) {
	      var query = _typeof(this.query) === 'object' ? parseqs.encode(this.query) : this.query;
	
	      this.packet({ type: parser.CONNECT, query: query });
	    } else {
	      this.packet({ type: parser.CONNECT });
	    }
	  }
	};
	
	/**
	 * Called upon engine `close`.
	 *
	 * @param {String} reason
	 * @api private
	 */
	
	Socket.prototype.onclose = function (reason) {
	
	  this.connected = false;
	  this.disconnected = true;
	  delete this.id;
	  this.emit('disconnect', reason);
	};
	
	/**
	 * Called with socket packet.
	 *
	 * @param {Object} packet
	 * @api private
	 */
	
	Socket.prototype.onpacket = function (packet) {
	  var sameNamespace = packet.nsp === this.nsp;
	  var rootNamespaceError = packet.type === parser.ERROR && packet.nsp === '/';
	
	  if (!sameNamespace && !rootNamespaceError) return;
	
	  switch (packet.type) {
	    case parser.CONNECT:
	      this.onconnect();
	      break;
	
	    case parser.EVENT:
	      this.onevent(packet);
	      break;
	
	    case parser.BINARY_EVENT:
	      this.onevent(packet);
	      break;
	
	    case parser.ACK:
	      this.onack(packet);
	      break;
	
	    case parser.BINARY_ACK:
	      this.onack(packet);
	      break;
	
	    case parser.DISCONNECT:
	      this.ondisconnect();
	      break;
	
	    case parser.ERROR:
	      this.emit('error', packet.data);
	      break;
	  }
	};
	
	/**
	 * Called upon a server event.
	 *
	 * @param {Object} packet
	 * @api private
	 */
	
	Socket.prototype.onevent = function (packet) {
	  var args = packet.data || [];
	
	  if (null != packet.id) {
	
	    args.push(this.ack(packet.id));
	  }
	
	  if (this.connected) {
	    emit.apply(this, args);
	  } else {
	    this.receiveBuffer.push(args);
	  }
	};
	
	/**
	 * Produces an ack callback to emit with an event.
	 *
	 * @api private
	 */
	
	Socket.prototype.ack = function (id) {
	  var self = this;
	  var sent = false;
	  return function () {
	    // prevent double callbacks
	    if (sent) return;
	    sent = true;
	    var args = toArray(arguments);
	
	    self.packet({
	      type: hasBin(args) ? parser.BINARY_ACK : parser.ACK,
	      id: id,
	      data: args
	    });
	  };
	};
	
	/**
	 * Called upon a server acknowlegement.
	 *
	 * @param {Object} packet
	 * @api private
	 */
	
	Socket.prototype.onack = function (packet) {
	  var ack = this.acks[packet.id];
	  if ('function' === typeof ack) {
	
	    ack.apply(this, packet.data);
	    delete this.acks[packet.id];
	  } else {}
	};
	
	/**
	 * Called upon server connect.
	 *
	 * @api private
	 */
	
	Socket.prototype.onconnect = function () {
	  this.connected = true;
	  this.disconnected = false;
	  this.emit('connect');
	  this.emitBuffered();
	};
	
	/**
	 * Emit buffered events (received and emitted).
	 *
	 * @api private
	 */
	
	Socket.prototype.emitBuffered = function () {
	  var i;
	  for (i = 0; i < this.receiveBuffer.length; i++) {
	    emit.apply(this, this.receiveBuffer[i]);
	  }
	  this.receiveBuffer = [];
	
	  for (i = 0; i < this.sendBuffer.length; i++) {
	    this.packet(this.sendBuffer[i]);
	  }
	  this.sendBuffer = [];
	};
	
	/**
	 * Called upon server disconnect.
	 *
	 * @api private
	 */
	
	Socket.prototype.ondisconnect = function () {
	
	  this.destroy();
	  this.onclose('io server disconnect');
	};
	
	/**
	 * Called upon forced client/server side disconnections,
	 * this method ensures the manager stops tracking us and
	 * that reconnections don't get triggered for this.
	 *
	 * @api private.
	 */
	
	Socket.prototype.destroy = function () {
	  if (this.subs) {
	    // clean subscriptions to avoid reconnections
	    for (var i = 0; i < this.subs.length; i++) {
	      this.subs[i].destroy();
	    }
	    this.subs = null;
	  }
	
	  this.io.destroy(this);
	};
	
	/**
	 * Disconnects the socket manually.
	 *
	 * @return {Socket} self
	 * @api public
	 */
	
	Socket.prototype.close = Socket.prototype.disconnect = function () {
	  if (this.connected) {
	
	    this.packet({ type: parser.DISCONNECT });
	  }
	
	  // remove socket from pool
	  this.destroy();
	
	  if (this.connected) {
	    // fire events
	    this.onclose('io client disconnect');
	  }
	  return this;
	};
	
	/**
	 * Sets the compress flag.
	 *
	 * @param {Boolean} if `true`, compresses the sending data
	 * @return {Socket} self
	 * @api public
	 */
	
	Socket.prototype.compress = function (compress) {
	  this.flags.compress = compress;
	  return this;
	};
	
	/**
	 * Sets the binary flag
	 *
	 * @param {Boolean} whether the emitted data contains binary
	 * @return {Socket} self
	 * @api public
	 */
	
	Socket.prototype.binary = function (binary) {
	  this.flags.binary = binary;
	  return this;
	};

/***/ }),
/* 31 */
/***/ (function(module, exports) {

	module.exports = toArray
	
	function toArray(list, index) {
	    var array = []
	
	    index = index || 0
	
	    for (var i = index || 0; i < list.length; i++) {
	        array[i - index] = list[i]
	    }
	
	    return array
	}


/***/ }),
/* 32 */
/***/ (function(module, exports) {

	"use strict";
	
	/**
	 * Module exports.
	 */
	
	module.exports = on;
	
	/**
	 * Helper for subscriptions.
	 *
	 * @param {Object|EventEmitter} obj with `Emitter` mixin or `EventEmitter`
	 * @param {String} event name
	 * @param {Function} callback
	 * @api public
	 */
	
	function on(obj, ev, fn) {
	  obj.on(ev, fn);
	  return {
	    destroy: function destroy() {
	      obj.removeListener(ev, fn);
	    }
	  };
	}

/***/ }),
/* 33 */
/***/ (function(module, exports) {

	/**
	 * Slice reference.
	 */
	
	var slice = [].slice;
	
	/**
	 * Bind `obj` to `fn`.
	 *
	 * @param {Object} obj
	 * @param {Function|String} fn or string
	 * @return {Function}
	 * @api public
	 */
	
	module.exports = function(obj, fn){
	  if ('string' == typeof fn) fn = obj[fn];
	  if ('function' != typeof fn) throw new Error('bind() requires a function');
	  var args = slice.call(arguments, 2);
	  return function(){
	    return fn.apply(obj, args.concat(slice.call(arguments)));
	  }
	};


/***/ }),
/* 34 */
/***/ (function(module, exports) {

	
	/**
	 * Expose `Backoff`.
	 */
	
	module.exports = Backoff;
	
	/**
	 * Initialize backoff timer with `opts`.
	 *
	 * - `min` initial timeout in milliseconds [100]
	 * - `max` max timeout [10000]
	 * - `jitter` [0]
	 * - `factor` [2]
	 *
	 * @param {Object} opts
	 * @api public
	 */
	
	function Backoff(opts) {
	  opts = opts || {};
	  this.ms = opts.min || 100;
	  this.max = opts.max || 10000;
	  this.factor = opts.factor || 2;
	  this.jitter = opts.jitter > 0 && opts.jitter <= 1 ? opts.jitter : 0;
	  this.attempts = 0;
	}
	
	/**
	 * Return the backoff duration.
	 *
	 * @return {Number}
	 * @api public
	 */
	
	Backoff.prototype.duration = function(){
	  var ms = this.ms * Math.pow(this.factor, this.attempts++);
	  if (this.jitter) {
	    var rand =  Math.random();
	    var deviation = Math.floor(rand * this.jitter * ms);
	    ms = (Math.floor(rand * 10) & 1) == 0  ? ms - deviation : ms + deviation;
	  }
	  return Math.min(ms, this.max) | 0;
	};
	
	/**
	 * Reset the number of attempts.
	 *
	 * @api public
	 */
	
	Backoff.prototype.reset = function(){
	  this.attempts = 0;
	};
	
	/**
	 * Set the minimum duration
	 *
	 * @api public
	 */
	
	Backoff.prototype.setMin = function(min){
	  this.ms = min;
	};
	
	/**
	 * Set the maximum duration
	 *
	 * @api public
	 */
	
	Backoff.prototype.setMax = function(max){
	  this.max = max;
	};
	
	/**
	 * Set the jitter
	 *
	 * @api public
	 */
	
	Backoff.prototype.setJitter = function(jitter){
	  this.jitter = jitter;
	};
	


/***/ }),
/* 35 */
/***/ (function(module, exports, __webpack_require__) {

	var rng = __webpack_require__(36);
	var bytesToUuid = __webpack_require__(37);
	
	// **`v1()` - Generate time-based UUID**
	//
	// Inspired by https://github.com/LiosK/UUID.js
	// and http://docs.python.org/library/uuid.html
	
	var _nodeId;
	var _clockseq;
	
	// Previous uuid creation time
	var _lastMSecs = 0;
	var _lastNSecs = 0;
	
	// See https://github.com/broofa/node-uuid for API details
	function v1(options, buf, offset) {
	  var i = buf && offset || 0;
	  var b = buf || [];
	
	  options = options || {};
	  var node = options.node || _nodeId;
	  var clockseq = options.clockseq !== undefined ? options.clockseq : _clockseq;
	
	  // node and clockseq need to be initialized to random values if they're not
	  // specified.  We do this lazily to minimize issues related to insufficient
	  // system entropy.  See #189
	  if (node == null || clockseq == null) {
	    var seedBytes = rng();
	    if (node == null) {
	      // Per 4.5, create and 48-bit node id, (47 random bits + multicast bit = 1)
	      node = _nodeId = [
	        seedBytes[0] | 0x01,
	        seedBytes[1], seedBytes[2], seedBytes[3], seedBytes[4], seedBytes[5]
	      ];
	    }
	    if (clockseq == null) {
	      // Per 4.2.2, randomize (14 bit) clockseq
	      clockseq = _clockseq = (seedBytes[6] << 8 | seedBytes[7]) & 0x3fff;
	    }
	  }
	
	  // UUID timestamps are 100 nano-second units since the Gregorian epoch,
	  // (1582-10-15 00:00).  JSNumbers aren't precise enough for this, so
	  // time is handled internally as 'msecs' (integer milliseconds) and 'nsecs'
	  // (100-nanoseconds offset from msecs) since unix epoch, 1970-01-01 00:00.
	  var msecs = options.msecs !== undefined ? options.msecs : new Date().getTime();
	
	  // Per 4.2.1.2, use count of uuid's generated during the current clock
	  // cycle to simulate higher resolution clock
	  var nsecs = options.nsecs !== undefined ? options.nsecs : _lastNSecs + 1;
	
	  // Time since last uuid creation (in msecs)
	  var dt = (msecs - _lastMSecs) + (nsecs - _lastNSecs)/10000;
	
	  // Per 4.2.1.2, Bump clockseq on clock regression
	  if (dt < 0 && options.clockseq === undefined) {
	    clockseq = clockseq + 1 & 0x3fff;
	  }
	
	  // Reset nsecs if clock regresses (new clockseq) or we've moved onto a new
	  // time interval
	  if ((dt < 0 || msecs > _lastMSecs) && options.nsecs === undefined) {
	    nsecs = 0;
	  }
	
	  // Per 4.2.1.2 Throw error if too many uuids are requested
	  if (nsecs >= 10000) {
	    throw new Error('uuid.v1(): Can\'t create more than 10M uuids/sec');
	  }
	
	  _lastMSecs = msecs;
	  _lastNSecs = nsecs;
	  _clockseq = clockseq;
	
	  // Per 4.1.4 - Convert from unix epoch to Gregorian epoch
	  msecs += 12219292800000;
	
	  // `time_low`
	  var tl = ((msecs & 0xfffffff) * 10000 + nsecs) % 0x100000000;
	  b[i++] = tl >>> 24 & 0xff;
	  b[i++] = tl >>> 16 & 0xff;
	  b[i++] = tl >>> 8 & 0xff;
	  b[i++] = tl & 0xff;
	
	  // `time_mid`
	  var tmh = (msecs / 0x100000000 * 10000) & 0xfffffff;
	  b[i++] = tmh >>> 8 & 0xff;
	  b[i++] = tmh & 0xff;
	
	  // `time_high_and_version`
	  b[i++] = tmh >>> 24 & 0xf | 0x10; // include version
	  b[i++] = tmh >>> 16 & 0xff;
	
	  // `clock_seq_hi_and_reserved` (Per 4.2.2 - include variant)
	  b[i++] = clockseq >>> 8 | 0x80;
	
	  // `clock_seq_low`
	  b[i++] = clockseq & 0xff;
	
	  // `node`
	  for (var n = 0; n < 6; ++n) {
	    b[i + n] = node[n];
	  }
	
	  return buf ? buf : bytesToUuid(b);
	}
	
	module.exports = v1;


/***/ }),
/* 36 */
/***/ (function(module, exports) {

	// Unique ID creation requires a high quality random # generator.  In the
	// browser this is a little complicated due to unknown quality of Math.random()
	// and inconsistent support for the `crypto` API.  We do the best we can via
	// feature-detection
	
	// getRandomValues needs to be invoked in a context where "this" is a Crypto
	// implementation. Also, find the complete implementation of crypto on IE11.
	var getRandomValues = (typeof(crypto) != 'undefined' && crypto.getRandomValues && crypto.getRandomValues.bind(crypto)) ||
	                      (typeof(msCrypto) != 'undefined' && typeof window.msCrypto.getRandomValues == 'function' && msCrypto.getRandomValues.bind(msCrypto));
	
	if (getRandomValues) {
	  // WHATWG crypto RNG - http://wiki.whatwg.org/wiki/Crypto
	  var rnds8 = new Uint8Array(16); // eslint-disable-line no-undef
	
	  module.exports = function whatwgRNG() {
	    getRandomValues(rnds8);
	    return rnds8;
	  };
	} else {
	  // Math.random()-based (RNG)
	  //
	  // If all else fails, use Math.random().  It's fast, but is of unspecified
	  // quality.
	  var rnds = new Array(16);
	
	  module.exports = function mathRNG() {
	    for (var i = 0, r; i < 16; i++) {
	      if ((i & 0x03) === 0) r = Math.random() * 0x100000000;
	      rnds[i] = r >>> ((i & 0x03) << 3) & 0xff;
	    }
	
	    return rnds;
	  };
	}


/***/ }),
/* 37 */
/***/ (function(module, exports) {

	/**
	 * Convert array of 16 byte values to UUID string format of the form:
	 * XXXXXXXX-XXXX-XXXX-XXXX-XXXXXXXXXXXX
	 */
	var byteToHex = [];
	for (var i = 0; i < 256; ++i) {
	  byteToHex[i] = (i + 0x100).toString(16).substr(1);
	}
	
	function bytesToUuid(buf, offset) {
	  var i = offset || 0;
	  var bth = byteToHex;
	  // join used to fix memory issue caused by concatenation: https://bugs.chromium.org/p/v8/issues/detail?id=3175#c4
	  return ([bth[buf[i++]], bth[buf[i++]], 
		bth[buf[i++]], bth[buf[i++]], '-',
		bth[buf[i++]], bth[buf[i++]], '-',
		bth[buf[i++]], bth[buf[i++]], '-',
		bth[buf[i++]], bth[buf[i++]], '-',
		bth[buf[i++]], bth[buf[i++]],
		bth[buf[i++]], bth[buf[i++]],
		bth[buf[i++]], bth[buf[i++]]]).join('');
	}
	
	module.exports = bytesToUuid;


/***/ }),
/* 38 */
/***/ (function(module, exports) {

	"use strict";
	
	module.exports = {
	    maxNumber: 5,
	    startMillis: 1559615249963
	};

/***/ })
/******/ ])
});
;
//# sourceMappingURL=goeasy-0.19.22.dev.js.map 