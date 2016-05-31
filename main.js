
   var friendsList1 = document.getElementById('friends-list1');
   var friendsList2 = document.getElementById('friends-list2');
   
   VK.init({
        apiId: 5376627
    });

    VK.Auth.login(function(response) {
        if (response.session) {
            console.log('авторизация прошла успешно');
        } else {
            console.log('ошибка авторизации');
        }
    },2);

    VK.api('friends.get', {'fields': 'photo_50'} , function(response){   
        if (response.error) {
            reject(new Error(response.error.error_msg));
        } 
        else {                            
            /*Шаблон первого списка */
            var source = ItemTemplate.innerHTML,
            templateFn = Handlebars.compile(source),
            template = templateFn({list: response.response}); // шаблон заполняется полученным списком друзей 
            friendsList1.innerHTML = template; 
            /*Шаблон второго списка*/
            var source2 = ItemTemplate2.innerHTML,
            templateFn2 = Handlebars.compile(source2);
            var seclist = [];
            
            search1.addEventListener('keyup', function(){
               
                var newresponse = mySearch(response.response, search1.value );    // поиск. передаем в шаблон значение нового списка                 
                template = templateFn({list: newresponse});
                friendsList1.innerHTML = template;                      
            });

            friendsList1.addEventListener('click', function(e){    // перенос друга в соседний список     
               var tag = e.target.parentNode.firstElementChild.nextElementSibling.innerHTML; // имя друга по которому произошел клик            
               var newtag = myFilter(response.response, tag.trim()); //возвращяет новый список, за исключение контакта по которому был произведен клик.
               template = templateFn({list: newtag.ret}); // шаблон заполняется новым списком. В списке нет контакта по которуму произведен клик
               friendsList1.innerHTML = template; // заполнение первого списка              
           
                seclist.push(newtag.deleted[0][0]); // новый список с переносимыми элементами

                var template2 = templateFn2({list2: seclist}); // второй список еренесенных элементов        
             
                friendsList2.innerHTML = template2;
      
                search2.addEventListener('keyup', function(){  // поиск по второму списку.
               
                    var newresponse2 = mySearch(seclist, search2.value );    // поиск. передаем в шаблон значение нового списка                 
                   // console.log(newresponse2);
                    var template2 = templateFn2({list2: newresponse2});
                    //console.log(template2);
                    friendsList2.innerHTML = template2;                      
                });

                friendsList2.addEventListener('click', function(e){
                    var tag2 = e.target.parentNode.firstElementChild.nextElementSibling.innerHTML;
                    var newtag2 = myFilter(seclist, tag2.trim());
                   // console.log(newtag2.deleted[0][0]);
                      var template2 = templateFn2({list2: newtag2.ret});

                    response.response.push(newtag2.deleted[0][0]);
                    template = templateFn({list: response.response}); // шаблон заполняется новым списком. В списке нет контакта по которуму произведен клик
                    friendsList1.innerHTML = template;
                    //console.log(template2);
                    friendsList2.innerHTML = template2;
                });
                    
               

            });

                         
        }               
    });

test.addEventListener('keypress,mousedown', function(){
    alert('sdf');
});

function mySearch(arr , key){
    var tmp = []; 
    for(var i =0; i<arr.length; i++){
        
        var name =  arr[i].first_name.toUpperCase(),
            lastname =  arr[i].last_name.toUpperCase(),
            str2 = key.toUpperCase();             

        if ((name.indexOf(str2)==0) ||(lastname.indexOf(str2)==0)){
            tmp.push(arr[i]);
        }
    }
    return tmp; 
}


function myFilter(arr , tag){
    var obj ={
        ret: [],
        deleted: []
    };     
    var str ;
    
    for(var i = 0; i<arr.length; i++){
        str = arr[i].first_name + " " + arr[i].last_name;
        if (str != tag){
            obj.ret.push(arr[i]);
        }
        if (str==tag){
           obj.deleted.push(arr.splice(i,1));         
        }
    }    
    return obj;
}


