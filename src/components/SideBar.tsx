import React from 'react';

const SideBar = () => {
    //@ts-ignore
  const onDragStart = (event, nodeType, label) => {
    event.dataTransfer.setData('application/reactflow', nodeType);
    event.dataTransfer.effectAllowed = 'move';
    event.dataTransfer.setData('label', label);
  };

  return (
    <aside className="dndflow flex flex-col max-w-[20vw] items-start">
      
      <div className="dndnode input border-2 border-blue-500 p-2 rounded-md my-2 cursor-move" onDragStart={(event) => onDragStart(event, 'input', 'Start')} draggable>
        Start
      </div>
      <div className="dndnode border-2 border-gray-500 p-2 rounded-md my-2 cursor-move" onDragStart={(event) => onDragStart(event, 'default', 'Filter Data')} draggable>
        Filter Data
      </div>
      <div className="dndnode border-2 border-gray-500 p-2 rounded-md my-2 cursor-move" onDragStart={(event) => onDragStart(event, 'default', 'Wait')} draggable>
        Wait
      </div>
      <div className="dndnode border-2 border-gray-500 p-2 rounded-md my-2 cursor-move" onDragStart={(event) => onDragStart(event, 'default', 'Convert')} draggable>
        Convert
      </div>
      <div className="dndnode output border-2 border-red-500 p-2 rounded-md my-2 cursor-move" onDragStart={(event) => onDragStart(event, 'output', 'Stop')} draggable>
        Stop
      </div>
    </aside>
  );
};

export default SideBar;
