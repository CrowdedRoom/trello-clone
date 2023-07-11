import {ID, database, storage} from "@/appwrite";
import {Board, TypedColumn, Column, Todo, Image} from "@/typings";
import {getTodosGroupedByStatus} from "@/utils/getTodosGroupedByStatus";
import uploadImage from "@/utils/uploadImage";
import {create} from "zustand";
import {devtools, persist} from "zustand/middleware";

export interface BoardState {
  board: Board;
  getBoard: () => void;
  setBoardState: (board: Board) => void;
  updateTodoInDB: (todo: Todo, columnId: TypedColumn) => void;
  searchString: string;
  setSearchString: (searchString: string) => void;
  deleteTask: (taskIndex: number, todo: Todo, id: TypedColumn) => void;
  newTaskInput: string;
  setNewTaskInput: (newTaskInput: string) => void;
  newTaskType: TypedColumn;
  setNewTaskType: (newTaskType: TypedColumn) => void;
  image: File | null;
  setImage: (image: File | null) => void;
  addTask: (todo: string, columnId: TypedColumn, image?: File | null) => void;
}

export const useBoardStore = create<BoardState>((set, get) => ({
  board: {
    columns: new Map<TypedColumn, Column>(),
  },
  addTask: async (todo: string, columnId: TypedColumn, image?: File | null) => {
    let file: Image | undefined;
    if (image) {
      const fileUpload = await uploadImage(image);
      if (fileUpload) {
        file = {
          bucketId: fileUpload.bucketId,
          fileId: fileUpload.$id,
        };
      }
    }

    const {$id} = await database.createDocument(
      process.env.NEXT_PUBLIC_DATABASE_ID!,
      process.env.NEXT_PUBLIC_TODOS_COLLECTION_ID!,
      ID.unique(),
      {
        title: todo,
        status: columnId,
        ...(file && {image: JSON.stringify(file)}),
      }
    );
    set({newTaskInput: ""});
    set((state) => {
      const newColumns = new Map(state.board.columns);
      const newTodo: Todo = {
        $id,
        $createdAt: new Date().toISOString(),
        title: todo,
        status: columnId,
        tags: [],
        ...(file && {image: file}),
      };
      const column = newColumns.get(columnId);
      if (!column) {
        newColumns.set(columnId, {
          id: columnId,
          todos: [newTodo],
        });
      } else {
        newColumns.get(columnId)?.todos.push(newTodo);
      }
      return {board: {columns: newColumns}};
    });
  },
  searchString: "",
  setSearchString: (searchString: string) => {
    set({searchString});
  },
  getBoard: async () => {
    const board = await getTodosGroupedByStatus();
    set({board});
  },
  setBoardState: (board: Board) => {
    set({board});
  },
  updateTodoInDB: async (todo: Todo, columnId: TypedColumn) => {
    await database.updateDocument(
      process.env.NEXT_PUBLIC_DATABASE_ID || "YOUR_APPWRITE_DATABASE_ID",
      process.env.NEXT_PUBLIC_TODOS_COLLECTION_ID ||
        "YOUR_APPWRITE_COLLECTION_ID",
      todo.$id,
      {
        title: todo.title,
        status: columnId,
      }
    );
  },
  deleteTask: async (taskIndex: number, todo: Todo, id: TypedColumn) => {
    const newColumns = new Map(get().board.columns);

    newColumns.get(id)?.todos.splice(taskIndex, 1);

    set({board: {columns: newColumns}});

    if (todo.image) {
      await storage.deleteFile(todo.image.bucketId, todo.image.fileId);
    }

    await database.deleteDocument(
      process.env.NEXT_PUBLIC_DATABASE_ID || "YOUR_APPWRITE_DATABASE_ID",
      process.env.NEXT_PUBLIC_TODOS_COLLECTION_ID ||
        "YOUR_APPWRITE_COLLECTION_ID",
      todo.$id
    );
  },
  newTaskInput: "",
  setNewTaskInput: (newTaskInput: string) => {
    set({newTaskInput});
  },
  newTaskType: "NO_PROGRESS",
  setNewTaskType: (newTaskType: TypedColumn) => {
    set({newTaskType});
  },
  image: null,
  setImage: (image: File | null) => {
    set({image});
  },
}));
