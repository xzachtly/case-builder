var ordersAndTasks = {
    orders: [
        {
            orderName: 'Simple Residential Estimate',
            tasks: [
                {
                    name: "Address Review",
                    sla: "1",
                    role: "LAM"
                },
                {
                     name: "Field Estimate",
                     sla: "3",
                     role: "Planner"
                }, 
                {
                    name: "Final Review",
                    sla: "2",
                    role: "LAM"
                }  
            ]
        },
        {
            orderName: 'Build Estimate',
            tasks: ["Address Review", "Field Estimate", "Final Review"]
        },
        {
            orderName: 'Node Split',
            tasks: ["Address Review", "Field Estimate", "Final Review"]
        },
    ]
};

var menu = new XMLHttpRequest();
var url = 'https://a5a65819-6a2e-43f4-aa89-742cafd3a7cd.mock.pstmn.io/menu';
var json;
var myArray = [];

menu.onreadystatechange = function() {
    if(menu.readyState == 4 && menu.status == 200) {
        json = JSON.parse(menu.responseText);
        console.log(json)
        buildMenu();
    }
}

this.menu.onload = function() {
    console.log(`Loaded: ${menu.status} ${menu.response}`)
}

this.menu.onprogress = function(event) {
    console.log(`Received ${event.loaded} of ${event.total}`);
}

this.menu.onerror = function() {
    console.log(`Network Error`);
}

this.menu.open('GET', this.url, true);
menu.send();



function buildMenu() {
    var menuHtml = '';
    var taskName = "";

    json.orders.forEach(function(item) {
        menuHtml += '<li><a class="sub" href="#">' + item.orderName + '</a><ul>';
        item.tasks.forEach(function(subItem) {
            console.log('<li onclick="newTree(parent, \'' + subItem.name + '\');">+ ' + subItem.name + '</li>')
            menuHtml += '<li onclick="newTree(parent, \'' + subItem.name + '\', ' + subItem.sla + ', \'' + subItem.role + '\', \'' + subItem.order + '\', chart_config, tree);">+ ' + subItem.name + '</li>';
        })
        menuHtml += '</ul></li>';
    });
    document.getElementById("menu").innerHTML = menuHtml;
    

    /*$(window).on("load", function() {
        console.log('Window Loaded')
        $('.sub').on("click", function(e){
            $(this).next('ul').toggle();
            $("a").css("color", "#bababa");
            $(this).css("color", "#d29f13");
            e.stopPropagation();
            e.preventDefault();
        });
    });*/

    $(document).ready(function(){
        console.log('Doc Ready')
      $('a').on("click", function(e){
        $(this).next('ul').toggle();
        $("a").css("color", "#bababa");
        $(this).css("color", "#d29f13");
        e.stopPropagation();
        e.preventDefault();
      });
      $('.sub').on("click", function(e){
          e.preventDefault();
        if($(this).next('ul').style.display == 'none') {
            $(this).next('ul').show();
        } else {
            $(this).next('ul').hide();
        }
        $("a").css("color", "#bababa");
        $(this).css("color", "#d29f13");
    });
    });
}