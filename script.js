const svg = document.getElementsByTagName("svg")[0];
const edgesGroup = document.getElementById("edges");
const verticesGroup = document.getElementById("vertices");
const clearButton = document.getElementById("clear");
const calculateButton = document.getElementById("calculate");
let selectedVertex = null;
let mode = "vertex";

class Graph {
    constructor() {
        this.vertices = [];
        this.vertexCount = 0;
    }

    createVertex() {
        const newVertex = new Vertex(this.vertexCount);
        this.vertices.push(newVertex);
        this.vertexCount++;
    }

    isEmpty() {
        return this.vertices.length == 0;
    }

    isConnected() {
        const root = this.vertices.find(element => element != null);
        let trueVertexCount = 0;
        for (const vertex of this.vertices) {
            if (vertex != null) {
                trueVertexCount++;
            }
        }

        const visited = new Set();

        const depthFirstSearch = (id) => {
            visited.add(id);
            for (const neighbour of this.vertices[id].neighbours) {
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

    clear() {
        this.vertices = [];
        this.vertexCount = 0;
    }

    getNeighbours(v1) {
        return this.vertices[v1].neighbours
    }

    areNeighbours(v1, v2) {
        for (const neighbour of this.vertices[v1].neighbours) {
            if (neighbour == v2) {
                return true;
            }
        }
        return false;
    }

    addEdge(v1, v2) {
        this.vertices[v1].neighbours.push(v2);
        this.vertices[v2].neighbours.push(v1); 
    }

    delVertex(v1) {
        const edgesToDelete = [];
        for (const neighbour of this.vertices[v1].neighbours) {
            edgesToDelete.push(neighbour)
        }
        for (const v2 of edgesToDelete) {
            this.delEdge(v1, v2);
        }
        this.vertices[v1] = null;
        if (this.vertices.length == 0) {
            this.vertexCount = 0;
        }
        if (this.vertices.every(entry => entry == null)) {
            this.clear()
        }
    }

    delEdge(v1, v2) {
        const indexV1 = this.vertices[v1].neighbours.indexOf(v2);
        this.vertices[v1].neighbours.splice(indexV1, 1);
    
        const indexV2 = this.vertices[v2].neighbours.indexOf(v1);
        this.vertices[v2].neighbours.splice(indexV2, 1);
    }
}

class Vertex {
    constructor(id) {
        this.neighbours = [];
        this.id = id
    }

    clone() {
        const clonedVertex = new Vertex(this.id);
        clonedVertex.neighbours = [...this.neighbours];
        return clonedVertex;
    }
}

document.getElementById('vertex').addEventListener('change', function() {
                                                                mode = "vertex"; 
                                                                selectedVertex != null ? selectedVertex.setAttribute("fill", "red") : null;
                                                            });
document.getElementById('edge').addEventListener('change', () => { mode = "edge"; });
document.getElementById('delete').addEventListener('change', function() {
                                                                mode = "delete"; 
                                                                selectedVertex != null ? selectedVertex.setAttribute("fill", "red") : null;

});

const userGraph = new Graph();
svg.addEventListener('click', function(event) {
    switch(mode) {
        case "vertex": {
            if (event.target != svg) {
                return;
            }
            const svgArea = svg.getBoundingClientRect();
            const x = event.clientX - svgArea.left;
            const y = event.clientY - svgArea.top;

            const vertexGroup = document.createElementNS('http://www.w3.org/2000/svg', 'g');
            vertexGroup.setAttribute('class', 'vertex-group');

            const vertexCircle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
            vertexCircle.setAttribute('cx', x);
            vertexCircle.setAttribute('cy', y);
            vertexCircle.setAttribute('r', 15);
            vertexCircle.setAttribute('fill', 'red')
            vertexCircle.setAttribute('class', 'vertex');
            vertexCircle.setAttribute("id", userGraph.vertexCount);

            const label = document.createElementNS('http://www.w3.org/2000/svg', 'text');
            label.textContent = userGraph.vertexCount;
            label.setAttribute('x', x);
            label.setAttribute('y', y + 5);
            label.setAttribute('class', 'vertex-label');

            vertexGroup.appendChild(vertexCircle);
            vertexGroup.appendChild(label);
            verticesGroup.appendChild(vertexGroup);

            userGraph.createVertex()
            break
        }
        case "edge": {
            let chosen = null;
            if (event.target.classList.contains("vertex")) {
                chosen = event.target;
            } else if (event.target.classList.contains("vertex-label")) {
                chosen = event.target.parentNode.firstElementChild;
            } else {
                return;
            }

            if (selectedVertex == chosen) {
                selectedVertex.setAttribute("fill", "red")
                selectedVertex = null;
                return;
            } else if (selectedVertex == null) {
                selectedVertex = chosen;
                selectedVertex.setAttribute("fill", "lightblue");
                return;
            }

            const sortedId = [Number(selectedVertex.getAttribute('id')), Number(chosen.getAttribute('id'))].sort()
            const edgeId = sortedId.join('-');
            const [v1, v2] = sortedId

            if (userGraph.areNeighbours(v1, v2)) {
                alert("multiple edges added");
            }

            const x1 = selectedVertex.getAttribute('cx');
            const y1 = selectedVertex.getAttribute('cy');
            const x2 = chosen.getAttribute('cx');
            const y2 = chosen.getAttribute('cy');
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

            userGraph.addEdge(v1, v2)
            break
        }
        case "delete": {
            let chosen = null;
            if (event.target.classList.contains("vertex")) {
                chosen = event.target;
            } else if (event.target.classList.contains("vertex-label")) {
                chosen = event.target.parentNode.firstElementChild;
            }

            if (chosen != null) {
                const id = Number(chosen.getAttribute('id'));
                const neighbours = userGraph.getNeighbours(id);
                for (const neighbour of neighbours) {
                    const edgeId = [neighbour, id].sort().join('-');
                    document.getElementById(edgeId).remove();
                }
                userGraph.delVertex(id);
                chosen.parentNode.remove()
            } else if (event.target.classList.contains("edge")) {
                const id = event.target.getAttribute('id');
                const [v1, v2] = id.split("-").map(Number);
                userGraph.delEdge(v1, v2);
                event.target.remove()
            }
            break
        }
    }
    //console.log(userGraph);
});

clearButton.addEventListener("click", function() {
    edgesGroup.innerHTML = '';
    verticesGroup.innerHTML = '';
    if (selectedVertex != null) {
        selectedVertex.setAttribute('fill', 'red');
        selectedVertex = null;
    }
    userGraph.clear()
});



calculateButton.addEventListener("click", function() {
    if (selectedVertex != null) {
        selectedVertex.setAttribute('fill', 'red');
        selectedVertex = null;
    }    if (userGraph.isEmpty()) {
        alert("Graph is empty!");
        return;
    } else if (!userGraph.isConnected()) {
        alert("Graph is unconnected!");
        return;
    }
    console.log("OK");
    const graphG = new Graph();//.filter(vertex => vertex != null)
    graphG.vertices = userGraph.vertices.map(vertex => vertex ? vertex.clone() : null);
    //graphG.vertexCount = graphG.vertices.length;
    //console.log(userGraph)
    //console.log(graphG)
    

    function tauOfG(G) {
        if (!G.isConnected()) {
            return 0;
        }
        let trueVertexCount = 0;
        for (const vertex of G.vertices) {
            if (vertex != null) {
                trueVertexCount++;
            }
        }
        if (trueVertexCount == 1) {
            return 1;
        }
        let v1 = null, e = null;
        for (const vertex of G.vertices) {
            if (vertex != null && vertex.neighbours.length > 0) {
                v1 = vertex.id;
                e = vertex.neighbours[0];
                break;
            }
        }
        const gMinusE = new Graph();
        gMinusE.vertices = G.vertices.map(vertex => vertex ? vertex.clone() : null);

        const gContractE = new Graph();
        gContractE.vertices = G.vertices.map(vertex => vertex ? vertex.clone() : null);

        gMinusE.delEdge(v1, e);

        for (const neighbour of gContractE.vertices[e].neighbours) {
            const neighboursNeighbours = gContractE.vertices[neighbour].neighbours;
            const index = neighboursNeighbours.indexOf(e);
            neighboursNeighbours[index] = v1;
        }

        gContractE.vertices[v1].neighbours = gContractE.vertices[v1].neighbours.concat(gContractE.vertices[e].neighbours).filter(neighbour => neighbour != v1 && neighbour != e);
        gContractE.vertices[e].neighbours = [];
        gContractE.delVertex(e);
        return tauOfG(gMinusE) + tauOfG(gContractE);
    }

    console.log(tauOfG(graphG));

});
