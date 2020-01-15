
var connections = [];

function getOrder(fName) {
    var formData = {order: fName}
    var order;
    $.ajax({
        url : "http://localhost:8080/get-order",
        type : "POST",
        data: formData,
        dataType: "json",
        success : function(data) {              
            taskList = data;
            document.getElementById("order-name").innerHTML = taskList.OrderClass + ' v' + taskList.orderVersion;
            document.getElementById("saved-name").innerHTML = taskList.OrderClass + ' v' + taskList.orderVersion;
            console.log(taskList)
        },
        error : function(jqXHR, textStatus, errorThrown){
            var errorMessage = "An error has occurred: " + textStatus + " " + errorThrown;
            alert(errorMessage)
        }
    });

    return order;
}

function getUrlParam(parameter, defaultvalue){
    var urlparameter = defaultvalue;
    if(window.location.href.indexOf(parameter) > -1){
        urlparameter = getUrlVars()[parameter];
        }
    return urlparameter;
}

function getUrlVars() {
    var vars = {};
    var parts = window.location.href.replace(/[?&]+([^=&]+)=([^&]*)/gi, function(m,key,value) {
        vars[key] = value;
    });
    return vars;
}


var fileName = getUrlParam('order', 'SimpleResidentialEstimate-1.0.1');

getOrder(fileName);

