var image_popover = {

    //This function creates a popover for an image
    //It expects an img tag
    popover: function( element, isUrl, additional_element, id ){
        var image = null;
        if( element.tagName && element.tagName == 'IMG' ){
            image = element.src;
        }
        else if( element && isUrl ){
            image = element;
        }
        else{
            console.log('error');
            return 0;
        }

        if( !document.getElementById( 'image-popover' ) ){
            popover = this.create( image, additional_element, id );
        }
        //This prevents the page from scrolling
        return false;
    },

    //Helper function that creates the DOM elements for the popover
    create: function( source, additional_element, id ){
        var overlay = document.createElement('div');
        overlay.setAttribute('id', 'image-popover');
        overlay.setAttribute('onClick', 'image_popover.destory()');
        overlay.style.height = this.getDocHeight() + 'px';


        var img_frame = document.createElement('div');
        img_frame.setAttribute('id', 'image-frame');
        img_frame.setAttribute('class', 'well');
        var doc = document.documentElement, body = document.body;
        img_frame.style.marginTop = ((doc && doc.scrollTop  || body && body.scrollTop  || 0) + 100) + 'px';

        overlay.appendChild( img_frame );

        var img_link = document.createElement('a');
        img_link.setAttribute('href', 'examples/pages/picture.html?id='+id+'&url='+encodeURIComponent(source));
        img_frame.appendChild( img_link );

        var img = document.createElement('img');
        img.setAttribute('id', '__image__');
        img.setAttribute('src', source);
        img_link.appendChild( img );

        if( additional_element ){
            img_frame.appendChild( additional_element );
        }

        document.body.appendChild(overlay);
    },

    //Helper function that destroys the popover
    destory: function(){
        document.body.removeChild( document.getElementById('image-popover') );
    },

    //Helper function that gets the height of the document
    getDocHeight: function() {
        var D = document;
        return Math.max(
            Math.max(D.body.scrollHeight, D.documentElement.scrollHeight),
            Math.max(D.body.offsetHeight, D.documentElement.offsetHeight),
            Math.max(D.body.clientHeight, D.documentElement.clientHeight)
        );
    }
};
