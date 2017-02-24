var $ = require ('jquery');


function getXMLHttpRequest() {
        var xhr = null;

        if (window.XMLHttpRequest || window.ActiveXObject) {
            if (window.ActiveXObject) {
                try {
                    xhr = new ActiveXObject("Msxml2.XMLHTTP");
                } catch(e) {
                    xhr = new ActiveXObject("Microsoft.XMLHTTP");
                }
            } else {
                xhr = new XMLHttpRequest();
            }
        } else {
            alert("Votre navigateur ne supporte pas l'objet XMLHTTPRequest...");
            return null;
        }

        return xhr;
    }
    
	function request(url, callback, async) {
        var xhr = getXMLHttpRequest();

        xhr.onreadystatechange = function() {
            if (xhr.readyState == 4 && (xhr.status == 200 || xhr.status == 0)) {
				console.log(xhr.reponse)
                callback(xhr.responseText);
            }
        };

        xhr.open("GET",url, async);
        xhr.send(null);
    }
    

$(function(){  //page avec ajax
	var products = null;
	/*request('data/product.json', function(data){
		console.log(JSON.parse(data));
		
	},false);*/
	
	$.ajax({
		url:"data/product.json",
		async:false
		
	}).done(function(data){
		products=data;
	});
	
	
	console.log('pl');

	/*var products = [{
		name:"pull",
		price:"36.99£",
		color:"rouge",
		visuel:"pull-rouge.jpg",
		visuelHover:"pull-rouge-hover.jpg"
		
	},
	{
		name:"pull",
		price:"36.99£",
		color:"rouge",
		visuel:"pull-bleu.jpg",
		visuelHover:"pull-bleu-hover.jpg"
		
	},
	
	{
		name:"pull",
		price:"36.99£",
		color:"rouge",
		visuel:"pull-vert.jpg"
		
	},
	{
		name:"pull",
		price:"36.99£",
		color:"rouge",
		visuel:"pull-jaune.jpg"
		
	},
	];*/
   
    var productList= $('.ProductList');
	
	
	
	$.each(products,function(i,product){
		
		var li = $('<li class="productList-item"></li>');
		
		productList.append(li);
		
		productList.find('.productList-item:last-child')
			.append('<p class="productList-productname"> '+ product.name +'</p>');
		
		
		
		productList.find('.productList-item:last-child')
			.append('<p class="productList-productprice"> '+ product.price +'</p>');
		
		
		productList.find('.productList-item:last-child')
			.append('<p class="productList-productcolor"> '+ product.color +'</p>');
		
		
		
		productList.find('.productList-item:last-child')
			.append('<img class="productList-productvisuel" src="images/'+ product.visuel +'" />');
		
		if(product.visuelHover){
			li.on('mouseover',function(){
				$(this).find('.productList-productvisuel').attr('src','images/'+product.visuelHover);
			});
			li.on('mouseleave',function(){
				$(this).find('.productList-productvisuel').attr('src','images/'+product.visuel);
			});
		}
			
		
	});
});