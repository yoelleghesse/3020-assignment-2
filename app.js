<!doctype html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Kanban Board</title>
  <link rel="stylesheet" href="styles.css" />

  <!-- React -->
  <script crossorigin src="https://unpkg.com/react@18/umd/react.development.js"></script>
  <!-- ReactDOM -->
  <script crossorigin src="https://unpkg.com/react-dom@18/umd/react-dom.development.js"></script>
  <!-- Babel -->
  <script src="https://unpkg.com/@babel/standalone/babel.min.js"></script>
</head>
<body>
  <div id="root"></div>

  <script type="text/babel">

  function App() {
    const [boards, setBoards] = React.useState([
      {
        id: 1,
        title: "Main Board",
        tasks: [
          {
            id: 1,
            title: "Task 1",
            description: "Our Main Board",
            createdAt: "date",
            dueDate: "date",
            status: "To Do"
          },
        ],
      },
    ]);

    // Function to delete a board
    function deleteBoard(boardId) {
      setBoards(prevBoards => prevBoards.filter(board => board.id !== boardId));
    }

    // Function to add a new board
    function addBoard(title) {
      setBoards(prevBoards => [
        ...prevBoards,
        { id: Date.now(), title: title, tasks: [] },
      ]);
    }

    return (
      <div>
        <h1>Kanban Board Demo</h1>
        <button onClick={() => addBoard("New Board")}>Add Board</button>

        {/* This container wraps all the boards and displays them in a row (horizontally) with a gap between each board. */}
       <div style= {{display: "flex", flexDirection: "column", gap: "20px"}}>
        {boards.map(board => (
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

    // Add a new task
    function addTask() {
      const newTask = {
        id: Date.now(),
        title: `Task ${board.tasks.length + 1}`,
        description: "",
        createdAt: new Date().toISOString(),
        dueDate: "",
        status: "To Do"
      };

      setBoards(prevBoards =>
        prevBoards.map(b =>
          b.id === board.id ? { ...b, tasks: [...b.tasks, newTask] } : b
        )
      );
    }

    // Delete a task
    function deleteTask(taskId) {
      setBoards(prevBoards =>
        prevBoards.map(b =>
          b.id === board.id
            ? { ...b, tasks: b.tasks.filter(t => t.id !== taskId) }
            : b
        )
      );
    }

    // Move task to another column
    function moveTask(taskId, newStatus) {
      setBoards(prevBoards =>
        prevBoards.map(b =>
          b.id === board.id
            ? {
                ...b,
                tasks: b.tasks.map(t =>
                  t.id === taskId ? { ...t, status: newStatus } : t
                )
              }
            : b
        )
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
          {board.tasks.map(task => (
            <div key={task.id} style={{ margin: "2px 0" }}>
              {task.title} — {task.status}
              <button onClick={() => deleteTask(task.id)} style={{ marginLeft: "5px" }}>Delete</button>
            </div>
          ))}
        </div>

        {/* Columns for drag-and-drop */}
        <div style={{ display: "flex", gap: "20px" }}>
          {columns.map(columnName => {
            const tasksInColumn = board.tasks.filter(task => task.status === columnName);
            return (
              <div
                key={columnName}
                onDragOver={e => e.preventDefault()}
                onDrop={e => {
                  const draggedTaskId = Number(e.dataTransfer.getData("taskId"));
                  moveTask(draggedTaskId, columnName);
                }}
                style={{
                  border: "1px solid black",
                  padding: "10px",
                  width: "150px",
                  minHeight: "50px"
                }}
              >
                <h3>{columnName}</h3>
                {tasksInColumn.map(task => (
                  <div
                    key={task.id}
                    draggable
                    onDragStart={e => e.dataTransfer.setData("taskId", String(task.id))}
                    style={{
                      border: "1px solid gray",
                      margin: "5px",
                      padding: "5px"
                    }}
                  >
                    {task.title}
                  </div>
                ))}
              </div>
            );
          })}
        </div>
      </div>
    );
  }

  // Render the app
  const root = ReactDOM.createRoot(document.getElementById("root"));
  root.render(<App />);

  </script>
</body>
</html>
