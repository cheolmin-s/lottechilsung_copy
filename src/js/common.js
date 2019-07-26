var init = (function(){

    var $win = $(window);
    var $html = $('html,body');

    //헤더 
    var gnbActive = function(){

        var $header = $('.common-header');
        var $depth1Link = $('.depth1 > li > a');
        var $newsFeed = $('.news-feed > button');
        var $directLink = $('.direct a')

        $depth1Link.on('mouseenter focus', function(){
            $header.addClass('on');
        });

        $header.on('mouseleave', function(){
            $header.removeClass('on');
        });

        $directLink.last().on('focus', function(){
            $header.addClass('on');
        });

        $newsFeed.on('blur', function(){
            $header.removeClass('on');
        });

        $html.on('mousewheel',function(e){
            
            var delta = e.originalEvent.wheelDelta;

            if( delta === 120) {
                $header.css('transform','translateY(0)');
            } else {
                $header.css('transform','translateY(-100px)');
            }
        });

        $win.on('scroll', function(){

            var st = $html.scrollTop();

            if( st === 0 ){
                $header.css('transform','translateY(0)');
            }
        });
    };

    //메인 비주얼 슬라이더
    var mainSlider = function(){

        var $slider = $('.main-banner .slider');
        var $btn = $('.toggle-btn button');

        $slider.touchSlider({
            controls:false,
            btn_prev:$('.main-banner .btn-prev'),
            btn_next:$('.main-banner .btn-next'),
            autoplay : {
                enable: true,
                pauseHover: false,
                addHoverTarget:'',
                interval: 5000
            },
            speed:400,
            counter: function(e) {
                $('.main-banner p').removeClass('on');
                $('.main-banner .list[aria-hidden="false"]').find('p').addClass('on');
            },
            
        });

        //슬라이더 재생/정지 버튼
        $btn.on('click', function(){

            var $this = $(this);

            if( $btn.hasClass('on') ){
                $slider[0].autoPlay();
                $this.removeClass('on').text('슬라이더 일시정지');
                
            } else {
                $slider[0].autoStop();
                $this.addClass('on').text('슬라이더 재생');
            }
        });
    };

    //BRAND 탭메뉴
    var brandTab = function(){

        var $tab = $('.brand .tab');
        var $panel = $('.brand .panel');
        var $circle = $('.circle');

        $tab.on('click', tabEvent);
        $tab.on('keydown', tabKeyEvent);

        function tabEvent(e){

            e.stopPropagation();

            var current = e.currentTarget;

            tab(current);
            tabPanel(current);
            circle(current);
        }

        function tab(tab){
            $(tab)
                .addClass('on')
                .attr({ 'tabindex': '0', 'aria-selected':'true' })
                .focus()
                .parent()
                .siblings()
                .find($tab)
                .removeClass('on')
                .attr({ 'tabindex': '-1', 'aria-selected':'false' })                                
        };

        function tabPanel(panel){
            $('#' + panel.getAttribute('aria-controls'))
                .attr({ tabindex:'0' })
                .prop({ 'hidden': false })
                .addClass('on')
                .siblings($panel)
                .attr({ 'tabindex': '-1' })
                .prop({ 'hidden': true })
                .removeClass('on')
        };

        function tabKeyEvent(e){

            e.stopPropagation();

            var keyCode = e.keycode || e.which;
            var $target =  e.target.parentElement;

           switch(keyCode){

                case 37:
                    if($target.previousElementSibling){
                        $(e.target)
                            .attr({'tabindex':'-1'})
                            .parent()
                            .prev()
                            .children()                       
                            .attr({'tabindex':'0'})                            
                            .focus()
                    } else {
                        $(e.target)
                            .attr({ 'tabindex':'-1' })                    
                            .parent()
                            .siblings(':last')
                            .children()
                            .attr({ 'tabindex':'0' })                            
                            .focus()                            
                    } break;

                case 39:
                    if($target.nextElementSibling){
                        $(e.target)
                            .attr({ 'tabindex':'-1' })                            
                            .parent()
                            .next()
                            .children()
                            .attr({ 'tabindex':'0' })                            
                            .focus()
                    } else {
                        $(e.target)
                            .attr({ 'tabindex':'-1' })                            
                            .parent()
                            .siblings(':first')
                            .children()
                            .attr({ 'tabindex':'0' })                            
                            .focus()                            
                    } break;

                case 32:
                case 13:
                    e.preventDefault();

                    tab(e.target);
                    tabPanel(e.target);
                    circle(e.target);
                    break;  
           }

        }

        function circle(circle){
            
            var $this = $(circle);
            var $width = $this.width() / 2;
            var offset = $this.position().left + $width - 5;
            
            $circle.stop().animate({ left : offset },200);
        }

        $('.tab-menu li:first-of-type .tab')
            .addClass('on')
            .attr({ 'tabindex': '0', 'aria-selected':'true' })
            .parent()
            .siblings()
            .find($tab)
            .attr({ 'tabindex': '-1', 'aria-selected':'false' })
        ;
        
        $('.panel:first-of-type')
            .attr({ tabindex:'0' })
            .prop({ 'hidden': false })
            .addClass('on')
            .siblings($panel)
            .attr({ 'tabindex': '-1' })
            .prop({ 'hidden': true })
            .removeClass('on')
        ;
    };

    //recruit 슬라이더
    var reruitSlider = function(){

        var $slider = $('.recruit .slider');

        $slider.touchSlider({
            resize: false,
            controls: false,
        });
    };

    //섹션 sticky 스크롤 효과
    var stickyScroll = function(){

        var $title = $('.scroll-sticky');
        var $box = $('.position');

        $win.on('scroll', function(){

            var st = $win.scrollTop();

            $box.each(function(){

                var $this = $(this);
                var index = $this.siblings('.scroll-sticky').index('.scroll-sticky');
                var offset = $this.offset().top - 400;

                if( st >= offset ){
                    $title.eq(index).addClass('on');
                } else {
                    $title.eq(index).removeClass('on');
                }

            });

            

        });

        
    };

    //푸터 셀렉트박스
    var footerSelect = function(){

        var $select = $('.common-footer .select');
        var $selectBtn = $('.common-footer .select button');
        var $box = $('.common-footer .select ul');
        var $option = $('.common-footer .select a');
        var $linkBtn = $('.common-footer .link-btn');


        $selectBtn.on('click',function(){

            if( $box.hasClass('on') ){

                $box.removeClass('on');
                $select.css('height',40);

            } else {

                $box.addClass('on');
                $select.css('height',420);

            }
        });

        $option.on('click',function(e){
            
            e.preventDefault();

            var $this = $(this);
            var text = $this.text();
            var val = $this.attr('data-val');

            $box.removeClass('on');
            $select.css('height',40);
            $selectBtn.text(text);
            $linkBtn.attr('href',val)
        });
    };

    //TOP 버튼
    var topBtn = function(){

        var $btn = $('.top-btn button');

        $win.on('scroll', function(){

            var st = $win.scrollTop();

            if ( st >= 1){
                $btn.fadeIn(500);
            } else {
                $btn.fadeOut(500);
            }
        });

        $btn.on('click', function(){

            var offset = $html.offset().top;

            $html.stop().animate({ scrollTop : offset }, 500);;
        });

    };

    //실행
    gnbActive();
    mainSlider();
    brandTab();
    reruitSlider();
    stickyScroll();
    footerSelect();
    topBtn();
});

//실행
$(init);