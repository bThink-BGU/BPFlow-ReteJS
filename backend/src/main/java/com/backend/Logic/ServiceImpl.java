package com.backend.Logic;

import com.backend.Models.GraphModel;
import com.backend.Models.NodeModel;
import il.ac.bgu.cs.bp.bpjs.execution.BProgramRunner;
import il.ac.bgu.cs.bp.bpjs.model.BProgram;
import il.ac.bgu.cs.bp.bpjs.model.ResourceBProgram;
import org.springframework.web.servlet.mvc.method.annotation.SseEmitter;

import java.io.IOException;
import java.util.*;
import java.util.concurrent.CopyOnWriteArrayList;

public class ServiceImpl implements IService {

    Map<String, DebugRunner> debugRunnerMap;

    public ServiceImpl(){
        debugRunnerMap = new HashMap<>();
    }

    @Override
    public void run(GraphModel graphModel, SseEmitter emitter) {

        //TODO filter only nodes with code


        // Collect node functions
        String functions = generateAllFunctionsFromNodes(graphModel.getNodes());


        // Start a new deployment
        BProgram bprog;
        BprogRunner rnr;
        bprog = new ResourceBProgram("rungraph.js");
        bprog.putInGlobalScope("model", graphModel);
        bprog.putInGlobalScope("selectedEvent", null);
        bprog.putInGlobalScope("selectedEvents", new CopyOnWriteArrayList<>());
        bprog.appendSource(functions);

        rnr = new BprogRunner(bprog);
        //rnr.addListener(new PrintBProgramRunnerListener());
        rnr.addListener(new GraphBProgramRunnerListener(emitter));
        rnr.run();
    }

    private String generateAllFunctionsFromNodes(Map<String, NodeModel> nodes) {
        StringBuilder functions = new StringBuilder("// Autogenerated code\n");
        for(String nodeID : nodes.keySet()){
            String code = nodes.get(nodeID).getData().getCode();
            functions.append("function f").append(nodeID).append("(payload,t,bp,nodesLists,selectedEvent) {\n").append(code).append("\n}\n");
        }
        return functions.toString();
    }

    @Override
    public void debug(GraphModel graphModel, SseEmitter emitter) {

        // Collect node functions
        String functions = generateAllFunctionsFromNodes(graphModel.getNodes());

        // Start a new deployment
        BProgram bprog;
        bprog = new ResourceBProgram("rungraph.js");
        bprog.putInGlobalScope("model", graphModel);
        bprog.putInGlobalScope("selectedEvent", null);
        bprog.putInGlobalScope("selectedEvents", new ArrayList<>());
        bprog.appendSource(functions);
        //bprog.getFromGlobalScope("nodes", Map.class);
        DebugRunner rnr = new DebugRunner(bprog, emitter);
        rnr.addListener(new GraphBProgramRunnerListener(emitter));
        rnr.initDebug();
        debugRunnerMap.put(graphModel.getId(), rnr);
    }

    @Override
    public void step(String graphID) {
        try {
            boolean isProgDone = debugRunnerMap.get(graphID).step();
            if(isProgDone){
                debugRunnerMap.remove(graphID);
            }
        } catch (IOException e) {
            e.printStackTrace();
        }
    }

    @Override
    public void stop(String graphID) {
        debugRunnerMap.get(graphID).stop();
        debugRunnerMap.remove(graphID);
    }
}
