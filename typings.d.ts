import { Type } from "typescript";

interface Board {
  columns: Map<TypedColumn, Column>;
}

type TypedColumn = "NO_PROGRESS" | "IN_PROGRESS" | "DONE" | "BLOCKED" | "BACKLOG" | "WISH" | "PLANNED"

interface Column {
    id: TypedColumn,
    todos: Todo[]
}

interface Todo {
    $id: string;
    $createdAt: string;
    title: string;
    status: TypedColumn;
    image?: Image;
    tags: string[];
}

interface Image {
    bucketId: string;
    fileId: string;
}
