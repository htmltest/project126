var html = document.documentElement;

var fontsfile = document.createElement("link");
fontsfile.href = "css/fonts.css";
fontsfile.rel = "stylesheet";
document.head.appendChild(fontsfile);

if (sessionStorage.fontsLoaded) {
    html.classList.add("fonts-loaded");
} else {
    var script = document.createElement("script");
    script.src = "js/fontfaceobserver.js";
    script.async = true;

    script.onload = function () {
        var font300 = new FontFaceObserver("Open Sans", {
            weight: "300"
        });
        var font400 = new FontFaceObserver("Open Sans", {
            weight: "400"
        });
        var font400i = new FontFaceObserver("Open Sans", {
            weight: "400",
            style: "italic"
        });
        var font700 = new FontFaceObserver("Open Sans", {
            weight: "400"
        });
        var font700i = new FontFaceObserver("Open Sans", {
            weight: "700",
            style: "italic"
        });
        var font800 = new FontFaceObserver("Open Sans", {
            weight: "800"
        });
        var font300r = new FontFaceObserver("Roboto", {
            weight: "300"
        });
        var font400r = new FontFaceObserver("Roboto", {
            weight: "400"
        });

        Promise.all([
            font300.load(),
            font400.load(),
            font400i.load(),
            font700.load(),
            font700i.load(),
            font800.load(),
            font300r.load(),
            font400r.load()
        ]).then(function () {
            html.classList.add("fonts-loaded");
            sessionStorage.fontsLoaded = true;
        });
    };
    document.head.appendChild(script);
}

var stopUserVideo = false;
var stopScrollVideo = false;
var stopScrollGallery = false;

