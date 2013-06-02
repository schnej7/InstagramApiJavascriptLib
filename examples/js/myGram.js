var myGram = {
    max_pic_id : null,
    query_parameters : {
        paginationField : null,
        tag_name : null,
        count : null,
        uid : 'self',
        max_id : null
    },
    uri : null,
    clientId : null,
    access_parameters : null,
    lazyLoad : function(){},
    instagramCall : function(){},
    getParameters : function(){
        var access_token = null;
        if( !!document.location.search ){
            var qParams = document.location.search.split('?')[1].split('&');
            for( var i = 0; i < qParams.length; i++ ){
                if( qParams[i].match("redirect=true") ){
                    access_token = instagram.AUTHENTICATION.getAccessToken( true );
                }
                if( qParams[i].match("uid") ){
                    myGram.query_parameters.uid = qParams[i].replace("uid=", "");
                }
                if( qParams[i].match("tag") ){
                    myGram.query_parameters.tag_name = qParams[i].replace("tag=", "");
                }
            }
        }
        myGram.query_parameters.uid = myGram.query_parameters.uid || 'self';
        if( !access_token ){
              access_token = instagram.AUTHENTICATION.getAccessToken( false );
        }
        myGram.uri = host_detect.getUri();
        myGram.clientId = host_detect.getClientId();
        if( !!access_token ){
            myGram.access_parameters = {access_token:access_token};
        }
        var headder1 = $('.headder1');
        if( myGram.query_parameters.tag_name ){
            headder1.append($('<div>#'+myGram.query_parameters.tag_name+'</div>'));
        }
        if( !!myGram.access_parameters ){
            if( myGram.query_parameters.tag_name ){
                myGram.paginationField = 'next_max_tag_id';
                myGram.instagramCall = instagram.TAGS.getRecentMedia;
                instagram.TAGS.getRecentMedia( myGram.access_parameters, myGram.query_parameters, myGram.getImagesCallback );
            }
            else if( myGram.query_parameters.uid == 'self' ){
                myGram.paginationField = 'next_max_id';
                myGram.instagramCall = instagram.USERS.getFeed;
                myGram.query_parameters.count = 40;
                instagram.USERS.getFeed( myGram.access_parameters, myGram.query_parameters, myGram.getImagesCallback );
            }
            else{
                myGram.paginationField = 'next_max_id';
                myGram.instagramCall = instagram.USERS.getRecentMedia;
                myGram.query_parameters.count = 40;
                instagram.USERS.getRecentMedia( myGram.access_parameters, myGram.query_parameters, myGram.getImagesCallback );
            }
        }
    },
    loadHeadder : function(){
        instagram.USERS.getUserInfo( myGram.access_parameters, {uid: 'self'}, function(data){
            $('.headder1-select').append($('<option>'+data.data.username+'</option>').attr('value', data.data.id));
            $('.profile').append($('<div></div>').css('background-image','url('+data.data.profile_picture+')').addClass('profile-image'));
            $('.profile').append($('<div>'+data.data.username+' ('+data.data.full_name+')</div>').addClass('profile-name'));
        });
        instagram.RELATIONSHIPS.getFollows( myGram.access_parameters, {uid:'self'}, function(data){
            data = data.data;
            for( var i = 0; i < data.length; i++ ){
                $('.headder1-select').append($('<option>'+data[i].username+'</option>').attr('value', data[i].id));
            }
            $('.headder1-select').val(myGram.query_parameters.uid);
        });
    },
    getImagesCallback : function( data ){
        var maindiv = $('.maindiv');
        var pagination = data.pagination;
        data = data.data;
        var standard_res_caption = [];
        var most_likes = [];
        var max_large_photos = (data.length % 4);
        //get images with most likes
        if( max_large_photos < data.length / 4 ){
            max_large_photos += 4;
        }
        for( var i = 0; i < data.length; i++ ){
            if( most_likes.length < max_large_photos ){
                most_likes[i] = {index: i, value: data[i].likes.count};
            }
            else{
                most_likes.sort( function(a, b){
                    return b.value - a.value;
                });
                for( var j = 0; j < most_likes.length; j++ ){
                    if( most_likes[j].value < data[i].likes.count ){
                        most_likes[j] = {index: i, value: data[i].likes.count };
                        break;
                    }
                }
            }
        }
        var small_fill = 0;
        var small_thumb_container = null;
        for( var i = 0; i < data.length; i++ ){
            if( small_fill == 0 ){
                small_thumb_container = $('<div><div>').addClass('large');
            }
            if( data[i].caption && data[i].tags ){
                for( var j = 0; j < data[i].tags.length; j++ ){
                    data[i].caption.text = data[i].caption.text.replace(new RegExp('#'+data[i].tags[j],'gi'), '<a href="?tag='+data[i].tags[j]+'">#'+data[i].tags[j]+' </a>');
                }
            }
            var likes = '';
            likes += data[i].likes.count;
            if( data[i].likes.count != 1 ){
                likes += ' likes';
            }
            else{
                likes += 'like';
            }
            standard_res_caption[i] = $('<div></div>')
                .append($('<div>'+likes+'</div>'))
                .append($('<a>'+data[i].user.username+'</a>').attr('href', '?uid='+data[i].user.id))
                .append($('<div>'+(data[i].caption&&data[i].caption.text||'')+'</div>'));
            console.log(data[i]);
            var newThumb = $('<div standard_resolution="'+data[i].images.standard_resolution.url+'" pos="'+i+'"></div>')
                .attr('media-id', data[i].id)
                .addClass('thumb')
                .addClass('item')
                .addClass('user-has-liked-'+data[i].user_has_liked)
                .append($('<div></div>')
                    .click( function( element ){
                        image_popover.popover( element.srcElement.parentNode.attributes['standard_resolution'].nodeValue, true );
                        $('#image-frame').append( standard_res_caption[element.srcElement.parentNode.attributes['pos'].nodeValue] );
                    })
                    .addClass('thumb-cover')
                    .append($('<div>'+(data[i].caption&&data[i].caption.text||'')+'</div>')
                        .addClass('caption')
                        .click( function( element ){
                            element.stopPropagation();
                            image_popover.popover( element.srcElement.parentNode.parentNode.attributes['standard_resolution'].nodeValue, true );
                            $('#image-frame').append( standard_res_caption[element.srcElement.parentNode.parentNode.attributes['pos'].nodeValue] );
                        }))
                    .append($('<div>&hearts;</div>')
                        .addClass('likeButton')
                        .click( function( element ){
                            element.stopPropagation();
                            var e_parent = $(element.target).parent().parent();
                            console.log(e_parent);
                            console.log(e_parent.attr('media-id'));
                            if( e_parent.hasClass('user-has-liked-false') ){
                                myGram.query_parameters.media_id = e_parent.attr('media-id');
                                instagram.LIKES.post(myGram.access_parameters, myGram.query_parameters, function(){} );
                                e_parent.addClass('user-has-liked-true');
                                e_parent.removeClass('user-has-liked-false');
                            }
                            else{
                                /*
                                myGram.query_parameters.media_id = e_parent.attr('media-id');
                                instagram.LIKES.del(myGram.access_parameters, myGram.query_parameters, function(){} );
                                e_parent.addClass('user-has-liked-false');
                                e_parent.removeClass('user-has-liked-true');
                                */
                            }
                        })
                    ));
            var is_large = false;
            for( var j = 0; j < most_likes.length; j++ ){
                if( i == most_likes[j].index ){
                    is_large = true;
                }
                break;
            }
            if( is_large ){
                newThumb = newThumb.addClass('large')
                    .css('background-image','url('+data[i].images.low_resolution.url+')');
                maindiv.append(newThumb);
            }
            else{
                if( small_fill < 2 ){
                    newThumb = newThumb.addClass('top');
                }
                if( small_fill % 2 == 0 ){
                    newThumb = newThumb.addClass('left');
                }
                newThumb = newThumb.css('background-image','url('+data[i].images.thumbnail.url+')');
                small_thumb_container.append(newThumb);
                small_fill += 1;
                if( small_fill == 4 ){
                    small_fill = 0;
                    maindiv.append(small_thumb_container);
                }
            }
        }
        var doc = $(document);
        var win = $(window);
        if( (win.scrollTop() + win.height() + 1000 >= doc.height() ) && pagination.next_max_id ){
            myGram.query_parameters.max_id = pagination[myGram.paginationField];
            myGram.instagramCall( myGram.access_parameters, myGram.query_parameters, myGram.getImagesCallback );
        }
        else if( pagination.next_max_id ){
            myGram.query_parameters.max_id = pagination[myGram.paginationField];
            window.onscroll = myGram.lazyLoadOnScroll;
        }
        else{
            window.onscroll = null;
            $('.lazyLoadFooter').remove();
        }
    },
    lazyLoadOnScroll : function( lazyLoad, lazyLoadCallback ){
        window.onscroll = null;
        var doc = $(document);
        var win = $(window);
        if( win.scrollTop() + win.height() + 1000 >= doc.height() ){
            myGram.instagramCall( myGram.access_parameters, myGram.query_parameters, myGram.getImagesCallback );
        }
        else{
            window.onscroll = myGram.lazyLoadOnScroll;
        }
    }
};
