Base graphing calculator that can be scaled to calculate many different graphing algorithms and visualizations

Live demo @ 

Currently uses a recursive implementation of [deletion-contraction](https://en.wikipedia.org/wiki/Deletion%E2%80%93contraction_formula#Spanning_trees) to find Tau of G, that is:

τ(G) = τ(G-e) + τ(G\e)

As well as a depth first search to ensure connectivity of graph.
