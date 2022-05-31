import Pusher from 'pusher-js';
import React, { useCallback, useEffect } from 'react';
import ReactFlow, {
  addEdge,
  MiniMap,
  Controls,
  Background,
  useNodesState,
  useEdgesState,
  ReactFlowProvider,
  useReactFlow,
} from 'react-flow-renderer';
import axios from '../axios'; 
import OnHoverDisplay  from './OnHoverDisplay';
import { useStateValue } from '../StateProvider';

const onInit = (reactFlowInstance) => console.log('flow loaded:', reactFlowInstance);
const pusher = new Pusher('d2e40102bb65c4ab886c', {
  cluster: 'ap4'
});

const nodeTypes = { hoverDisplay: OnHoverDisplay };

let edgenum = 0;

const OverviewFlow = () => {
  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);
  const [{ user }] = useStateValue();
  const onConnect = (params) => setEdges((eds) => addEdge(params, eds));
  
  const reactFlowInstance = useReactFlow();
  
  const update = useCallback(() => {
    axios.get('/get/users').then((res) => {
      for (var key in res.data) {
        const newNode = {
          id: key,
          type: 'hoverDisplay',
          position: {
            x: Math.random() * 500,
            y: Math.random() * 500,
          },
          data: {
            keys: key,  
            value: res.data[key]
          },
        };
        reactFlowInstance.addNodes(newNode);
      }
    })   

    const sources = user.id
    axios.get(`/get/peoplelist?id=${user.id}`).then((res) => {
      for (var pep in res.data) {
        console.log(res.data)
        console.log(sources)
        console.log(res.data[pep].id)
        const id = `${++edgenum}`;
        const newEdge = {
          id, 
          source: sources, 
          target: res.data[pep].id, 
        }
        onConnect(newEdge)
      }
    })
    
  }, []);
    
  useEffect(() => {
    update()
    //realtime processing
    const channel = pusher.subscribe('chats');

    channel.bind('newChats', function(data) {
      update()
    });

  }, [])

  return (
    <ReactFlow
      nodes={nodes}
      edges={edges}
      onNodesChange={onNodesChange}
      onEdgesChange={onEdgesChange}
      onConnect={onConnect}
      onInit={onInit}
      nodeTypes={nodeTypes}
      fitView
      attributionPosition="top-right"
    >
      <MiniMap
        nodeStrokeColor={(n) => {
          if (n.style?.background) return n.style.background;
          if (n.type === 'input') return '#0041d0';
          if (n.type === 'output') return '#ff0072';
          if (n.type === 'default') return '#1a192b';

          return '#eee';
        }}
        nodeColor={(n) => {
          if (n.style?.background) return n.style.background;

          return '#fff';
        }}
        nodeBorderRadius={2}
      />
      <Controls />
      <Background color="#aaa" gap={16} />
    </ReactFlow>
  );
};


export default function () {
  return (
    <ReactFlowProvider>
      <OverviewFlow />
    </ReactFlowProvider>
  );
}
