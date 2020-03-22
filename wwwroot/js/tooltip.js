/*!
 * tooltip.js v1.0.0.0322 (https://github.com/xxxmatko/tooltip.js)
 * Copyright 2020 xxxmatko
 */
(function (root, factory) {
    if (typeof (define) === "function" && define.amd) {
        // AMD. Register as an anonymous module.
        define([], factory);
    } 
    else {
        // Browser globals
        factory();
    }
}(typeof (self) !== "undefined" ? self : this, function () {
    //#region [ Fields ]
    
    var global = (function () { return this; })();
    var doc = global.document;
    var tooltips = [];
    var counter = 0;
    var timer = null;
    
    //#endregion


    //#region [ Methods : Private ]
    
    /**
     * Fires function when DOM is ready.
     * 
     * @param {function} fn Function.
     */
    function _ready(fn) {
        if (doc.attachEvent ? (doc.readyState === "complete") : (doc.readyState !== "loading")) {
            fn();
        }
        else {
            doc.addEventListener("DOMContentLoaded", fn);
        }
    }


    /**
     * Adds event handler.
     * 
     * @param {string} event Event name. 
     * @param {function} handler Event handler. 
     */
    function _on(event, handler) {
        doc.addEventListener(event, function(e) {
            for (var target = e.target; target && target != this; target = target.parentNode) {
                if (target.classList.contains("tooltip")) {
                    handler.call(target, e);
                    break;
                }
            }
        }, true);
    }


    /**
     * Gets the closest tooltip element.
     * 
     * @param {element} el HTML element.
     */
    function _closest(el) {
        if(el.classList.contains("tooltip")) {
            return el;
        }

        return _closest(el.parentNode);
    }


    /**
     * Gets title.
     * 
     * @param {object} el HTML element. 
     */
    function _getTitle(el) {
        var title = (el.querySelector(".tooltip__text") || {}).innerHTML
            || el.getAttribute("title")
            || el.getAttribute("data-tooltip-text");
    
        el.removeAttribute("title");
        el.setAttribute("data-tooltip-text", title);

        return title;
    }


    /**
     * Gets id.
     * 
     * @param {object} el HTML element. 
     */
    function _getId(el) {
        var id = el.getAttribute("data-tooltip-id");
        if(id) {
            return id;
        }
    
        counter++;
        el.setAttribute("data-tooltip-id", counter);
        return counter;
    }


    /**
     * Gets or creates tooltip.
     * 
     * @param {number} id Id of the tooltip.
     * @param {object} target HTML element. 
     */
    function _getTooltip(id, target) {
        var el = doc.getElementById("tooltip" + id);
        if(el) {
            return el;
        }

        el = doc.createElement("div");
        el.setAttribute("id", "tooltip" + id);
        el.className = "tooltip-text";
        el.innerHTML = _getTitle(target);

        doc.body.appendChild(el);
        return el;
    }


    /**
     * Gets offset of the element.
     * 
     * @param {element} el Element.
     */
    function _offset(el) {
        var rect = el.getBoundingClientRect();

        return {
            top: Math.floor(rect.top + doc.body.scrollTop),
            left: Math.floor(rect.left + doc.body.scrollLeft)
        };
    }


    /**
     * Creates and shows tooltip.
     * 
     * @param {object} el HTML element which represents tooltip.
     */
    function _show(el) {
        var pos = _offset(this);
        var t = global.pageYOffset || doc.documentElement.scrollTop || doc.body.scrollTop || 0;
        var l = global.pageXOffset || doc.documentElement.scrollLeft || doc.body.scrollLeft || 0;
        var w = this.offsetWidth;
        var h = this.offsetHeight;

        var position = this.classList.contains("tooltip--top") ? "top" :
            this.classList.contains("tooltip--right") ? "right" :
            this.classList.contains("tooltip--bottom") ? "bottom" :
            this.classList.contains("tooltip--left") ? "left" : "top";
        switch (position) {
            case "top":
                el.style.top = Math.floor(pos.top + t) + "px";
                el.style.left = Math.floor(pos.left + l + (w / 2)) + "px";
                el.classList.add("tooltip-text--top");
                break;
            case "right":
                el.style.top = Math.floor(pos.top + (h / 2) + t) + "px";
                el.style.left = Math.floor(pos.left + w + l) + "px";
                el.classList.add("tooltip-text--right");
                break;
            case "bottom":
                el.style.top = Math.floor(pos.top + h + t) + "px";
                el.style.left = Math.floor(pos.left + l + (w / 2)) + "px";
                el.classList.add("tooltip-text--bottom");
                break;
            case "left":
                el.style.top = Math.floor(pos.top + t + (h / 2)) + "px";
                el.style.left = Math.floor(pos.left + l) + "px";
                el.classList.add("tooltip-text--left");
                break;
        }
        
        el.classList.add("tooltip-text--visible");
    }
 
    //#endregion


    //#region [ Event Handlers ]

    /**
     * Handles the mouse enter event.
     * 
     * @param {object} e Event arguments.
     */
    function _onMouseEnter(e) {
        // Clear previous timer
        if (timer) {
            clearTimeout(timer);
            timer = null;
        }

        // Get target element
        var target = _closest(e.target);

        // Check the id
        var id = _getId(target);

        // Get the last tooltip and remove it
        var t = tooltips[0];
        if(t) {
            if(("tooltip" + id) == t.getAttribute("id")) {
                return;
            }
            tooltips.shift();
            t.classList.remove("tooltip-text--visible");
        }

        // Create tooltip
        var el = _getTooltip(id, target);
        tooltips.push(el);

        timer = setTimeout(_show.bind(target, el), 200);
    }


    /**
     * Handles the mouse leave event.
     * 
     * @param {object} e Event arguments.
     */
    function _onMouseLeave(e) {
        // Get target element
        var target = _closest(e.target);

        // Check the id
        var id = _getId(target);

        // Get the last tooltip and remove it
        var t = tooltips[0];
        if(t) {
            if(("tooltip" + id) == t.getAttribute("id")) {
                tooltips.shift();
                t.classList.remove("tooltip-text--visible");
            }
        }
    }

    //#endregion


    //#region [ Methods : Public ]

    /**
     * Initializes tooltips.
     */
    function init() {
        _on("mouseenter", _onMouseEnter);
        _on("focus", _onMouseEnter);
        _on("mouseleave", _onMouseLeave); 
        _on("blur", _onMouseLeave);
    }

    //#endregion

    _ready(init);
}));