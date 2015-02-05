/*!--------------------------------------------------------------------
JAVASCRIPT "Outdated Browser"
Version:    1.1.0 - 2014
author:     Burocratik
website:    http://www.burocratik.com
* @preserve
-----------------------------------------------------------------------*/
var outdatedBrowser = function(options) {
    var outdated = document.getElementById("outdated");

    options = options || {};

    // default settings
    var defaultOpts = {
        bgColor      : '#f25648',
        color        : '#ffffff',
        lowerThan    : 'transform',
        languagePath : '../outdatedbrowser/lang/en.html',
        test         : false
    };

    // assign css3 property to IE browser version
    if (options.lowerThan === 'IE8' || options.lowerThan === 'borderSpacing') {
        options.lowerThan = 'borderSpacing';
    } else if (options.lowerThan === 'IE9' || options.lowerThan === 'boxShadow') {
        options.lowerThan = 'boxShadow';
    } else if (options.lowerThan === 'IE10' || options.lowerThan === 'transform' || options.lowerThan === '' || typeof options.lowerThan === "undefined") {
        options.lowerThan = 'transform';
    } else if (options.lowerThan === 'IE11' || options.lowerThan === 'borderImage') {
        options.lowerThan = 'borderImage';
    }

    options.bgColor       = options.bgColor      || defaultOpts.bgColor;
    options.color         = options.color        || defaultOpts.color;
    options.lowerThan     = options.lowerThan    || defaultOpts.lowerThan;
    options.languagePath  = options.languagePath != null ? options.languagePath : defaultOpts.languagePath;
    options.test          = options.test         || defaultOpts.test;

    // define opacity and fadeIn functions

    function opacity(opacityValue) {
        outdated.style.opacity = opacityValue / 100;
        outdated.style.filter = 'alpha(opacity=' + opacityValue + ')';
    }

    function fadeIn() {
        function step(opacityValue) {
            opacity(opacityValue);
        }

        outdated.style.opacity = 0;
        outdated.style.display = 'block';

        for (var i = 1; i <= 100; i++) {
            setTimeout((function (x) {
                return function () {
                    step(x);
                };
            })(i), i * 8);
        }
    }

    var supports = (function() {
        var div     = document.createElement('div'),
            vendors = 'Khtml Ms O Moz Webkit'.split(' '),
            len     = vendors.length;

        return function(prop) {
            if (prop in div.style) {
               return true;
            }

            prop = prop.replace(/^[a-z]/, function(val) {
                return val.toUpperCase();
            });

            while (len--) {
                if (vendors[len] + prop in div.style) {
                    return true;
                }
            }

            return false;
        };
    })();

    // if not in test mode and the browser supports css3 property (transform=default) then exit all this
    if (!options.test && supports(''+ options.lowerThan +'')) {
        return;
    }

    if (outdated.style.opacity !== '1') {
        fadeIn();
    }

    // check AJAX Options: if options.languagePath == '' > use no Ajax way, html is needed inside <div id="outdated">
    if (options.languagePath === ' ' || options.languagePath.length === 0) {
        startStylesAndEvents();
    } else {
        grabFile(options.languagePath);
    }

    // events and colors
    function startStylesAndEvents() {
        var btnClose = document.getElementById("btnCloseUpdateBrowser"),
            btnUpdate = document.getElementById("btnUpdateBrowser");

        // check settings attributes
        outdated.style.backgroundColor = options.bgColor;
        // way too hard to put !important on IE6
        outdated.style.color = options.color;
        outdated.children[0].style.color = options.color;
        outdated.children[1].style.color = options.color;

        // check settings attributes
        btnUpdate.style.color = options.color;
        // btnUpdate.style.borderColor = options.color;

        if (btnUpdate.style.borderColor) {
            btnUpdate.style.borderColor = options.color;
        }

        btnClose.style.color = options.color;

        // close button
        btnClose.onmousedown = function() {
            outdated.style.display = 'none';

            return false;
        };

        // override the update button color to match the background color
        btnUpdate.onmouseover = function() {
            this.style.color = options.bgColor;
            this.style.backgroundColor = options.color;
        };
        btnUpdate.onmouseout = function() {
            this.style.color = options.color;
            this.style.backgroundColor = options.bgColor;
        };
    }

    // if AJAX with request ERROR > insert english default
    var ajaxEnglishDefault = '<h6>Your browser is out-of-date!</h6>' +
        '<p>Update your browser to view this website correctly. <a id="btnUpdateBrowser" href="http://outdatedbrowser.com/">Update my browser now </a></p>' +
        '<p class="last"><a href="#" id="btnCloseUpdateBrowser" title="Close">&times;</a></p>';

    /* AJAX FUNCTIONS - Bulletproof Ajax by Jeremy Keith */
    function getHTTPObject() {
        var xhr = false;

        if (window.XMLHttpRequest) {
            xhr = new XMLHttpRequest();
        } else if (window.ActiveXObject) {
            try {
                xhr = new ActiveXObject("Msxml2.XMLHTTP");
            } catch(e) {
                try {
                    xhr = new ActiveXObject("Microsoft.XMLHTTP");
                } catch(e) {
                    xhr = false;
                }
            }
        }

        return xhr;
    }

    function grabFile(file) {
        var request = getHTTPObject();

        if (request) {
            request.onreadystatechange = function() {
                displayResponse(request);
            };

            request.open("GET", file, true);
            request.send(null);
        }

        return false;
    }

    function displayResponse(request) {
        if (request.readyState == 4) {
            if (request.status == 200 || request.status == 304) {
                outdated.innerHTML = request.responseText;
            } else {
                outdated.innerHTML = ajaxEnglishDefault;
            }

            startStylesAndEvents();
        }

        return false;
    }
};







