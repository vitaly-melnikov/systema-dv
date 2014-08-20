/*
 * Licensed to the Apache Software Foundation (ASF) under one
 * or more contributor license agreements.  See the NOTICE file
 * distributed with this work for additional information
 * regarding copyright ownership.  The ASF licenses this file
 * to you under the Apache License, Version 2.0 (the
 * "License"); you may not use this file except in compliance
 * with the License.  You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */
var app = {
    // Application Constructor
    initialize: function() {
        this.bindEvents();
        this.initSearch();
        this.initMessages();
    },
    // Bind Event Listeners
    //
    // Bind any events that are required on startup. Common events are:
    // 'load', 'deviceready', 'offline', and 'online'.
    bindEvents: function() {
        //document.addEventListener('deviceready', this.onDeviceReady, false);
    	
    	document.addEventListener('deviceready', this.allow, false);
    	document.addEventListener('mobileinit', this.allow, false);
    	console.log('listeners configured');
    	$.mobile.allowCrossDomainPages = true;
    	
    	/*
    	$(document).bind("mobileinit", function(){
    		   $.mobile.allowCrossDomainPages = true;
    		   alert('CROSS ALLOWED');
    	});
    	*/    	
    },
    
    allow: function() {
	   $.mobile.allowCrossDomainPages = true;
    },
    
    add: function(parent, tag, content, cls) {
    	var html = "<" + tag;
    	if (cls && cls.length) {
    		html +=  " class='" + cls + "'";
    	}
    	html += "></" + tag + ">";
    	var elm = $(html);
    	elm.html(content);
    	parent.append(elm);
    },
    
    displayResults: function(number, result) {
    	if (result && result.id) {
    		var content = $("#results-content");
    		
    		// status
    		var divStatus = content.find('div.status');
    		divStatus.attr('class', result.statusId);
    		divStatus.find('p').html(result.statusName);
    		
    		// news
    		var divNews = content.find('div.news div');
    		divNews.empty();
    		if (result.log && result.log.length) {
    			for (var i = 0; i < result.log.length; i++) {
    				var item = result.log[i];
    				var p = $("<p></p>");
    				p.html(item.dt + ' (<span class="' + item.statusId + '">' + item.statusName + '</span>) - ' + item.user + ' - ' + item.description);
    				divNews.append(p);
    			}
    		}

    		// issue data
    		var divIssue = content.find('div.issue');
    		divIssue.find('p.subject').html(result.number + ' - ' + result.subject);
    		divIssue.find('p.date span.begin').html(result.dateBegin);
    		divIssue.find('p.date span.end').html(result.dateEnd);
    		divIssue.find('div.description').html(result.description);
    		
    		$.mobile.changePage("#results");
    		
    	} else {
    		app.showMessage('Заказ #' + number + ' не найден');
    	}
    },
    
    doSearch: function(number) {
    	$.ajax({url: 'http://192.168.1.196:8080/logistic/ntrack?number=' + number,
            dataType: "jsonp",
            timeout: 10000,
            jsonpCallback: 'successCallback',
            beforeSend: function() {
            	$.mobile.loading("show");
            },
            complete: function() {
            	$.mobile.loading("hide");
            },
            success: function (result) {
            	app.displayResults(number, result);
            },
            error: function (request, error, message) {
                app.showMessage('Соединение с сервером прервано');
            }
        });         	
    },
    
    initMessages: function() {
    	$("#close").on('click', function() {
    		$.mobile.changePage('#home');
    	});
    },
    
    initSearch: function() {
    	$("#search").on('click', function() {
    		var number = $("#number").val();
    		if (number.length == 0) {
    			app.showMessage("Введите номер заказа");
    		} else {
        		app.doSearch(number);
    		}
    	});
    },
    
    // deviceready Event Handler
    //
    // The scope of 'this' is the event. In order to call the 'receivedEvent'
    // function, we must explicitly call 'app.receivedEvent(...);'
    onDeviceReady: function() {
        //app.receivedEvent('deviceready');
    },
    // Update DOM on a Received Event
    receivedEvent: function(id) {
        //var parentElement = document.getElementById(id);
        /*
        var listeningElement = parentElement.querySelector('.listening');
        var receivedElement = parentElement.querySelector('.received');

        listeningElement.setAttribute('style', 'display:none;');
        receivedElement.setAttribute('style', 'display:block;');
         */
        console.log('Received Event: ' + id);
    },
    
    showMessage: function(msg) {
    	$("#message-text").html(msg);
		$.mobile.changePage('#message', 'pop', true, true);
    }
};
