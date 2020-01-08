console.log(chart_config)
        var tree = new Treant( chart_config, $ );
        buildConnections();

        console.log('#' + parent)

        $("#" + parent).parent().addClass("selected");

        function newTree(parent, task, taskSla, taskRole, orderName) {
            newNodeDef = {
                text: {
                    taskNum: taskId,
                    taskIndex: taskId
                },
                innerHTML: '<p class="task" id="' + taskId + '">' + task + '</p><i class="material-icons-outlined" onclick="setParent(' + taskId + '); slaModal();">settings_applications' +
                '</i><div><div class="task-info"><div id="' + taskId + 'sla" class="task-sla">SLA:  ' + taskSla +
                '</div><div id="' + taskId + 'role" class="task-role">Queue:  ' + taskRole + '</div></div><div class=button-group><button class="openbtn" onclick="setParent(' + taskId +
                '); existingTasks(); openNav();">+</button><button class="openbtn" onclick="removeNode(' + taskId + ');">-</button><i class="material-icons-round ff" onclick="setParent(' + taskId + '); next();">fast_forward</i></div></div>',
                children: [],
                task: task,
                taskId: taskId,
                pId: parent,
                parents: [parent],
                childrenId: [],
                sla: taskSla,
                role: taskRole,
                dependents: [parent],
                orderName: orderName
            };
            taskId++;

            chart_config[chart_config.length] = newNodeDef;

            for(i=1; i<chart_config.length; i++) {
                if (chart_config[i].taskId===parent) {
                    chart_config[i].children[chart_config[i].children.length] = newNodeDef;
                    chart_config[i].childrenId.push(newNodeDef.taskId);
                }
            }

            console.log(chart_config)

            build_tree = [...chart_config];
            if (tree !== undefined) {
              tree.destroy;
            }
            tree = new Treant( chart_config, $ );
            buildConnections();

            console.log('#' + parent)
            $("#" + parent).parent().addClass("selected");

            onTreeLoad();
        }

        /*function newNode(parent, task) {
            nodeSpot = tree.tree.nodeDB.db.length;
            console.log(nodeSpot)
            newNodeDef2 = {
                text: {
                    name: "New Node"
                },
                innerHTML: '<p class="task">' + task + '</p><button class="openbtn" onclick="setParent(' + nodeSpot + '); openNav();">+</button>',
                children: [],
            };
            tree.tree.addNode(tree.tree.nodeDB.get(parent), newNodeDef2);
            console.log(tree)
        }*/

        function connectNodes(node2, node1, flag) {

            var spot1;
            var spot2;

            for (i=1; i<chart_config.length; i++) {
                if ((chart_config[i].taskId === node2) && (!chart_config[i].parents.includes(node1))) {
                    chart_config[i].parents.push(node1);
                }
                if (chart_config[i].taskId === node1 && (!chart_config[i].parents.includes(node2))) {
                    chart_config[i].childrenId.push(node2);
                }
            }

            /* Add loop here to get array location based on taskId of node */
            for (i=0; i<tree.tree.nodeDB.db.length; i++) {
                if (tree.tree.nodeDB.db[i].text.taskIndex===node2) {
                    spot2 = i;
                } else if (tree.tree.nodeDB.db[i].text.taskIndex===node1) {
                    spot1 = i;
                }
            }

            if(spot2 > spot1) {
                tree.tree.addConnectionToNode(tree.tree.nodeDB.get(spot1), false,tree.tree.nodeDB.get(spot2));
            } else if (spot1 > spot2) {
                tree.tree.addConnectionToNode(tree.tree.nodeDB.get(spot2), false,tree.tree.nodeDB.get(spot1));
            }

            if(flag===true) {
                connections.push([node2, node1]);
            }
        }

        /* Currently only deletes selected node and immediate children */
        function removeNode(task) {

            var currentParent;

            for(i=1; i<chart_config.length; i++) {
                if(chart_config[i].taskId===task) {
                    currentParent = chart_config[i].pId;
                    for(j=0; j<chart_config[i].children.length; j++) {
                        console.log('enter middle loop')
                        for(k = chart_config.length - 1; k >= 1; k--) {
                            if(chart_config[k].taskId === chart_config[i].children[j].taskId) {
                                chart_config.splice(k, 1);
                            }
                        }
                    }
                    chart_config.splice(i, 1);
                }
            }

            if(currentParent!==-1) {
                for(i=1; i<chart_config.length; i++) {
                    if(chart_config[i].taskId===currentParent) {
                        for(j=0; j<chart_config[i].children.length; j++) {
                            if(chart_config[i].children[j].taskId===task) {
                                chart_config[i].children.splice(j, 1);
                            }
                        }
                    }
                }
            }
            
            tree.destroy();
            tree = new Treant( chart_config, $ );

            onTreeLoad();

            var connections_temp = []

            for(k=0; k<connections.length; k++) {
                if(connections[k][0]!==task && connections[k][1]!==task) {
                    connections_temp.push([connections[k][0], connections[k][1]]);
                }
            }
            connections = connections_temp;
            buildConnections();

            console.log('#' + parent)
            $("#" + parent).parent().addClass("selected");

            $(document).ready(function() {
                $('.node').on("click", function(e){
                    setParent(Number($(this).children("p").attr("id")));
                    $('.selected').removeClass("selected");
                    $(this).addClass("selected");
                    e.stopPropagation();
                });
            })
        }

        function existingTasks() {
            console.log('run exisitingTasks()')
            var mHTML = '';
            var dHTML = '<input type="text" placeholder="Search.." id="myInput" onkeyup="filterFunction()">';

            chart_config.forEach(function(item) {
                console.log('ET taskID')
                console.log(item.taskId)
                console.log('ET parent')
                console.log(parent)
                if (item.task && (item.taskId !== parent)) {
                    mHTML += '<li onclick="connectNodes(' + item.taskId + ', parent, true)">+ ' + item.task + '</li>';
                    dHTML += '<a href="#" onclick="connectNodes(' + item.taskId + ', parent, true); document.getElementById(\'myDropdown\').classList.remove(\'show\');">+ ' + item.task + '</a>';
                }
            });
            document.getElementById("task-list").innerHTML = mHTML;
            document.getElementById("myDropdown").innerHTML = dHTML;
            console.log(dHTML)
        }

        function buildConnections() {
            console.log('Enter Build Connections')
            for (n=0; n<connections.length; n++) {
                connectNodes(connections[n][0], connections[n][1], false);
            }
            console.log('Exit Build Connections')
        }

        let slaId = document.querySelector(".sla-modal")

        function slaModal() {
            console.log(parent)
            let slaId = document.querySelector(".sla-modal");
            let slaHtml;
            let roleHtml;
            let nameHtml;
            slaId.style.display = "block";
            closeNav();

            for (i=1; i<chart_config.length; i++) {
                console.log(chart_config[i].taskId)
                console.log(parent)
                if (chart_config[i].taskId === parent) {
                    console.log("Enter if")
                    slaHtml = 'SLA:  <input id="sla-input" type="text" value="' + chart_config[i].sla + '">';
                    roleHtml = 'Role:  <input id="role-input" type="text" value="' + chart_config[i].role + '">';
                    nameHtml = 'Task Name:  <input id="name-input" type="text" value="' + chart_config[i].task + '">';
                }
            }
            document.getElementById("sla-tent").innerHTML = slaHtml;
            document.getElementById("role-tent").innerHTML = roleHtml;
            document.getElementById("name-tent").innerHTML = nameHtml;
        }

        function closeSlaModal() {
            let slaId = document.querySelector(".sla-modal");
            slaId.style.display = "none";
        }

        function updateSla() {
            var slaInputVal = document.getElementById("sla-input").value;
            var roleInputVal = document.getElementById("role-input").value;
            var taskNameVal = document.getElementById("name-input").value;

            for (j=1; j<chart_config.length; j++) {
                if(chart_config[j].taskId === parent) {
                    chart_config[j].sla = Number(slaInputVal);
                    chart_config[j].role = roleInputVal;
                    chart_config[j].task = taskNameVal;
                    document.getElementById(parent + "sla").innerHTML = 'SLA:  ' + slaInputVal;
                    document.getElementById(parent + "role").innerHTML = 'Role:  ' + roleInputVal;
                    document.getElementById(parent).innerHTML = taskNameVal;
                }
            }
            let slaId = document.querySelector(".sla-modal");
            slaId.style.display = "none";
        }