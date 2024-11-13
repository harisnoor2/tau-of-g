const graph = document.getElementsByTagName("svg")[0];
const edges = document.getElementById("edges");
const vertices = document.getElementById("vertices");

let adjacencyMatrix = [];
let vertex_count = 1;
let selected_vertex = null;


function addVertex(x,y) {
    
}
const graphArea = graph.getBoundingClientRect();

const vertex = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
vertex.setAttribute('cx', 100);
vertex.setAttribute('cy', 100);
vertex.setAttribute('class', 'vertex');
vertex.setAttribute("id", vertex_count);
vertices.appendChild(vertex);
vertex_count++;

graph.addEventListener('click', function(event) {
    let mode = "vertex";
    if (document.getElementById('vertex').checked) {
        mode = "vertex";
    } else if (document.getElementById('edge').checked) {
        mode = "edge";
    } else if (document.getElementById("delete").checked) {
        mode = "delete";
    }

    switch(mode) {

        case "vertex":
            if (event.target != graph) {
                return;
            }
            const graphArea = graph.getBoundingClientRect();
            const x = event.clientX - graphArea.left;
            const y = event.clientY - graphArea.top;
            const vertex = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
            vertex.setAttribute('cx', x);
            vertex.setAttribute('cy', y);
            vertex.setAttribute('r', 15);
            vertex.setAttribute('class', 'vertex');
            vertex.setAttribute("id", vertex_count);
            vertices.appendChild(vertex);
            vertex_count++;
            break

        case "edge":
            if (!event.target.classList.contains("vertex")) {
                return;
            }
            if (selected_vertex == event.target) {
                selected_vertex.setAttribute("fill", "red")
                selected_vertex = null;
                return;
            }
            if (selected_vertex == null) {
                selected_vertex = event.target;
                selected_vertex.setAttribute("fill", "blue")
                return;
            }
            const edge_id = [Number(selected_vertex.getAttribute('id')), Number(event.target.getAttribute('id'))].sort().join('-');
            const edge = document.createElementNS('http://www.w3.org/2000/svg', 'line');
            const x1 = selected_vertex.getAttribute('cx');
            const y1 = selected_vertex.getAttribute('cy');
            const x2 = event.target.getAttribute('cx');
            const y2 = event.target.getAttribute('cy');  
            edge.setAttribute('x1', x1);
            edge.setAttribute('y1', y1);
            edge.setAttribute('x2', x2);
            edge.setAttribute('y2', y2);
            edge.setAttribute('stroke', 'black');
            edge.setAttribute('stroke-width', 2);
            edge.setAttribute('class', 'edge')
            edge.setAttribute('id', edge_id)
            edges.appendChild(edge)
            selected_vertex.setAttribute('fill', 'red'
            )
            selected_vertex = null;

            break

        case "delete":
            if (event.target == graph) {
                return
            }
            console.log(`adsasdasdsa`)
            break

    }
});
