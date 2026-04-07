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
  
         // Counts total number of boards
         const boardCount = boards.length;

// Counts total number of tasks across all boards
const taskCount = boards.reduce((total, board) => {
  return total + board.tasks.length;
}, 0);

// Counts tasks that have high priority
const highPriorityCount = boards.reduce((total, board) => {
  return total + board.tasks.filter(task => task.priority === "high").length;
}, 0);

// Gets today's date to compare due dates
const today = new Date();

// Counts tasks that are due within the next 3 days
const dueSoonCount = boards.reduce((total, board) => {
  return total + board.tasks.filter(task => {

    // Skip if task has no due date
    if (!task.dueDate) return false;

    const dueDate = new Date(task.dueDate);

    // Converts time difference into days
    const diffDays = (dueDate - today) / (1000 * 60 * 60 * 24);

    return diffDays >= 0 && diffDays <= 3; }).length; }, 0);
  

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
      <h2>Boards: {boardCount}</h2>
      <h2>Total Tasks: {taskCount}</h2>
      <h2>High Priority: {highPriorityCount}</h2>
      <h2>Due Soon: {dueSoonCount}</h2>

      
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

  //Add a new task
  function addTask() {
    const title = prompt("Enter task title:");
    if (!title) return;

    const description = prompt("Enter short description:");
    const dueDate = prompt("Enter due date (YYYY-MM-DD):");
    const priority = prompt("Enter priority (low, medium, high):");
    
    // Creates a new task with all required fields (title, description, dates, priority)
    const newTask = {
      id: Date.now(), // unique id based on current time
      title: title,
      description: description || "",
      createdAt: new Date().toISOString(), // automatically stores creation date
      dueDate: dueDate || "",
      status: "To Do",
      priority: priority || "low", // defaults to low if user doesn't enter one
    };

    setBoards((prevBoards) =>
      prevBoards.map((b) =>
        b.id === board.id ? { ...b, tasks: [...b.tasks, newTask] } : b,
      ),
    );
  
    
  }
  //Delete a task
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
  // Allows tasks to be reordered within the same column using drag and drop
  function reorderTasks(draggedId, targetId, columnName) {
  setBoards((prevBoards) =>
    prevBoards.map((b) => {
      if (b.id !== board.id) return b;

      // Get tasks in same column
      const columnTasks = b.tasks.filter(
        (t) => t.status === columnName
      );

      const draggedTask = columnTasks.find((t) => t.id === draggedId);
      const targetTask = columnTasks.find((t) => t.id === targetId);

      if (!draggedTask || !targetTask) return b;

      // Remove dragged task
      let newTasks = b.tasks.filter((t) => t.id !== draggedId);

      // Find index of target
      const targetIndex = newTasks.findIndex((t) => t.id === targetId);

      // Insert dragged task before target task
      newTasks.splice(targetIndex, 0, draggedTask);

      return { ...b, tasks: newTasks };
    })
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
            > {/* Makes each task draggable and stores its ID when dragging starts */}
              <h3>{columnName}</h3>
              {tasksInColumn.map((task) => {
              const isOverdue = task.dueDate && new Date(task.dueDate) < new Date(); // Checks if the task is overdue by comparing due date to today
              
              return(
                <div
                  key={task.id}
                  draggable
                  onDragStart={(e) =>  // Stores the task ID when dragging starts so it can be moved later
                    e.dataTransfer.setData("taskId", String(task.id))
                  }
                  //Allows the element to accept dropped items and handles dropping a draged task
                  //to reorder it.
                  onDragOver = {(e) => e.preventDefault()}
                  onDrop={(e) => { // Allows dropping a task into a column and updates its status
                    const draggedId = Number(e.dataTransfer.getData("taskId"));
                    reorderTasks(draggedId, task.id, columnName);
                  }}

                  style={{
                    border: "1px solid gray",
                    margin: "5px",
                    padding: "5px",
                    backgroundColor: isOverdue ? "#ffcccc" : "#f9f9f9", //turns red if overdue.
                  }}
                >
                  <strong>{task.title}</strong>
                  <div style={{ fontSize: "12px", marginTop: "4px" }}>
                    {task.description}
                  </div>
                  <div style={{ fontSize: "12px", marginTop: "4px" }}>
                   Created: {new Date(task.createdAt).toLocaleDateString()}
                 </div>
                 <div style={{ fontSize: "12px" }}>
                  Due: {task.dueDate || "No due date"}

                </div>
                <div style={{ fontSize: "12px" }}>
                   Status: {isOverdue ? "Overdue" : task.status}
                </div>
                </div>
              
                )})}
            </div>
          );
        })}
      </div>
    </div>
  );
}

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(<App />);
