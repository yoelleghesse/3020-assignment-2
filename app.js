function App() {
  const [boards, setBoards] = React.useState([
    {
      id: 1,
      title: "Main Board",
      tasks: [
        {
          id: 1,
          description: "Our Main Board",
          title: "Task 1",
          createdAt: "date",
          dueDate: "date",
        },
      ],
    },
  ]);
    //Function to delete a board
  function deleteBoard(boardId) {
    setBoards((prevBoards) =>
      prevBoards.filter((board) => board.id !== boardId),
    );
  }

  // Function to add a new board
  function addBoard(title) {
    setBoards((prevBoards) => [
      ...prevBoards,
      { id: Date.now(), title: "Sub Board", tasks: [] },
    ]);
  }

  return (
    <div>
      <h1>Kanban Board Demo</h1>
      <button onClick={() => addBoard("To Do")}>Add Board</button>

      {boards.map((board) => (
        <Board
          key={board.id}
          board={board}
          setBoards={setBoards}
          deleteBoard={deleteBoard}
        />
      ))}
    </div>
  );
}

// Board component
function Board({ board, setBoards, deleteBoard }) {
  function addTask() {
    const newTask = {
      id: Date.now(),
      title: `Task ${board.tasks.length + 1}`,
      description: "",
      createdAt: new Date().toISOString(),
      dueDate: "",
    };

    setBoards((prevBoards) =>
      prevBoards.map((b) =>
        b.id === board.id ? { ...b, tasks: [...b.tasks, newTask] } : b,
      ),
    );
  }

  function deleteTask(taskId) {
    setBoards((prevBoards) =>
      prevBoards.map((b) =>
        b.id === board.id
          ? { ...b, tasks: b.tasks.filter((t) => t.id !== taskId) }
          : b,
      ),
    );
  }

  return (
    <div style={{ border: "1px solid black", padding: "10px", margin: "10px" }}>
      <h2>{board.title}</h2>
      <button onClick={() => deleteBoard(board.id)}>Delete Board</button>
      <button onClick={addTask}>Add Task</button>

      {board.tasks.map((task) => (
        <div
          key={task.id}
          style={{ border: "1px solid gray", padding: "5px", margin: "5px" }}
        >
          <h4>{task.title}</h4>
          <p>{task.description}</p>
          <button onClick={() => deleteTask(task.id)}>Delete Task</button>
        </div>
      ))}
    </div>
  );
}

// Render App
const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(<App />);
