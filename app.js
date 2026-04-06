function App() {
  const [boards, setBoards] = React.useState(() => {
    const saved = localStorage.getItem("boards");
    return saved
      ? JSON.parse(saved)
      : [
          {
            id: 1,
            title: "Main Board",
            tasks: [],
          },
        ];
  });

  // Save to localStorage whenever boards change
  React.useEffect(() => {
    localStorage.setItem("boards", JSON.stringify(boards));
  }, [boards]);

  function deleteBoard(boardId) {
    setBoards((prevBoards) =>
      prevBoards.filter((board) => board.id !== boardId),
    );
  }

  function addBoard(title) {
    setBoards((prevBoards) => [
      ...prevBoards,
      { id: Date.now(), title: title, tasks: [] },
    ]);
  }

  return (
    <div>
      <h1>Kanban Board Demo</h1>
      <button onClick={() => addBoard("New Board")}>Add Board</button>

      <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
        {boards.map((board) => (
          <Board
            key={board.id}
            board={board}
            setBoards={setBoards}
            deleteBoard={deleteBoard}
          />
        ))}
      </div>
    </div>
  );
}

//Board component
function Board({ board, setBoards, deleteBoard }) {
  const columns = ["To Do", "In Progress", "Done"];

  function addTask() {
    const title = prompt("Enter task title:");
    if (!title) return;

    const description = prompt("Enter short description:");

    const newTask = {
      id: Date.now(),
      title: title,
      description: description || "",
      createdAt: new Date().toISOString(),
      dueDate: "",
      status: "To Do",
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

  // Move task to another column
  function moveTask(taskId, newStatus) {
    setBoards((prevBoards) =>
      prevBoards.map((b) =>
        b.id === board.id
          ? {
              ...b,
              tasks: b.tasks.map((t) =>
                t.id === taskId ? { ...t, status: newStatus } : t,
              ),
            }
          : b,
      ),
    );
  }

  return (
    <div style={{ border: "1px solid black", padding: "10px", margin: "10px" }}>
      <h2>{board.title}</h2>
      <button onClick={() => deleteBoard(board.id)}>Delete Board</button>
      <button onClick={addTask}>Add Task</button>

      {/* List of all task on the board */}
      <div style={{ margin: "10px 0" }}>
        <h4>All Tasks:</h4>
        {board.tasks.map((task) => (
          <div key={task.id} style={{ margin: "2px 0" }}>
            <strong>{task.title}</strong> — {task.status}
            <br />
            <button
              onClick={() => deleteTask(task.id)}
              style={{ marginLeft: "5px" }}
            >
              Delete
            </button>
          </div>
        ))}
      </div>

      {/* Columns for drag-and-drop */}
      <div style={{ display: "flex", gap: "20px" }}>
        {columns.map((columnName) => {
          const tasksInColumn = board.tasks.filter(
            (task) => task.status === columnName,
          );
          return (
            <div
              key={columnName}
              onDragOver={(e) => e.preventDefault()}
              onDrop={(e) => {
                const draggedTaskId = Number(e.dataTransfer.getData("taskId"));
                moveTask(draggedTaskId, columnName);
              }}
              style={{
                border: "1px solid black",
                padding: "10px",
                width: "150px",
                minHeight: "50px",
              }}
            >
              <h3>{columnName}</h3>
              {tasksInColumn.map((task) => (
                <div
                  key={task.id}
                  draggable
                  onDragStart={(e) =>
                    e.dataTransfer.setData("taskId", String(task.id))
                  }
                  style={{
                    border: "1px solid gray",
                    margin: "5px",
                    padding: "5px",
                    backgroundColor: "#f9f9f9",
                  }}
                >
                  <strong>{task.title}</strong>
                  <div style={{ fontSize: "12px", marginTop: "4px" }}>
                    {task.description}
                  </div>
                </div>
              ))}
            </div>
          );
        })}
      </div>
    </div>
  );
}

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(<App />);
