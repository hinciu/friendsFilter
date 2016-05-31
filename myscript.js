 var friendsList1 = document.getElementById('friends-list1'),
 	 friendsList2 = document.getElementById('friends-list2');
 var source = ItemTemplate.innerHTML,
     templateFn = Handlebars.compile(source),
     source2 = ItemTemplate2.innerHTML,
     templateFn2 = Handlebars.compile(source2);
 var seclist = [];



new Promise(function(resolve) {
	if(document.readyState === "complete"){
		resolve();
	} else {
		window.onload = resolve;
	}
})
	.then(function(){
		return new Promise(function(resolve , reject){
			VK.init({
       		apiId: 5376627
    		});

    		VK.Auth.login(function(response) {
		        if (response.session) {
		            console.log('авторизация прошла успешно');
		            resolve(response);
		            
		        } 
		        else {
		            console.log('ошибка авторизации');
		            reject(new Error("Ошибка авторизации"));
	        	}
    		},2);
		})
	})
	.then(function(){		
		return new Promise(function(resolve, reject){
			VK.api('friends.get', {'fields': 'photo_50'} , function(response){
				if (response.error) {
            	reject(new Error(response.error.error_msg));
            	}
            	else {
            		resolve(response);
            	}
			}); 
		})
	})
	.then(function(responsee){
		
			var response = responsee;
            var template = templateFn({list: response.response});// шаблон заполняется полученным списком друзей 
            friendsList1.innerHTML = template; 
            /*Шаблон второго списка*/
          	
           var stor = storageFilter(response.response);
           	    //console.log(localStorage.getItem("0"));
           		 template2 = templateFn2({list2: stor}); // второй список еренесенных элементов        
		             
		                friendsList2.innerHTML = template2;
            
            search1.addEventListener('keyup', function(){
               
                var newresponse = mySearch(response.response, search1.value );    // поиск. передаем в шаблон значение нового списка                 
                template = templateFn({list: newresponse});
                friendsList1.innerHTML = template;                      
            });

            friendsList1.addEventListener('click', function(e){    // перенос друга в соседний список     
             
            	
            		if (e.target.tagName == "A")
            		{		
		               var tag = e.target.parentNode.firstElementChild.nextElementSibling.innerHTML; // имя друга по которому произошел клик
		              
		                                
		               var newtag = myFilter(response.response, tag.trim()); //возвращяет новый список, за исключение контакта по которому был произведен клик.
		               template = templateFn({list: newtag}); // шаблон заполняется новым списком. В списке нет контакта по которуму произведен клик
		               friendsList1.innerHTML = template; // заполнение первого списка              
		           		var newtag2 = myFilter2(response.response, tag.trim())
		                seclist.push(newtag2); // новый список с переносимыми элементами

		                var template2 = templateFn2({list2: seclist}); // второй список еренесенных элементов        
		             
		                friendsList2.innerHTML = template2;
		                } 
           		

            });

            search2.addEventListener('keyup', function(){  // поиск по второму списку.               
                var newresponse2 = mySearch(seclist, search2.value );    // поиск. передаем в шаблон значение нового списка                 
                   
                template2 = templateFn2({list2: newresponse2});
                    
                 friendsList2.innerHTML = template2;                      
            });

            friendsList2.addEventListener('click', function(e){
              	var tag2 = e.target.parentNode.firstElementChild.nextElementSibling.innerHTML;
               	var newtag2 = myFilter(seclist, tag2.trim());
                   
                template2 = templateFn2({list2: newtag2.ret});

                response.response.push(newtag2.deleted[0][0]);
                template = templateFn({list: response.response}); // шаблон заполняется новым списком. В списке нет контакта по которуму произведен клик
                friendsList1.innerHTML = template;
                   
                friendsList2.innerHTML = template2;
            });

            
            friendsList1.addEventListener("dragstart", function(e){
            		var name = e.target;
              		   var a = e.target.firstElementChild.nextElementSibling.innerHTML;
              		   
		                    
                
                        
                friendsList1.addEventListener("dragenter", function(){
                    console.log("enter");
                          
                })
    
                friendsList1.addEventListener("dragend", function(){
            		  if (name.tagName == "LI"){
            		  var newtag = myFilter(response.response, a.trim()); //возвращяет новый список, за исключение контакта по которому был произведен клик.
            		  template = templateFn({list: newtag.ret}); // шаблон заполняется новым списком. В списке нет контакта по которуму произведен клик
		               friendsList1.innerHTML = template; // заполнение первого списка  

		                seclist.push(newtag.deleted[0][0]); // новый список с переносимыми элементами

		                var template2 = templateFn2({list2: seclist}); // второй список еренесенных элементов        
		             
		                friendsList2.innerHTML = template2;  
            		}

                })
            })

            save.addEventListener('click', function(){
            	console.log(seclist);
            	
            	for (var i = 0; i <seclist.length; i++){
            		
            		localStorage.setItem(i, seclist[i].user_id)

            	}
            	
            });
          
	})


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
    var tmp = [];
         
    var str ;
    
    for(var i = 0; i<arr.length; i++){
        str = arr[i].first_name + " " + arr[i].last_name;
        if (str != tag.trim()){
            tmp.push(arr[i]);
        }
    }
        
    return tmp;
}


function myFilter2(arr , tag){
    var tmp = [];
        
    var str ;
    
    for(var i = 0; i<arr.length; i++){
        str = arr[i].first_name + " " + arr[i].last_name;
        if (str == tag.trim()){
            tmp.push(arr[i]);
        }
     }
        
    return tmp;
}


function storageFilter (arr){
	var tmp = [];

	for(var i = 0; i < localStorage.length; i++){
		for (var k = 0; k < arr.length; k++ ){
				//console.log(arr[k].user_id);
				//console.log(localStorage.getItem(+i))
				if (arr[k].user_id == localStorage.getItem(+i)){
					tmp.push(arr[k]);
				}
			}
		}

	

	return tmp;

}