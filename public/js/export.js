var dependencies = [];
var singleSlot = [];

var sub = new XMLHttpRequest();
var subUrl = 'https://a5a65819-6a2e-43f4-aa89-742cafd3a7cd.mock.pstmn.io/submit';
var subResponse;

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

this.sub.onprogress = function() {
    console.log(`Received ${event.loaded} of ${event.total}`);
}

this.sub.onerror = function() {
    console.log(`Network Error`);
}

/* This still needs work */
function createOutput() {
    console.log('Create Output Enter')
    this.sub.open('POST', this.subUrl, true);
    
    dependencies = [];
    singleSlot = [];
    for (i=1; i<chart_config.length; i++) {
        dependencies.push( { task: chart_config[i].task, parent: chart_config[i].pId, parallels: []} );
    }

    for(i=0; i<chart_config.length-1; i++) {
        for(j=0; j<connections.length; j++) {
            if(connections[j][1]===chart_config[i+1].taskId) {
                dependencies[i].parallels.push(connections[j][0]);
            }
        }
    }

    sub.send(JSON.stringify(dependencies));
    console.log(JSON.stringify(dependencies))
    console.log(tree)

    console.log('Create Output Exit')
}