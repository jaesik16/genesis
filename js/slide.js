(function($){ //매개변수 파라미터
    // 즉시표현함수는 제이쿼리 달러 사인기호의 
    // 외부 플러그인(라이브러리)와 충돌을 피하기 위해 사용하는 함수식
    
    
    //객체(Object) 선언 {}: 섹션별 변수 중복을 피할 수 있다
    // const obj = new Object(); // 객체 생성자 방식 권장
    //       obj= {}
    const obj = { // 객체 리터럴 방식
        init(){ // 대표 메서드
                this.header();
                this.section1();
                this.section2();
                this.section3();
        },
        header(){},
        section1(){
            let cnt=0;
            let setId=0;
            let winW = $(window).innerWidth();
            const slideContainer = $('#section1 .slide-container');
            const slideWrap = $('#section1 .slide-wrap');
            const slideView = $('#section1 .slide-view');
            const slideImg = $('#section1 .slide img');
            const pageBtn = $('#section1 .page-btn');
            const n = ($('#section1 .slide').length-2)-1;
            const stopBtn = $('#section1 .stop-btn');
            const playBtn = $('#section1 .play-btn');
            const imgRate = 1.3452443510246979; //slideImg.innerWidth() / winW; // 창너비(1903)대한 이미지(2560) 비율 2560 / 1903
            const imgTranRate = 0.1265625; // 이미지(2560)크기에 대한 -translateX(-값)비율 : 324/2560 transform: translateX(-324px);




            // 이미지 크기 조절 => 창 크기에 반응하는 이미지 크기
            //transform: translateX(-324px);

            let x = (imgRate * winW) * imgTranRate
            slideImg.css({width: imgRate * winW,transform: `translateX(${-x}px)` });




            // 창크기에 반응하는 이미지 크기와 트랜스레이트x
            // 크기가 1px만 변경돼도 즉각 반응
            $(window).resize(function(){
                winW = $(window).innerWidth();
                x = (imgRate * winW) * imgTranRate;
                slideImg.css({width: imgRate * winW,transform: `translateX(${-x}px)` });
            });



            // 이미지를 반응형 => 비율계산
            // 이미지 비율  = 이미지너비(2500)
            // 1.313715187 = 2500 /1903
            // 윈도우너비 = $(window).innerWidth();
            // 이미지크기 = 창너비(반응형크기) * 비율(1.313715187)
            

            // 0. 메인슬라이드 터치스와이프
            // 마우스다운 => 터치시작
            // 마우스업 => 터치끝
            // 화면의 왼쪽 끝이 0이고 오른쪽 끝이 1920
            //방향잡기
            let mouseDown = null ;
            let mouseUp = null ;



            // 드래그 시작
            // 드래그 끝
            let dragStart = null;
            let dragEnd = null;
            let mDown = false; 
            let sizeX = winW/2; //드래그의길이


            // 터치 스와이프 이벤트
            slideContainer.on({
                mousedown(e){
                    winW = $(window).innerWidth(); // 마우스 다운하면 창너비 가져오기
                    sizeX = winW/2
                    mouseDown = e.clientX;
                    // 슬라이드랩퍼박스 좌측 좌표값
                    // 계속 드래그시 슬라이드 박스 좌측값 
                    dragStart = e.clientX - (slideWrap.offset().left + winW);
                    mDown = true
                    slideView.css({cursor:'grabbing'}); //잡는다
                },
                mouseup(e){
                    mouseUp = e.clientX;
                    mDown = false;
                    if(mouseDown-mouseUp > sizeX){
                        clearInterval(setId);
                        if(!slideWrap.is(':animated')){
                            nextCount();
                        }
                    }
                    if(mouseDown-mouseUp < -sizeX){
                        clearInterval(setId);
                        if(!slideWrap.is(':animated')){
                            preCount();
                        }
                    }
                    if( mouseDown-mouseUp>=-sizeX && mouseDown-mouseUp<=sizeX){
                        mainSlide();

                    }
                    slideView.css({cursor:'grab'});//놓는다
                },
                mousemove(e){
                    if(mDown!==true){ //마우스 다운이 있어야 드래그 가능
                        return;
                    }
                    dragEnd = e.clientX;
                    slideWrap.css({left: dragEnd-dragStart });

                }
            });
            // slideContainer 영역을 벗어나면 mouseup의 예외처리
            $(document).on({
                mouseup(e){
                    if(!mDown){ //마우스 다운상태에서 마우스업이 실행이 안된상태에서만 실행해라
                        return;
                    }
                    mouseUp = e.clientX;
                    mDown = false;
                    if(mouseDown-mouseUp > sizeX){
                        clearInterval(setId);
                        if(!slideWrap.is(':animated')){
                            nextCount();
                        }
                    }
                    if(mouseDown-mouseUp < -sizeX){
                        clearInterval(setId);
                        if(!slideWrap.is(':animated')){
                            preCount();
                        }
                    }
                    if( mouseDown-mouseUp>=-sizeX && mouseDown-mouseUp<=sizeX){
                        mainSlide();

                    }
                }
            })

            mainSlide();
            //1. 메인슬라이드함수
            function mainSlide(){
                slideWrap.stop().animate({left: `${-100*cnt}%`},600,'easeInOutExpo',function(){
                    if(cnt>n){cnt=0};
                    if(cnt<0){cnt=n};
                    slideWrap.stop().animate({left: `${-100*cnt}%`},0);
                });
                pageEvent();
            }
            


            //2-1. 다음카운트함수
            function nextCount(){
                cnt++;
                mainSlide();

            }
            //2-2. 이전카운트함수
            function preCount(){
                cnt--;
                mainSlide();

            }



            //3. 자동타이머함수(7초후 7초 간격)
            function autoTimer(){
               setId = setInterval(nextCount,7000)
            }
            //autoTimer();

            // 4. 페이지 이벤트 함수
            function pageEvent(){
                pageBtn.removeClass('on')
                pageBtn.eq(cnt>n?0:cnt).addClass('on')
            }

            // 5. 페이지버튼클릭
            pageBtn.each(function(idx){
                $(this).on({
                    click(e){
                        e.preventDefault();
                        cnt=idx;
                        mainSlide();
                        clearInterval(setId); //클릭시 일시중지
                    }
                })
            })

            // 6-1 스톱 버튼 클릭이벤트
            stopBtn.on({
                click(e){
                    e.preventDefault();
                    stopBtn.addClass('on');
                    playBtn.addClass('on');
                    clearInterval(setId); //클릭시 일시중지
                }
            })

            // 6-2 & 플레이 버튼 클릭이벤트
            playBtn.on({
                click(e){
                    e.preventDefault();
                    stopBtn.removeClass('on');
                    playBtn.removeClass('on');
                    autoTimer(); //클릭시 재실행
                }
            })
            
        },
        section2(){
            // 0. 변수 설정
            let cnt = 0;
            const section2Container = $('#section2 .container');
            const slideContainer = $('#section2 .slide-container');
            const slideWrap = $('#section2 .slide-wrap');
            const slideView = $('#section2 .slide-view');
            const slide = $('#section2 .slide-view .slide');
            const slideH3 = $('#section2 .slide-view .slide h3');
            const slideH4 = $('#section2 .slide-view .slide h4');
            const pageBtn = $('#section2 .page-btn');
            const selectBtn = $('#section2 .select-btn');
            const subMenu = $('#section2 .sub-menu');
            const materialIcons = $('#section2 .select-btn .material-icons');
            const heightRate = 0.884545392; //너비에 대한 높이 비율 초기


            // 터치스와이프
            let touchStart = null;
            let touchEnd = null;

            //드래그시작
            //드래그끝
            let dragStart = null;
            let dragEnd = null;
            let mDown = false; 
            let sizeX = 300;
            let offsetLeft = slideWrap.offset().left;
            let winW = $(window).innerWidth();
            let sildeWidth = (section2Container.innerWidth()-198+20+20)/3;
            
            resizeFn(); //로딩시 실행
            // 함수는 명령어의 묶음
            function resizeFn(){
                winW = $(window).innerWidth();// 창크기 계속 값을 보여준다.
                // 창 너비(window)가 1642px이하에서 패딩레프트 좌측 값 0으로 설정하기
                if(winW<=1642){
                    // 1280 이하 에서는 슬라이드 1개
                    // 1280 초과 에서는 슬라이드 3개
                    if(winW>1280){
                        sildeWidth = (section2Container.innerWidth()+20+20)/3;
                    }
                    else{
                        sildeWidth = (section2Container.innerWidth()+20+20)/1;
                    }
                }
                else{ //이하 winW<=1642
                    sildeWidth = (section2Container.innerWidth()-198+20+20)/3;
                }
                slideWrap.css({width:sildeWidth*10 });
                slide.css({width:sildeWidth, height: sildeWidth*heightRate });
                slideH3.css({fontSize:sildeWidth*0.07});
                slideH4.css({fontSize:sildeWidth*0.03});
                mainSlide(); //슬라이드 너비 전달하기 위해서 호출
            };


            // 가로 세로 크기가 1픽셀만 이라도 변경되면 동작 구동(실행)이 된다.
            // 가로 세로 크기가 변경이 안되면 영원히 그대로 구동이 없다.
            $(window).resize(function(){
                resizeFn();
            });

            




            slideContainer.on({
                mousedown(e){
                    touchStart = e.clientX;
                    dragStart = e.clientX - (slideWrap.offset().left - offsetLeft);
                    mDown = true;
                    slideView.css({cursor:'grabbing'});

                },
                mouseup(e){
                    touchEnd = e.clientX;
                    mDown = false;
                    if(touchStart-touchEnd > sizeX){
                        nextCount();
                    }
                    if(touchStart-touchEnd < -sizeX){
                        preCount();
                    }
                    if( touchEnd-touchStart>=-sizeX && touchEnd-touchStart<=sizeX){
                        mainSlide();

                    }
                    slideView.css({cursor:'grab'});
                },
                mousemove(e){
                    dragEnd=e.clientX;
                    if(!mDown){
                        return;
                    }
                    slideWrap.css({left : dragEnd - dragStart});
                }
            });
            $(document).on({
                mouseup(e){
                    //mDown = true 상태에서
                    //mouseup 에서 mDown = false; 변경
                    // 그러면 이미 실행한거임
                    if(!mDown){ //마우스 다운상태에서 마우스업이 실행이 안된상태에서만 실행해라
                        return;
                    }
                    touchEnd = e.clientX;
                    mDown = false;
                    if(touchStart-touchEnd > sizeX){
                        nextCount();
                    }
                    if(touchStart-touchEnd < -sizeX){
                        preCount();
                    }
                    if( touchEnd-touchStart>=-sizeX && touchEnd-touchStart<=sizeX){
                        mainSlide();

                    }
                    slideView.css({cursor:'grab'});
                }
            })





            // 셀렉트버튼클릭이벤트
            // 셀렉트 버튼 한번 클릭하면 서브메뉴보이고
            // 셀렉트 버튼 또 한번클릭하면 서브메뉴 숨긴다
            // 토글
            selectBtn.on({
                click(e){
                    e.preventDefault();
                    subMenu.toggleClass('on'); //서브메뉴
                    materialIcons.toggleClass('on'); //아이콘
                }
            });
            subMenu.on({
                click(e){
                    e.preventDefault();

                }
            });
            
            


            // 1.메인슬라이드함수
            mainSlide();
            function mainSlide(){
                slideWrap.stop().animate({left: -sildeWidth * cnt},600,'easeInOutExpo');
                pageBtnEvent();
            }

            // 다음카운트함수
            function nextCount(){
                cnt++;
                if(cnt>7){cnt=7;}
                mainSlide();

            }

            // 이전카운트함수
            function preCount(){
                cnt--;
                if(cnt<0){cnt=0;}
                mainSlide();

            }
            

            
            // 2.페이지버튼 클릭이벤트
            pageBtn.each(function(idx){
                $(this).on({
                    click(e){
                        e.preventDefault();
                        cnt=idx;
                        mainSlide();
                    }
                })
            })


            // 3. 페이지버튼 이벤트 함수
            function pageBtnEvent(){
                pageBtn.removeClass('on')
                pageBtn.eq(cnt).addClass('on')
            };

            // 4.



            
        },
        section3(){}
    }  
    obj.init();
    

})(jQuery); //전달인수 아규먼트



