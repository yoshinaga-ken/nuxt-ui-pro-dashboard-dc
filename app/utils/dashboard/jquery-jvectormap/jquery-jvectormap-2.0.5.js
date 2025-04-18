!function($) {
    var apiParams = {
        set: {
            colors: 1,
            values: 1,
            backgroundColor: 1,
            scaleColors: 1,
            normalizeFunction: 1,
            focus: 1
        },
        get: {
            selectedRegions: 1,
            selectedMarkers: 1,
            mapObject: 1,
            regionName: 1
        }
    };
    $.fn.vectorMap = function(options) {
        var map = this.children(".jvectormap-container").data("mapObject");
        if ("addMap" === options)
            jvm.Map.maps[arguments[1]] = arguments[2];
        else {
            if (("set" === options || "get" === options) && apiParams[options][arguments[1]])
                return map[options + (arguments[1].charAt(0).toUpperCase() + arguments[1].substr(1))].apply(map, Array.prototype.slice.call(arguments, 2));
            (options = options || {}).container = this,
            map = new jvm.Map(options)
        }
        return this
    }
}(jQuery),
function(factory) {
    "function" == typeof define && define.amd ? define(["jquery"], factory) : "object" == typeof exports ? module.exports = factory : factory(jQuery)
}(function($) {
    var nullLowestDeltaTimeout, lowestDelta, toFix = ["wheel", "mousewheel", "DOMMouseScroll", "MozMousePixelScroll"], toBind = "onwheel"in document || 9 <= document.documentMode ? ["wheel"] : ["mousewheel", "DomMouseScroll", "MozMousePixelScroll"], slice = Array.prototype.slice;
    if ($.event.fixHooks)
        for (var i = toFix.length; i; )
            $.event.fixHooks[toFix[--i]] = $.event.mouseHooks;
    var special = $.event.special.mousewheel = {
        version: "3.1.9",
        setup: function() {
            if (this.addEventListener)
                for (var i = toBind.length; i; )
                    this.addEventListener(toBind[--i], handler, !1);
            else
                this.onmousewheel = handler;
            $.data(this, "mousewheel-line-height", special.getLineHeight(this)),
            $.data(this, "mousewheel-page-height", special.getPageHeight(this))
        },
        teardown: function() {
            if (this.removeEventListener)
                for (var i = toBind.length; i; )
                    this.removeEventListener(toBind[--i], handler, !1);
            else
                this.onmousewheel = null
        },
        getLineHeight: function(elem) {
            return parseInt($(elem)["offsetParent"in $.fn ? "offsetParent" : "parent"]().css("fontSize"), 10)
        },
        getPageHeight: function(elem) {
            return $(elem).height()
        },
        settings: {
            adjustOldDeltas: !0
        }
    };
    function handler(event) {
        var absDelta, orgEvent = event || window.event, args = slice.call(arguments, 1), delta = 0, deltaX = 0, deltaY = 0;
        if ((event = $.event.fix(orgEvent)).type = "mousewheel",
        "detail"in orgEvent && (deltaY = -1 * orgEvent.detail),
        "wheelDelta"in orgEvent && (deltaY = orgEvent.wheelDelta),
        "wheelDeltaY"in orgEvent && (deltaY = orgEvent.wheelDeltaY),
        "wheelDeltaX"in orgEvent && (deltaX = -1 * orgEvent.wheelDeltaX),
        "axis"in orgEvent && orgEvent.axis === orgEvent.HORIZONTAL_AXIS && (deltaX = -1 * deltaY,
        deltaY = 0),
        delta = 0 === deltaY ? deltaX : deltaY,
        "deltaY"in orgEvent && (delta = deltaY = -1 * orgEvent.deltaY),
        "deltaX"in orgEvent && (deltaX = orgEvent.deltaX,
        0 === deltaY && (delta = -1 * deltaX)),
        0 !== deltaY || 0 !== deltaX) {
            if (1 === orgEvent.deltaMode) {
                var lineHeight = $.data(this, "mousewheel-line-height");
                delta *= lineHeight,
                deltaY *= lineHeight,
                deltaX *= lineHeight
            } else if (2 === orgEvent.deltaMode) {
                var pageHeight = $.data(this, "mousewheel-page-height");
                delta *= pageHeight,
                deltaY *= pageHeight,
                deltaX *= pageHeight
            }
            return absDelta = Math.max(Math.abs(deltaY), Math.abs(deltaX)),
            (!lowestDelta || absDelta < lowestDelta) && shouldAdjustOldDeltas(orgEvent, lowestDelta = absDelta) && (lowestDelta /= 40),
            shouldAdjustOldDeltas(orgEvent, absDelta) && (delta /= 40,
            deltaX /= 40,
            deltaY /= 40),
            delta = Math[1 <= delta ? "floor" : "ceil"](delta / lowestDelta),
            deltaX = Math[1 <= deltaX ? "floor" : "ceil"](deltaX / lowestDelta),
            deltaY = Math[1 <= deltaY ? "floor" : "ceil"](deltaY / lowestDelta),
            event.deltaX = deltaX,
            event.deltaY = deltaY,
            event.deltaFactor = lowestDelta,
            event.deltaMode = 0,
            args.unshift(event, delta, deltaX, deltaY),
            nullLowestDeltaTimeout && clearTimeout(nullLowestDeltaTimeout),
            nullLowestDeltaTimeout = setTimeout(nullLowestDelta, 200),
            ($.event.dispatch || $.event.handle).apply(this, args)
        }
    }
    function nullLowestDelta() {
        lowestDelta = null
    }
    function shouldAdjustOldDeltas(orgEvent, absDelta) {
        return special.settings.adjustOldDeltas && "mousewheel" === orgEvent.type && absDelta % 120 == 0
    }
    $.fn.extend({
        mousewheel: function(fn) {
            return fn ? this.bind("mousewheel", fn) : this.trigger("mousewheel")
        },
        unmousewheel: function(fn) {
            return this.unbind("mousewheel", fn)
        }
    })
});
var jvm = {
    inherits: function(child, parent) {
        function temp() {}
        temp.prototype = parent.prototype,
        child.prototype = new temp,
        (child.prototype.constructor = child).parentClass = parent
    },
    mixin: function(target, source) {
        var prop;
        for (prop in source.prototype)
            source.prototype.hasOwnProperty(prop) && (target.prototype[prop] = source.prototype[prop])
    },
    min: function(values) {
        var i, min = Number.MAX_VALUE;
        if (values instanceof Array)
            for (i = 0; i < values.length; i++)
                values[i] < min && (min = values[i]);
        else
            for (i in values)
                values[i] < min && (min = values[i]);
        return min
    },
    max: function(values) {
        var i, max = Number.MIN_VALUE;
        if (values instanceof Array)
            for (i = 0; i < values.length; i++)
                values[i] > max && (max = values[i]);
        else
            for (i in values)
                values[i] > max && (max = values[i]);
        return max
    },
    keys: function(object) {
        var key, keys = [];
        for (key in object)
            keys.push(key);
        return keys
    },
    values: function(object) {
        var key, i, values = [];
        for (i = 0; i < arguments.length; i++)
            for (key in object = arguments[i])
                values.push(object[key]);
        return values
    },
    whenImageLoaded: function(url) {
        var deferred = new jvm.$.Deferred
          , img = jvm.$("<img/>");
        return img.on("error", function() {
            deferred.reject()
        }).on("load", function() {
            deferred.resolve(img)
        }),
        img.attr("src", url),
        deferred
    },
    isImageUrl: function(s) {
        return /\.\w{3,4}$/.test(s)
    }
};
jvm.$ = jQuery,
Array.prototype.indexOf || (Array.prototype.indexOf = function(searchElement, fromIndex) {
    var k;
    if (null == this)
        throw new TypeError('"this" is null or not defined');
    var O = Object(this)
      , len = O.length >>> 0;
    if (0 == len)
        return -1;
    var n = +fromIndex || 0;
    if (Math.abs(n) === 1 / 0 && (n = 0),
    len <= n)
        return -1;
    for (k = Math.max(0 <= n ? n : len - Math.abs(n), 0); k < len; ) {
        if (k in O && O[k] === searchElement)
            return k;
        k++
    }
    return -1
}
),
jvm.AbstractElement = function(name, config) {
    this.node = this.createElement(name),
    this.name = name,
    this.properties = {},
    config && this.set(config)
}
,
jvm.AbstractElement.prototype.set = function(property, value) {
    var key;
    if ("object" == typeof property)
        for (key in property)
            this.properties[key] = property[key],
            this.applyAttr(key, property[key]);
    else
        this.properties[property] = value,
        this.applyAttr(property, value)
}
,
jvm.AbstractElement.prototype.get = function(property) {
    return this.properties[property]
}
,
jvm.AbstractElement.prototype.applyAttr = function(property, value) {
    this.node.setAttribute(property, value)
}
,
jvm.AbstractElement.prototype.remove = function() {
    jvm.$(this.node).remove()
}
,
jvm.AbstractCanvasElement = function(container, width, height) {
    this.container = container,
    this.setSize(width, height),
    this.rootElement = new jvm[this.classPrefix + "GroupElement"],
    this.node.appendChild(this.rootElement.node),
    this.container.appendChild(this.node)
}
,
jvm.AbstractCanvasElement.prototype.add = function(element, group) {
    (group = group || this.rootElement).add(element),
    element.canvas = this
}
,
jvm.AbstractCanvasElement.prototype.addPath = function(config, style, group) {
    var el = new jvm[this.classPrefix + "PathElement"](config,style);
    return this.add(el, group),
    el
}
,
jvm.AbstractCanvasElement.prototype.addCircle = function(config, style, group) {
    var el = new jvm[this.classPrefix + "CircleElement"](config,style);
    return this.add(el, group),
    el
}
,
jvm.AbstractCanvasElement.prototype.addImage = function(config, style, group) {
    var el = new jvm[this.classPrefix + "ImageElement"](config,style);
    return this.add(el, group),
    el
}
,
jvm.AbstractCanvasElement.prototype.addText = function(config, style, group) {
    var el = new jvm[this.classPrefix + "TextElement"](config,style);
    return this.add(el, group),
    el
}
,
jvm.AbstractCanvasElement.prototype.addGroup = function(parentGroup) {
    var el = new jvm[this.classPrefix + "GroupElement"];
    return parentGroup ? parentGroup.node.appendChild(el.node) : this.node.appendChild(el.node),
    el.canvas = this,
    el
}
,
jvm.AbstractShapeElement = function(name, config, style) {
    this.style = style || {},
    this.style.current = this.style.current || {},
    this.isHovered = !1,
    this.isSelected = !1,
    this.updateStyle()
}
,
jvm.AbstractShapeElement.prototype.setStyle = function(property, value) {
    var styles = {};
    "object" == typeof property ? styles = property : styles[property] = value,
    jvm.$.extend(this.style.current, styles),
    this.updateStyle()
}
,
jvm.AbstractShapeElement.prototype.updateStyle = function() {
    var attrs = {};
    jvm.AbstractShapeElement.mergeStyles(attrs, this.style.initial),
    jvm.AbstractShapeElement.mergeStyles(attrs, this.style.current),
    this.isHovered && jvm.AbstractShapeElement.mergeStyles(attrs, this.style.hover),
    this.isSelected && (jvm.AbstractShapeElement.mergeStyles(attrs, this.style.selected),
    this.isHovered && jvm.AbstractShapeElement.mergeStyles(attrs, this.style.selectedHover)),
    this.set(attrs)
}
,
jvm.AbstractShapeElement.mergeStyles = function(styles, newStyles) {
    var key;
    for (key in newStyles = newStyles || {})
        null === newStyles[key] ? delete styles[key] : styles[key] = newStyles[key]
}
,
jvm.SVGElement = function(name, config) {
    jvm.SVGElement.parentClass.apply(this, arguments)
}
,
jvm.inherits(jvm.SVGElement, jvm.AbstractElement),
jvm.SVGElement.svgns = "http://www.w3.org/2000/svg",
jvm.SVGElement.prototype.createElement = function(tagName) {
    return document.createElementNS(jvm.SVGElement.svgns, tagName)
}
,
jvm.SVGElement.prototype.addClass = function(className) {
    this.node.setAttribute("class", className)
}
,
jvm.SVGElement.prototype.getElementCtr = function(ctr) {
    return jvm["SVG" + ctr]
}
,
jvm.SVGElement.prototype.getBBox = function() {
    return this.node.getBBox()
}
,
jvm.SVGGroupElement = function() {
    jvm.SVGGroupElement.parentClass.call(this, "g")
}
,
jvm.inherits(jvm.SVGGroupElement, jvm.SVGElement),
jvm.SVGGroupElement.prototype.add = function(element) {
    this.node.appendChild(element.node)
}
,
jvm.SVGCanvasElement = function(container, width, height) {
    this.classPrefix = "SVG",
    jvm.SVGCanvasElement.parentClass.call(this, "svg"),
    this.defsElement = new jvm.SVGElement("defs"),
    this.node.appendChild(this.defsElement.node),
    jvm.AbstractCanvasElement.apply(this, arguments)
}
,
jvm.inherits(jvm.SVGCanvasElement, jvm.SVGElement),
jvm.mixin(jvm.SVGCanvasElement, jvm.AbstractCanvasElement),
jvm.SVGCanvasElement.prototype.setSize = function(width, height) {
    this.width = width,
    this.height = height,
    this.node.setAttribute("width", width),
    this.node.setAttribute("height", height)
}
,
jvm.SVGCanvasElement.prototype.applyTransformParams = function(scale, transX, transY) {
    this.scale = scale,
    this.transX = transX,
    this.transY = transY,
    this.rootElement.node.setAttribute("transform", "scale(" + scale + ") translate(" + transX + ", " + transY + ")")
}
,
jvm.SVGShapeElement = function(name, config, style) {
    jvm.SVGShapeElement.parentClass.call(this, name, config),
    jvm.AbstractShapeElement.apply(this, arguments)
}
,
jvm.inherits(jvm.SVGShapeElement, jvm.SVGElement),
jvm.mixin(jvm.SVGShapeElement, jvm.AbstractShapeElement),
jvm.SVGShapeElement.prototype.applyAttr = function(attr, value) {
    var patternEl, imageEl, that = this;
    "fill" === attr && jvm.isImageUrl(value) ? jvm.SVGShapeElement.images[value] ? this.applyAttr("fill", "url(#image" + jvm.SVGShapeElement.images[value] + ")") : jvm.whenImageLoaded(value).then(function(img) {
        (imageEl = new jvm.SVGElement("image")).node.setAttributeNS("http://www.w3.org/1999/xlink", "href", value),
        imageEl.applyAttr("x", "0"),
        imageEl.applyAttr("y", "0"),
        imageEl.applyAttr("width", img[0].width),
        imageEl.applyAttr("height", img[0].height),
        (patternEl = new jvm.SVGElement("pattern")).applyAttr("id", "image" + jvm.SVGShapeElement.imageCounter),
        patternEl.applyAttr("x", 0),
        patternEl.applyAttr("y", 0),
        patternEl.applyAttr("width", img[0].width / 2),
        patternEl.applyAttr("height", img[0].height / 2),
        patternEl.applyAttr("viewBox", "0 0 " + img[0].width + " " + img[0].height),
        patternEl.applyAttr("patternUnits", "userSpaceOnUse"),
        patternEl.node.appendChild(imageEl.node),
        that.canvas.defsElement.node.appendChild(patternEl.node),
        jvm.SVGShapeElement.images[value] = jvm.SVGShapeElement.imageCounter++,
        that.applyAttr("fill", "url(#image" + jvm.SVGShapeElement.images[value] + ")")
    }) : jvm.SVGShapeElement.parentClass.prototype.applyAttr.apply(this, arguments)
}
,
jvm.SVGShapeElement.imageCounter = 1,
jvm.SVGShapeElement.images = {},
jvm.SVGPathElement = function(config, style) {
    jvm.SVGPathElement.parentClass.call(this, "path", config, style),
    this.node.setAttribute("fill-rule", "evenodd")
}
,
jvm.inherits(jvm.SVGPathElement, jvm.SVGShapeElement),
jvm.SVGCircleElement = function(config, style) {
    jvm.SVGCircleElement.parentClass.call(this, "circle", config, style)
}
,
jvm.inherits(jvm.SVGCircleElement, jvm.SVGShapeElement),
jvm.SVGImageElement = function(config, style) {
    jvm.SVGImageElement.parentClass.call(this, "image", config, style)
}
,
jvm.inherits(jvm.SVGImageElement, jvm.SVGShapeElement),
jvm.SVGImageElement.prototype.applyAttr = function(attr, value) {
    var imageUrl, that = this;
    "image" == attr ? ("object" == typeof value ? (imageUrl = value.url,
    this.offset = value.offset) : (imageUrl = value,
    this.offset = [0, 0]),
    jvm.whenImageLoaded(imageUrl).then(function(img) {
        that.node.setAttributeNS("http://www.w3.org/1999/xlink", "href", imageUrl),
        that.width = img[0].width,
        that.height = img[0].height,
        that.applyAttr("width", that.width),
        that.applyAttr("height", that.height),
        that.applyAttr("x", that.cx - that.width / 2 + that.offset[0]),
        that.applyAttr("y", that.cy - that.height / 2 + that.offset[1]),
        jvm.$(that.node).trigger("imageloaded", [img])
    })) : "cx" == attr ? (this.cx = value,
    this.width && this.applyAttr("x", value - this.width / 2 + this.offset[0])) : "cy" == attr ? (this.cy = value,
    this.height && this.applyAttr("y", value - this.height / 2 + this.offset[1])) : jvm.SVGImageElement.parentClass.prototype.applyAttr.apply(this, arguments)
}
,
jvm.SVGTextElement = function(config, style) {
    jvm.SVGTextElement.parentClass.call(this, "text", config, style)
}
,
jvm.inherits(jvm.SVGTextElement, jvm.SVGShapeElement),
jvm.SVGTextElement.prototype.applyAttr = function(attr, value) {
    "text" === attr ? this.node.textContent = value : jvm.SVGTextElement.parentClass.prototype.applyAttr.apply(this, arguments)
}
,
jvm.VMLElement = function(name, config) {
    jvm.VMLElement.VMLInitialized || jvm.VMLElement.initializeVML(),
    jvm.VMLElement.parentClass.apply(this, arguments)
}
,
jvm.inherits(jvm.VMLElement, jvm.AbstractElement),
jvm.VMLElement.VMLInitialized = !1,
jvm.VMLElement.initializeVML = function() {
    try {
        document.namespaces.rvml || document.namespaces.add("rvml", "urn:schemas-microsoft-com:vml"),
        jvm.VMLElement.prototype.createElement = function(tagName) {
            return document.createElement("<rvml:" + tagName + ' class="rvml">')
        }
    } catch (e) {
        jvm.VMLElement.prototype.createElement = function(tagName) {
            return document.createElement("<" + tagName + ' xmlns="urn:schemas-microsoft.com:vml" class="rvml">')
        }
    }
    document.createStyleSheet().addRule(".rvml", "behavior:url(#default#VML)"),
    jvm.VMLElement.VMLInitialized = !0
}
,
jvm.VMLElement.prototype.getElementCtr = function(ctr) {
    return jvm["VML" + ctr]
}
,
jvm.VMLElement.prototype.addClass = function(className) {
    jvm.$(this.node).addClass(className)
}
,
jvm.VMLElement.prototype.applyAttr = function(attr, value) {
    this.node[attr] = value
}
,
jvm.VMLElement.prototype.getBBox = function() {
    var node = jvm.$(this.node);
    return {
        x: node.position().left / this.canvas.scale,
        y: node.position().top / this.canvas.scale,
        width: node.width() / this.canvas.scale,
        height: node.height() / this.canvas.scale
    }
}
,
jvm.VMLGroupElement = function() {
    jvm.VMLGroupElement.parentClass.call(this, "group"),
    this.node.style.left = "0px",
    this.node.style.top = "0px",
    this.node.coordorigin = "0 0"
}
,
jvm.inherits(jvm.VMLGroupElement, jvm.VMLElement),
jvm.VMLGroupElement.prototype.add = function(element) {
    this.node.appendChild(element.node)
}
,
jvm.VMLCanvasElement = function(container, width, height) {
    this.classPrefix = "VML",
    jvm.VMLCanvasElement.parentClass.call(this, "group"),
    jvm.AbstractCanvasElement.apply(this, arguments),
    this.node.style.position = "absolute"
}
,
jvm.inherits(jvm.VMLCanvasElement, jvm.VMLElement),
jvm.mixin(jvm.VMLCanvasElement, jvm.AbstractCanvasElement),
jvm.VMLCanvasElement.prototype.setSize = function(width, height) {
    var paths, groups, i, l;
    if (this.width = width,
    this.height = height,
    this.node.style.width = width + "px",
    this.node.style.height = height + "px",
    this.node.coordsize = width + " " + height,
    this.node.coordorigin = "0 0",
    this.rootElement) {
        for (i = 0,
        l = (paths = this.rootElement.node.getElementsByTagName("shape")).length; i < l; i++)
            paths[i].coordsize = width + " " + height,
            paths[i].style.width = width + "px",
            paths[i].style.height = height + "px";
        for (i = 0,
        l = (groups = this.node.getElementsByTagName("group")).length; i < l; i++)
            groups[i].coordsize = width + " " + height,
            groups[i].style.width = width + "px",
            groups[i].style.height = height + "px"
    }
}
,
jvm.VMLCanvasElement.prototype.applyTransformParams = function(scale, transX, transY) {
    this.scale = scale,
    this.transX = transX,
    this.transY = transY,
    this.rootElement.node.coordorigin = this.width - transX - this.width / 100 + "," + (this.height - transY - this.height / 100),
    this.rootElement.node.coordsize = this.width / scale + "," + this.height / scale
}
,
jvm.VMLShapeElement = function(name, config) {
    jvm.VMLShapeElement.parentClass.call(this, name, config),
    this.fillElement = new jvm.VMLElement("fill"),
    this.strokeElement = new jvm.VMLElement("stroke"),
    this.node.appendChild(this.fillElement.node),
    this.node.appendChild(this.strokeElement.node),
    this.node.stroked = !1,
    jvm.AbstractShapeElement.apply(this, arguments)
}
,
jvm.inherits(jvm.VMLShapeElement, jvm.VMLElement),
jvm.mixin(jvm.VMLShapeElement, jvm.AbstractShapeElement),
jvm.VMLShapeElement.prototype.applyAttr = function(attr, value) {
    switch (attr) {
    case "fill":
        this.node.fillcolor = value;
        break;
    case "fill-opacity":
        this.fillElement.node.opacity = Math.round(100 * value) + "%";
        break;
    case "stroke":
        this.node.stroked = "none" !== value,
        this.node.strokecolor = value;
        break;
    case "stroke-opacity":
        this.strokeElement.node.opacity = Math.round(100 * value) + "%";
        break;
    case "stroke-width":
        0 === parseInt(value, 10) ? this.node.stroked = !1 : this.node.stroked = !0,
        this.node.strokeweight = value;
        break;
    case "d":
        this.node.path = jvm.VMLPathElement.pathSvgToVml(value);
        break;
    default:
        jvm.VMLShapeElement.parentClass.prototype.applyAttr.apply(this, arguments)
    }
}
,
jvm.VMLPathElement = function(config, style) {
    var scale = new jvm.VMLElement("skew");
    jvm.VMLPathElement.parentClass.call(this, "shape", config, style),
    this.node.coordorigin = "0 0",
    scale.node.on = !0,
    scale.node.matrix = "0.01,0,0,0.01,0,0",
    scale.node.offset = "0,0",
    this.node.appendChild(scale.node)
}
,
jvm.inherits(jvm.VMLPathElement, jvm.VMLShapeElement),
jvm.VMLPathElement.prototype.applyAttr = function(attr, value) {
    "d" === attr ? this.node.path = jvm.VMLPathElement.pathSvgToVml(value) : jvm.VMLShapeElement.prototype.applyAttr.call(this, attr, value)
}
,
jvm.VMLPathElement.pathSvgToVml = function(path) {
    var ctrlx, ctrly, cx = 0, cy = 0;
    return (path = path.replace(/(-?\d+)e(-?\d+)/g, "0")).replace(/([MmLlHhVvCcSs])\s*((?:-?\d*(?:\.\d+)?\s*,?\s*)+)/g, function(segment, letter, coords, index) {
        (coords = coords.replace(/(\d)-/g, "$1,-").replace(/^\s+/g, "").replace(/\s+$/g, "").replace(/\s+/g, ",").split(","))[0] || coords.shift();
        for (var i = 0, l = coords.length; i < l; i++)
            coords[i] = Math.round(100 * coords[i]);
        switch (letter) {
        case "m":
            return cx += coords[0],
            cy += coords[1],
            "t" + coords.join(",");
        case "M":
            return cx = coords[0],
            cy = coords[1],
            "m" + coords.join(",");
        case "l":
            return cx += coords[0],
            cy += coords[1],
            "r" + coords.join(",");
        case "L":
            return cx = coords[0],
            cy = coords[1],
            "l" + coords.join(",");
        case "h":
            return cx += coords[0],
            "r" + coords[0] + ",0";
        case "H":
            return "l" + (cx = coords[0]) + "," + cy;
        case "v":
            return cy += coords[0],
            "r0," + coords[0];
        case "V":
            return cy = coords[0],
            "l" + cx + "," + cy;
        case "c":
            return ctrlx = cx + coords[coords.length - 4],
            ctrly = cy + coords[coords.length - 3],
            cx += coords[coords.length - 2],
            cy += coords[coords.length - 1],
            "v" + coords.join(",");
        case "C":
            return ctrlx = coords[coords.length - 4],
            ctrly = coords[coords.length - 3],
            cx = coords[coords.length - 2],
            cy = coords[coords.length - 1],
            "c" + coords.join(",");
        case "s":
            return coords.unshift(cy - ctrly),
            coords.unshift(cx - ctrlx),
            ctrlx = cx + coords[coords.length - 4],
            ctrly = cy + coords[coords.length - 3],
            cx += coords[coords.length - 2],
            cy += coords[coords.length - 1],
            "v" + coords.join(",");
        case "S":
            return coords.unshift(cy + cy - ctrly),
            coords.unshift(cx + cx - ctrlx),
            ctrlx = coords[coords.length - 4],
            ctrly = coords[coords.length - 3],
            cx = coords[coords.length - 2],
            cy = coords[coords.length - 1],
            "c" + coords.join(",")
        }
        return ""
    }).replace(/z/g, "e")
}
,
jvm.VMLCircleElement = function(config, style) {
    jvm.VMLCircleElement.parentClass.call(this, "oval", config, style)
}
,
jvm.inherits(jvm.VMLCircleElement, jvm.VMLShapeElement),
jvm.VMLCircleElement.prototype.applyAttr = function(attr, value) {
    switch (attr) {
    case "r":
        this.node.style.width = 2 * value + "px",
        this.node.style.height = 2 * value + "px",
        this.applyAttr("cx", this.get("cx") || 0),
        this.applyAttr("cy", this.get("cy") || 0);
        break;
    case "cx":
        if (!value)
            return;
        this.node.style.left = value - (this.get("r") || 0) + "px";
        break;
    case "cy":
        if (!value)
            return;
        this.node.style.top = value - (this.get("r") || 0) + "px";
        break;
    default:
        jvm.VMLCircleElement.parentClass.prototype.applyAttr.call(this, attr, value)
    }
}
,
jvm.VectorCanvas = function(container, width, height) {
    return this.mode = window.SVGAngle ? "svg" : "vml",
    "svg" == this.mode ? this.impl = new jvm.SVGCanvasElement(container,width,height) : this.impl = new jvm.VMLCanvasElement(container,width,height),
    this.impl.mode = this.mode,
    this.impl
}
,
jvm.SimpleScale = function(scale) {
    this.scale = scale
}
,
jvm.SimpleScale.prototype.getValue = function(value) {
    return value
}
,
jvm.OrdinalScale = function(scale) {
    this.scale = scale
}
,
jvm.OrdinalScale.prototype.getValue = function(value) {
    return this.scale[value]
}
,
jvm.OrdinalScale.prototype.getTicks = function() {
    var key, ticks = [];
    for (key in this.scale)
        ticks.push({
            label: key,
            value: this.scale[key]
        });
    return ticks
}
,
jvm.NumericScale = function(scale, normalizeFunction, minValue, maxValue) {
    this.scale = [],
    normalizeFunction = normalizeFunction || "linear",
    scale && this.setScale(scale),
    normalizeFunction && this.setNormalizeFunction(normalizeFunction),
    void 0 !== minValue && this.setMin(minValue),
    void 0 !== maxValue && this.setMax(maxValue)
}
,
jvm.NumericScale.prototype = {
    setMin: function(min) {
        this.clearMinValue = min,
        "function" == typeof this.normalize ? this.minValue = this.normalize(min) : this.minValue = min
    },
    setMax: function(max) {
        this.clearMaxValue = max,
        "function" == typeof this.normalize ? this.maxValue = this.normalize(max) : this.maxValue = max
    },
    setScale: function(scale) {
        var i;
        for (this.scale = [],
        i = 0; i < scale.length; i++)
            this.scale[i] = [scale[i]]
    },
    setNormalizeFunction: function(f) {
        "polynomial" === f ? this.normalize = function(value) {
            return Math.pow(value, .2)
        }
        : "linear" === f ? delete this.normalize : this.normalize = f,
        this.setMin(this.clearMinValue),
        this.setMax(this.clearMaxValue)
    },
    getValue: function(value) {
        var l, c, lengthes = [], fullLength = 0, i = 0;
        for ("function" == typeof this.normalize && (value = this.normalize(value)),
        i = 0; i < this.scale.length - 1; i++)
            l = this.vectorLength(this.vectorSubtract(this.scale[i + 1], this.scale[i])),
            lengthes.push(l),
            fullLength += l;
        for (c = (this.maxValue - this.minValue) / fullLength,
        i = 0; i < lengthes.length; i++)
            lengthes[i] *= c;
        for (i = 0,
        value -= this.minValue; 0 <= value - lengthes[i]; )
            value -= lengthes[i],
            i++;
        return value = i == this.scale.length - 1 ? this.vectorToNum(this.scale[i]) : this.vectorToNum(this.vectorAdd(this.scale[i], this.vectorMult(this.vectorSubtract(this.scale[i + 1], this.scale[i]), value / lengthes[i])))
    },
    vectorToNum: function(vector) {
        var i, num = 0;
        for (i = 0; i < vector.length; i++)
            num += Math.round(vector[i]) * Math.pow(256, vector.length - i - 1);
        return num
    },
    vectorSubtract: function(vector1, vector2) {
        var i, vector = [];
        for (i = 0; i < vector1.length; i++)
            vector[i] = vector1[i] - vector2[i];
        return vector
    },
    vectorAdd: function(vector1, vector2) {
        var i, vector = [];
        for (i = 0; i < vector1.length; i++)
            vector[i] = vector1[i] + vector2[i];
        return vector
    },
    vectorMult: function(vector, num) {
        var i, result = [];
        for (i = 0; i < vector.length; i++)
            result[i] = vector[i] * num;
        return result
    },
    vectorLength: function(vector) {
        var i, result = 0;
        for (i = 0; i < vector.length; i++)
            result += vector[i] * vector[i];
        return Math.sqrt(result)
    },
    getTicks: function() {
        var tick, v, extent = [this.clearMinValue, this.clearMaxValue], span = extent[1] - extent[0], step = Math.pow(10, Math.floor(Math.log(span / 5) / Math.LN10)), err = 5 / span * step, ticks = [];
        for (err <= .15 ? step *= 10 : err <= .35 ? step *= 5 : err <= .75 && (step *= 2),
        extent[0] = Math.floor(extent[0] / step) * step,
        extent[1] = Math.ceil(extent[1] / step) * step,
        tick = extent[0]; tick <= extent[1]; )
            v = tick == extent[0] ? this.clearMinValue : tick == extent[1] ? this.clearMaxValue : tick,
            ticks.push({
                label: tick,
                value: this.getValue(v)
            }),
            tick += step;
        return ticks
    }
},
jvm.ColorScale = function(colors, normalizeFunction, minValue, maxValue) {
    jvm.ColorScale.parentClass.apply(this, arguments)
}
,
jvm.inherits(jvm.ColorScale, jvm.NumericScale),
jvm.ColorScale.prototype.setScale = function(scale) {
    var i;
    for (i = 0; i < scale.length; i++)
        this.scale[i] = jvm.ColorScale.rgbToArray(scale[i])
}
,
jvm.ColorScale.prototype.getValue = function(value) {
    return jvm.ColorScale.numToRgb(jvm.ColorScale.parentClass.prototype.getValue.call(this, value))
}
,
jvm.ColorScale.arrayToRgb = function(ar) {
    var d, i, rgb = "#";
    for (i = 0; i < ar.length; i++)
        rgb += 1 == (d = ar[i].toString(16)).length ? "0" + d : d;
    return rgb
}
,
jvm.ColorScale.numToRgb = function(num) {
    for (num = num.toString(16); num.length < 6; )
        num = "0" + num;
    return "#" + num
}
,
jvm.ColorScale.rgbToArray = function(rgb) {
    return rgb = rgb.substr(1),
    [parseInt(rgb.substr(0, 2), 16), parseInt(rgb.substr(2, 2), 16), parseInt(rgb.substr(4, 2), 16)]
}
,
jvm.Legend = function(params) {
    this.params = params || {},
    this.map = this.params.map,
    this.series = this.params.series,
    this.body = jvm.$("<div/>"),
    this.body.addClass("jvectormap-legend"),
    this.params.cssClass && this.body.addClass(this.params.cssClass),
    params.vertical ? this.map.legendCntVertical.append(this.body) : this.map.legendCntHorizontal.append(this.body),
    this.render()
}
,
jvm.Legend.prototype.render = function() {
    var i, tick, sample, label, ticks = this.series.scale.getTicks(), inner = jvm.$("<div/>").addClass("jvectormap-legend-inner");
    for (this.body.html(""),
    this.params.title && this.body.append(jvm.$("<div/>").addClass("jvectormap-legend-title").html(this.params.title)),
    this.body.append(inner),
    i = 0; i < ticks.length; i++) {
        switch (tick = jvm.$("<div/>").addClass("jvectormap-legend-tick"),
        sample = jvm.$("<div/>").addClass("jvectormap-legend-tick-sample"),
        this.series.params.attribute) {
        case "fill":
            jvm.isImageUrl(ticks[i].value) ? sample.css("background", "url(" + ticks[i].value + ")") : sample.css("background", ticks[i].value);
            break;
        case "stroke":
            sample.css("background", ticks[i].value);
            break;
        case "image":
            sample.css("background", "url(" + ("object" == typeof ticks[i].value ? ticks[i].value.url : ticks[i].value) + ") no-repeat center center");
            break;
        case "r":
            jvm.$("<div/>").css({
                "border-radius": ticks[i].value,
                border: this.map.params.markerStyle.initial["stroke-width"] + "px " + this.map.params.markerStyle.initial.stroke + " solid",
                width: 2 * ticks[i].value + "px",
                height: 2 * ticks[i].value + "px",
                background: this.map.params.markerStyle.initial.fill
            }).appendTo(sample)
        }
        tick.append(sample),
        label = ticks[i].label,
        this.params.labelRender && (label = this.params.labelRender(label)),
        tick.append(jvm.$("<div>" + label + " </div>").addClass("jvectormap-legend-tick-text")),
        inner.append(tick)
    }
    inner.append(jvm.$("<div/>").css("clear", "both"))
}
,
jvm.DataSeries = function(params, elements, map) {
    var scaleConstructor;
    (params = params || {}).attribute = params.attribute || "fill",
    this.elements = elements,
    this.params = params,
    this.map = map,
    params.attributes && this.setAttributes(params.attributes),
    jvm.$.isArray(params.scale) ? (scaleConstructor = "fill" === params.attribute || "stroke" === params.attribute ? jvm.ColorScale : jvm.NumericScale,
    this.scale = new scaleConstructor(params.scale,params.normalizeFunction,params.min,params.max)) : params.scale ? this.scale = new jvm.OrdinalScale(params.scale) : this.scale = new jvm.SimpleScale(params.scale),
    this.values = params.values || {},
    this.setValues(this.values),
    this.params.legend && (this.legend = new jvm.Legend(jvm.$.extend({
        map: this.map,
        series: this
    }, this.params.legend)))
}
,
jvm.DataSeries.prototype = {
    setAttributes: function(key, attr) {
        var code, attrs = key;
        if ("string" == typeof key)
            this.elements[key] && this.elements[key].setStyle(this.params.attribute, attr);
        else
            for (code in attrs)
                this.elements[code] && this.elements[code].element.setStyle(this.params.attribute, attrs[code])
    },
    setValues: function(values) {
        var val, cc, max = -Number.MAX_VALUE, min = Number.MAX_VALUE, attrs = {};
        if (this.scale instanceof jvm.OrdinalScale || this.scale instanceof jvm.SimpleScale)
            for (cc in values)
                values[cc] ? attrs[cc] = this.scale.getValue(values[cc]) : attrs[cc] = this.elements[cc].element.style.initial[this.params.attribute];
        else {
            if (void 0 === this.params.min || void 0 === this.params.max)
                for (cc in values)
                    max < (val = parseFloat(values[cc])) && (max = val),
                    val < min && (min = val);
            for (cc in void 0 === this.params.min ? (this.scale.setMin(min),
            this.params.min = min) : this.scale.setMin(this.params.min),
            void 0 === this.params.max ? (this.scale.setMax(max),
            this.params.max = max) : this.scale.setMax(this.params.max),
            values)
                "indexOf" != cc && (val = parseFloat(values[cc]),
                isNaN(val) ? attrs[cc] = this.elements[cc].element.style.initial[this.params.attribute] : attrs[cc] = this.scale.getValue(val))
        }
        this.setAttributes(attrs),
        jvm.$.extend(this.values, values)
    },
    clear: function() {
        var key, attrs = {};
        for (key in this.values)
            this.elements[key] && (attrs[key] = this.elements[key].element.shape.style.initial[this.params.attribute]);
        this.setAttributes(attrs),
        this.values = {}
    },
    setScale: function(scale) {
        this.scale.setScale(scale),
        this.values && this.setValues(this.values)
    },
    setNormalizeFunction: function(f) {
        this.scale.setNormalizeFunction(f),
        this.values && this.setValues(this.values)
    }
},
jvm.Proj = {
    degRad: 180 / Math.PI,
    radDeg: Math.PI / 180,
    radius: 6381372,
    sgn: function(n) {
        return 0 < n ? 1 : n < 0 ? -1 : n
    },
    mill: function(lat, lng, c) {
        return {
            x: this.radius * (lng - c) * this.radDeg,
            y: -this.radius * Math.log(Math.tan((45 + .4 * lat) * this.radDeg)) / .8
        }
    },
    mill_inv: function(x, y, c) {
        return {
            lat: (2.5 * Math.atan(Math.exp(.8 * y / this.radius)) - 5 * Math.PI / 8) * this.degRad,
            lng: (c * this.radDeg + x / this.radius) * this.degRad
        }
    },
    merc: function(lat, lng, c) {
        return {
            x: this.radius * (lng - c) * this.radDeg,
            y: -this.radius * Math.log(Math.tan(Math.PI / 4 + lat * Math.PI / 360))
        }
    },
    merc_inv: function(x, y, c) {
        return {
            lat: (2 * Math.atan(Math.exp(y / this.radius)) - Math.PI / 2) * this.degRad,
            lng: (c * this.radDeg + x / this.radius) * this.degRad
        }
    },
    aea: function(lat, lng, c) {
        var lambda0 = c * this.radDeg
          , fi1 = 29.5 * this.radDeg
          , fi2 = 45.5 * this.radDeg
          , fi = lat * this.radDeg
          , lambda = lng * this.radDeg
          , n = (Math.sin(fi1) + Math.sin(fi2)) / 2
          , C = Math.cos(fi1) * Math.cos(fi1) + 2 * n * Math.sin(fi1)
          , theta = n * (lambda - lambda0)
          , ro = Math.sqrt(C - 2 * n * Math.sin(fi)) / n
          , ro0 = Math.sqrt(C - 2 * n * Math.sin(0)) / n;
        return {
            x: ro * Math.sin(theta) * this.radius,
            y: -(ro0 - ro * Math.cos(theta)) * this.radius
        }
    },
    aea_inv: function(xCoord, yCoord, c) {
        var x = xCoord / this.radius
          , y = yCoord / this.radius
          , lambda0 = c * this.radDeg
          , fi1 = 29.5 * this.radDeg
          , fi2 = 45.5 * this.radDeg
          , n = (Math.sin(fi1) + Math.sin(fi2)) / 2
          , C = Math.cos(fi1) * Math.cos(fi1) + 2 * n * Math.sin(fi1)
          , ro0 = Math.sqrt(C - 2 * n * Math.sin(0)) / n
          , ro = Math.sqrt(x * x + (ro0 - y) * (ro0 - y))
          , theta = Math.atan(x / (ro0 - y));
        return {
            lat: Math.asin((C - ro * ro * n * n) / (2 * n)) * this.degRad,
            lng: (lambda0 + theta / n) * this.degRad
        }
    },
    lcc: function(lat, lng, c) {
        var lambda0 = c * this.radDeg
          , lambda = lng * this.radDeg
          , fi1 = 33 * this.radDeg
          , fi2 = 45 * this.radDeg
          , fi = lat * this.radDeg
          , n = Math.log(Math.cos(fi1) * (1 / Math.cos(fi2))) / Math.log(Math.tan(Math.PI / 4 + fi2 / 2) * (1 / Math.tan(Math.PI / 4 + fi1 / 2)))
          , F = Math.cos(fi1) * Math.pow(Math.tan(Math.PI / 4 + fi1 / 2), n) / n
          , ro = F * Math.pow(1 / Math.tan(Math.PI / 4 + fi / 2), n)
          , ro0 = F * Math.pow(1 / Math.tan(Math.PI / 4 + 0), n);
        return {
            x: ro * Math.sin(n * (lambda - lambda0)) * this.radius,
            y: -(ro0 - ro * Math.cos(n * (lambda - lambda0))) * this.radius
        }
    },
    lcc_inv: function(xCoord, yCoord, c) {
        var x = xCoord / this.radius
          , y = yCoord / this.radius
          , lambda0 = c * this.radDeg
          , fi1 = 33 * this.radDeg
          , fi2 = 45 * this.radDeg
          , n = Math.log(Math.cos(fi1) * (1 / Math.cos(fi2))) / Math.log(Math.tan(Math.PI / 4 + fi2 / 2) * (1 / Math.tan(Math.PI / 4 + fi1 / 2)))
          , F = Math.cos(fi1) * Math.pow(Math.tan(Math.PI / 4 + fi1 / 2), n) / n
          , ro0 = F * Math.pow(1 / Math.tan(Math.PI / 4 + 0), n)
          , ro = this.sgn(n) * Math.sqrt(x * x + (ro0 - y) * (ro0 - y))
          , theta = Math.atan(x / (ro0 - y));
        return {
            lat: (2 * Math.atan(Math.pow(F / ro, 1 / n)) - Math.PI / 2) * this.degRad,
            lng: (lambda0 + theta / n) * this.degRad
        }
    }
},
jvm.MapObject = function(config) {}
,
jvm.MapObject.prototype.getLabelText = function(key) {
    return this.config.label ? "function" == typeof this.config.label.render ? this.config.label.render(key) : key : null
}
,
jvm.MapObject.prototype.getLabelOffsets = function(key) {
    var offsets;
    return this.config.label && ("function" == typeof this.config.label.offsets ? offsets = this.config.label.offsets(key) : "object" == typeof this.config.label.offsets && (offsets = this.config.label.offsets[key])),
    offsets || [0, 0]
}
,
jvm.MapObject.prototype.setHovered = function(isHovered) {
    this.isHovered !== isHovered && (this.isHovered = isHovered,
    this.shape.isHovered = isHovered,
    this.shape.updateStyle(),
    this.label && (this.label.isHovered = isHovered,
    this.label.updateStyle()))
}
,
jvm.MapObject.prototype.setSelected = function(isSelected) {
    this.isSelected !== isSelected && (this.isSelected = isSelected,
    this.shape.isSelected = isSelected,
    this.shape.updateStyle(),
    this.label && (this.label.isSelected = isSelected,
    this.label.updateStyle()),
    jvm.$(this.shape).trigger("selected", [isSelected]))
}
,
jvm.MapObject.prototype.setStyle = function() {
    this.shape.setStyle.apply(this.shape, arguments)
}
,
jvm.MapObject.prototype.remove = function() {
    this.shape.remove(),
    this.label && this.label.remove()
}
,
jvm.Region = function(config) {
    var bbox, text, offsets;
    this.config = config,
    this.map = this.config.map,
    this.shape = config.canvas.addPath({
        d: config.path,
        "data-code": config.code
    }, config.style, config.canvas.rootElement),
    this.shape.addClass("jvectormap-region jvectormap-element"),
    bbox = this.shape.getBBox(),
    text = this.getLabelText(config.code),
    this.config.label && text && (offsets = this.getLabelOffsets(config.code),
    this.labelX = bbox.x + bbox.width / 2 + offsets[0],
    this.labelY = bbox.y + bbox.height / 2 + offsets[1],
    this.label = config.canvas.addText({
        text: text,
        "text-anchor": "middle",
        "alignment-baseline": "central",
        x: this.labelX,
        y: this.labelY,
        "data-code": config.code
    }, config.labelStyle, config.labelsGroup),
    this.label.addClass("jvectormap-region jvectormap-element"))
}
,
jvm.inherits(jvm.Region, jvm.MapObject),
jvm.Region.prototype.updateLabelPosition = function() {
    this.label && this.label.set({
        x: this.labelX * this.map.scale + this.map.transX * this.map.scale,
        y: this.labelY * this.map.scale + this.map.transY * this.map.scale
    })
}
,
jvm.Marker = function(config) {
    var text;
    this.config = config,
    this.map = this.config.map,
    this.isImage = !!this.config.style.initial.image,
    this.createShape(),
    text = this.getLabelText(config.index),
    this.config.label && text && (this.offsets = this.getLabelOffsets(config.index),
    this.labelX = config.cx / this.map.scale - this.map.transX,
    this.labelY = config.cy / this.map.scale - this.map.transY,
    this.label = config.canvas.addText({
        text: text,
        "data-index": config.index,
        dy: "0.6ex",
        x: this.labelX,
        y: this.labelY
    }, config.labelStyle, config.labelsGroup),
    this.label.addClass("jvectormap-marker jvectormap-element"))
}
,
jvm.inherits(jvm.Marker, jvm.MapObject),
jvm.Marker.prototype.createShape = function() {
    var that = this;
    this.shape && this.shape.remove(),
    this.shape = this.config.canvas[this.isImage ? "addImage" : "addCircle"]({
        "data-index": this.config.index,
        cx: this.config.cx,
        cy: this.config.cy
    }, this.config.style, this.config.group),
    this.shape.addClass("jvectormap-marker jvectormap-element"),
    this.isImage && jvm.$(this.shape.node).on("imageloaded", function() {
        that.updateLabelPosition()
    })
}
,
jvm.Marker.prototype.updateLabelPosition = function() {
    this.label && this.label.set({
        x: this.labelX * this.map.scale + this.offsets[0] + this.map.transX * this.map.scale + 5 + (this.isImage ? (this.shape.width || 0) / 2 : this.shape.properties.r),
        y: this.labelY * this.map.scale + this.map.transY * this.map.scale + this.offsets[1]
    })
}
,
jvm.Marker.prototype.setStyle = function(property, value) {
    var isImage;
    jvm.Marker.parentClass.prototype.setStyle.apply(this, arguments),
    "r" === property && this.updateLabelPosition(),
    (isImage = !!this.shape.get("image")) != this.isImage && (this.isImage = isImage,
    this.config.style = jvm.$.extend(!0, {}, this.shape.style),
    this.createShape())
}
,
jvm.Map = function(params) {
    var e, map = this;
    if (this.params = jvm.$.extend(!0, {}, jvm.Map.defaultParams, params),
    !jvm.Map.maps[this.params.map])
        throw new Error("Attempt to use map which was not loaded: " + this.params.map);
    for (e in this.mapData = jvm.Map.maps[this.params.map],
    this.markers = {},
    this.regions = {},
    this.regionsColors = {},
    this.regionsData = {},
    this.container = jvm.$("<div>").addClass("jvectormap-container"),
    this.params.container && this.params.container.append(this.container),
    this.container.data("mapObject", this),
    this.defaultWidth = this.mapData.width,
    this.defaultHeight = this.mapData.height,
    this.setBackgroundColor(this.params.backgroundColor),
    this.onResize = function() {
        map.updateSize()
    }
    ,
    jvm.$(window).resize(this.onResize),
    jvm.Map.apiEvents)
        this.params[e] && this.container.bind(jvm.Map.apiEvents[e] + ".jvectormap", this.params[e]);
    this.canvas = new jvm.VectorCanvas(this.container[0],this.width,this.height),
    this.params.bindTouchEvents && ("ontouchstart"in window || window.DocumentTouch && document instanceof DocumentTouch ? this.bindContainerTouchEvents() : window.MSGesture && this.bindContainerPointerEvents()),
    this.bindContainerEvents(),
    this.bindElementEvents(),
    this.createTip(),
    this.params.zoomButtons && this.bindZoomButtons(),
    this.createRegions(),
    this.createMarkers(this.params.markers || {}),
    this.updateSize(),
    this.params.focusOn && ("string" == typeof this.params.focusOn ? this.params.focusOn = {
        region: this.params.focusOn
    } : jvm.$.isArray(this.params.focusOn) && (this.params.focusOn = {
        regions: this.params.focusOn
    }),
    this.setFocus(this.params.focusOn)),
    this.params.selectedRegions && this.setSelectedRegions(this.params.selectedRegions),
    this.params.selectedMarkers && this.setSelectedMarkers(this.params.selectedMarkers),
    this.legendCntHorizontal = jvm.$("<div/>").addClass("jvectormap-legend-cnt jvectormap-legend-cnt-h"),
    this.legendCntVertical = jvm.$("<div/>").addClass("jvectormap-legend-cnt jvectormap-legend-cnt-v"),
    this.container.append(this.legendCntHorizontal),
    this.container.append(this.legendCntVertical),
    this.params.series && this.createSeries()
}
,
jvm.Map.prototype = {
    transX: 0,
    transY: 0,
    scale: 1,
    baseTransX: 0,
    baseTransY: 0,
    baseScale: 1,
    width: 0,
    height: 0,
    setBackgroundColor: function(backgroundColor) {
        this.container.css("background-color", backgroundColor)
    },
    resize: function() {
        var curBaseScale = this.baseScale;
        this.width / this.height > this.defaultWidth / this.defaultHeight ? (this.baseScale = this.height / this.defaultHeight,
        this.baseTransX = Math.abs(this.width - this.defaultWidth * this.baseScale) / (2 * this.baseScale)) : (this.baseScale = this.width / this.defaultWidth,
        this.baseTransY = Math.abs(this.height - this.defaultHeight * this.baseScale) / (2 * this.baseScale)),
        this.scale *= this.baseScale / curBaseScale,
        this.transX *= this.baseScale / curBaseScale,
        this.transY *= this.baseScale / curBaseScale
    },
    updateSize: function() {
        this.width = this.container.width(),
        this.height = this.container.height(),
        this.resize(),
        this.canvas.setSize(this.width, this.height),
        this.applyTransform()
    },
    reset: function() {
        var key, i;
        for (key in this.series)
            for (i = 0; i < this.series[key].length; i++)
                this.series[key][i].clear();
        this.scale = this.baseScale,
        this.transX = this.baseTransX,
        this.transY = this.baseTransY,
        this.applyTransform()
    },
    applyTransform: function() {
        var maxTransX, maxTransY, minTransX, minTransY;
        minTransX = this.defaultWidth * this.scale <= this.width ? (maxTransX = (this.width - this.defaultWidth * this.scale) / (2 * this.scale),
        (this.width - this.defaultWidth * this.scale) / (2 * this.scale)) : (maxTransX = 0,
        (this.width - this.defaultWidth * this.scale) / this.scale),
        minTransY = this.defaultHeight * this.scale <= this.height ? (maxTransY = (this.height - this.defaultHeight * this.scale) / (2 * this.scale),
        (this.height - this.defaultHeight * this.scale) / (2 * this.scale)) : (maxTransY = 0,
        (this.height - this.defaultHeight * this.scale) / this.scale),
        this.transY > maxTransY ? this.transY = maxTransY : this.transY < minTransY && (this.transY = minTransY),
        this.transX > maxTransX ? this.transX = maxTransX : this.transX < minTransX && (this.transX = minTransX),
        this.canvas.applyTransformParams(this.scale, this.transX, this.transY),
        this.markers && this.repositionMarkers(),
        this.repositionLabels(),
        this.container.trigger("viewportChange", [this.scale / this.baseScale, this.transX, this.transY])
    },
    bindContainerEvents: function() {
        var oldPageX, oldPageY, mouseDown = !1, map = this;
        this.params.panOnDrag && (this.container.mousemove(function(e) {
            return mouseDown && (map.transX -= (oldPageX - e.pageX) / map.scale,
            map.transY -= (oldPageY - e.pageY) / map.scale,
            map.applyTransform(),
            oldPageX = e.pageX,
            oldPageY = e.pageY),
            !1
        }).mousedown(function(e) {
            return mouseDown = !0,
            oldPageX = e.pageX,
            oldPageY = e.pageY,
            !1
        }),
        this.onContainerMouseUp = function() {
            mouseDown = !1
        }
        ,
        jvm.$("body").mouseup(this.onContainerMouseUp)),
        this.params.zoomOnScroll && this.container.mousewheel(function(event, delta, deltaX, deltaY) {
            var offset = jvm.$(map.container).offset()
              , centerX = event.pageX - offset.left
              , centerY = event.pageY - offset.top
              , zoomStep = Math.pow(1 + map.params.zoomOnScrollSpeed / 1e3, event.deltaFactor * event.deltaY);
            map.tip.hide(),
            map.setScale(map.scale * zoomStep, centerX, centerY),
            event.preventDefault()
        })
    },
    bindContainerTouchEvents: function() {
        function handleTouchEvent(e) {
            var offset, scale, transXOld, transYOld, touches = e.originalEvent.touches;
            "touchstart" == e.type && (lastTouchesLength = 0),
            1 == touches.length ? (1 == lastTouchesLength && (transXOld = map.transX,
            transYOld = map.transY,
            map.transX -= (touchX - touches[0].pageX) / map.scale,
            map.transY -= (touchY - touches[0].pageY) / map.scale,
            map.applyTransform(),
            map.tip.hide(),
            transXOld == map.transX && transYOld == map.transY || e.preventDefault()),
            touchX = touches[0].pageX,
            touchY = touches[0].pageY) : 2 == touches.length && (2 == lastTouchesLength ? (scale = Math.sqrt(Math.pow(touches[0].pageX - touches[1].pageX, 2) + Math.pow(touches[0].pageY - touches[1].pageY, 2)) / touchStartDistance,
            map.setScale(touchStartScale * scale, centerTouchX, centerTouchY),
            map.tip.hide(),
            e.preventDefault()) : (offset = jvm.$(map.container).offset(),
            centerTouchX = touches[0].pageX > touches[1].pageX ? touches[1].pageX + (touches[0].pageX - touches[1].pageX) / 2 : touches[0].pageX + (touches[1].pageX - touches[0].pageX) / 2,
            centerTouchY = touches[0].pageY > touches[1].pageY ? touches[1].pageY + (touches[0].pageY - touches[1].pageY) / 2 : touches[0].pageY + (touches[1].pageY - touches[0].pageY) / 2,
            centerTouchX -= offset.left,
            centerTouchY -= offset.top,
            touchStartScale = map.scale,
            touchStartDistance = Math.sqrt(Math.pow(touches[0].pageX - touches[1].pageX, 2) + Math.pow(touches[0].pageY - touches[1].pageY, 2)))),
            lastTouchesLength = touches.length
        }
        var touchStartScale, touchStartDistance, touchX, touchY, centerTouchX, centerTouchY, lastTouchesLength, map = this;
        jvm.$(this.container).bind("touchstart", handleTouchEvent),
        jvm.$(this.container).bind("touchmove", handleTouchEvent)
    },
    bindContainerPointerEvents: function() {
        var map = this
          , gesture = new MSGesture
          , element = this.container[0];
        (gesture.target = element).addEventListener("MSGestureChange", function(e) {
            var transXOld, transYOld;
            0 == e.translationX && 0 == e.translationY || (transXOld = map.transX,
            transYOld = map.transY,
            map.transX += e.translationX / map.scale,
            map.transY += e.translationY / map.scale,
            map.applyTransform(),
            map.tip.hide(),
            transXOld == map.transX && transYOld == map.transY || e.preventDefault()),
            1 != e.scale && (map.setScale(map.scale * e.scale, e.offsetX, e.offsetY),
            map.tip.hide(),
            e.preventDefault())
        }, !1),
        element.addEventListener("pointerdown", function(e) {
            gesture.addPointer(e.pointerId)
        }, !1)
    },
    bindElementEvents: function() {
        var pageX, pageY, mouseMoved, map = this;
        this.container.mousemove(function(e) {
            2 < Math.abs(pageX - e.pageX) + Math.abs(pageY - e.pageY) && (mouseMoved = !0)
        }),
        this.container.delegate("[class~='jvectormap-element']", "mouseover mouseout", function(e) {
            var type = -1 === (jvm.$(this).attr("class").baseVal || jvm.$(this).attr("class")).indexOf("jvectormap-region") ? "marker" : "region"
              , code = "region" == type ? jvm.$(this).attr("data-code") : jvm.$(this).attr("data-index")
              , element = "region" == type ? map.regions[code].element : map.markers[code].element
              , tipText = "region" == type ? map.mapData.paths[code].name : map.markers[code].config.name || ""
              , tipShowEvent = jvm.$.Event(type + "TipShow.jvectormap")
              , overEvent = jvm.$.Event(type + "Over.jvectormap");
            "mouseover" == e.type ? (map.container.trigger(overEvent, [code]),
            overEvent.isDefaultPrevented() || element.setHovered(!0),
            map.tip.text(tipText),
            map.container.trigger(tipShowEvent, [map.tip, code]),
            tipShowEvent.isDefaultPrevented() || (map.tip.show(),
            map.tipWidth = map.tip.width(),
            map.tipHeight = map.tip.height())) : (element.setHovered(!1),
            map.tip.hide(),
            map.container.trigger(type + "Out.jvectormap", [code]))
        }),
        this.container.delegate("[class~='jvectormap-element']", "mousedown", function(e) {
            pageX = e.pageX,
            pageY = e.pageY,
            mouseMoved = !1
        }),
        this.container.delegate("[class~='jvectormap-element']", "mouseup", function() {
            var type = -1 === (jvm.$(this).attr("class").baseVal ? jvm.$(this).attr("class").baseVal : jvm.$(this).attr("class")).indexOf("jvectormap-region") ? "marker" : "region"
              , code = "region" == type ? jvm.$(this).attr("data-code") : jvm.$(this).attr("data-index")
              , clickEvent = jvm.$.Event(type + "Click.jvectormap")
              , element = "region" == type ? map.regions[code].element : map.markers[code].element;
            mouseMoved || (map.container.trigger(clickEvent, [code]),
            ("region" == type && map.params.regionsSelectable || "marker" == type && map.params.markersSelectable) && (clickEvent.isDefaultPrevented() || (map.params[type + "sSelectableOne"] && map.clearSelected(type + "s"),
            element.setSelected(!element.isSelected))))
        })
    },
    bindZoomButtons: function() {
        var map = this;
        jvm.$("<div/>").addClass("jvectormap-zoomin").text("+").appendTo(this.container),
        jvm.$("<div/>").addClass("jvectormap-zoomout").html("&#x2212;").appendTo(this.container),
        this.container.find(".jvectormap-zoomin").click(function() {
            map.setScale(map.scale * map.params.zoomStep, map.width / 2, map.height / 2, !1, map.params.zoomAnimate)
        }),
        this.container.find(".jvectormap-zoomout").click(function() {
            map.setScale(map.scale / map.params.zoomStep, map.width / 2, map.height / 2, !1, map.params.zoomAnimate)
        })
    },
    createTip: function() {
        var map = this;
        this.tip = jvm.$("<div/>").addClass("jvectormap-tip").appendTo(jvm.$("body")),
        this.container.mousemove(function(e) {
            var left = e.pageX - 15 - map.tipWidth
              , top = e.pageY - 15 - map.tipHeight;
            left < 5 && (left = e.pageX + 15),
            top < 5 && (top = e.pageY + 15),
            map.tip.css({
                left: left,
                top: top
            })
        })
    },
    setScale: function(scale, anchorX, anchorY, isCentered, animate) {
        var interval, scaleStart, scaleDiff, transXStart, transXDiff, transYStart, transYDiff, transX, transY, viewportChangeEvent = jvm.$.Event("zoom.jvectormap"), that = this, i = 0, count = Math.abs(Math.round(60 * (scale - this.scale) / Math.max(scale, this.scale))), deferred = new jvm.$.Deferred;
        return scale > this.params.zoomMax * this.baseScale ? scale = this.params.zoomMax * this.baseScale : scale < this.params.zoomMin * this.baseScale && (scale = this.params.zoomMin * this.baseScale),
        void 0 !== anchorX && void 0 !== anchorY && (zoomStep = scale / this.scale,
        transY = isCentered ? (transX = anchorX + this.defaultWidth * (this.width / (this.defaultWidth * scale)) / 2,
        anchorY + this.defaultHeight * (this.height / (this.defaultHeight * scale)) / 2) : (transX = this.transX - (zoomStep - 1) / scale * anchorX,
        this.transY - (zoomStep - 1) / scale * anchorY)),
        animate && 0 < count ? (scaleStart = this.scale,
        scaleDiff = (scale - scaleStart) / count,
        transXStart = this.transX * this.scale,
        transYStart = this.transY * this.scale,
        transXDiff = (transX * scale - transXStart) / count,
        transYDiff = (transY * scale - transYStart) / count,
        interval = setInterval(function() {
            i += 1,
            that.scale = scaleStart + scaleDiff * i,
            that.transX = (transXStart + transXDiff * i) / that.scale,
            that.transY = (transYStart + transYDiff * i) / that.scale,
            that.applyTransform(),
            i == count && (clearInterval(interval),
            that.container.trigger(viewportChangeEvent, [scale / that.baseScale]),
            deferred.resolve())
        }, 10)) : (this.transX = transX,
        this.transY = transY,
        this.scale = scale,
        this.applyTransform(),
        this.container.trigger(viewportChangeEvent, [scale / this.baseScale]),
        deferred.resolve()),
        deferred
    },
    setFocus: function(config) {
        var bbox, itemBbox, codes, i, point;
        if ((config = config || {}).region ? codes = [config.region] : config.regions && (codes = config.regions),
        codes) {
            for (i = 0; i < codes.length; i++)
                this.regions[codes[i]] && (itemBbox = this.regions[codes[i]].element.shape.getBBox()) && (bbox = void 0 === bbox ? itemBbox : {
                    x: Math.min(bbox.x, itemBbox.x),
                    y: Math.min(bbox.y, itemBbox.y),
                    width: Math.max(bbox.x + bbox.width, itemBbox.x + itemBbox.width) - Math.min(bbox.x, itemBbox.x),
                    height: Math.max(bbox.y + bbox.height, itemBbox.y + itemBbox.height) - Math.min(bbox.y, itemBbox.y)
                });
            return this.setScale(Math.min(this.width / bbox.width, this.height / bbox.height), -(bbox.x + bbox.width / 2), -(bbox.y + bbox.height / 2), !0, config.animate)
        }
        return void 0 !== config.lat && void 0 !== config.lng ? (point = this.latLngToPoint(config.lat, config.lng),
        config.x = this.transX - point.x / this.scale,
        config.y = this.transY - point.y / this.scale) : config.x && config.y && (config.x *= -this.defaultWidth,
        config.y *= -this.defaultHeight),
        this.setScale(config.scale * this.baseScale, config.x, config.y, !0, config.animate)
    },
    getSelected: function(type) {
        var key, selected = [];
        for (key in this[type])
            this[type][key].element.isSelected && selected.push(key);
        return selected
    },
    getSelectedRegions: function() {
        return this.getSelected("regions")
    },
    getSelectedMarkers: function() {
        return this.getSelected("markers")
    },
    setSelected: function(type, keys) {
        var i;
        if ("object" != typeof keys && (keys = [keys]),
        jvm.$.isArray(keys))
            for (i = 0; i < keys.length; i++)
                this[type][keys[i]].element.setSelected(!0);
        else
            for (i in keys)
                this[type][i].element.setSelected(!!keys[i])
    },
    setSelectedRegions: function(keys) {
        this.setSelected("regions", keys)
    },
    setSelectedMarkers: function(keys) {
        this.setSelected("markers", keys)
    },
    clearSelected: function(type) {
        var i, select = {}, selected = this.getSelected(type);
        for (i = 0; i < selected.length; i++)
            select[selected[i]] = !1;
        this.setSelected(type, select)
    },
    clearSelectedRegions: function() {
        this.clearSelected("regions")
    },
    clearSelectedMarkers: function() {
        this.clearSelected("markers")
    },
    getMapObject: function() {
        return this
    },
    getRegionName: function(code) {
        return this.mapData.paths[code].name
    },
    createRegions: function() {
        var key, region, map = this;
        for (key in this.regionLabelsGroup = this.regionLabelsGroup || this.canvas.addGroup(),
        this.mapData.paths)
            region = new jvm.Region({
                map: this,
                path: this.mapData.paths[key].path,
                code: key,
                style: jvm.$.extend(!0, {}, this.params.regionStyle),
                labelStyle: jvm.$.extend(!0, {}, this.params.regionLabelStyle),
                canvas: this.canvas,
                labelsGroup: this.regionLabelsGroup,
                label: "vml" != this.canvas.mode ? this.params.labels && this.params.labels.regions : null
            }),
            jvm.$(region.shape).bind("selected", function(e, isSelected) {
                map.container.trigger("regionSelected.jvectormap", [jvm.$(this.node).attr("data-code"), isSelected, map.getSelectedRegions()])
            }),
            this.regions[key] = {
                element: region,
                config: this.mapData.paths[key]
            }
    },
    createMarkers: function(markers) {
        var i, marker, point, markerConfig, markersArray, map = this;
        if (this.markersGroup = this.markersGroup || this.canvas.addGroup(),
        this.markerLabelsGroup = this.markerLabelsGroup || this.canvas.addGroup(),
        jvm.$.isArray(markers))
            for (markersArray = markers.slice(),
            markers = {},
            i = 0; i < markersArray.length; i++)
                markers[i] = markersArray[i];
        for (i in markers)
            markerConfig = markers[i]instanceof Array ? {
                latLng: markers[i]
            } : markers[i],
            !1 !== (point = this.getMarkerPosition(markerConfig)) && (marker = new jvm.Marker({
                map: this,
                style: jvm.$.extend(!0, {}, this.params.markerStyle, {
                    initial: markerConfig.style || {}
                }),
                labelStyle: jvm.$.extend(!0, {}, this.params.markerLabelStyle),
                index: i,
                cx: point.x,
                cy: point.y,
                group: this.markersGroup,
                canvas: this.canvas,
                labelsGroup: this.markerLabelsGroup,
                label: "vml" != this.canvas.mode ? this.params.labels && this.params.labels.markers : null
            }),
            jvm.$(marker.shape).bind("selected", function(e, isSelected) {
                map.container.trigger("markerSelected.jvectormap", [jvm.$(this.node).attr("data-index"), isSelected, map.getSelectedMarkers()])
            }),
            this.markers[i] && this.removeMarkers([i]),
            this.markers[i] = {
                element: marker,
                config: markerConfig
            })
    },
    repositionMarkers: function() {
        var i, point;
        for (i in this.markers)
            !1 !== (point = this.getMarkerPosition(this.markers[i].config)) && this.markers[i].element.setStyle({
                cx: point.x,
                cy: point.y
            })
    },
    repositionLabels: function() {
        var key;
        for (key in this.regions)
            this.regions[key].element.updateLabelPosition();
        for (key in this.markers)
            this.markers[key].element.updateLabelPosition()
    },
    getMarkerPosition: function(markerConfig) {
        return jvm.Map.maps[this.params.map].projection ? this.latLngToPoint.apply(this, markerConfig.latLng || [0, 0]) : {
            x: markerConfig.coords[0] * this.scale + this.transX * this.scale,
            y: markerConfig.coords[1] * this.scale + this.transY * this.scale
        }
    },
    addMarker: function(key, marker, seriesData) {
        var values, i, markers = {}, data = [];
        seriesData = seriesData || [];
        for (markers[key] = marker,
        i = 0; i < seriesData.length; i++)
            values = {},
            void 0 !== seriesData[i] && (values[key] = seriesData[i]),
            data.push(values);
        this.addMarkers(markers, data)
    },
    addMarkers: function(markers, seriesData) {
        var i;
        for (seriesData = seriesData || [],
        this.createMarkers(markers),
        i = 0; i < seriesData.length; i++)
            this.series.markers[i].setValues(seriesData[i] || {})
    },
    removeMarkers: function(markers) {
        var i;
        for (i = 0; i < markers.length; i++)
            this.markers[markers[i]].element.remove(),
            delete this.markers[markers[i]]
    },
    removeAllMarkers: function() {
        var i, markers = [];
        for (i in this.markers)
            markers.push(i);
        this.removeMarkers(markers)
    },
    latLngToPoint: function(lat, lng) {
        var point, inset, bbox, proj = jvm.Map.maps[this.params.map].projection, centralMeridian = proj.centralMeridian;
        return lng < -180 + centralMeridian && (lng += 360),
        point = jvm.Proj[proj.type](lat, lng, centralMeridian),
        !!(inset = this.getInsetForPoint(point.x, point.y)) && (bbox = inset.bbox,
        point.x = (point.x - bbox[0].x) / (bbox[1].x - bbox[0].x) * inset.width * this.scale,
        point.y = (point.y - bbox[0].y) / (bbox[1].y - bbox[0].y) * inset.height * this.scale,
        {
            x: point.x + this.transX * this.scale + inset.left * this.scale,
            y: point.y + this.transY * this.scale + inset.top * this.scale
        })
    },
    pointToLatLng: function(x, y) {
        var i, inset, bbox, nx, ny, proj = jvm.Map.maps[this.params.map].projection, centralMeridian = proj.centralMeridian, insets = jvm.Map.maps[this.params.map].insets;
        for (i = 0; i < insets.length; i++)
            if (bbox = (inset = insets[i]).bbox,
            nx = x - (this.transX * this.scale + inset.left * this.scale),
            ny = y - (this.transY * this.scale + inset.top * this.scale),
            nx = nx / (inset.width * this.scale) * (bbox[1].x - bbox[0].x) + bbox[0].x,
            ny = ny / (inset.height * this.scale) * (bbox[1].y - bbox[0].y) + bbox[0].y,
            nx > bbox[0].x && nx < bbox[1].x && ny > bbox[0].y && ny < bbox[1].y)
                return jvm.Proj[proj.type + "_inv"](nx, -ny, centralMeridian);
        return !1
    },
    getInsetForPoint: function(x, y) {
        var i, bbox, insets = jvm.Map.maps[this.params.map].insets;
        for (i = 0; i < insets.length; i++)
            if (x > (bbox = insets[i].bbox)[0].x && x < bbox[1].x && y > bbox[0].y && y < bbox[1].y)
                return insets[i]
    },
    createSeries: function() {
        var i, key;
        for (key in this.series = {
            markers: [],
            regions: []
        },
        this.params.series)
            for (i = 0; i < this.params.series[key].length; i++)
                this.series[key][i] = new jvm.DataSeries(this.params.series[key][i],this[key],this)
    },
    remove: function() {
        this.tip.remove(),
        this.container.remove(),
        jvm.$(window).unbind("resize", this.onResize),
        jvm.$("body").unbind("mouseup", this.onContainerMouseUp)
    }
},
jvm.Map.maps = {},
jvm.Map.defaultParams = {
    map: "world_mill_en",
    backgroundColor: "#505050",
    zoomButtons: !0,
    zoomOnScroll: !0,
    zoomOnScrollSpeed: 3,
    panOnDrag: !0,
    zoomMax: 8,
    zoomMin: 1,
    zoomStep: 1.6,
    zoomAnimate: !0,
    regionsSelectable: !1,
    markersSelectable: !1,
    bindTouchEvents: !0,
    regionStyle: {
        initial: {
            fill: "white",
            "fill-opacity": 1,
            stroke: "none",
            "stroke-width": 0,
            "stroke-opacity": 1
        },
        hover: {
            "fill-opacity": .8,
            cursor: "pointer"
        },
        selected: {
            //fill: "yellow" //mod_yoshi
        },
        selectedHover: {}
    },
    regionLabelStyle: {
        initial: {
            "font-family": "Verdana",
            "font-size": "12",
            "font-weight": "bold",
            cursor: "default",
            fill: "black"
        },
        hover: {
            cursor: "pointer"
        }
    },
    markerStyle: {
        initial: {
            fill: "grey",
            stroke: "#505050",
            "fill-opacity": 1,
            "stroke-width": 1,
            "stroke-opacity": 1,
            r: 5
        },
        hover: {
            stroke: "black",
            "stroke-width": 2,
            cursor: "pointer"
        },
        selected: {
            fill: "blue"
        },
        selectedHover: {}
    },
    markerLabelStyle: {
        initial: {
            "font-family": "Verdana",
            "font-size": "12",
            "font-weight": "bold",
            cursor: "default",
            fill: "black"
        },
        hover: {
            cursor: "pointer"
        }
    }
},
jvm.Map.apiEvents = {
    onRegionTipShow: "regionTipShow",
    onRegionOver: "regionOver",
    onRegionOut: "regionOut",
    onRegionClick: "regionClick",
    onRegionSelected: "regionSelected",
    onMarkerTipShow: "markerTipShow",
    onMarkerOver: "markerOver",
    onMarkerOut: "markerOut",
    onMarkerClick: "markerClick",
    onMarkerSelected: "markerSelected",
    onViewportChange: "viewportChange"
},
jvm.MultiMap = function(params) {
    var that = this;
    this.maps = {},
    this.params = jvm.$.extend(!0, {}, jvm.MultiMap.defaultParams, params),
    this.params.maxLevel = this.params.maxLevel || Number.MAX_VALUE,
    this.params.main = this.params.main || {},
    this.params.main.multiMapLevel = 0,
    this.history = [this.addMap(this.params.main.map, this.params.main)],
    this.defaultProjection = this.history[0].mapData.projection.type,
    this.mapsLoaded = {},
    this.params.container.css({
        position: "relative"
    }),
    this.backButton = jvm.$("<div/>").addClass("jvectormap-goback").text("Back").appendTo(this.params.container),
    this.backButton.hide(),
    this.backButton.click(function() {
        that.goBack()
    }),
    this.spinner = jvm.$("<div/>").addClass("jvectormap-spinner").appendTo(this.params.container),
    this.spinner.hide()
}
,
jvm.MultiMap.prototype = {
    addMap: function(name, config) {
        var cnt = jvm.$("<div/>").css({
            width: "100%",
            height: "100%"
        });
        return this.params.container.append(cnt),
        this.maps[name] = new jvm.Map(jvm.$.extend(config, {
            container: cnt
        })),
        this.params.maxLevel > config.multiMapLevel && this.maps[name].container.on("regionClick.jvectormap", {
            scope: this
        }, function(e, code) {
            var multimap = e.data.scope
              , mapName = multimap.params.mapNameByCode(code, multimap);
            multimap.drillDownPromise && "pending" === multimap.drillDownPromise.state() || multimap.drillDown(mapName, code)
        }),
        this.maps[name]
    },
    downloadMap: function(code) {
        var that = this
          , deferred = jvm.$.Deferred();
        return this.mapsLoaded[code] ? deferred.resolve() : jvm.$.get(this.params.mapUrlByCode(code, this)).then(function() {
            that.mapsLoaded[code] = !0,
            deferred.resolve()
        }, function() {
            deferred.reject()
        }),
        deferred
    },
    drillDown: function(name, code) {
        var currentMap = this.history[this.history.length - 1]
          , that = this
          , focusPromise = currentMap.setFocus({
            region: code,
            animate: !0
        })
          , downloadPromise = this.downloadMap(code);
        focusPromise.then(function() {
            "pending" === downloadPromise.state() && that.spinner.show()
        }),
        downloadPromise.always(function() {
            that.spinner.hide()
        }),
        this.drillDownPromise = jvm.$.when(downloadPromise, focusPromise),
        this.drillDownPromise.then(function() {
            currentMap.params.container.hide(),
            that.maps[name] ? that.maps[name].params.container.show() : that.addMap(name, {
                map: name,
                multiMapLevel: currentMap.params.multiMapLevel + 1
            }),
            that.history.push(that.maps[name]),
            that.backButton.show()
        })
    },
    goBack: function() {
        var currentMap = this.history.pop()
          , prevMap = this.history[this.history.length - 1]
          , that = this;
        currentMap.setFocus({
            scale: 1,
            x: .5,
            y: .5,
            animate: !0
        }).then(function() {
            currentMap.params.container.hide(),
            prevMap.params.container.show(),
            prevMap.updateSize(),
            1 === that.history.length && that.backButton.hide(),
            prevMap.setFocus({
                scale: 1,
                x: .5,
                y: .5,
                animate: !0
            })
        })
    }
},
jvm.MultiMap.defaultParams = {
    mapNameByCode: function(code, multiMap) {
        return code.toLowerCase() + "_" + multiMap.defaultProjection + "_en"
    },
    mapUrlByCode: function(code, multiMap) {
        return "jquery-jvectormap-data-" + code.toLowerCase() + "-" + multiMap.defaultProjection + "-en.js"
    }
};
