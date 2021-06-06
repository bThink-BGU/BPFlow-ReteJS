export let unconnectedGraphBeforeParse = 
{
    "id": "1a5abcee-a6da-45ad-a1c9-1dd774519a9c@0.1.0",
    "nodes": {
      "1": {
        "id": 1,
        "data": {
          "code": "outputs[\"Output\"] = {}"
        },
        "inputs": {},
        "outputs": {
          "Output": {
            "connections": []
          }
        },
        "position": [
          100,
          100
        ],
        "name": "Start"
      },
      "2": {
        "id": 2,
        "data": {
          "payloadView": {},
          "color": "BRIGHTGRAY"
        },
        "inputs": {
          "input": {
            "connections": []
          }
        },
        "outputs": {
          "Output": {
            "connections": []
          }
        },
        "position": [
          400,
          100
        ],
        "name": "Bsync"
      }
    }
  }
export let unconnectedGraphExpectedParse =
{
    "id": "1a5abcee-a6da-45ad-a1c9-1dd774519a9c@0.1.0",
    "nodes": {
      "1": {
        "id": 1,
        "data": {
          "code": "let outputs = {};\noutputs[\"Output\"] = {}\nreturn outputs;"
        },
        "inputs": [],
        "outputs": {
          "Output": []
        },
        "type": "Start"
      },
      "2": {
        "id": 2,
        "data": {
          "code": "nodesLists[\"active\"].get(\"2\").incrementAndGet();\n\n                bp.sync( {} );\n\n                nodesLists[\"active\"].get(\"2\").decrementAndGet();\n\n                selectedEvents.add(2);\n\nlet outputs = {};\noutputs[\"Output\"] = payload;\nreturn outputs;"
        },
        "inputs": [],
        "outputs": {
          "Output": []
        },
        "type": "General"
      }
    }
  }