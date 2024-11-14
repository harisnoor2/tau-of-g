const svg = document.getElementsByTagName("svg")[0];
const edgesGroup = document.getElementById("edges");
const verticesGroup = document.getElementById("vertices");
let selectedVertex = null;
const userGraph = new Graph();

class Graph {
    constructor() {
        this.vertices = [];
        this.vertexCount = 1;
    }

    clear() {
        for (const vertex of this.vertices) {
            if (vertex != null) {
                vertex.delVertex(this)
            }
        }
        this.vertices = [];
        this.vertexCount = 1;
    }
}

class Vertex {
    constructor(id) {
        this.neighbours = [];
        this.id = id
    }
}



//let adjacencyMatrix = [];
let vertexCount = 1;
let vertexList = [];

class Vertex {
    constructor(x,y) {
        this.neighbours = [];
        this.id = vertexCount;
        const newVertex = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
        newVertex.setAttribute('cx', x);
        newVertex.setAttribute('cy', y);
        newVertex.setAttribute('r', 15);
        newVertex.setAttribute('fill', 'red')
        newVertex.setAttribute('class', 'vertex');
        newVertex.setAttribute("id", vertexCount);
        verticesGroup.appendChild(newVertex);
        vertexCount++;
    }

    static addEdge(x1,y1,x2,y2,edgeId,vertex1,vertex2, vertexList) {

        vertexList[vertex1-1].neighbours.push(vertex2)
        vertexList[vertex2-1].neighbours.push(vertex1)
        return;
    }

    delVertex(vertexList) {
        const id = this.id;
        const vertex = vertexList[id-1];
        const neighbours = vertex.neighbours;
        let edgesToDelete = [];

        for (const neighbour of neighbours) {
            const sortedId = [vertex.id, vertexList[neighbour-1].id].sort()
            const edgeId = sortedId.join('-');
            edgesToDelete.push(edgeId)
        }
        for (const edge of edgesToDelete) {
            Vertex.delEdge(edge, vertexList);
        }
        const vertexToDelete = document.getElementById(id)
        vertexToDelete.remove()
        vertexList[id-1] = null;
        return;
    }
    
    static delEdge(id, vertexList) {
        const [vertex1, vertex2] = id.split("-").map(Number);
        let index = vertexList[vertex1-1].neighbours.indexOf(vertex2)
        vertexList[vertex1-1].neighbours.splice(index, 1);
        index = vertexList[vertex2-1].neighbours.indexOf(vertex1)
        vertexList[vertex2-1].neighbours.splice(index, 1);
        const edge = document.getElementById(id)
        edge.remove()
        return;
    }
}
let mode = "vertex";
document.getElementById('vertex').addEventListener('change', function() {
                                                                mode = "vertex"; 
                                                                selectedVertex != null ? selectedVertex.setAttribute("fill", "red") : null;
                                                            });
document.getElementById('edge').addEventListener('change', () => { mode = "edge"; });
document.getElementById('delete').addEventListener('change', function() {
                                                                mode = "delete"; 
                                                                selectedVertex != null ? selectedVertex.setAttribute("fill", "red") : null;

});

graph.addEventListener('click', function(event) {
    switch(mode) {

        case "vertex":
            if (event.target != graph) {
                return;
            }
            const graphArea = graph.getBoundingClientRect();
            const x = event.clientX - graphArea.left;
            const y = event.clientY - graphArea.top;
            vertexList[vertexCount-1] = new Vertex(x, y);
            break

        case "edge":
            if (!event.target.classList.contains("vertex")) {
                return;
            }
            if (selectedVertex == event.target) {
                selectedVertex.setAttribute("fill", "red")
                selectedVertex = null;
                return;
            }
            if (selectedVertex == null) {
                selectedVertex = event.target;
                selectedVertex.setAttribute("fill", "lightblue");
                return;
            }
            
            const sortedId = [Number(selectedVertex.getAttribute('id')), Number(event.target.getAttribute('id'))].sort()
            const edgeId = sortedId.join('-');
            const [vertex1, vertex2] = sortedId

            for (const neighbour of vertexList[vertex1-1].neighbours) {
                if (neighbour == vertex2) {
                    alert("Added multiple edge!");
                }
            }
            const x1 = selectedVertex.getAttribute('cx');
            const y1 = selectedVertex.getAttribute('cy');
            const x2 = event.target.getAttribute('cx');
            const y2 = event.target.getAttribute('cy');
            const edge = document.createElementNS('http://www.w3.org/2000/svg', 'line'); 
            edge.setAttribute('x1', x1);
            edge.setAttribute('y1', y1);
            edge.setAttribute('x2', x2);
            edge.setAttribute('y2', y2);
            edge.setAttribute('class', 'edge');
            edge.setAttribute('id', edgeId);
            edgesGroup.appendChild(edge);
            selectedVertex.setAttribute('fill', 'red');
            selectedVertex = null;
            Vertex.addEdge(x1,y1,x2,y2,edgeId,vertex1,vertex2,vertexList);
            break

        case "delete":
            if (event.target.classList.contains("vertex")) {
                const id = event.target.getAttribute('id')
                vertexList[id-1].delVertex(vertexList);
            } else if (event.target.classList.contains("edge")) {
                Vertex.delEdge(event.target.getAttribute('id'), vertexList);
            }
            break
    }
    console.log(vertexList.length);
    console.log(vertexList)
});


const clearButton = document.getElementById("clear");
const calculateButton = document.getElementById("calculate");

clearButton.addEventListener("click", function() {
    for (const vertex of vertexList) {
        if (vertex != null) {
            vertex.delVertex(vertexList)
        }
    }
    vertexList = [];
    vertexCount = 1;
});

function isConnected() {
    let trueVertexCount = 0
    let root = null
    for (const vertex of vertexList) {
        if (vertex != null) {
            if (root == null) {
                root = vertex
            }
            trueVertexCount++;
        }
    }

    if (root == null) {
        alert("graph is empty");
        return;
    }

    const visited = new Set();

    function depthFirstSearch(id) {
        visited.add(id);
        for (const neighbour of vertexList[id-1].neighbours) {
            if (!visited.has(neighbour)) {
                depthFirstSearch(neighbour);
            }
        }
    }

    depthFirstSearch(root.id)

    if (visited.size != trueVertexCount) {
        return false;
    } else {
        return true;
    }


}


calculateButton.addEventListener("click", function() {
    if (!isConnected()) {
        alert("graph is unconnected")
        return;
    }
    const graphG = structuredClone(vertexList.filter(vertex => vertex !== null));


    function tauOfG(graphG) {
        //return tauOfG(G-e) + tauOfG(G\e);
    }

    console.log(tauOfG(vertexList));

});
