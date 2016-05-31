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
        		
		var vkresponse = [];
        if (localStorage.length == 0){
            vkresponse = obCopy(responsee.response);        
            fillTemplate(templateFn,vkresponse,friendsList1);
        } else {            
            seclist = storageFilter(responsee.response);
            fillTemplate(templateFn2,seclist,friendsList2)
            vkresponse = storageFilter2(responsee.response);
            fillTemplate(templateFn,vkresponse,friendsList1);            
        }   
        

        friendsList1.addEventListener('click', function(e){
            if (e.target.tagName == "A"){                        
                seclist.push(myFilter(vkresponse, e.target.parentNode.getAttribute('data-id'))[0]);               
                fillTemplate(templateFn,vkresponse,friendsList1);               
                fillTemplate(templateFn2,seclist,friendsList2);
            }
        });

        search1.addEventListener('keyup', function(){               
            var newresponse = mySearch(vkresponse, search1.value);              
            fillTemplate(templateFn,newresponse,friendsList1);                     
        });

        search2.addEventListener('keyup', function(){             
            var newresponse = mySearch(seclist, search2.value);              
            fillTemplate(templateFn2,newresponse,friendsList2);                     
        });

        friendsList2.addEventListener('click', function(e){
            if (e.target.tagName == "A"){
            console.log(seclist);                            
                vkresponse.push(myFilter(seclist, e.target.parentNode.getAttribute('data-id'))[0]);                
                fillTemplate(templateFn,vkresponse,friendsList1);                
                fillTemplate(templateFn2,seclist,friendsList2);
            }
        });
         
        friendsList1.addEventListener("dragend", function(e){
            var name = e.target,
            dragid = name.getAttribute('data-id');
            if (name.tagName == "LI"){
                seclist.push(myFilter(vkresponse, dragid)[0]);                               
                fillTemplate(templateFn,vkresponse,friendsList1);               
                fillTemplate(templateFn2,seclist,friendsList2);
            }

        })

         friendsList2.addEventListener("dragend", function(e){
            var name = e.target,
            dragid = name.getAttribute('data-id');
            if (name.tagName == "LI"){
                vkresponse.push(myFilter(seclist, dragid)[0]);                               
                fillTemplate(templateFn,vkresponse,friendsList1);               
                fillTemplate(templateFn2,seclist,friendsList2);
            }

        })

        save.addEventListener('click', function(){
            localStorage.clear();
            for(var i = 0; i < seclist.length; i++){

                localStorage.setItem(seclist[i].user_id, seclist[i].user_id);
            }
        })          
          
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


function myFilter(arr , id){
    var tmp = [];    
    for(var i = 0; i < arr.length; i++){        
        if (arr[i].user_id == id){
            tmp.push(arr[i]);
            arr.splice(i,1);
        }    
    }    
    return tmp;
}

function obCopy(arr){
    var tmp = [];
    for(var i = 0; i<arr.length; i++ ){
        tmp.push(arr[i]);
    }
    return tmp;
}

function fillTemplate (mytem , myresp , mylist){
    var mytemplate = mytem({list: myresp});
    mylist.innerHTML = mytemplate;

}


function storageFilter(arr){
    var a;
    var tmp = [];
    
    for(a in localStorage){
        for (var i = 0; i < arr.length; i++) {
            if (a == arr[i].user_id){
                tmp.push(arr[i])
            }
        }
    }

    return tmp;
}

function storageFilter2(arr){
    var a;
    var mas = obCopy(arr);

    for(a in localStorage){
        for(var i = 0; i < mas.length; i++){
            if (a == mas[i].user_id) {
                mas.splice(i,1);
            }
        }
    }
    return mas;

}
