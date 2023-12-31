import {Todo, TypedColumn} from "@/typings";
import {PlusCircleIcon} from "@heroicons/react/24/solid";
import {Draggable, Droppable} from "react-beautiful-dnd";
import TodoCard from "./TodoCard";
import {useBoardStore} from "@/store/BoardStore";
import {useModalStore} from "@/store/ModalStore";

type Props = {
  id: TypedColumn;
  todos: Todo[];
  index: number;
};

const idToColumnText: {
  [key in TypedColumn]: string;
} = {
  NO_PROGRESS: "No Progress",
  IN_PROGRESS: "In Progress",
  DONE: "Done",
  PLANNED: "Planned",
  BLOCKED: "Blocked",
  WISH: "Wish",
  BACKLOG: "Backlog",
};

const Column = ({id, todos, index}: Props) => {
  const [searchString, setNewTaskType] = useBoardStore((state) => [
    state.searchString,
    state.setNewTaskType,
  ]);
  const openModal = useModalStore((state) => state.openModal);
  function handleAddTask(): void {
    setNewTaskType(id);
    openModal();
  }

  return (
    <Draggable draggableId={id} index={index}>
      {(provided) => (
        <div
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          ref={provided.innerRef}
        >
          <Droppable droppableId={index.toString()} type='card'>
            {(provided, snapshot) => (
              <div
                className={`p-2 rounded-2xl shadow-sm ${
                  snapshot.isDraggingOver ? "bg-green-200" : "bg-white/50"
                } `}
                {...provided.droppableProps}
                ref={provided.innerRef}
              >
                <h2 className='flex justify-between font-bold text-xl p-2'>
                  {idToColumnText[id]}
                  <span className=' text-gray-500 font-normal bg-gray-200 rounded-full px-2 py-1 text-sm'>
                    {!searchString
                      ? todos.length
                      : todos.filter((todo) =>
                          todo.title
                            .toLowerCase()
                            .includes(searchString.toLowerCase())
                        ).length}
                  </span>
                </h2>
                <div className='space-y-2'>
                  {todos.map(
                    (todo, index) =>
                      !(
                        searchString &&
                        !todo.title
                          .toLowerCase()
                          .includes(searchString.toLowerCase())
                      ) && (
                        <Draggable
                          key={todo.$id}
                          draggableId={todo.$id}
                          index={index}
                        >
                          {(provided) => (
                            <TodoCard
                              todo={todo}
                              index={index}
                              id={id}
                              innerRef={provided.innerRef}
                              draggableProps={provided.draggableProps}
                              dragHandleProps={provided.dragHandleProps}
                            />
                          )}
                        </Draggable>
                      )
                  )}
                  {provided.placeholder}
                  <div className='flex items-end justify-end'>
                    <button
                      className='text-green-500 hover:text-green-600'
                      onClick={handleAddTask}
                    >
                      <PlusCircleIcon className='h-8 w-8' />
                    </button>
                  </div>
                </div>
              </div>
            )}
          </Droppable>
        </div>
      )}
    </Draggable>
  );
};
export default Column;
