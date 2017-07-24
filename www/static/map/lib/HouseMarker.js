function HouseMarker(latlng, map, args) {
    this.latlng = latlng;   
    this.args = args;   
    this.setMap(map);   
}

HouseMarker.prototype = new google.maps.OverlayView();

HouseMarker.prototype.draw = function() {
    
    var self = this;
    
    var div = this.div;
    var innerDiv;
    
    if (!div) {
        div = this.div = document.createElement('div');
        
        div.className = 'gmap-html-marker';

        var extendHtml = '';
        if (window.$viewData.type === 'purchase') {
            extendHtml = '<div class="extend">'+self.args.data.prop_type_name+'</div>';
        }
        div.innerHTML = '<div class="marker-container overlay">'+
            '<span class="price">$'+self.args.data.list_price+'</span>'+
            extendHtml+
        '</div>';
        
        if (typeof(self.args.marker_id) !== 'undefined') {
            div.dataset.marker_id = self.args.marker_id;
        }
        
        google.maps.event.addDomListener(div, "click", function(event) {
            // alert('You clicked on a custom marker!');
            google.maps.event.trigger(self, "click");
        });
        
        var panes = this.getPanes();
        //panes.overlayMouseTarget.appendChild(div);
        panes.overlayMouseTarget.appendChild(div);
    }
    
    var point = this.getProjection().fromLatLngToDivPixel(this.latlng);
    
    if (point) {
        div.style.left = (point.x - div.offsetWidth / 2) + 'px';
        div.style.top = (point.y - div.offsetHeight - 6) + 'px';
    }
};

HouseMarker.prototype.remove = function() {
    if (this.div) {
        this.div.parentNode.removeChild(this.div);
        this.div = null;
    }   
};

HouseMarker.prototype.getPosition = function() {
    return this.latlng; 
};