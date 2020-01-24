import React from 'react';
import { ref, reactive } from '@vue/reactivity';
import { setup } from '../../src/index';
import './index.css';
interface TodoItem {
  title: string;
  done: boolean;
}

const Todo: React.FC = setup(() => {
  const todos = reactive<TodoItem[]>([]);

  const inputValue = ref('');

  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const title = inputValue.value;
    if (title) {
      todos.push({
        title,
        done: false,
      });
    }
    inputValue.value = '';
  };

  return props => {
    return (
      <>
        <form onSubmit={onSubmit}>
          <input
            value={inputValue.value}
            onChange={e => (inputValue.value = e.target.value)}
            placeholder="回车添加待办事项"
          />
        </form>

        <TodoUl todos={todos} />
      </>
    );
  };
});

const TodoUl: React.FC<{ todos: TodoItem[] }> = setup(() => {
  return ({ todos }) => {
    const onToggle = (todo: TodoItem) => (todo.done = !todo.done);
    return (
      <ul>
        {todos.map((todo, index) => {
          return (
            <li
              className={todo.done ? 'todo done' : 'todo'}
              onClick={() => onToggle(todo)}
              key={index}
            >
              {todo.title}
            </li>
          );
        })}
      </ul>
    );
  };
});

export default Todo;
