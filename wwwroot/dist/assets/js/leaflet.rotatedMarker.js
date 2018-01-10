(function () {
    // save these original methods before they are overwritten
    var proto_initIcon = L.Marker.prototype._initIcon;
    var proto_setPos = L.Marker.prototype._setPos;

    var oldIE = (L.DomUtil.TRANSFORM === 'msTransform');

    L.Marker.addInitHook(function () {
        var iconAnchor = this.options.icon.options.iconAnchor;
        var shadowAnchor = this.options.icon.options.shadowAnchor;
        if (iconAnchor) {
            iconAnchor = (iconAnchor[0] + 'px ' + iconAnchor[1] + 'px');
        }
        if (shadowAnchor) {
            shadowAnchor = (shadowAnchor[0] + 'px ' + shadowAnchor[1] + 'px');
        }
        this.options.rotationShadowOrigin = this.options.rotationShadowOrigin || shadowAnchor || 'center bottom';
        this.options.rotationOrigin = this.options.rotationOrigin || iconAnchor || 'center bottom';
        this.options.rotationAngle = this.options.rotationAngle || 0;
    });

    L.Marker.include({
        _initIcon: function () {
            proto_initIcon.call(this);
        },

        _setPos: function (pos) {
            proto_setPos.call(this, pos);

            if (this.options.rotationAngle) {
                if (this._icon)
                    this._icon.style[L.DomUtil.TRANSFORM + 'Origin'] = this.options.rotationOrigin;
                if (this._shadow)
                    this._shadow.style[L.DomUtil.TRANSFORM + 'Origin'] = this.options.rotationShadowOrigin;

                if (oldIE) {
                    // for IE 9, use the 2D rotation
                    if (this._icon)
                        this._icon.style[L.DomUtil.TRANSFORM] = ' rotate(' + this.options.rotationAngle + 'deg)';
                    if (this._shadow)
                        this._shadow.style[L.DomUtil.TRANSFORM] = ' rotate(' + this.options.rotationAngle + 'deg)';
                } else {
                    // for modern browsers, prefer the 3D accelerated version
                    if (this._icon)
                        this._icon.style[L.DomUtil.TRANSFORM] += ' rotateZ(' + this.options.rotationAngle + 'deg)';
                    if (this._shadow)
                        this._shadow.style[L.DomUtil.TRANSFORM] += ' rotateZ(' + this.options.rotationAngle + 'deg)';
                }
            }
        },

        setRotationAngle: function (angle) {
            this.options.rotationAngle = angle;
            this.update();
            return this;
        },

        setRotationOrigin: function (origin) {
            this.options.rotationOrigin = origin;
            this.update();
            return this;
        },

        setRotationShadowOrigin: function (origin) {
            this.options.rotationShadowOrigin = origin;
            this.update();
            return this;
        }
    });
})();