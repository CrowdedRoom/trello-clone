import {TypedColumn, Column, Board} from "@/typings";
import {database} from "../appwrite";

export const getTodosGroupedByStatus = async () => {
  const data = await database.listDocuments(
    process.env.NEXT_PUBLIC_DATABASE_ID || "YOUR_APPWRITE_DATABASE_ID",
    process.env.NEXT_PUBLIC_TODOS_COLLECTION_ID || "YOUR_APPWRITE_COLLECTION_ID"
  );

  const todosGroupedByStatus = data.documents.reduce((acc, todo) => {
    const status = todo.status;
    const currentTodos = acc.get(status) || [];
    if (!acc.get(status)) {
      acc.set(status, {
        id: status,
        todos: [],
      });
    }
    acc.get(status)!.todos.push({
      $id: todo.$id,
      $createdAt: todo.$createdAt,
      title: todo.title,
      status: todo.status,
      ...(todo.image && {image: JSON.parse(todo.image)}),
    });

    return acc;
  }, new Map<TypedColumn, Column>());
  const statusTypes: TypedColumn[] = [
    "NO_PROGRESS",
    "PLANNED",
    "IN_PROGRESS",
    "BLOCKED",
    "WISH",
    "BACKLOG",
    "DONE",
  ];
  statusTypes.forEach((status) => {
    if (!todosGroupedByStatus.get(status)) {
      todosGroupedByStatus.set(status, {
        id: status,
        todos: [],
      });
    }
  });
  // sort columns by status
  const sortedTodosGroupedByStatus = new Map(
    Array.from(todosGroupedByStatus.entries()).sort(
      (a, b) => statusTypes.indexOf(a[0]) - statusTypes.indexOf(b[0])
    )
  );
  const board: Board = {
    columns: sortedTodosGroupedByStatus,
  };

  return board;
};
