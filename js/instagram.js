var instagram = {
    AUTHENTICATION : {
        getAccessToken : function( forceNew ){
            if( localStorage['access_token'] && !forceNew ){
                return localStorage['access_token'];
            }
            var access_token = null;
            if( document.location.hash ){
                var hashParams = document.location.hash.split('#')[1].split('&');
                for( var i = 0; i < hashParams.length; i++ ){
                    if( hashParams[i].match(/access_token=/gi) ){
                      access_token = hashParams[i].match(/access_token=[^]*$/gi)[0].replace('access_token=', '');
                    }
                }
                if( localStorage ){
                    localStorage['access_token'] = access_token;
                }
            }
            return access_token;
        },
        register : function( uri, clientId ){
            window.location='https://instagram.com/oauth/authorize/?client_id='+clientId+'&redirect_uri='+uri+'&response_type=token&scope=likes';
        }
    },
    USERS : {
        getRecentMedia : function( access_parameters, query_parameters, callback ){
            var COUNT = query_parameters.count || null;
            var MAX_TIMESTAMP = query_parameters.max_timestamp || null;
            var MIN_TIMESTAMP = query_parameters.min_timestamp || null;
            var MIN_ID = query_parameters.min_id || null;
            var MAX_ID = query_parameters.max_id || null;
            var UID = query_parameters.uid || 'self';
            var ACCESS_TOKEN = access_parameters.access_token || null;
            var query = 'https://api.instagram.com/v1/users/'+UID+'/media/recent/?access_token='+ACCESS_TOKEN;
            query = (!!COUNT) ? query+'&count='+COUNT : query;
            query = (!!MAX_TIMESTAMP) ? query+'&max_timestamp='+MAX_TIMESTAMP : query;
            query = (!!MIN_TIMESTAMP) ? query+'&min_timestamp='+MIN_TIMESTAMP : query;
            query = (!!MIN_ID) ? query+'&min_id='+MIN_ID : query;
            query = (!!MAX_ID) ? query+'&max_id='+MAX_ID : query;
            query += '&callback=?';
            $.getJSON(query, callback); 
        },
        getUserInfo : function( access_parameters, query_parameters, callback ){
            var UID = query_parameters.uid || 'self';
            var ACCESS_TOKEN = access_parameters.access_token || null;
            $.getJSON('https://api.instagram.com/v1/users/'+UID+'/?access_token='+ACCESS_TOKEN+'&callback=?', callback );
        },
        getFeed : function( access_parameters, query_parameters, callback ){
            console.log( query_parameters );
            var COUNT = query_parameters.count || null;
            var MIN_ID = query_parameters.min_id || null;
            var MAX_ID = query_parameters.max_id || null;
            var ACCESS_TOKEN = access_parameters.access_token || null;
            var query = 'https://api.instagram.com/v1/users/self/feed/?access_token='+ACCESS_TOKEN;
            query = (!!COUNT) ? query+'&count='+COUNT : query;
            query = (!!MIN_ID) ? query+'&min_id='+MIN_ID : query;
            query = (!!MAX_ID) ? query+'&max_id='+MAX_ID : query;
            query += '&callback=?';
            $.getJSON( query, callback );
        }
    },
    TAGS : {
        getRecentMedia : function( access_parameters, query_parameters, callback ){
            var MIN_ID = query_parameters.min_id || null;
            var MAX_ID = query_parameters.max_id || null;
            var TAG_NAME = query_parameters.tag_name || 'yolo';
            var ACCESS_TOKEN = access_parameters.access_token || null;
            var query = 'https://api.instagram.com/v1/tags/'+TAG_NAME+'/media/recent/?access_token='+ACCESS_TOKEN;
            query = (!!MIN_ID) ? query+'&min_id='+MIN_ID : query;
            query = (!!MAX_ID) ? query+'&max_id='+MAX_ID : query;
            query += '&callback=?';
            $.getJSON(query, callback); 
        }
    },
    RELATIONSHIPS : {
        getFollows : function( access_parameters, query_parameters, callback ){
            var UID = query_parameters.uid || 'self';
            var ACCESS_TOKEN = access_parameters.access_token || null;
            var query = "https://api.instagram.com/v1/users/"+UID+"/follows?access_token="+ACCESS_TOKEN+"&callback=?";
            $.getJSON(query, callback);
        }
    },
    LIKES : {
        get : function( access_parameters, query_parameters, callback ){
            var MEDIA_ID = query_parameters.media_id || null;
            var ACCESS_TOKEN = access_parameters.access_token || null;
            var query = "https://api.instagram.com/v1/media/"+MEDIA_ID+"/likes?access_token="+ACCESS_TOKEN+"&callback=?";
            $.getJSON(query, callback); 
        },
        post : function( access_parameters, query_parameters, callback ){
            var MEDIA_ID = query_parameters.media_id || null;
            var ACCESS_TOKEN = access_parameters.access_token || null;
            var query = "https://api.instagram.com/v1/media/"+MEDIA_ID+"/likes?access_token="+ACCESS_TOKEN+"&callback=?";
            $.post(query, callback); 
        },
        del : function( access_parameters, query_parameters, callback ){
            var MEDIA_ID = query_parameters.media_id || null;
            var ACCESS_TOKEN = access_parameters.access_token || null;
            var query = "https://api.instagram.com/v1/media/"+MEDIA_ID+"/likes?access_token="+ACCESS_TOKEN+"&callback=?";
            $.ajax({
                type: "DELETE",
                dataType: "jsonp",
                crossDomain:true,
                url: query, 
                success: callback
            }); 
        }
    }
};
