var branches = [];

var proofing = {
    "branch" : "Proofing",
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
}

branches.push(proofing);

function branchList() {
    document.getElementById("branch-list").classList.toggle("show");

    var bHTML = '';

    branches.forEach(function(item) {
        bHTML += '<a href="#" onclick="switchTree(' + item.branch + ');">' + item.branch + '</a>'
    });
    document.getElementById("branch-list").innerHTML = bHTML;
}

function switchTree() {
    
}