$(function(){
    
    var curIndex = 0;
    var maxIndex = Math.ceil($('.galeria img').length-1) ;
    var sigle = $('.galeria img')

    galeriaON();
    

    function galeriaON(){
       
       $('.galeria img').css('width','80%')
       $('.galeria img').eq(curIndex).show()

       $('.arrow-right').click(function(){
        if( curIndex < maxIndex){
            curIndex++;
            $('.galeria img').eq(curIndex).show();
            $('.galeria img').eq(curIndex-1).hide();
        }

        
          
       })

       $('.arrow-left').click(function(){
        if( curIndex > 0){
            curIndex--;
            $('.galeria img').eq(curIndex).show();
            $('.galeria img').eq(curIndex+1).hide();
        }

        
          
       })

       

       }


    
});