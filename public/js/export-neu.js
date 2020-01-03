var dependencies = [];
var singleSlot = [];

var sub = new XMLHttpRequest();
var subUrl = 'https://watts.dev.cox.com/prweb/PRRestService/PrototypeDesigner/Prototype/PrototypeSubmit';
var subResponse;
var request;

sub.onreadystatechange = function() {
    if(sub.readyState == 4 && sub.status == 200) {
        subResponse = JSON.parse(sub.responseText);
        console.log(subResponse)
        buildMenu();
    }
}

this.sub.onload = function() {
    console.log(`Loaded: ${sub.status} ${sub.response}`)
}

this.sub.onprogress = function(event) {
    console.log(`Received ${event.loaded} of ${event.total}`);
}

this.sub.onerror = function() {
    console.log(`Network Error`);
}

/* This still needs work */
function createOutput() {
    console.log('Create Output Enter')
    this.sub.open('POST', this.subUrl, true);
    this.sub.setRequestHeader("Access-Control-Allow-Origin", "*");
    this.sub.setRequestHeader("Content-Type", "application/json");
    
    dependencies = [];
    singleSlot = [];

    let nLevel = [chart_config[1].taskId];

    let orderClass = "CCI-CE-SOM-Work-BuildEstimate-Simple";

    let nextRound = [];
    let idHolder = 1;
    let ids = [];

    function createIds(nLevel) {
        nextRound = [];
        ids = [];
        for (i=0; i<nLevel.length; i++) {
            for (j=1; j<chart_config.length; j++) {
                if (nLevel[i] === chart_config[j].taskId){
                    dependencies.push(
                        {
                            Department: "Construction",
                            OrderClass: orderClass,
                            TaskKey: chart_config[j].taskId,
                            TaskClass: (chart_config[j].orderName !== undefined && chart_config[j].orderName !== "" && chart_config[j].orderName !== "undefined") ? orderClass + "-" + chart_config[j].task.replace(/\s/g, '') : "",
                            DependentKey: (chart_config[j].dependents[0] !== undefined && chart_config[j].dependents[0] !== -1) ? chart_config[j].dependents[0].toString() : "",
                            role: chart_config[j].role,
                            sla: chart_config[j].sla,
                            SortSequence: idHolder
                        });
                        ids.push(chart_config[j].taskId);
                        idHolder++;
                        /* For trying to use sort-sequence as dependencies */
                        /*if (chart_config[j].taskId !== 0) {
                            for(o=0; o<dependencies.length; o++) {
                                if(dependencies[o] === nLevel[i]) {
                                    for ( m=0; m<dependencies[o].dependents.length;m++ ) {
                                        for (n=0; n<dependencies.length; n++) {
                                            if(dependencies[n].taskId === dependencies[o].dependents[m]) {
                                                dependencies[o].dependents[m] = dependencies[n].sequenceId;
                                            }
                                        }
                                    }
                                }
                            }
                        }*/
                        for (k=0; k<chart_config[j].childrenId.length; k++) {
                            if(!nextRound.includes(chart_config[j].childrenId[k]) && !ids.includes(chart_config[j].childrenId[k])) {
                                nextRound.push(chart_config[j].childrenId[k]);
                            }
                        }
                    }
                }
            }
            if(nextRound[0] !== undefined) {
                createIds(nextRound);
            }
    }
    createIds(nLevel);
    /*for (i=1; i<chart_config.length; i++) {
        dependencies.push( { task: chart_config[i].task, dependents: [chart_config[i].pId], role: chart_config[i].role, sla: chart_config[i].sla} );
    }*/

    for(i=1; i<chart_config.length; i++) {
        for(j=0; j<connections.length; j++) {
            if(connections[j][0]===chart_config[i].taskId) {
                dependencies[i].DependentKey += ', ' + connections[j][1].toString();
            }
        }
    }

    request = {
        OrderClass: orderClass,
        Tasks: dependencies
    }
    
        /*sub.send(JSON.stringify(request));*/
    
    console.log(JSON.stringify(request))
    console.log(tree)
    console.log('Create Output Exit')
}

function download(content, fileName, contentType) {
    var a = document.createElement("a");
    var file = new Blob([content], {type: contentType});
    a.href = URL.createObjectURL(file);
    a.download = fileName;
    a.click();
}