var playbackTree_config;
var playbackTree;
var newConfig;

function startPlayback() {
    chart_config[0].rootOrientation = 'WEST';
    if (tree) {
        tree.destroy();
    }
    console.log(parent)
    playFromIndex();

    if (newConfig !== undefined) {
        tree = new Treant(newConfig, $);
        buildConnections();
        $('#' + newConfig[1].taskId).parent().addClass("fade-in");
    } else {
        tree = new Treant(chart_config, $);
        buildConnections();
        $('#' + chart_config[1].taskId).parent().addClass("fade-in");
    }

    onTreeLoad();

    $('.chart.Treant.Treant-loaded').css('margin-top', '10%');
    $('body').addClass("dark-body");

    $('.back-button').toggle("show");


    $('.node').css('visibility', 'hidden');
    $('.node').css('opacity', '0');

    $('.ff').toggle();
    $('.openbtn').toggle();
}

function next() {
    console.log(parent)
    if (newConfig[0] !== undefined) {
        for (j=1; j<newConfig.length; j++) {
            if(newConfig[j].taskId === parent) {
                for (i=0; i<newConfig[j].childrenId.length; i++) {
                    $('#' + newConfig[j].childrenId[i]).parent().addClass("fade-in");
                }
            }
        }
    } else {
        for (j=1; j<chart_config.length; j++) {
            if(chart_config[j].taskId === parent) {
                for (i=0; i<chart_config[j].children.length; i++) {
                    $('#' + chart_config[j].childrenId[i]).parent().addClass("fade-in");
                }
            }
        }
    }
}

function back() {
    chart_config[0].rootOrientation = 'NORTH';
    if (tree) {
        tree.destroy();
    }
    tree = new Treant(chart_config, $);
    buildConnections();
    onTreeLoad();

    $(tree).ready(function() {
        console.log("Tree Ready")
        $('.chart.Treant.Treant-loaded').css('margin-top', '0');
        $('body').removeClass("dark-body");

        $('.back-button').toggle("hide");
        
        $('.node').css('visibility', 'visible');
        $('.node').css('opacity', '1');
        console.log("Tree Ready Done")
    })
}

function playFromIndex() {
    for(i=1; i<chart_config.length; i++) {
        if (chart_config[i].taskId === parent) {
            newConfig = [chart_config[0], chart_config[i]];
            addChild(chart_config[i]);
        }
    }
}

function addChild(ancestor) {
    if (ancestor.children.length !== 0) {
        ancestor.children.forEach(function(child) {
            newConfig.push(child);
            if(child.children.length !== 0) {
                addChild(child);
            }
        })
    }
}