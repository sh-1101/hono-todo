import { Todo } from "../types/types";
import TodoItem from "./Todo";

interface TodoListProps {
  todos: Todo[];
  onDelete: (id: number) => void;
}

const TodoList = ({ todos, onDelete }: TodoListProps) => {
  return (
    <div className="space-y-4">
      {todos.map((todo) => (
        <TodoItem key={todo.id} todo={todo} onDelete={onDelete} />
      ))}
    </div>
  );
};

export default TodoList;
