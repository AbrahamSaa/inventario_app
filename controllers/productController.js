app.controller("productsController",function($scope, request,$location, $http) {
    $scope.warehouse_id = "select";
    $scope.editMode = false;

	$scope.uploadImg = function(productId, file) {
        let data = {
            image:file
        };

        $http({ 
            headers: {
                'Content-Type': undefined,
                "token":$scope.getTokenCookie("token"),
                "selectedCompany":localStorage["selectedCompany"],
            },
            method  : 'PUT',
            url     : URLAPI+"/upload/products/"+productId,
            processData: false,
            transformRequest: function (data) {
                var formData = new FormData();
                formData.append("image", file);
                return formData;
            },
            data : $scope.form,
           
        }).then(function(data){
            if(data.data.ok){
                $scope.showMessage("Producto subido con exito", "success", "left");
            }
        });
        
    };

    $scope.setProduct = function(_id){
        $scope.qrCodeActive = false; 
        $(".infoProduct").css({"display":"block"});
        $(".qrCodeGen").css({"display":"none"}); 
        $scope.productId = _id;
        $scope.warehouseId = "";
        for (var i = 0; i < $scope.products.length; i++) {
            if($scope.products[i]["_id"]==_id){
                $scope.getWarehouseById($scope.products[i]["warehouse_id"]);
                let qty = $scope.products[i]["qty"];
                $scope.warehouseId =$scope.products[i]["warehouse_id"];
                $scope.info = {
                    name: $scope.products[i]["name"],
                    desc: $scope.products[i]["desc"],
                    price: $scope.products[i]["price"],
                    metainfo: $scope.products[i]["meta_info"].replace("{","").replace("}","").replace(/"/g, ' '),
                    qty: qty,
                }

                $("#mainImgProduct").attr("src", URLAPI+"/img/products/"+localStorage["selectedCompany"]+"/"+ $scope.products[i]["img"]);
                console.log($scope.info);
                $("#moreInfo").modal("show");
                break;
            }
        }
    }

    $scope.setEditModeEnable = function(product){
        $scope.editMode = true;
        $scope.productId = product._id;
        for (var i = 0; i < $scope.products.length; i++) {
            if($scope.products[i]["_id"]==$scope.productId ){
                let qty = $scope.products[i]["qty"];
                $scope.warehouseId =$scope.products[i]["warehouse_id"];
                

                $scope.name =$scope.products[i]["name"];
                $scope.qty = parseInt($scope.products[i]["qty"]);
                $scope.desc =$scope.products[i]["desc"];
                $scope.price = parseInt($scope.products[i]["price"]);
                $scope.warehouse_id = $scope.products[i]["warehouse_id"];
                let meta_info = JSON.parse($scope.products[i]["meta_info"]);

                $scope.meta_info_piso = parseInt(meta_info.piso);
                $scope.meta_info_estante = meta_info.estante;
                $scope.meta_info_zona = meta_info.zona;

                
                $(".formEmployee").focus();

                $("#addProduct").modal("show");
                break;
            }
        }


    }

    $scope.qrCodeActive = false;


    $scope.getWarehouseById = function(){
        request.get(URLAPI+"/warehouse/"+$scope.warehouseId, $scope.getTokenCookie("token"), localStorage["selectedCompany"])
            .then((success)=>{
                if(success.data.ok){
                    $scope.info.dir = success.data.warehouses[0]["dir"]+" - "+success.data.warehouses[0]["city"];
                }
            }).catch((e)=>{
                console.log(e);
            })
    }

    $scope.generateQrCode = function(){
        $scope.qrCodeActive = true; 
        $(".infoProduct").toggle(200);
        $(".qrCodeGen").toggle(300); 
        $("#qrcodeInfo").html(""); 
        var qrcode = new QRCode("qrcodeInfo"); 
        qrcode.makeCode($scope.productId); 
    }

    $scope.goBackInfo = function(){
        $scope.qrCodeActive = false; 
        $(".infoProduct").toggle(300);
        $(".qrCodeGen").toggle(200); 
    }

    $scope.addProduct = function(){
        if(!$scope.editMode){
            let product = {
                name:$scope.name,
                qty:$scope.qty,
                desc:$scope.desc,
                price:$scope.price,
                warehouse_id:$scope.warehouse_id,
                meta_info:`{"piso":"${$scope.meta_info_piso}","estante": "${$scope.meta_info_estante}","zona": "${$scope.meta_info_zona}"}`,
            }


            request.post(URLAPI+"/product", product, $scope.getTokenCookie("token"), localStorage["selectedCompany"])
                .then((success)=>{
                    if(success.data.ok){
                        if($scope.files !== undefined){
                            $scope.uploadImg(success.data.product._id, $scope.files[0]);
                            var qrcode = new QRCode("qrcode"); 
                            qrcode.makeCode(success.data.product._id);

                            $("#formProduct").toggle(200);
                            $("#qrGenerate").toggle(300);
                            $scope.getProducts();
                        }
                    }
                }).catch((e)=>{
                    console.log(e);
                });
        }else{
            $scope.editProduct();
        }
    }

    $scope.editProduct = function(){
        let product = {
                name:$scope.name,
                qty:$scope.qty,
                desc:$scope.desc,
                price:$scope.price,
                warehouse_id:$scope.warehouse_id,
                meta_info:`{"piso":"${$scope.meta_info_piso}","estante": "${$scope.meta_info_estante}","zona": "${$scope.meta_info_zona}"}`,
            }


            request.put(URLAPI+"/product/"+ $scope.productId, product, $scope.getTokenCookie("token"), localStorage["selectedCompany"])
                .then((success)=>{
                    if(success.data.ok){
                        if($scope.files !== undefined){
                            $scope.uploadImg(success.data.product._id, $scope.files[0]);
                        }
                        var qrcode = new QRCode("qrcode"); 
                        qrcode.makeCode(success.data.product._id);

                        $("#formProduct").toggle(200);
                        $("#qrGenerate").toggle(300);
                        $scope.getProducts();
                    }
                }).catch((e)=>{
                    console.log(e);
                });
    }

    $scope.getProducts = function(){
        request.get(URLAPI+"/product",$scope.getTokenCookie("token"), localStorage["selectedCompany"])
            .then((success)=>{
                if(success.data.ok){
                    $scope.products = success.data.products;
                }
            }).catch((e)=>{
                $scope.showMessage(e.data.message, "danger", "left");
            })
    };

    $scope.setImageProduct = function(product){
        var checkImgElem = setInterval(function(){

        if($("#"+product._id).length > 0 ){
            $("#"+product._id).attr("src", URLAPI+"/img/products/"+localStorage["selectedCompany"]+"/"+product["img"]);
            clearInterval(checkImgElem);
        }

        },1000);
    }

    $scope.getWarehouse = function(){
        request.get(URLAPI+"/warehouse",$scope.getTokenCookie("token"),localStorage["selectedCompany"])
            .then((success)=>{
                console.log(success);
                if(success.data.ok){
                    $scope.warehouses = success.data.warehouses;
                }
            }).catch((e)=>{
                $scope.showMessage(e.data.message, "danger", "left");
            });
    }

    $scope.productId = "";

    $scope.deleteProduct = function(_id){
        $scope.productId = _id;
        $("#deleteProduct").modal("show");
    }

    $scope.deleteProductAction = function(){
        request.delete(URLAPI+"/product/"+$scope.productId, $scope.getTokenCookie("token"),localStorage["selectedCompany"])
            .then((success)=>{
                if(success.data.ok){
                    $scope.showMessage(success.data.message, "success", "left");
                    $scope.getProducts();
                    $("#deleteProduct").modal("hide");
                }
            }).catch((e)=>{
                $scope.showMessage(e.data.message, "danger", "left");

            });
    }


    $scope.uploadedFile = function(element) {
        $scope.currentFile = element.files[0];
        var reader = new FileReader();


        reader.onload = function(event) {
            $scope.image_source = event.target.result
            $scope.$apply(function($scope) {
                $scope.files = element.files;
            });
        };
        reader.readAsDataURL(element.files[0]);
    };

    $scope.setEditMode = function(){
        $scope.editMode = false;
    }

	
    $scope.getWarehouse(); 
	$scope.getToken();
});