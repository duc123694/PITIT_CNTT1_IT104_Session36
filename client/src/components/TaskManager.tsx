import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getInputValue, addTask } from "../redux/slice/taskManager.slice";
import axios from "axios";
import { changeCompletion, deleteTask, editTask } from "../redux/slice/tackManagerArray.slice";

export default function TaskManager() {
  const value = useSelector((state: any) => state.task);
  const dispatch = useDispatch();
  const [tasks, setTasks] = useState([]);
  const [reload, setReload] = useState(0);
  const [editingTaskId, setEditingTaskId] = useState<number | null>(null);
  const [editForm, setEditForm] = useState({ name: "", priority: "" });
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [taskIdToDelete, setTaskIdToDelete] = useState<number | null>(null);

  useEffect(() => {
    axios
      .get("http://localhost:3000/tasks")
      .then((res) => setTasks(res.data));
  }, [reload]);

  const filterByPriority = (e: React.ChangeEvent<HTMLSelectElement>) => {
    if (e.target.value === "") {
      axios
        .get("http://localhost:3000/tasks")
        .then((res) => setTasks(res.data));
    } else {
      setTasks(tasks.filter((task: any) => task.priority === e.target.value));
    }
  };

  const filterByCompletion = (e: React.ChangeEvent<HTMLSelectElement>) => {
    if (e.target.value === "") {
      axios
        .get("http://localhost:3000/tasks")
        .then((res) => setTasks(res.data));
    } else {
      setTasks(tasks.filter((task: any) => task.completion.toString() === e.target.value));
    }
  };

  const filterByName = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.value === "") {
      axios
        .get("http://localhost:3000/tasks")
        .then((res) => setTasks(res.data));
    } else {
      setTasks(tasks.filter((task: any) => task.name.includes(e.target.value)));
    }
  };

  const handleEditClick = (task: any) => {
    setEditingTaskId(task.id);
    setEditForm({ name: task.name, priority: task.priority });
  };

  const handleEditSubmit = (taskId: number) => {
    dispatch(
      editTask({
        id: taskId,
        name: editForm.name,
        priority: editForm.priority,
        completion: tasks.find((t: any) => t.id === taskId).completion,
      })
    );
    setEditingTaskId(null);
    setEditForm({ name: "", priority: "" });
    setReload(reload + 1);
  };

  const handleDeleteClick = (taskId: number) => {
    setTaskIdToDelete(taskId);
    setShowDeleteModal(true);
  };

  const confirmDelete = () => {
    if (taskIdToDelete !== null) {
      dispatch(deleteTask(taskIdToDelete));
      setReload(reload + 1);
    }
    setShowDeleteModal(false);
    setTaskIdToDelete(null);
  };

  const cancelDelete = () => {
    setShowDeleteModal(false);
    setTaskIdToDelete(null);
  };

  return (
    <div className="task-manager">
      <h2>📑 Task Manager</h2>

      <div className="task-input">
        <input
          type="text"
          placeholder="Công việc mới"
          value={value.name}
          onChange={(e) =>
            dispatch(getInputValue({ field: "name", value: e.target.value }))
          }
        />
        <select
          value={value.priority}
          onChange={(e) =>
            dispatch(
              getInputValue({ field: "priority", value: e.target.value })
            )
          }
        >
          <option value="HIGH">Cao</option>
          <option value="MEDIUM">Trung bình</option>
          <option value="LOW">Thấp</option>
        </select>
        <button
          onClick={() => {
            dispatch(
              addTask({
                id: tasks.length ? tasks[tasks.length - 1].id + 1 : 1,
                name: value.name,
                priority: value.priority,
                completion: false,
              })
            );
            dispatch(getInputValue({ field: "name", value: "" }));
            setReload(reload + 1);
          }}
        >
          THÊM
        </button>
      </div>

      <div className="task-filters">
        <select onChange={filterByCompletion}>
          <option value="">Tất cả</option>
          <option value="true">Hoàn thành</option>
          <option value="false">Chưa làm</option>
        </select>
        <select onChange={filterByPriority}>
          <option value="">Tất cả</option>
          <option value="HIGH">Cao</option>
          <option value="MEDIUM">Trung bình</option>
          <option value="LOW">Thấp</option>
        </select>
        <input type="text" placeholder="Tìm kiếm" onChange={filterByName} />
      </div>

      <ul className="task-list">
        {tasks.map((task: any) => (
          <li className="task-item" key={task.id}>
            {editingTaskId === task.id ? (
              <div style={{ display: "flex", gap: "5px" }}>
                <input
                  type="text"
                  value={editForm.name}
                  onChange={(e) =>
                    setEditForm({ ...editForm, name: e.target.value })
                  }
                />
                <select
                  value={editForm.priority}
                  onChange={(e) =>
                    setEditForm({ ...editForm, priority: e.target.value })
                  }
                >
                  <option value="HIGH">Cao</option>
                  <option value="MEDIUM">Trung bình</option>
                  <option value="LOW">Thấp</option>
                </select>
                <button onClick={() => handleEditSubmit(task.id)}>LƯU</button>
                <button onClick={() => setEditingTaskId(null)}>HỦY</button>
              </div>
            ) : (
              <div style={{ display: "flex", gap: "5px" }}>
                <input
                  type="checkbox"
                  checked={task.completion}
                  onChange={() => {
                    dispatch(changeCompletion({ id: task.id, value: !task.completion }));
                    setReload(reload + 1);
                  }}
                />
                <span className={task.completion ? "completed" : ""}>
                  {task.name}
                </span>
                <span className={`priority ${task.priority.toLowerCase()}`}>
                  {task.priority}
                </span>
              </div>
            )}
            <div>
              <button
                className="delete-btn"
                onClick={() => handleDeleteClick(task.id)}
              >
                🗑
              </button>
              <button
                className="edit-btn"
                onClick={() => handleEditClick(task)}
              >
                ✏️
              </button>
            </div>
          </li>
        ))}
      </ul>

      {showDeleteModal && (
        <div className="modal" style={{
          position: "fixed",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          background: "rgba(0, 0, 0, 0.5)",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          zIndex: 1000
        }}>
          <div className="modal-content" style={{
            background: "white",
            padding: "20px",
            borderRadius: "5px",
            textAlign: "center"
          }}>
            <h3>Xác nhận xóa</h3>
            <p>Bạn có chắc muốn xóa công việc này?</p>
            <div style={{ display: "flex", gap: "10px", justifyContent: "center" }}>
              <button
                onClick={confirmDelete}
                style={{ background: "#ff4444", color: "white", padding: "8px 16px", border: "none", borderRadius: "4px" }}
              >
                Xóa
              </button>
              <button
                onClick={cancelDelete}
                style={{ background: "#ccc", color: "black", padding: "8px 16px", border: "none", borderRadius: "4px" }}
              >
                Hủy
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}