(function($) {

    $(document).ready(function() {

        $('.side nav').jScrollPane({autoReinitialise: true});

        $('.side-link').click(function(e) {
            $('body').toggleClass('hidden-menu');
            e.preventDefault();
        });

        $('body').on('click', '.order-link', function(e) {
            $.ajax({
                type: 'POST',
                url: $(this).attr('href'),
                dataType: 'html',
                cache: false
            }).done(function(html) {
                if ($('.window').length > 0) {
                    windowClose();
                }
                windowOpen(html);
            });
            e.preventDefault();
        });

        $.extend($.validator.messages, {
            required: 'Не заполнено поле',
            email: 'Введен некорректный e-mail'
        });

        $('body').on('click', '.message-error-back-link', function(e) {
            $(this).parents().filter('.message-error').remove();
            e.preventDefault();
        });

        $('.callback-link').click(function(e) {
            $('.callback').toggle();
            $('.callback').find('.loading, .message-error, .message-success').remove();
            $('.callback .form-input input').val('');
            e.preventDefault();
        });

        $('.callback-close').click(function(e) {
            $('.callback').hide();
            e.preventDefault();
        });

        $(document).click(function(e) {
            if ($(e.target).parents().filter('.callback').length == 0 && !$(e.target).hasClass('callback') && !$(e.target).hasClass('callback-link') && !$(e.target).hasClass('map-callback')) {
                $('.callback').hide();
            }
        });

        $('.map-callback').click(function(e) {
            $('.callback').show();
            $('.callback').find('.loading, .message-error, .message-success').remove();
            $('.callback .form-input input').val('');
            e.preventDefault();
        });

        initForm();

        $('.plans-rooms a').click(function(e) {
            var curLi = $(this).parent();
            if (!curLi.hasClass('active')) {
                $('.plans-rooms li.active').removeClass('active');
                curLi.addClass('active');

                var curIndex = $('.plans-rooms li').index(curLi);
                $('.plans-rooms-tab.active').removeClass('active');
                $('.plans-rooms-tab').eq(curIndex).addClass('active');

                var curLink = $('.plans-rooms-tab').eq(curIndex).find('.plans-types li.active a');
                $('.plans-compare-images img').eq(0).attr('src', curLink.data('comparebefore'));
                $('.plans-compare-images img').eq(1).attr('src', curLink.data('compareafter'));
            }
            e.preventDefault();
        });

        $('.plans-types a').click(function(e) {
            var curLi = $(this).parent();
            if (!curLi.hasClass('active')) {
                var curBlock = curLi.parents().filter('.plans-rooms-tab');

                curBlock.find('.plans-types li.active').removeClass('active');
                curLi.addClass('active');

                var curIndex = curBlock.find('.plans-types li').index(curLi);
                curBlock.find('.plans-types-tab.active').removeClass('active');
                curBlock.find('.plans-types-tab').eq(curIndex).addClass('active');

                $('.plans-compare-images img').eq(0).attr('src', $(this).data('comparebefore'));
                $('.plans-compare-images img').eq(1).attr('src', $(this).data('compareafter'));
            }
            e.preventDefault();
        });

        $('.plans-compare-ctrl-link').click(function(e) {
            var curIndex = $('.plans-compare-ctrl-link').index($(this));
            if (!$(this).hasClass('active')) {
                $('.plans-compare-images img.active').removeClass('active');
                $('.plans-compare-images img').eq(curIndex).addClass('active');
                $('.plans-compare-ctrl-link.active').removeClass('active');
                $(this).addClass('active');
            }
            e.preventDefault();
        });

        $('.webcam-slider').each(function() {
            var curSlider = $(this);
            curSlider.data('curIndex', 0);
            curSlider.data('disableAnimation', true);
            var curHTML = '';
            var i = 1;
            curSlider.find('.webcam-slider-content li').each(function() {
                curHTML += '<a href="#">' + i + '</a>';
                i++;
            });
            $('.webcam-slider-ctrl-list').html(curHTML);
            $('.webcam-slider-ctrl-list a:first').addClass('active');
        });

        $('.webcam-slider').on('click', '.webcam-slider-ctrl-list a', function(e) {
            if (!$(this).hasClass('active')) {
                var curSlider = $('.webcam-slider');
                if (curSlider.data('disableAnimation')) {
                    var curIndex = curSlider.data('curIndex');
                    var newIndex = $('.webcam-slider-ctrl-list a').index($(this));

                    curSlider.data('curIndex', newIndex);
                    curSlider.data('disableAnimation', false);

                    curSlider.find('.webcam-slider-content > ul > li').eq(curIndex).css({'z-index': 2});
                    curSlider.find('.webcam-slider-content > ul > li').eq(newIndex).css({'z-index': 1, 'left': 0, 'top': 0}).show();

                    curSlider.find('.webcam-slider-ctrl-list a.active').removeClass('active');
                    curSlider.find('.webcam-slider-ctrl-list a').eq(newIndex).addClass('active');

                    curSlider.find('.webcam-slider-content > ul > li').eq(curIndex).fadeOut(function() {
                        curSlider.data('disableAnimation', true);
                    });
                }
            }

            e.preventDefault();
        });

        function resizeGallery() {
            var curBlock = $('.gallery');
            var curIndex = curBlock.find('.gallery-preview li').index(curBlock.find('.gallery-preview li.active'));
            var curLeft = 0;
            var newIndex = -1;
            curBlock.find('.gallery-content li').each(function() {
                var curItem = $(this);
                curLeft -= curItem.width();
                if (curItem.attr('curid')) {
                    newIndex++;
                    if (curIndex == newIndex) {
                        return false;
                    }
                }
            });
            curLeft += curBlock.find('.gallery-content li').eq(newIndex).width() / 2;
            curLeft += curBlock.find('.gallery-content').width() / 2;
            curBlock.find('.gallery-content ul').css({'left': curLeft});
            var sideWidth = (curBlock.find('.gallery-content').width() - curBlock.find('.gallery-content li').eq(newIndex).width()) / 2;
            if (sideWidth < 0) {
                sideWidth = 0;
            }
            curBlock.find('.gallery-prev, .gallery-next').width(sideWidth);
        }

        $('.gallery-periods').each(function() {
            $('.gallery-periods-parents li.active').each(function() {
                $(this).parents().filter('li').addClass('active');
            });

            $('.gallery-periods-parents > ul > li.active > ul > li.active').each(function() {
                var curLi = $(this);
                if (curLi.find('ul').length > 0) {
                    $('.gallery-periods-third').html('<ul>' + curLi.find('ul').html() + '</ul>');
                    $('.gallery-periods-third-wrap').show();
                    resizePeriods();
                }
            });
        });

        $('.gallery-periods-parents > ul > li > a').click(function(e) {
            var curLi = $(this).parent();
            if (curLi.find('ul').length > 0) {
                if (curLi.hasClass('active')) {
                    curLi.removeClass('active');
                    $('.gallery-periods-third').html('');
                    $('.gallery-periods-third-wrap').hide();
                    $('.gallery-periods-parents > ul > li > ul > li.active').removeClass('active');
                } else {
                    $('.gallery-periods-parents > ul > li.active').removeClass('active');
                    curLi.addClass('active');
                    $('.gallery-periods-third').html('');
                    $('.gallery-periods-third-wrap').hide();
                    $('.gallery-periods-parents > ul > li > ul > li.active').removeClass('active');
                }
                resizePeriods();
                e.preventDefault();
            }
        });

        $('.gallery-periods-parents > ul > li > ul > li > a').click(function(e) {
            var curLi = $(this).parent();
            if (curLi.find('ul').length > 0) {
                $('.gallery-periods-parents > ul > li > ul > li.active').removeClass('active');
                curLi.addClass('active');
                $('.gallery-periods-third').html('<ul>' + curLi.find('ul').html() + '</ul>');
                $('.gallery-periods-third-wrap').show();
                resizePeriods();
                e.preventDefault();
            }
        });

        function resizePeriods() {
            if ($('.gallery-periods-parents > ul').width() > $('.gallery-periods-parents').width()) {
                var curLeft = Number($('.gallery-periods-parents > ul').css('left').replace(/px/, ''));
                if (curLeft < 0) {
                    $('.gallery-periods-parents-prev').css({'display': 'block'});
                } else {
                    $('.gallery-periods-parents-prev').css({'display': 'none'});
                }
                if ($('.gallery-periods-parents > ul').width() - curLeft > $('.gallery-periods-parents').width()) {
                    $('.gallery-periods-parents-next').css({'display': 'block'});
                } else {
                    $('.gallery-periods-parents-next').css({'display': 'none'});
                }
                var isFull = false;
                if ($('.gallery-periods-parents > ul > li.active').length > 0) {
                    while(!isFull && ($('.gallery-periods-parents > ul > li.active').offset().left + $('.gallery-periods-parents > ul > li.active').width() > $('.gallery-periods-parents').width() + $('.gallery-periods-parents').offset().left)) {
                        var curLeft = Number($('.gallery-periods-parents > ul').css('left').replace(/px/, ''));
                        curLeft -= $('.gallery-periods-parents').width() / 2;

                        $('.gallery-periods-parents-prev').css({'display': 'block'});
                        if ($('.gallery-periods-parents > ul').width() + curLeft <= $('.gallery-periods-parents').width()) {
                            curLeft = $('.gallery-periods-parents').width() - $('.gallery-periods-parents > ul').width();
                            $('.gallery-periods-parents-next').css({'display': 'none'});
                            isFull = true;
                        }

                        $('.gallery-periods-parents > ul').css({'left': curLeft});

                    }
                }
            } else {
                $('.gallery-periods-parents-prev').css({'display': 'none'});
                $('.gallery-periods-parents-next').css({'display': 'none'});
                $('.gallery-periods-parents > ul').css({'left': 0});
            }
            if ($('.gallery-periods-third > ul').width() > $('.gallery-periods-third').width()) {
                var curLeft = Number($('.gallery-periods-third > ul').css('left').replace(/px/, ''));
                if (curLeft < 0) {
                    $('.gallery-periods-third-prev').css({'display': 'block'});
                } else {
                    $('.gallery-periods-third-prev').css({'display': 'none'});
                }
                if ($('.gallery-periods-third > ul').width() - curLeft > $('.gallery-periods-third').width()) {
                    $('.gallery-periods-third-next').css({'display': 'block'});
                } else {
                    $('.gallery-periods-third-next').css({'display': 'none'});
                }
                if ($('.gallery-periods-third > ul > li.active').length > 0) {
                    var isFull = false;
                    while(!isFull && ($('.gallery-periods-third > ul > li.active').offset().left + $('.gallery-periods-third > ul > li.active').width() > $('.gallery-periods-third').width() + $('.gallery-periods-third').offset().left)) {
                        var curLeft = Number($('.gallery-periods-third > ul').css('left').replace(/px/, ''));
                        curLeft -= $('.gallery-periods-third').width() / 2;

                        $('.gallery-periods-third-prev').css({'display': 'block'});
                        if ($('.gallery-periods-third > ul').width() + curLeft <= $('.gallery-periods-third').width()) {
                            curLeft = $('.gallery-periods-third').width() - $('.gallery-periods-third > ul').width();
                            $('.gallery-periods-third-next').css({'display': 'none'});
                            isFull = true;
                        }

                        $('.gallery-periods-third > ul').css({'left': curLeft});

                    }
                }
            } else {
                $('.gallery-periods-third-prev').css({'display': 'none'});
                $('.gallery-periods-third-next').css({'display': 'none'});
                $('.gallery-periods-third > ul').css({'left': 0});
            }
        }

        $('.gallery-periods-parents-next a').click(function(e) {
            $('.gallery-periods-parents > ul').stop(true, true);

            var curLeft = Number($('.gallery-periods-parents > ul').css('left').replace(/px/, ''));
            curLeft -= $('.gallery-periods-parents').width() / 2;

            $('.gallery-periods-parents-prev').css({'display': 'block'});
            if ($('.gallery-periods-parents > ul').width() + curLeft <= $('.gallery-periods-parents').width()) {
                curLeft = $('.gallery-periods-parents').width() - $('.gallery-periods-parents > ul').width();
                $('.gallery-periods-parents-next').css({'display': 'none'});
            }

            $('.gallery-periods-parents > ul').animate({'left': curLeft});

            e.preventDefault();
        });

        $('.gallery-periods-parents-prev a').click(function(e) {
            $('.gallery-periods-parents > ul').stop(true, true);

            var curLeft = Number($('.gallery-periods-parents > ul').css('left').replace(/px/, ''));
            curLeft += $('.gallery-periods-parents').width() / 2;

            $('.gallery-periods-parents-next').css({'display': 'block'});
            if (curLeft >= 0) {
                curLeft = 0;
                $('.gallery-periods-parents-prev').css({'display': 'none'});
            }

            $('.gallery-periods-parents > ul').animate({'left': curLeft});

            e.preventDefault();
        });

        $('.gallery-periods-third-next a').click(function(e) {
            $('.gallery-periods-third > ul').stop(true, true);

            var curLeft = Number($('.gallery-periods-third > ul').css('left').replace(/px/, ''));
            curLeft -= $('.gallery-periods-third').width() / 2;

            $('.gallery-periods-third-prev').css({'display': 'block'});
            if ($('.gallery-periods-third > ul').width() + curLeft <= $('.gallery-periods-third').width()) {
                curLeft = $('.gallery-periods-third').width() - $('.gallery-periods-third > ul').width();
                $('.gallery-periods-third-next').css({'display': 'none'});
            }

            $('.gallery-periods-third > ul').animate({'left': curLeft});

            e.preventDefault();
        });

        $('.gallery-periods-third-prev a').click(function(e) {
            $('.gallery-periods-third > ul').stop(true, true);

            var curLeft = Number($('.gallery-periods-third > ul').css('left').replace(/px/, ''));
            curLeft += $('.gallery-periods-third').width() / 2;

            $('.gallery-periods-third-next').css({'display': 'block'});
            if (curLeft >= 0) {
                curLeft = 0;
                $('.gallery-periods-third-prev').css({'display': 'none'});
            }

            $('.gallery-periods-third > ul').animate({'left': curLeft});

            e.preventDefault();
        });

        $('.gallery').each(function() {
            var curBlock = $(this);

            $(window).load(function() {
                $('.gallery-content ul').css({'visibility': 'visible'});

                resizePeriods();

                var startHTML = curBlock.find('.gallery-content ul').html();
                var i = 0;
                curBlock.find('.gallery-content li').each(function() {
                    $(this).attr('curid', i++);
                });
                curBlock.find('.gallery-content ul').prepend(startHTML);
                curBlock.find('.gallery-content ul').append(startHTML);
            });

            $(window).bind('load resize', resizeGallery);

            curBlock.find('.gallery-next').click(function(e) {
                var curIndex = curBlock.find('.gallery-preview li').index(curBlock.find('.gallery-preview li.active'));
                curIndex++;
                if (curIndex >= curBlock.find('.gallery-preview li').length) {
                    curIndex = 0;
                }
                curBlock.find('.gallery-preview li').eq(curIndex).find('a').click();
                e.preventDefault();
            });

            curBlock.find('.gallery-prev').click(function(e) {
                var curIndex = curBlock.find('.gallery-preview li').index(curBlock.find('.gallery-preview li.active'));
                curIndex--;
                if (curIndex < 0) {
                    curIndex = curBlock.find('.gallery-preview li').length - 1;
                }
                curBlock.find('.gallery-preview li').eq(curIndex).find('a').click();
                e.preventDefault();
            });

            curBlock.find('.gallery-preview a').click(function(e) {
                var curLi = $(this).parent();
                if (!curLi.hasClass('active')) {
                    var curIndex = curBlock.find('.gallery-preview li').index(curLi);

                    curBlock.find('.gallery-preview li.active').removeClass('active');
                    curLi.addClass('active');

                    curBlock.find('.gallery-content ul').stop(true, true);
                    curBlock.find('.gallery-prev, .gallery-next').stop(true, true);

                    var curLeft = 0;
                    var newIndex = -1;
                    curBlock.find('.gallery-content li').each(function() {
                        var curItem = $(this);
                        curLeft -= curItem.width();
                        if (curItem.attr('curid')) {
                            newIndex++;
                            if (curIndex == newIndex) {
                                return false;
                            }
                        }
                    });
                    curLeft += curBlock.find('.gallery-content li').eq(newIndex).width() / 2;
                    curLeft += curBlock.find('.gallery-content').width() / 2;
                    curBlock.find('.gallery-content ul').animate({'left': curLeft});
                    var sideWidth = (curBlock.find('.gallery-content').width() - curBlock.find('.gallery-content li').eq(newIndex).width()) / 2;
                    if (sideWidth < 0) {
                        sideWidth = 0;
                    }
                    curBlock.find('.gallery-prev, .gallery-next').animate({'width': sideWidth});
                }
                e.preventDefault();
            });

            curBlock.find('.gallery-periods-next a').click(function(e) {
                var curBlock = $(this).parents().filter('.gallery');

                curBlock.find('.gallery-periods ul').stop(true, true);

                var curLeft = Number(curBlock.find('.gallery-periods ul').css('left').replace(/px/, ''));
                curLeft -= curBlock.find('.gallery-periods-inner').width() / 2;

                curBlock.find('.gallery-periods-prev').css({'display': 'block'});
                if (curBlock.find('.gallery-periods-inner ul').width() + curLeft <= curBlock.find('.gallery-periods-inner').width()) {
                    curLeft = curBlock.find('.gallery-periods-inner').width() - curBlock.find('.gallery-periods-inner ul').width() - 20;
                    curBlock.find('.gallery-periods-next').css({'display': 'none'});
                }

                curBlock.find('.gallery-periods ul').animate({'left': curLeft});

                e.preventDefault();
            });

            curBlock.find('.gallery-periods-prev a').click(function(e) {
                var curBlock = $(this).parents().filter('.gallery');

                curBlock.find('.gallery-periods ul').stop(true, true);

                var curLeft = Number(curBlock.find('.gallery-periods ul').css('left').replace(/px/, ''));
                curLeft += curBlock.find('.gallery-periods-inner').width() / 2;

                curBlock.find('.gallery-periods-next').css({'display': 'block'});
                if (curLeft >= 0) {
                    curLeft = 0;
                    curBlock.find('.gallery-periods-prev').css({'display': 'none'});
                }

                curBlock.find('.gallery-periods ul').animate({'left': curLeft});

                e.preventDefault();
            });

        });

        $('.webcam-play').click(function(e) {
            var curLink = $(this);
            var curItem = curLink.parent();
            curItem.addClass('play');
            e.preventDefault();
        });

        resizeVideo();

        $(window).load(function() {
            $('.slider-preview ul li:first a').click();
        });

        if (Modernizr.video.h264) {
            $('.slider-content video').each(function() {
                var curVideo = $(this);
                curVideo[0].addEventListener('timeupdate', function() {
                    var progress = Math.floor(curVideo[0].currentTime) / Math.floor(curVideo[0].duration);
                    var curIndex = $('.slider-content video').index(curVideo);
                    var curProgress = $('.slider-preview ul li').eq(curIndex).find('span');
                    curProgress.css({'width': Math.floor(progress * curProgress.parent().width())});
                }, false);

                curVideo[0].addEventListener('ended', function() {
                    var curIndex = $('.slider-preview ul li').index($('.slider-preview ul li.active'));
                    curIndex++;
                    if (curIndex > $('.slider-preview ul li').length - 1) {
                        curIndex = 0;
                    }
                    $('.slider-preview ul li').eq(curIndex).find('a').click();
                });

                curVideo[0].addEventListener('canplay', function() {
                    curVideo.show();
                });
            });
        }

        $('.slider-preview ul li a').click(function(e) {
            var curLink = $(this);
            var curLi = curLink.parent();

            var curIndex = $('.slider-preview ul li').index(curLi);
            var curVideo = $('.slider-content li').eq(curIndex).find('video');

            if (curLi.hasClass('active')) {
                if (curLi.hasClass('play')) {
                    if (!stopScrollVideo) {
                        stopUserVideo = true;
                    }
                    curLi.removeClass('play');
                    if (Modernizr.video.h264) {
                        curVideo[0].pause();
                    }
                } else {
                    stopUserVideo = false;
                    curLi.addClass('play');
                    if (Modernizr.video.h264) {
                        curVideo[0].muted = true;
                        curVideo[0].play();
                    }
                }
            } else {
                stopUserVideo = false;
                $('.slider-preview ul li.active').removeClass('active play');
                curLi.addClass('active play');

                if (Modernizr.video.h264) {
                    $('.slider-content li.active video')[0].pause();
                    $('.slider-content li.active video')[0].currentTime = 0;
                }
                $('.slider-content li.active').removeClass('active');
                $('.slider-content li').eq(curIndex).addClass('active');
                if (Modernizr.video.h264) {
                    curVideo[0].muted = true;
                    curVideo[0].currentTime = 0;
                    curVideo[0].play();
                }
            }

            e.preventDefault();
        });

        var sliderPeriod    = 5000;
        var sliderTimer     = null;

        $('.slider-inner').each(function() {
            var curSlider = $(this);
            curSlider.data('curIndex', 0);
            curSlider.data('disableAnimation', true);
            sliderTimer = window.setTimeout(sliderNext, sliderPeriod);
        });

        function sliderNext() {
            var curSlider = $('.slider-inner');

            if (curSlider.data('disableAnimation')) {
                var curIndex = curSlider.data('curIndex');
                var newIndex = curIndex + 1;
                if (newIndex >= curSlider.find('li').length) {
                    newIndex = 0;
                }

                curSlider.data('curIndex', newIndex);
                curSlider.data('disableAnimation', false);

                curSlider.find('li').eq(curIndex).animate({'top': 50, 'opacity': 0}, function() {
                    curSlider.find('li').eq(newIndex).css({'top': -50, 'opacity': 0, 'display': 'block'}).animate({'top': 0, 'opacity': 1}, function() {
                        curSlider.data('disableAnimation', true);
                        sliderTimer = window.setTimeout(sliderNext, sliderPeriod);
                    });
                });
            }
        }

        $('.choose-wrap').each(function() {
            for (var i = 0; i < chooseData.length; i++) {
                $('.choose-wrap map').append('<area shape="poly" coords="' + chooseData[i].coords + '" href="#" alt="" data-maphilight=\'{"stroke":0, "strokeColor":"ff0000", "fillColor":"ff0000", "fillOpacity":0}\' />');
                $('.choose-map-section-numbers').append('<div class="choose-map-section-number" style="left:' + chooseData[i].left + 'px; top:' + chooseData[i].top + 'px"><div class="choose-map-section-number-title">' + chooseData[i].number + '</div></div>');
                var newWindow = $('<div class="choose-map-window"><div class="choose-map-window-wrap"><div class="choose-map-window-title">' + chooseData[i].title + '</div><div class="choose-map-window-status">' + chooseData[i].status + '</div><div class="choose-map-window-menu"><ul></ul></div><div class="choose-map-window-tabs"></div><div class="choose-map-window-close"></div></div></div>');
                if (typeof (chooseData[i].flats) != 'undefined') {
                    var newFlats = chooseData[i].flats;
                    for (var j = 0; j < newFlats.length; j++) {
                        newWindow.find('.choose-map-window-menu ul').append('<li>' + newFlats[j].room + '-комнатные</li>');
                        var newTab = $('<div class="choose-map-window-tab choose-map-window-tab-' + newFlats[j].room + '"><div class="choose-map-window-headers"><div class="choose-map-window-header">Секция</div><div class="choose-map-window-header">Кол-во</div><div class="choose-map-window-header">Стоимость</div><div class="choose-map-window-header"></div></div></div>');
                        var newRows = newFlats[j].entrances;
                        for (var k = 0; k < newRows.length; k++) {
                            var activeRowClass = '';
                            if (typeof (newRows[k].isActive) != 'undefined' && newRows[k].isActive) {
                                activeRowClass = ' active';
                            }
                            newTab.append('<a href="' + newRows[k].url + '" class="choose-map-window-row' + activeRowClass + '"><div class="choose-map-window-row-1">' + newRows[k].entrance + ' секция</div><div class="choose-map-window-row-2">' + newRows[k].count + '</div><div class="choose-map-window-row-3">' + newRows[k].price + '</div><div class="choose-map-window-row-4">&rarr;</div></a>');
                        }

                        newWindow.find('.choose-map-window-tabs').append(newTab);
                    }
                }
                $('.choose-map-windows').append(newWindow);
            }
        });

        $('body').on('click', '.choose-map-rooms-item a', function(e) {
            var curLink = $(this);
            var curRooms = 1;
            if (curLink.hasClass('choose-map-rooms-item-2')) {
                curRooms = 2;
            }
            if (curLink.hasClass('choose-map-rooms-item-3')) {
                curRooms = 3;
            }
            if (curLink.hasClass('active')) {
                curLink.removeClass('active');
                $('.choose-map-section-number-flats-' + curRooms).removeClass('visible');
            } else {
                curLink.addClass('active');
                $('.choose-map-section-number-flats-' + curRooms).addClass('visible');
            }
            $('.choose-content area').data('maphilight', {"stroke":0, "strokeColor":"ff0000", "fillColor":"ff0000", "fillOpacity":0});
            $('.choose-map').maphilight();
            $('.choose-map-window.visible').removeClass('visible');
            $('.choose-map-section-number-flats.active').removeClass('active');
            e.preventDefault();
        });

        $('body').on('click', '.choose-form-reset input', function() {
            window.setTimeout(function() {
                $('.form-select select').trigger('chosen:updated');
            }, 100);
        });

        $('body').on('click', '.choose-form', function() {
            $('body').removeClass('hidden-menu');
        });

        $('body').on('click', '.choose-map-window-close', function(e) {
            $('.choose-content area').data('maphilight', {"stroke":0, "strokeColor":"ff0000", "fillColor":"ff0000", "fillOpacity":0});
            $('.choose-map').maphilight();
            $('.choose-map-window.visible').removeClass('visible');
            $('.choose-map-section-number-flats.active').removeClass('active');
        });

        $('body').on('click', '.choose-map-section-number-flats', function() {
            var curItem = $(this);
            var curIndex = $('.choose-map-section-number').index(curItem.parent());
            $('.choose-content area').data('maphilight', {"stroke":0, "strokeColor":"ff0000", "fillColor":"ff0000", "fillOpacity":0});
            $('.choose-map-window.visible').removeClass('visible');
            if (curItem.hasClass('active')) {
                curItem.removeClass('active');
            } else {
                $('.choose-map-section-number-flats.active').removeClass('active');
                curItem.addClass('active');
                $('.choose-content area').eq(curIndex).data('maphilight', {"stroke":0, "strokeColor":"ff0000", "fillColor":"ff0000", "fillOpacity":0.8, "alwaysOn":true});
                var curLeft = curItem.parent().offset().left - $('.choose-wrap').offset().left + curItem.parent().outerWidth() / 2;
                var curTop = curItem.parent().offset().top - $('.choose-wrap').offset().top + curItem.parent().outerHeight() / 2;
                var curWindow = $('.choose-map-window').eq(curIndex);
                curWindow.removeClass('side-to-left').addClass('visible').css({'left': curLeft, 'top': curTop});
                if (curWindow.find('.choose-map-window-wrap').offset().left < $('.choose-content').offset().left) {
                    curWindow.addClass('side-to-left');
                }
                var curSectionNumber = $('.choose-map-section-number').eq(curIndex);
                var curTabIndex = curSectionNumber.find('.choose-map-section-number-flats').index($(this));
                curWindow.find('.choose-map-window-menu ul li').eq(curTabIndex).trigger('click');
            }
            $('.choose-map').maphilight();
        });

        $('body').on('click', '.choose-map-section-number-title', function() {
            var curItem = $(this);
            var curIndex = $('.choose-map-section-number').index(curItem.parent());
            $('.choose-content area').data('maphilight', {"stroke":0, "strokeColor":"ff0000", "fillColor":"ff0000", "fillOpacity":0});
            $('.choose-map-window.visible').removeClass('visible');
            $('.choose-content area').eq(curIndex).data('maphilight', {"stroke":0, "strokeColor":"ff0000", "fillColor":"ff0000", "fillOpacity":0.8, "alwaysOn":true});
            var curLeft = curItem.parent().offset().left - $('.choose-wrap').offset().left + curItem.parent().outerWidth() / 2;
            var curTop = curItem.parent().offset().top - $('.choose-wrap').offset().top + curItem.parent().outerHeight() / 2;
            var curWindow = $('.choose-map-window').eq(curIndex);
            curWindow.removeClass('side-to-left').addClass('visible').css({'left': curLeft, 'top': curTop});
            if (curWindow.find('.choose-map-window-wrap').offset().left < $('.choose-content').offset().left) {
                curWindow.addClass('side-to-left');
            }
            if (curWindow.find('.choose-map-window-menu ul li.active').length == 0) {
                curWindow.find('.choose-map-window-menu ul li').eq(0).trigger('click');
            }
            $('.choose-map').maphilight();
        });

        $('body').on('mouseover', '.choose-wrap area', function() {
            var curArea = $(this);
            var curIndex = $('.choose-wrap area').index(curArea);
            curArea.data('maphilight', {"stroke":0, "strokeColor":"ff0000", "fillColor":"ff0000", "fillOpacity":0.8, "alwaysOn":true});
            $('.choose-map').maphilight();
        });

        $('body').on('mouseout', '.choose-wrap area', function() {
            var curArea = $(this);
            var curIndex = $('.choose-wrap area').index(curArea);
            if (!$('.choose-map-window').eq(curIndex).hasClass('visible')) {
                curArea.data('maphilight', {"stroke":0, "strokeColor":"ff0000", "fillColor":"ff0000", "fillOpacity":0});
                $('.choose-map').maphilight();
            }
        });

        $('body').on('click', '.choose-wrap area', function(e) {
            var curArea = $(this);
            var curIndex = $('.choose-wrap area').index(curArea);
            $('.choose-map-section-number').eq(curIndex).find('.choose-map-section-number-title').trigger('click');
            e.preventDefault();
        });

        $('body').on('click', '.choose-map-window-menu ul li', function(e) {
            var curLi = $(this);
            if (!curLi.hasClass('active')) {
                var curWindow = $(this).parents().filter('.choose-map-window');
                curWindow.find('.choose-map-window-menu ul li.active').removeClass('active');
                curLi.addClass('active');
                var curIndex = curWindow.find('.choose-map-window-menu ul li').index(curLi);
                curWindow.find('.choose-map-window-tab.active').removeClass('active');
                curWindow.find('.choose-map-window-tab').eq(curIndex).addClass('active');
                var curWindowIndex = $('.choose-map-window').index(curWindow);
                var curSectionNumber = $('.choose-map-section-number').eq(curWindowIndex);
                curSectionNumber.find('.choose-map-section-number-flats.active').removeClass('active');
                curSectionNumber.find('.choose-map-section-number-flats').eq(curIndex).addClass('active');
            }
        });

        $('.choose-map-window-row').each(function() {
            if ($(this).find('.choose-map-window-row-2').html() == '0') {
                $(this).addClass('disabled');
            }
        });

        $('.choose-map-window').each(function() {
            var curWindow = $(this);
            var curIndex = $('.choose-map-window').index(curWindow);
            var curSection = $('.choose-map-section-number').eq(curIndex);
            curWindow.find('.choose-map-window-tab').each(function() {
                var curTab = $(this);
                var curSumm = 0;
                curTab.find('.choose-map-window-row-2').each(function() {
                    curSumm += Number($(this).text());
                });
                var curSectionClass = 'choose-map-section-number-flats-1';
                if (curTab.hasClass('choose-map-window-tab-2')) {
                    curSectionClass = 'choose-map-section-number-flats-2';
                }
                if (curTab.hasClass('choose-map-window-tab-3')) {
                    curSectionClass = 'choose-map-section-number-flats-3';
                }

                curSection.find('.choose-map-section-number-title').before('<div class="choose-map-section-number-flats ' + curSectionClass + '">' + curSumm + '</div>');
            });
        });

        $('.choose-map-rooms').each(function() {
            var curSumm1 = 0;
            $('.choose-map-section-number-flats-1').each(function() {
                curSumm1 += Number($(this).text());
            });
            $('.choose-map-rooms-item-1 .choose-map-rooms-count').html(curSumm1);

            var curSumm2 = 0;
            $('.choose-map-section-number-flats-2').each(function() {
                curSumm2 += Number($(this).text());
            });
            $('.choose-map-rooms-item-2 .choose-map-rooms-count').html(curSumm2);

            var curSumm3 = 0;
            $('.choose-map-section-number-flats-3').each(function() {
                curSumm3 += Number($(this).text());
            });
            $('.choose-map-rooms-item-3 .choose-map-rooms-count').html(curSumm3);
        });

        $('.choose-map-window-row.active').eq(0).each(function() {
            var curLink = $(this);
            var curTab = curLink.parents().filter('.choose-map-window-tab');
            curTab.addClass('active');
            var curWindow = curTab.parents().filter('.choose-map-window');
            var curTabIndex = curWindow.find('.choose-map-window-tab').index(curTab);
            curWindow.find('.choose-map-window-menu ul li').eq(curTabIndex).addClass('active');
            var curRooms = 1;
            if (curTab.hasClass('choose-map-window-tab-2')) {
                curRooms = 2;
            }
            if (curTab.hasClass('choose-map-window-tab-3')) {
                curRooms = 3;
            }
            $('.choose-map-rooms-item-' + curRooms).each(function() {
                var curLink = $(this);
                curLink.addClass('active');
                $('.choose-map-section-number-flats-' + curRooms).addClass('visible');
            });
            var curWindowIndex = $('.choose-map-window').index(curWindow);
            $('.choose-map-section-number').eq(curWindowIndex).find('.choose-map-section-number-flats-' + curRooms).trigger('click');
            $('.choose-map-section-number').eq(curWindowIndex).addClass('active');
        });

        $('.choose-map-rooms-item a.active').each(function(e) {
            var curLink = $(this);
            var curRooms = 1;
            if (curLink.hasClass('choose-map-rooms-item-2')) {
                curRooms = 2;
            }
            if (curLink.hasClass('choose-map-rooms-item-3')) {
                curRooms = 3;
            }
            $('.choose-map-section-number-flats-' + curRooms).addClass('visible');
        });

        $('body').on('click', '.choose-window-floors a', function(e) {
            var curLi = $(this).parent();
            if (!curLi.hasClass('active')) {
                var curIndex = $('.choose-window-floors li').index(curLi);
                $('.choose-window-floors li.active').removeClass('active');
                curLi.addClass('active');
                $('.choose-window-tab.active').removeClass('active');
                $('.choose-window-tab').eq(curIndex).addClass('active');
            }
            e.preventDefault();
        });

        $('body').on('click', '.choose-window-map-scheme+map area', function(e) {
            if ($(this).hasClass('disabled')) {
                e.preventDefault();
            }
        });

        $('body').on('mouseover', '.choose-window-map-scheme+map area', function(e) {
            var curBlock = $(this).parents().filter('.choose-window-flat-scheme');
            var curIndex = curBlock.find('.choose-window-map-scheme+map area').index($(this));
            var curArea = curBlock.find('.choose-window-map+map area').eq(curIndex);
            if (curArea.data('maphilighthover')) {
                var curStyle = curArea.data('maphilight');
                curArea.data('maphilight', curArea.data('maphilighthover'));
                curArea.data('maphilighthover', curStyle);
                curBlock.find('.choose-window-map').maphilight();
            }
            curBlock.find('.flat-floor-scheme-hint-item').eq(curIndex).show().css({'left': e.pageX - $(window).scrollLeft(), 'top': e.pageY - $(window).scrollTop()});
        });

        $('body').on('mouseout', '.choose-window-map-scheme+map area', function(e) {
            var curBlock = $(this).parents().filter('.choose-window-flat-scheme');
            var curIndex = curBlock.find('.choose-window-map-scheme+map area').index($(this));
            var curArea = curBlock.find('.choose-window-map+map area').eq(curIndex);
            if (curArea.data('maphilighthover')) {
                var curStyle = curArea.data('maphilight');
                curArea.data('maphilight', curArea.data('maphilighthover'));
                curArea.data('maphilighthover', curStyle);
                curBlock.find('.choose-window-map').maphilight();
            }
            $('.flat-floor-scheme-hint-item').hide();
        });

        $('body').on('mousemove', '.choose-window-map-scheme+map area', function(e) {
            var curBlock = $(this).parents().filter('.choose-window-flat-scheme');
            var curIndex = curBlock.find('.choose-window-map-scheme+map area').index($(this));
            curBlock.find('.flat-floor-scheme-hint-item').eq(curIndex).show().css({'left': e.pageX - $(window).scrollLeft(), 'top': e.pageY - $(window).scrollTop()});
        });

        $('body').on('mouseover', '.infrastructure-queue-item span', function() {
            var builds = $(this).data('builds').split(',');
            for (var i = 0; i < builds.length; i++) {
                var curIndex = -1;
                $('.infrastructure-map-section-number').each(function() {
                    if ($(this).html() == builds[i]) {
                        curIndex = $('.infrastructure-map-section-number').index($(this));
                    }
                });
                if (curIndex > -1) {
                    $('.infrastructure-map-section-number').eq(curIndex).addClass('hover');
                    $('.infrastructure-container area').each(function() {
                        var curArea = $(this);
                        if (curArea.data('build') == builds[i]) {
                            curArea.data('maphilight', {"stroke":false, "fillColor":"fff000", "fillOpacity":0.6, "alwaysOn":true});
                        }
                    });
                }
            }
            $('.infrastructure-map').maphilight();
        });

        $('body').on('mouseout', '.infrastructure-queue-item span', function() {
            $('.infrastructure-map-section-number').removeClass('hover');
            $('.infrastructure-container area').data('maphilight', {"stroke":false, "fillColor":"fff000", "fillOpacity":0.6});
            $('.infrastructure-map').maphilight();
        });

        $('.flat-map').maphilight();

        $('.flat-builds-content area').click(function(e) {
            e.preventDefault();
        });

        $('.choose-window-map').maphilight();

        $('.flat-floor-img').maphilight();

        $('.flat-floor-content area.disabled').click(function(e) {
            e.preventDefault();
        });

        $('map[name="flat-floor-scheme"] area').hover(
            function(e) {
                var curIndex = $('map[name="flat-floor-scheme"] area').index($(this));
                $('.flat-floor-scheme-hint-item').eq(curIndex).show().css({'left': e.pageX - $(window).scrollLeft(), 'top': e.pageY - $(window).scrollTop()});
                var curArea = $('.flat-floor-map area').eq(curIndex);
                if (curArea.data('maphilighthover')) {
                    var curStyle = curArea.data('maphilight');
                    curArea.data('maphilight', curArea.data('maphilighthover'));
                    curArea.data('maphilighthover', curStyle);
                    $('.flat-floor-img').maphilight();
                }
            },

            function(e) {
                $('.flat-floor-scheme-hint-item').hide();
                var curIndex = $('map[name="flat-floor-scheme"] area').index($(this));
                var curArea = $('.flat-floor-map area').eq(curIndex);
                if (curArea.data('maphilighthover')) {
                    var curStyle = curArea.data('maphilight');
                    curArea.data('maphilight', curArea.data('maphilighthover'));
                    curArea.data('maphilighthover', curStyle);
                    $('.flat-floor-img').maphilight();
                }
            }
        );

        $('map[name="flat-floor-scheme"] area').mousemove(function(e) {
            var curIndex = $('map[name="flat-floor-scheme"] area').index($(this));
            $('.flat-floor-scheme-hint-item').eq(curIndex).show().css({'left': e.pageX - $(window).scrollLeft(), 'top': e.pageY - $(window).scrollTop()});
        });

        $('.photo-gallery-item').each(function() {
            var curSlider = $(this);
            curSlider.data('curIndex', 0);
            curSlider.data('disableAnimation', true);

            var pageSize = 5;
            if (curSlider.parents().filter('.photo-gallery-inside').length > 0) {
                pageSize = 3;
            }
            var curPages = Math.ceil(curSlider.find('li').length / pageSize);
            if (curPages > 1) {
                var curHTML = '';
                for (var i = 0; i < curPages; i++) {
                    curHTML += '<a href="#"></a>';
                }
                curSlider.find('.photo-gallery-ctrl').html(curHTML);
                curSlider.find('.photo-gallery-ctrl a:first-child').addClass('active');
            } else {
                curSlider.parents().filter('.photo-gallery-inside').find('.photo-gallery-inside-next, .photo-gallery-inside-prev').hide();
            }
        });

        $('.photo-gallery-item').on('click', '.photo-gallery-ctrl a', function(e) {
            var pageSize = 5;
            if ($(this).parents().filter('.photo-gallery-inside').length > 0) {
                pageSize = 3;
            }
            var curList = $(this).parents().filter('.photo-gallery-item');
            var curIndex = curList.find('.photo-gallery-ctrl a').index($(this));
            curList.find('li:first').stop(true, true);
            curList.find('.photo-gallery-ctrl a.active').removeClass('active');
            $(this).addClass('active');
            curList.find('li:first').animate({'margin-left': -curIndex * pageSize * curList.find('li:first').outerWidth()});
            e.preventDefault();
        });

        $('.photo-gallery-inside-next').click(function(e) {
            var curGallery = $(this).parents().filter('.photo-gallery');
            var curDot = curGallery.find('.photo-gallery-ctrl a.active');
            curDot.next().trigger('click');

            e.preventDefault();
        });

        $('.photo-gallery-inside-prev').click(function(e) {
            var curGallery = $(this).parents().filter('.photo-gallery');
            var curDot = curGallery.find('.photo-gallery-ctrl a.active');
            curDot.prev().trigger('click');

            e.preventDefault();
        });

        $('.photo-gallery-item li a').click(function(e) {
            var curGalleryItem = $(this).parents().filter('.photo-gallery-item');
            $('.photo-gallery-item').removeClass('active');
            curGalleryItem.addClass('active');

            var windowWidth     = $(window).width();
            var windowHeight    = $(window).height();
            var curScrollTop    = $(window).scrollTop();
            var curScrollLeft   = $(window).scrollLeft();

            var bodyWidth = $('body').width();
            $('body').css({'height': windowHeight, 'overflow': 'hidden'});
            var scrollWidth =  $('body').width() - bodyWidth;
            $('body').css({'padding-right': scrollWidth + 'px'});
            $(window).scrollTop(0);
            $(window).scrollLeft(0);
            $('body').css({'margin-top': -curScrollTop});
            $('body').data('scrollTop', curScrollTop);
            $('body').css({'margin-left': -curScrollLeft});
            $('body').data('scrollLeft', curScrollLeft);

            $('.item-gallery-loading').show();
            var curLink = $(this);
            var curIndex = curGalleryItem.find('.photo-gallery-content li a').index(curLink);
            $('.item-gallery').data('curIndex', curIndex);

            $('.item-gallery-load img').attr('src', curLink.attr('href'));
            $('.item-gallery-load img').load(function() {
                $('.item-gallery-big img').attr('src', curLink.attr('href'));
                $('.item-gallery-big img').width('auto');
                $('.item-gallery-big img').height('auto');
                galleryPosition();

                $('.item-gallery-loading').hide();
            });

            $('.item-gallery').addClass('item-gallery-open');
            stopScrollGallery = true;

            e.preventDefault();
        });

        $('.item-gallery-close').click(function(e) {
            itemGalleryClose();
            e.preventDefault();
        });

        $('body').keyup(function(e) {
            if (e.keyCode == 27) {
                itemGalleryClose();
            }
        });

        $(document).click(function(e) {
            if ($(e.target).hasClass('item-gallery')) {
                itemGalleryClose();
            }
        });

        function itemGalleryClose() {
            if ($('.item-gallery-open').length > 0) {
                $('.item-gallery').removeClass('item-gallery-open');
                $('body').css({'height': '100%', 'overflow': 'visible', 'padding-right': 0, 'margin': 0});
                $(window).scrollTop($('body').data('scrollTop'));
                $(window).scrollLeft($('body').data('scrollLeft'));
                stopScrollGallery = false;
            }
        }

        function galleryPosition() {
            var curWidth = $('.item-gallery-big').width();
            var windowHeight = $(window).height();
            var curHeight = windowHeight - 40;

            var imgWidth = $('.item-gallery-big img').width();
            var imgHeight = $('.item-gallery-big img').height();

            var newWidth = curWidth;
            var newHeight = imgHeight * newWidth / imgWidth;

            if (newHeight > curHeight) {
                newHeight = curHeight;
                newWidth = imgWidth * newHeight / imgHeight;
            }

            $('.item-gallery-big img').width(newWidth);
            $('.item-gallery-big img').height(newHeight);

            if ($('.item-gallery-container').outerHeight() > windowHeight - 40) {
                $('.item-gallery-container').css({'top': 20, 'margin-top': 0});
            } else {
                $('.item-gallery-container').css({'top': '50%', 'margin-top': -$('.item-gallery-container').outerHeight() / 2});
            }
        }

        $('.item-gallery-next').click(function(e) {
            var curIndex = $('.item-gallery').data('curIndex');
            curIndex++;
            if (curIndex >= $('.photo-gallery-item.active .photo-gallery-content ul li').length) {
                curIndex = 0;
            }

            $('.item-gallery-loading').show();

            var curLink = $('.photo-gallery-item.active .photo-gallery-content ul li').eq(curIndex).find('a');
            $('.item-gallery').data('curIndex', curIndex);

            $('.item-gallery-load img').attr('src', curLink.attr('href'));
            $('.item-gallery-load img').load(function() {
                $('.item-gallery-big img').attr('src', curLink.attr('href'));
                $('.item-gallery-big img').width('auto');
                $('.item-gallery-big img').height('auto');
                galleryPosition();

                $('.item-gallery-loading').hide();
            });

            e.preventDefault();
        });

        $('.item-gallery-prev').click(function(e) {
            var curIndex = $('.item-gallery').data('curIndex');
            curIndex--;
            if (curIndex < 0) {
                curIndex = $('.photo-gallery-item.active .photo-gallery-content ul li').length - 1;
            }

            $('.item-gallery-loading').show();

            var curLink = $('.photo-gallery-item.active .photo-gallery-content ul li').eq(curIndex).find('a');
            $('.item-gallery').data('curIndex', curIndex);

            $('.item-gallery-load img').attr('src', curLink.attr('href'));
            $('.item-gallery-load img').load(function() {
                $('.item-gallery-big img').attr('src', curLink.attr('href'));
                $('.item-gallery-big img').width('auto');
                $('.item-gallery-big img').height('auto');
                galleryPosition();

                $('.item-gallery-loading').hide();
            });

            e.preventDefault();
        });

        $('.photo-gallery').each(function() {
            var curGallery = $(this);
            curGallery.data('curIndex', 0);
            curGallery.find('.photo-gallery-prev').html(curGallery.find('.photo-gallery-item:last').find('.photo-gallery-item-title span').html());
            curGallery.find('.photo-gallery-next').html(curGallery.find('.photo-gallery-item').eq(1).find('.photo-gallery-item-title span').html());
        });

        $('.photo-gallery-next').click(function(e) {
            var curGallery = $('.photo-gallery');
            var curIndex = curGallery.data('curIndex');
            curIndex++;
            if (curIndex > curGallery.find('.photo-gallery-item').length - 1) {
                curIndex = 0;
            }
            curGallery.data('curIndex', curIndex);
            curGallery.find('.photo-gallery-item.active').removeClass('active');
            curGallery.find('.photo-gallery-item').eq(curIndex).addClass('active');

            var nextIndex = curIndex + 1;
            if (nextIndex > curGallery.find('.photo-gallery-item').length - 1) {
                nextIndex = 0;
            }

            var prevIndex = curIndex - 1;
            if (prevIndex < 0) {
                prevIndex = curGallery.find('.photo-gallery-item').length - 1;
            }

            curGallery.find('.photo-gallery-prev').html(curGallery.find('.photo-gallery-item').eq(prevIndex).find('.photo-gallery-item-title span').html());
            curGallery.find('.photo-gallery-next').html(curGallery.find('.photo-gallery-item').eq(nextIndex).find('.photo-gallery-item-title span').html());

            e.preventDefault();
        });

        $('.photo-gallery-prev').click(function(e) {
            var curGallery = $('.photo-gallery');
            var curIndex = curGallery.data('curIndex');
            curIndex--;
            if (curIndex < 0) {
                curIndex = curGallery.find('.photo-gallery-item').length - 1;
            }
            curGallery.data('curIndex', curIndex);
            curGallery.find('.photo-gallery-item.active').removeClass('active');
            curGallery.find('.photo-gallery-item').eq(curIndex).addClass('active');

            var nextIndex = curIndex + 1;
            if (nextIndex > curGallery.find('.photo-gallery-item').length - 1) {
                nextIndex = 0;
            }

            var prevIndex = curIndex - 1;
            if (prevIndex < 0) {
                prevIndex = curGallery.find('.photo-gallery-item').length - 1;
            }

            curGallery.find('.photo-gallery-prev').html(curGallery.find('.photo-gallery-item').eq(prevIndex).find('.photo-gallery-item-title span').html());
            curGallery.find('.photo-gallery-next').html(curGallery.find('.photo-gallery-item').eq(nextIndex).find('.photo-gallery-item-title span').html());

            e.preventDefault();
        });

        $('.infrastructure-map').maphilight();

        $('body').on('mouseover', '.infrastructure-container area', function(e) {
            var curIndex = $('.infrastructure-container area').index($(this));
            var curLeft = e.pageX - $('.infrastructure-container .infrastructure-map').offset().left;
            var curTop = e.pageY - $('.infrastructure-container').offset().top;
            $('.infrastructure-map-section-list').eq(curIndex).removeClass('infrastructure-map-section-list-left').show().css({'left': curLeft, 'top': curTop});
            if ($('.infrastructure-map-section-list-wrap').eq(curIndex).offset().left < $('.infrastructure-container .infrastructure-map').offset().left) {
                $('.infrastructure-map-section-list').eq(curIndex).addClass('infrastructure-map-section-list-left');
            }
        });

        $('body').on('mousemove', '.infrastructure-container area', function(e) {
            var curIndex = $('.infrastructure-container area').index($(this));
            var curLeft = e.pageX - $('.infrastructure-container .infrastructure-map').offset().left;
            var curTop = e.pageY - $('.infrastructure-container').offset().top;
            $('.infrastructure-map-section-list').eq(curIndex).removeClass('infrastructure-map-section-list-left').show().css({'left': curLeft, 'top': curTop});
            if ($('.infrastructure-map-section-list-wrap').eq(curIndex).offset().left < $('.infrastructure-container .infrastructure-map').offset().left) {
                $('.infrastructure-map-section-list').eq(curIndex).addClass('infrastructure-map-section-list-left');
            }
        });

        $('body').on('mouseout', '.infrastructure-container area', function(e) {
            $('.infrastructure-map-section-list').hide();
        });

        $('.infrastructure-map-section-list-progress').each(function() {
            var curBlock = $(this);
            var curMax = Number(curBlock.find('.infrastructure-map-section-list-progress-max').html());
            var curCurrent = Number(curBlock.find('.infrastructure-map-section-list-progress-current').html());
            var curLimit = Number(curBlock.find('.infrastructure-map-section-list-progress-limit').html());
            var curProcent = curCurrent / curMax * 100;
            curBlock.find('.infrastructure-map-section-list-progress-text span').html(curCurrent);
            curBlock.find('.infrastructure-map-section-list-progress-bar-status').width(curProcent + '%');

            if (curProcent < curLimit) {
                curBlock.find('.infrastructure-map-section-list-progress-bar').addClass('red');
            }
        });

        $('.mortgage-menu-list-inner').slick({
            infinite: false,
            slidesToShow: 3,
            slidesToScroll: 3,
            arrows: false,
            dots: true
        });

        $('body').on('click', '.mortgage-menu-item a', function(e) {
            var curLink = $(this);
            var curItem = curLink.parent().parent();
            if (!curItem.hasClass('active')) {
                $('.mortgage-menu-item.active').removeClass('active');
                curItem.addClass('active');

                $('.mortgage-content').html('<div class="loading"><div class="loading-text">Загрузка данных</div></div>').show();
                $.ajax({
                    type: 'POST',
                    url:  curLink.attr('href'),
                    dataType: 'html',
                    cache: false
                }).done(function(html) {
                    $('.mortgage-content').html(html);

                    $('.mortgage-results-form input.maskPhone').mask('+7 (999) 999-99-99');

                    $('.mortgage-results-form form').each(function() {
                        $(this).validate({
                            ignore: '',
                            submitHandler: function(form) {
                                $(form).append('<div class="loading"><div class="loading-text">Отправка данных</div></div>');
                                $.ajax({
                                    type: 'POST',
                                    url: $(form).attr('action'),
                                    data: $(form).serialize() + '&' + $('.mortgage-params form').serialize(),
                                    dataType: 'html',
                                    cache: false
                                }).done(function(html) {
                                    $(form).find('.loading').remove();
                                    $(form).append(html);
                                });
                            }
                        });
                    });
                });
            } else {
                curItem.removeClass('active');

                $('.mortgage-content').html('').hide();
            }
            e.preventDefault();
        });

        $('body').on('click', '.mortgage-results-form .detail-link', function(e) {
            var curBlock = $(this).parent();
            if (curBlock.hasClass('open')) {
                curBlock.removeClass('open');
            } else {
                $('.mortgage-results-form.open').removeClass('open');
                curBlock.addClass('open');
                curBlock.find('.message-success').remove();
            }
            e.preventDefault();
        });

        $(document).click(function(e) {
            if ($(e.target).parents().filter('.mortgage-results-form').length == 0) {
                $('.mortgage-results-form.open').removeClass('open');
            }
        });

        $('body').on('click', '.mortgage-results-form-close, .mortgage-results-form-close-link', function(e) {
            $('.mortgage-results-form.open').removeClass('open');
            e.preventDefault();
        });

        $('body').on('click', '.euro-item-title a, .euro-item-preview-inner a', function(e) {
            $.ajax({
                type: 'POST',
                url: $(this).attr('href'),
                dataType: 'html',
                cache: false
            }).done(function(html) {
                if ($('.window').length > 0) {
                    windowClose();
                }
                windowOpen(html);
            });
            e.preventDefault();
        });

        $('.new-plans-side-list').jScrollPane({autoReinitialise: true});

        $('.new-plans-detail-compare a').click(function(e) {
            $(this).parent().toggleClass('swap');
            e.preventDefault();
        });

        $('.rules-item a').click(function(e) {
            var curBlock = $($(this).attr('href'));
            if (curBlock.length > 0) {
                if (curBlock.hasClass('active')) {
                    curBlock.removeClass('active');
                    $('.rules-item a').removeClass('active');
                } else {
                    $('.rules-detail.active').removeClass('active');
                    curBlock.addClass('active');
                    $('.rules-item a.active').removeClass('active');
                    $(this).addClass('active');
                }
                e.preventDefault();
            }
        });

        $('body').on('click', 'tr[data-href]', function() {
            window.location = $(this).attr('data-href');
        });

        $('body').on('mouseover', 'tr[data-href] a', function() {
            $('body').off('click', 'tr[data-href]');
        });

        $('body').on('mouseout', 'tr[data-href] a', function() {
            $('body').on('click', 'tr[data-href]', function() {
                window.location = $(this).attr('data-href');
            });
        });

    });

    function windowOpen(contentWindow) {
        var windowWidth     = $(window).width();
        var windowHeight    = $(window).height();
        var curScrollTop    = $(window).scrollTop();
        var curScrollLeft   = $(window).scrollLeft();

        var bodyWidth = $('body').width();
        $('body').css({'height': windowHeight, 'overflow': 'hidden'});
        var scrollWidth =  $('body').width() - bodyWidth;
        $('body').css({'padding-right': scrollWidth + 'px'});
        $(window).scrollTop(0);
        $(window).scrollLeft(0);
        $('body').css({'margin-top': -curScrollTop});
        $('body').data('scrollTop', curScrollTop);
        $('body').css({'margin-left': -curScrollLeft});
        $('body').data('scrollLeft', curScrollLeft);

        $('body').append('<div class="window"><div class="window-overlay"></div><div class="window-loading"></div><div class="window-container window-container-load"><div class="window-content">' + contentWindow + '<a href="#" class="window-close"></a></div></div></div>')

        if ($('.window-container img').length > 0) {
            $('.window-container img').each(function() {
                $(this).attr('src', $(this).attr('src'));
            });
            $('.window-container').data('curImg', 0);
            $('.window-container img').load(function() {
                var curImg = $('.window-container').data('curImg');
                curImg++;
                $('.window-container').data('curImg', curImg);
                if ($('.window-container img').length == curImg) {
                    $('.window-loading').remove();
                    $('.window-container').removeClass('window-container-load');
                    windowPosition();
                    if ($('.window-euro-compare').length > 0) {
                        windowPosition();
                    }
                }
            });
        } else {
            $('.window-loading').remove();
            $('.window-container').removeClass('window-container-load');
            windowPosition();
        }

        $('.window-overlay').click(function() {
            windowClose();
        });

        $('.window-close, .window-close-bottom').click(function(e) {
            windowClose();
            e.preventDefault();
        });

        $('body').bind('keyup', keyUpBody);

        $('.window input.maskPhone').mask('+7 (999) 999-99-99');

        $('.window form').validate({
            ignore: '',
            invalidHandler: function(form, validatorcalc) {
                validatorcalc.showErrors();

                $('.form-checkbox').each(function() {
                    var curField = $(this);
                    if (curField.find('input.error').length > 0) {
                        curField.addClass('error');
                    } else {
                        curField.removeClass('error');
                    }
                });
            },
            submitHandler: function(form) {
                $(form).append('<div class="loading"><div class="loading-text">Отправка данных</div></div>');
                $.ajax({
                    type: 'POST',
                    url: $(form).attr('action'),
                    data: $(form).serialize(),
                    dataType: 'html',
                    cache: false
                }).done(function(html) {
                    $(form).find('.loading').remove();
                    $(form).append(html);
                });
            }
        });

    }

    function windowPosition() {
        var windowWidth     = $(window).width();
        var windowHeight    = $(window).height();

        if ($('.window-container').width() > windowWidth - 40) {
            $('.window-container').css({'left': 20, 'margin-left': 0});
            $('.window-overlay').width($('.window-container').width() + 40);
        } else {
            $('.window-container').css({'left': '50%', 'margin-left': -$('.window-container').width() / 2});
            $('.window-overlay').width('100%');
        }

        if ($('.window-container').height() > windowHeight - 40) {
            $('.window-overlay').height($('.window-container').height() + 40);
            $('.window-container').css({'top': 20, 'margin-top': 0});
        } else {
            $('.window-container').css({'top': '50%', 'margin-top': -$('.window-container').height() / 2});
            $('.window-overlay').height('100%');
        }
    }

    function keyUpBody(e) {
        if (e.keyCode == 27) {
            windowClose();
        }
    }

    function windowClose() {
        $('body').unbind('keyup', keyUpBody);
        $('.window').remove();
        $('body').css({'height': '100%', 'overflow': 'visible', 'padding-right': 0, 'margin': 0});
        $(window).scrollTop($('body').data('scrollTop'));
        $(window).scrollLeft($('body').data('scrollLeft'));
    }

    $(window).resize(function() {
        if ($('.window').length > 0) {
            var windowWidth     = $(window).width();
            var windowHeight    = $(window).height();
            var curScrollTop    = $(window).scrollTop();
            var curScrollLeft   = $(window).scrollLeft();

            $('body').css({'height': '100%', 'overflow': 'visible', 'padding-right': 0, 'margin': 0});
            var bodyWidth = $('body').width();
            $('body').css({'height': windowHeight, 'overflow': 'hidden'});
            var scrollWidth =  $('body').width() - bodyWidth;
            $('body').css({'padding-right': scrollWidth + 'px'});
            $(window).scrollTop(0);
            $(window).scrollLeft(0);
            $('body').data('scrollTop', 0);
            $('body').data('scrollLeft', 0);

            windowPosition();
        }
    });

    $(window).bind('load resize', function() {
        $('.page-404-container').each(function() {
            $(this).css({'height': $(window).height() - 40 - $('footer').height() + 1})
        });

        resizeVideo();

        $('.infrastructure-detail').each(function() {
            $(this).css({'height': $(window).height()});
            if ($('#map').length > 0) {
                if (myMap) {
                    myMap.container.fitToViewport();
                }
            }
        });

        $('.photo-gallery-item').each(function() {
            var curSlider = $(this);
            curSlider.find('.photo-gallery-content li:first').css({'margin-left': 0});
            curSlider.find('.photo-gallery-ctrl a').removeClass('active');
            curSlider.find('.photo-gallery-ctrl a:first').addClass('active');
        });

    });

    function resizeVideo() {
        $('.slider').each(function() {
            var maxHeight = 800;

            var curWidth = $('.slider').width() + 20;
            var curHeight = curWidth * .5625;
            if (curHeight < maxHeight) {
                curHeight = maxHeight;
                curWidth = curHeight / .5625;
            }
            $('.slider video').css({'width': curWidth, 'height': curHeight, 'left': '50%', 'top': '50%', 'margin-left': -curWidth / 2, 'margin-top': -curHeight / 2});
        });
    }

    $(window).bind('load resize scroll', function() {
        if (!stopUserVideo && !stopScrollGallery) {
            if ($(window).scrollTop() > $('.slider').outerHeight() - 300) {
                stopScrollVideo = true;
                $('.slider-preview ul li.play a').click();
            } else {
                if (stopScrollVideo && !stopUserVideo) {
                    stopScrollVideo = false;
                    $('.slider-preview ul li.active a').click();
                }
            }
        }

        $('.flat-header').each(function() {
            var curHeight = $('.footer-inner').offset().top - $(window).height() - $(window).scrollTop();
            if (curHeight < 0) {
                $(this).css({'bottom': -curHeight});
            } else {
                $(this).css({'bottom': 0});
            }
        });
    });

})(jQuery);

