var host_detect = {
    getBaseUrl : function(){
        if( document.location.origin.match('localhost') ){
            return '/';
        }
        else if( document.location.origin.match('github') ){
            return '/InstagramApiJavascriptLib';
        }
        else{
            return '/';
        }
    },
    getUri : function(){
        if( document.location.origin.match('localhost') ){
            return 'http://localhost/instagram/?redirect=true';
        }
        else if( document.location.origin.match('github') ){
            return 'http://schnej7.github.com/InstagramApiJavascriptLib/?redirect=true';
        }
        else{
            return null;
        }
    },
    getClientId : function(){
        if( document.location.origin.match('localhost') ){
            return '94c63c6afce54a438ddec333784fefcd';
        }
        else if( document.location.origin.match('github') ){
            return '1417d772c7554316be58e619f17d10e7';
        }
        else{
            return null;
        }
    }
};
