"use client";

import {useEffect} from "react";
import {DragDropContext, DropResult, Droppable} from "react-beautiful-dnd";
import {useBoardStore} from "@/store/BoardStore";
import Column from "./Column";
import {Column as ColumnType} from "@/typings";
import {start} from "repl";

const Board = () => {
  const [getBoard, board, setBoardState, updateTodoInDB] = useBoardStore(
    (state) => [
      state.getBoard,
      state.board,
      state.setBoardState,
      state.updateTodoInDB,
    ]
  );
  useEffect(() => {
    getBoard();
  }, [getBoard]);

  const handleOnDragEnd = (result: DropResult) => {
    const {destination, source, type} = result;
    // if outside do nothing
    if (!destination || !source) return;

    // handle column drag
    if (type === "column") {
      const entries = Array.from(board.columns.entries());
      const [removed] = entries.splice(source.index, 1);
      entries.splice(destination.index, 0, removed);
      const newColumns = new Map(entries);
      setBoardState({...board, columns: newColumns});
    }

    const columns = Array.from(board.columns);
    const startColIndex = columns[Number(source.droppableId)];
    const endColIndex = columns[Number(destination.droppableId)];
    if(source.droppableId === destination.droppableId) return;
    const startColumn: ColumnType = {
      id:  startColIndex[0],
      todos:  startColIndex[1].todos,
    };
    const endColumn: ColumnType = {
      id: endColIndex[0],
      todos: endColIndex[1].todos,
    };

    if (!startColumn.id || !endColumn.id) return;

    if (source.index === destination.index && startColumn.id === endColumn.id)
      return;

    const newTodos = startColumn.todos;
    const [todoMoved] = newTodos.splice(source.index, 1);

    if (startColumn.id === endColumn.id) {
      // same column task drag
      newTodos.splice(destination.index, 0, todoMoved);
      const newCol = {
        id: startColumn.id,
        todos: newTodos,
      };
      const newColumns = new Map(board.columns);
      newColumns.set(startColumn.id, newCol);
      updateTodoInDB(todoMoved, endColumn.id);
      setBoardState({...board, columns: newColumns});
    } else {
      // dragging to another column
      const finishedTodos = Array.from(endColumn.todos);
      finishedTodos.splice(destination.index, 0, todoMoved);
      const newEndCol = {
        id: endColumn.id,
        todos: finishedTodos,
      };
      const newStartCol = {
        id: startColumn.id,
        todos: newTodos,
      };
      const newColumns = new Map(board.columns);
      newColumns.set(endColumn.id, newEndCol);
      newColumns.set(startColumn.id, newStartCol);
      updateTodoInDB(todoMoved, endColumn.id);
      setBoardState({...board, columns: newColumns});
      // updateBoard(board);
    }
  };

  return (
    <DragDropContext onDragEnd={handleOnDragEnd}>
      <Droppable droppableId='board' direction='horizontal' type='column'>
        {(provided) => (
          <div
            className='grid grid-cols-1 md:grid-cols-3 gap-5 max-w-7xl mx-auto'
            {...provided.droppableProps}
            ref={provided.innerRef}
          >
            {Array.from(board.columns.entries()).map(([id, column], index) => (
              <Column key={id} id={id} todos={column.todos} index={index} />
            ))}
            <div className='flex flex-col w-80 mr-4'></div>
            <div className='flex flex-col w-80 mr-4'></div>
            <div className='flex flex-col w-80 mr-4'></div>
            <div className='flex flex-col w-80 mr-4'></div>
            <div className='flex flex-col w-80 mr-4'></div>
            <div className='flex flex-col w-80 mr-4'></div>
            <div className='flex flex-col w-80 mr-4'></div>
          </div>
        )}
      </Droppable>
    </DragDropContext>
  );
};
export default Board;