var config = {
    container: "#collapsable-example",

    animateOnInit: false,
    rootOrientation: 'NORTH',
    
    node: {
        collapsable: true
    },
    animation: {
        nodeAnimation: "easeOutBounce",
        nodeSpeed: 700,
        connectorsAnimation: "bounce",
        connectorsSpeed: 700
    },
    connectors: {
        type: "straight",
        style: {
            stroke: '#adadad'
        }
    }
}

    /*var taskList = {
        "OrderClass" : "CCI-CE-SOM-Work-BuildEstimate-Simple",
        "orderVersion": "1.0.1",
        "Tasks" : [
            {
                "Department": "Construction",
                "OrderClass": "CCI-CE-SOM-Work-BuildEstimate-Simple",
                "TaskClass": "CCI-CE-SOM-Work-BuildEstimate-Simple-AddressReview",
                "TaskName": "Address Review",
                "TaskKey": 0,
                "SLA": 3,
                "Role": "IOSS-LAM",
                "DependentKey": [],
                "SortSequence": 1,
                "ParentKey": null
            },
            {
                "Department": "Construction",
                "OrderClass": "CCI-CE-SOM-Work-BuildEstimate-Simple",
                "TaskClass": "CCI-CE-SOM-Work-BuildEstimate-Simple-VirtualEstimate",
                "TaskName": "Virtual Estimate",
                "TaskKey": 1,
                "SLA": 2,
                "Role": "IOSS-LAM",
                "DependentKey": [0],
                "SortSequence": 2,
                "ParentKey": null
            },
            {
                "Department": "Construction",
                "OrderClass": "CCI-CE-SOM-Work-BuildEstimate-Simple",
                "TaskClass": "CCI-CE-SOM-Work-BuildEstimate-Simple-FieldEstimate",
                "TaskName": "Field Estimate",
                "TaskKey": 2,
                "SLA": 2,
                "Role": "Planner",
                "DependentKey": [1],
                "SortSequence": 3,
                "ParentKey": null
            },
            {
                "Department": "Construction",
                "OrderClass": "CCI-CE-SOM-Work-BuildEstimate-Simple",
                "TaskClass": "CCI-CE-SOM-Work-BuildEstimate-Simple-UpdateRemedyRequest",
                "TaskName": "Update Remedy Request",
                "TaskKey": 3,
                "SLA": 1,
                "Role": "IOSS-LAM",
                "DependentKey": [2],
                "SortSequence": 4,
                "ParentKey": null
            }
        ]
    }*/
    var taskList = "";

    addressReview = "Address Review";
    fieldEstimate= "Field Estimate";
    finalReview = "Final Review";
    invoiceCreation = "Invocie Creation";
    invoiceReview = "Invoice Review";
    designReview = "Design Review";
    contractorSelection = "Contractor Selection";
    invoiceApproval = "Invoice Approval";

    function openNav() {
        document.getElementById("mySidebar").style.width = "500px";
    }
    
    function closeNav() {
        document.getElementById("mySidebar").style.width = "0";
        $('ul').hide();
    }

    function setParent(node) {
        console.log('enter setParent()')
        console.log(node)
        parent = node;
    }

    function deleteConnection(connectionID) {
        for(i=0; i<connections.length; i++) {
            if((connections[i][0] === connectionID && connections[i][1] === parent) || (connections[i][0] === parent && connections[i][1] === connectionID)) {
                connections.splice(i, 1);
                console.log(connections)
                $('#dep-' + connectionID).hide();
            }

            for(j=0; j<chart_config.length; j++) {
                if(chart_config[j].taskId === connectionID) {
                    for(k=0; k<chart_config[j].childrenId.length; k++) {
                        chart_config[j].childrenId.splice(k, 1);
                    }
                } else if (chart_config[j].taskId === parent) {
                    console.log('enter elseif')
                    for(k=0; k<chart_config[j].parents.length; k++) {
                        chart_config[j].parents.splice(k, 1);
                        console.log('splice')
                    }
                }
            }
        }

        tree = new Treant( chart_config, $ );
        buildConnections();

        console.log('#' + parent)

        $("#" + parent).parent().addClass("selected");

        onTreeLoad();
    }

    var taskId;

    function initializeTree(status) {
        taskId = 1;
        if (status === "new") {
            malory = {
                task: "Design Review",
                text: {
                    taskNum: 1,
                    taskIndex: 1
                },
                innerHTML: '<p class="task" id="0">Design Review</p><i class="material-icons-outlined" onclick="setParent(0); slaModal();">settings_applications</i><div><div class="task-info"><div  id="0sla" class="task-sla">SLA:  3' +
                '</div><div id="0role" class="task-role">Queue:  Planner</div></div><div class=button-group><button class="openbtn" onclick="setParent(0' +
                '); existingTasks(); openNav();">+</button><button class="openbtn" onclick="removeNode(0);">-</button><i class="material-icons-round ff" onclick="setParent(' + taskId + '); next();">fast_forward</i></div></div>',
                children: [],
                taskId: 0,
                pId: -1,
                parents: [-1],
                childrenId: [],
                sla: 3,
                role: 'Planner',
                dependents: []
            }

            setParent(0);
        
            chart_config = [config];
            build_tree = [...chart_config];
            /*tree = new Treant( chart_config, $ );
            buildConnections();
            onTreeLoad();*/
            return chart_config;
        } else {
            var addTask;

            chart_config = [config];

            taskList.Tasks.sort(sortByProperty('TaskKey'));
    
            for (i=0; i<taskList.Tasks.length; i++) {
                addTask = {};
                addTask = {
                task: taskList.Tasks[i].TaskName,
                text: {
                    taskNum: i,
                    taskIndex: taskList.Tasks[i].TaskKey
                },
                innerHTML: '<p class="task" id="' + taskList.Tasks[i].TaskKey + '">' + taskList.Tasks[i].TaskName + '</p><i class="material-icons-outlined" onclick="setParent(' + taskList.Tasks[i].TaskKey + '); slaModal();">settings_applications' +
                '</i><div><div class="task-info"><div id="' + taskList.Tasks[i].TaskKey + 'sla" class="task-sla">SLA:  ' + taskList.Tasks[i].SLA +
                '</div><div id="' + taskList.Tasks[i].TaskKey + 'role" class="task-role">Queue:  ' + taskList.Tasks[i].Role + '</div></div><div class=button-group><button class="openbtn" onclick="setParent(' + taskList.Tasks[i].TaskKey +
                '); existingTasks(); openNav();">+</button><button class="openbtn" onclick="removeNode(' + taskList.Tasks[i].TaskKey + ');">-</button><i class="material-icons-round ff" onclick="setParent(' + taskList.Tasks[i].TaskKey + '); next();">fast_forward</i></div></div>',
                children: [],
                taskId: taskList.Tasks[i].TaskKey,
                pId: taskList.Tasks[i].DependentKey[0] !== undefined ? taskList.Tasks[i].DependentKey[0] : -1,
                parents: [taskList.Tasks[i].DependentKey[0] !== undefined ? taskList.Tasks[i].DependentKey[0] : -1],
                dependents: taskList.Tasks[i].DependentKey,
                childrenId: [],
                sla: 3,
                role: 'Planner',
                orderName: taskList.Tasks[i].OrderClass
            }
    
            if (taskList.Tasks[i].DependentKey[0] !== undefined) {
                for (k=0; k<chart_config.length; k++) {
                    if (taskList.Tasks[i].DependentKey[0]===chart_config[k].taskId) {
                        chart_config[k].children.push(addTask);
                        chart_config[k].childrenId.push(addTask.taskId);
                    }
                }
            }
    
            if(taskList.Tasks[i].DependentKey.length > 1) {
                for (m=1; m<taskList.Tasks[i].DependentKey.length; m++) {
                    connections.push([taskList.Tasks[i].TaskKey, taskList.Tasks[i].DependentKey[m]]);
                }
            }
    
            chart_config.push(addTask);
            taskId = i+1;
        }
        console.log(chart_config)
        console.log(parent)
        tree = new Treant( chart_config, $ );
        buildConnections();
        onTreeLoad();
        taskId++;
        return chart_config;
        }
    }

    function onTreeLoad() {
        $(document).ready(function() {
            $('.node').on("click", function(e){
                setParent(Number($(this).children("p").attr("id")));
                $('.selected').removeClass("selected");
                $(this).addClass("selected");
                e.stopPropagation()
            });

            $('.openbtn').toggle();
            $('.ff').toggle();

            $('.node').mouseenter(function(e) {
                parents = [];
                children = [];

                for (i=1; i<chart_config.length; i++) {
                  if(chart_config[i].taskId ===Number($(this).children("p").attr("id"))) {
                    for(j=0; j<chart_config[i].parents.length; j++) {
                      parents.push(chart_config[i].parents[j]);
                    }
                    for(j=0; j<chart_config[i].childrenId.length; j++) {
                      children.push(chart_config[i].childrenId[j]);
                    }
                  }
                }

                /*for(i=0; i<connections.length; i++) {
                  if(connections[i][0]===Number($(this).children("p").attr("id"))) {
                    parents.push(connections[i][1]);
                  } else if (connections[i][1]===Number($(this).children("p").attr("id"))) {
                    parents.push(connections[i][0]);
                  }
                }*/

                $(".node").addClass("greyed-out");

                $(this).removeClass("greyed-out");
                $(this).addClass("showcase");

                for (j=0; j<parents.length; j++) {
                  $("#" + parents[j]).parent().removeClass("greyed-out");
                  $("#" + parents[j]).parent().addClass("connection");
                }

                for (j=0; j<children.length; j++) {
                  $("#" + children[j]).parent().removeClass("greyed-out");
                  $("#" + children[j]).parent().addClass("child");
                }

                console.log(parents)

                console.log($(this).children("p").attr("id"));
                e.stopPropagation();
                e.preventDefault();
            }).mouseleave(function() {
                $(this).removeClass("showcase");
                for (j=0; j<parents.length; j++) {
                  $("#" + parents[j]).parent().removeClass("connection");
                }
                for (j=0; j<children.length; j++) {
                  $("#" + children[j]).parent().removeClass("child");
                }
                $(".node").removeClass("greyed-out");
            });

            $('.node').dblclick(function() {
              closeNav();
              depModal.style.display = "block";
              console.log(parents)

              
              setParent(Number($(this).children("p").attr("id")));
              existingTasks();
              console.log('dbCLick parent')
              console.log(Number($(this).children("p").attr("id")))

              iHtml = '';

              if(parents[0]!==undefined && parents[0]!==-1) {
                for(j=0; j<parents.length; j++) {
                  for(k=1; k<chart_config.length; k++) {
                    console.log('task-id')
                    console.log(chart_config[k].taskId)
                    console.log('parents')
                    console.log(parents[j])
                    if(chart_config[k].taskId === parents[j]) {
                        if(j === 0) {
                            iHtml += '<div id="dep-' + chart_config[k].taskId + '">' + chart_config[k].task + '</div>';
                        } else {
                            iHtml += '<div id="dep-' + chart_config[k].taskId + '">' + chart_config[k].task + '<a href="javascript:void(0)" class="delete-conn" onclick="deleteConnection(' + chart_config[k].taskId + ');">x</a></div>';
                        }
                    }
                  }
                }
                document.getElementById("dep-info").innerHTML = iHtml;
  
              }
            });
            $(".task").each(function () {
                len=$(this).text().length;
                str= $(this).text().substr(0,20);
                lastIndexOf = str.lastIndexOf(" "); 
                if(len>20) {
                    $(this).text(str.substr(0, lastIndexOf) + '…');
                }
            });
        })
    }

    var sortByProperty = function (property) {
        return function (x, y) {
            return ((x[property] === y[property]) ? 0 : ((x[property] > y[property]) ? 1 : -1));
        };
    };
