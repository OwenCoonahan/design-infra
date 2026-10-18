---
component: graph
title: Node graphs, workflows and diagrams
categories: [graph]
aliases: [network, network graph, node graph, knowledge graph, dependency graph, workflow, flowchart, diagram, connected nodes]
directions:
  - key: editor
    label: Editable workflow
    feel: Distinct nodes, understandable ports and purposeful connection controls.
    when: People construct, connect and edit steps in a workflow or builder.
    avoid: Treating a force-directed explorer as an editor or assuming the demo persists changes.
    intent: [replace, restyle, polish]
    moods: [technical, refined]
    picks: [react-flow/custom-nodes, react-flow/drag-handle, react-flow/custom-edges]
  - key: explorer
    label: Explore connected entities
    feel: Focus a neighborhood, inspect details and understand relationships.
    when: Knowledge networks, dependencies, topology or connected records.
    avoid: Showing every edge with equal emphasis or assuming a node-count performance limit without testing.
    intent: [replace, restyle, polish]
    moods: [technical, trustworthy]
    picks: [cytoscape/layouts, sigma/network, antv-g6/layouts]
  - key: explanation
    label: Explain a system
    feel: A readable diagram with labels that carry the explanation.
    when: Architecture, documentation, processes or state transitions.
    avoid: Introducing an interactive editor when a clear static diagram is sufficient.
    intent: [replace, restyle, polish]
    moods: [technical, minimal]
    picks: [mermaid/flowchart, mermaid/sequence, mermaid/state, beautifui/flowchart]
  - key: bespoke
    label: Custom relationship visualization
    feel: Domain-specific grouping and layout, with explicit interaction rules.
    when: Standard editors and explorers cannot express the product's relationship model.
    avoid: Starting from low-level primitives before checking complete engines.
    intent: [replace, restyle, polish]
    moods: [technical, refined]
    picks: [d3/force, visx/network, echarts/network]
---

First inspect the model: node types, edge direction, weights, hierarchy and whether users edit or only inspect. Check graph size, labels, layout stability, keyboard access and selected-node details. Keep a list/table or readable explanation alongside dense networks. Persisting graph edits, permissions and collaboration are application work, not an automatic benefit of a renderer.

“Graph” also means a numeric chart. Use the chart playbook when the task is a time series, category comparison or distribution. A quantitative Sankey and an editable workflow answer different questions. Preserve the existing stack and choose one compatible engine before adding dependencies. React Flow's core is free; Pro examples and templates are outside this free pilot.
