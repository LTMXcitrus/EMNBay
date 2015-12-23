/**
 * Created by Matthieu on 09/12/2015.
 */
$('div#navbar ul li').on('click',function(){
    $('div#navbar ul li').removeClass('active');
    if($(this).hasClass('active')){
        $(this).removeClass('active');
    }
    else{
        $(this).addClass('active');
    }
});