/* global bp */

//function SubmissionAddedAll() {
//	return bp.EventSet( "SubmissionAddedAll", function(ev){
//		  var e = JSON.parse(ev.name);
//		  return e.name == "SubmissionAdded";
//		});
//}
//
//function SubmissionAdded(id) {
//	return bp.EventSet( "SubmissionAddedAll", function(ev){
//		  var e = JSON.parse(ev.name);
//		  return e.name == "SubmissionAdded" && e.courseId == id;
//		});
//}


function goToFollowers(curNode, ths, bp, payloads) {
    const outputs = curNode.outputs;
    if(outputs.size() > 0){
        let isFirstFound = false;
        let firstOutputNode;
        let firstOutputPayload;
        let firstBP;
        const outputsKeys = outputs.keySet().toArray();
        for(var i in outputsKeys){
            if(outputs.get(outputsKeys[i]).size() > 0){ //check if this output have connected nodes
                let j = 0;
                if(!isFirstFound){
                    j = 1;
                    firstOutputNode = allNodesMap.get(outputs.get(outputsKeys[i]).get(0));
                    firstOutputPayload = payloads[outputsKeys[i]];
                    firstBP = bp;
                }
                for (;j < outputs.get(outputsKeys[i]).size(); j++) {
                    runInNewBT(allNodesMap.get(outputs.get(outputsKeys[i]).get(j)), payloads[outputsKeys[i]] );
                }
                isFirstFound = true;
            }
        }
        if(isFirstFound){
            bp.log.info("firstOutputNode = " + firstOutputNode);
            bp.log.info("firstOutputPayload = " + firstOutputPayload);
            runInSameBT(firstOutputNode, firstOutputPayload, ths, firstBP);
        }
    }
}

//function goToFollowers(curNode, ths, bp, payloads) {
//    const outputs = curNode.outputs;
//    if(outputs.size() > 0){
//        const outputsKeys = outputs.keySet().toArray();
//        for(var i in outputsKeys){
//            if(outputs.get(outputsKeys[i]).size() > 0){
//                for (var j = 1; j < outputs.get(outputsKeys[i]).size(); j++) {
//                    runInNewBT(allNodesMap.get(outputs.get(outputsKeys[i]).get(j)), payloads[outputsKeys[i]] );
//                }
//
//                runInSameBT(allNodesMap.get(outputs.get(outputsKeys[i]).get(0)), payloads[outputsKeys[i]], ths, bp);
//            }
//        }
//    }
//}

function runInNewBT(curNode, payload) {
    bp.log.info("in runInNewBT@@@@@@@@ - " + curNode.id + " :" + payload);
	var context = JSON.parse(JSON.stringify(payload));

	bp.registerBThread(curNode.id, function() {
		eval("var f=f" + curNode.id);
        //bp.log.info("curNode.id - " + curNode.id);
		const payloads = f(context, this, bp);
		goToFollowers(curNode, this, bp, payloads);
	});
};

function runInSameBT(c, payload, ths, bp) {
    bp.log.info("in runInSameBT!!!! - " + c.id + " :" + payload);
    //need to clone the payload??
	eval("var f=f" + c.id);

	const payloads = f(payload, ths, bp);

	goToFollowers(c, ths, bp, payloads);
};

//bp.log.info("log test!!!");
//bp.log.info(model);
//bp.log.info(model.getNodes().values());

const allNodesArr = model.getNodes().values().toArray();
const allNodesMap = model.getNodes();
//bp.log.info("allNodesArr:" + allNodesArr);
//bp.log.info("allNodesMap:" + allNodesMap);

var startNodes = [];
for(var i in allNodesArr){
    //bp.log.info("allNodesArr[i]:" + allNodesArr[i]);
    if(allNodesArr[i].type == "Start"){
        startNodes.push(allNodesArr[i]);
    }
}
for(var i in startNodes){
    runInNewBT(startNodes[i], {});
}