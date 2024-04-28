"use client"
import React, { useState, useRef, useCallback, DragEvent } from 'react';
import ReactFlow, {
  ReactFlowProvider,
  addEdge,
  useNodesState,
  useEdgesState,
  Controls,
  StraightEdge,
} from 'reactflow';
import 'reactflow/dist/style.css';

import SideBar from '@/components/SideBar';
import Link from 'next/link';





let id = 0;
//const getId = () => `dndnode_${id++}`;
const edgeTypes = {
  default: StraightEdge,
};

const DnDFlow = () => {
  const reactFlowWrapper = useRef(null);
  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);
  const [reactFlowInstance, setReactFlowInstance] = useState(null);
  

  
  const onConnect = useCallback(
    (params:any) => setEdges((eds) => addEdge(params, eds)),
    [],
  );

  const onDragOver = useCallback((event:any) => {
    event.preventDefault();
    event.preventDefault();
    if (event.dataTransfer) { // Check if dataTransfer exists
      event.dataTransfer.dropEffect = 'move';
    }
  }, []);

  const onDrop = useCallback(
    
    (event:any) => {
      event.preventDefault();

      const type = event.dataTransfer.getData('application/reactflow');
      const value = event.dataTransfer.getData('label');
      

      // check if the dropped element is valid
      if (typeof type === 'undefined' || !type) {
        return;
      }
      const existingNode = nodes.find((node) => node.data.label === value);

    if (existingNode) {
      // Node already exists, handle it (e.g., show a message)
      alert(`"${value}" already exists.`);
      return;
    }

         
      
      //@ts-ignore
      const position = reactFlowInstance.screenToFlowPosition({
        x: event.clientX,
        y: event.clientY,
      });
      const newNode = {
        id: value,
        type,
        position,
        data: { label: value },
      };

      setNodes((nds) => nds.concat(newNode));
      console.log(edges);
     
    },
    [reactFlowInstance,nodes],
  );

  const deleteNode = useCallback(
    (nodeId: string) => {
      setNodes((currentNodes) => currentNodes.filter((node) => node.id !== nodeId));

      // Update edges to remove those connected to the deleted node
      setEdges((currentEdges) =>
        currentEdges.filter(
          (edge) => edge.source !== nodeId && edge.target !== nodeId
        )
      );
    },
    [setNodes, setEdges],
  );

  const onNodesDelete = useCallback(
    //@ts-ignore
    (deletedNodes) => {
      //@ts-ignore
      deletedNodes.forEach((deletedNode) => deleteNode(deletedNode.id));
    },
    [deleteNode],
  );

  const saveWorkflow = useCallback(() => {
    const sourceNames = edges.map(edge => edge.source);
    const targetNames = edges.map(edge => edge.target);
    if(!targetNames.includes('Stop')){
      alert('Please connect to the Stop node');
      return;
    }
    
    const existingWorkflows = JSON.parse(localStorage.getItem('workflows') ?? '{}');
    const uniqueId = Date.now().toString();
    existingWorkflows[uniqueId] = sourceNames;

    // Save the updated workflows object back to localStorage
    localStorage.setItem('workflows', JSON.stringify(existingWorkflows));

    console.log('Workflow saved to localStorage with ID:', uniqueId);
  }, [edges]);
  
  return (
    <>
    <div className='flex flex-row ml-[48vw]'>
    <button className=' text-white mr-4 mt-5 p-2 mb-7 border-b flex items-center justify-center bg-blue-700 rounded-lg'
    onClick={saveWorkflow}
    > Save</button>
    <button className=' text-white mt-5 p-2 mb-7 border-b flex items-center justify-center bg-blue-700 rounded-lg'
    
    ><Link href={'/upload'}> Upload</Link></button>
    </div>
    <div className="dndflowh flex flex-row">
      {/* <ReactFlowProvider> */}
      <SideBar />
        <div className=" reactflow-wrapper" ref={reactFlowWrapper}>
        
          <div className=' h-[80vh] w-[80vw]'>
          <ReactFlow 
            nodes={nodes}
            edges={edges}
            onNodesChange={onNodesChange}
            onEdgesChange={onEdgesChange}
            onConnect={onConnect}
            edgeTypes={edgeTypes}
            //@ts-ignore
            onInit={setReactFlowInstance}
            onDrop={onDrop}
            onDragOver={onDragOver}
            fitView
            onNodesDelete={onNodesDelete}
          >
            <Controls />
          </ReactFlow>
          </div>
          
        </div>
        
       
      {/* </ReactFlowProvider> */}
    </div>
    </>    
  );
};

export default DnDFlow;