function initForm() {
    $('input.maskPhone').mask('+7 (999) 999-99-99');

    $('.form-select select').chosen({disable_search: true, no_results_text: 'Нет результатов'});
    $(window).resize(function() {
        $('.form-select select').chosen('destroy');
        $('.form-select select').chosen({disable_search: true, no_results_text: 'Нет результатов'});
    });

    $('.form-checkbox span input:checked').parent().parent().addClass('checked');
    $('.form-checkbox').click(function() {
        $(this).toggleClass('checked');
        $(this).find('input').prop('checked', $(this).hasClass('checked')).trigger('change');
    });

    $('.form-radio span input:checked').parent().parent().addClass('checked');
    $('.form-radio').click(function() {
        var curName = $(this).find('input').attr('name');
        $('.form-radio input[name="' + curName + '"]').parent().parent().removeClass('checked');
        $(this).addClass('checked');
        $(this).find('input').prop('checked', true).trigger('change');
    });

    $('.form-file input').change(function() {
        var curInput = $(this);
        var curField = curInput.parent().parent();
        curField.find('.form-file-name').html(curInput.val().replace(/.*(\/|\\)/, ''));
        curField.find('label.error').remove();
        curField.removeClass('error');
    });

    $('form').each(function() {
        if ($(this).hasClass('ajaxForm')) {
            $(this).validate({
                ignore: '',
                invalidHandler: function(form, validatorcalc) {
                    validatorcalc.showErrors();

                    $('.form-checkbox').each(function() {
                        var curField = $(this);
                        if (curField.find('input.error').length > 0) {
                            curField.addClass('error');
                        } else {
                            curField.removeClass('error');
                        }
                    });
                },
                submitHandler: function(form) {
                    $(form).append('<div class="loading"><div class="loading-text">Отправка данных</div></div>');
                    $.ajax({
                        type: 'POST',
                        url: $(form).attr('action'),
                        data: $(form).serialize(),
                        dataType: 'html',
                        cache: false
                    }).done(function(html) {
                        $(form).find('.loading').remove();
                        $(form).append(html);
                    });
                }
            });
        } else {
            $(this).validate({
                ignore: '',
                invalidHandler: function(form, validatorcalc) {
                    validatorcalc.showErrors();

                    $('.form-checkbox').each(function() {
                        var curField = $(this);
                        if (curField.find('input.error').length > 0) {
                            curField.addClass('error');
                        } else {
                            curField.removeClass('error');
                        }
                    });
                }
            });
        }
    });
}