import Task from "./Task.js";
import TasksService from "./TaskService.js";
import Validation from "./Validation.js";

const services = new TasksService();
const validation = new Validation();

const getELE = (id) => document.getElementById(id);

const loader = getELE("loader-container");

let isLoading = false;

const checkLoading = () => {
  if (isLoading) {
    document.querySelector(".card").appendChild(loader); // Thêm vào UI
  } else {
    loader.remove(); // xóa ra khỏi UI
  }
};
/**
 * Render List Data
 */

let listToDo, listCompleted;

const fetchData = async () => {
  isLoading = true;
  checkLoading();
  const listTask = await services.getListTaskApi();
  listToDo = listTask.data.filter((task) => task.status === "todo");
  listCompleted = listTask.data.filter((task) => task.status === "completed");

  renderListData(listToDo);
  renderListData(listCompleted, "completed");
};
fetchData();

const renderListData = (arrData, status = "todo") => {
  let contentHTML = arrData?.reduce((result, item) => {
    return (result += `
            <li>
                <span>${item.textTask}</span>
                <div class="buttons">
                    <button class="remove" onclick="removeTask('${item.id}')">
                        <i class="fas fa-trash-alt"></i>
                    </button>
                    <button
                        class="complete" 
                        onclick="checkStatus('${item.id}')"
                    >
                      <i class="${
                        status === "todo" ? "far" : "fas"
                      } fa-check-circle"></i>
                    </button>
                </div>
            </li>
        `);
  }, "");
  getELE(status).innerHTML = contentHTML;
  isLoading = false;
  checkLoading();
};

/**
 * Render Status
 */

const renderStatus = (result, status, message) => {
  if (result.status == status) {
    alert(`${message} successfully`);
    // fetchData();
    return true;
  } else {
    alert("Failure");
    return false;
  }
};
window.renderStatus = renderStatus;

/**
 * Add data
 */
getELE("addItem").addEventListener("click", async () => {
  const textTask = getELE("newTask").value;

  let isValid = true;

  isValid &= validation.checkEmpty(textTask, "Task Empty");

  if (isValid) {
    const task = new Task("", textTask, "todo");

    isLoading = true;
    checkLoading();
    const result = await services.addTaskApi(task);

    const success = renderStatus(result, 201, `Add`);
    if (success) listToDo.push(result.data);
    renderListData(listToDo, "todo");
    getELE("newTask").value = "";
  }
});

/**
 * Remove data
 */

const removeTask = async (id) => {
  isLoading = true;
  checkLoading();
  const result = await services.deleteTaskApi(id);
  if (renderStatus(result, 200, `Delete`)) {
    let index = listToDo.findIndex((todo) => todo.id === id);
    if (index > -1) {
      listToDo.splice(index, 1);
      renderListData(listToDo);
      return;
    }

    index = listCompleted.findIndex((todo) => todo.id === id);
    listCompleted.splice(index, 1);
    renderListData(listCompleted, "completed");
  }
};
window.removeTask = removeTask;

/**
 * check Status
 */

const processCheckStatus = async (oldTask, changeStatus) => {
  oldTask.data.status = changeStatus;
  // //put nó lên nữa xong rùi sàng
  isLoading = true;
  checkLoading();
  const newTask = await services.updateTaskApi(oldTask.data);

  // //sàng ra
  //   const listTask = await services.getListTaskApi();

  //   const listToDo = listTask.data.filter((task) => task.status === "todo");
  //   const listCompleted = listTask.data.filter(
  //     (task) => task.status === "completed"
  //   );

  if (changeStatus === "todo") {
    const task = listCompleted.splice(
      listCompleted.findIndex((task) => task.id === oldTask.data.id),
      1
    );
    listToDo.push(...task);
  } else {
    const task = listToDo.splice(
      listToDo.findIndex((task) => task.id === oldTask.data.id),
      1
    );
    listCompleted.push(...task);
  }

  alert("Change Status Successfully!!");
  renderListData(listToDo);
  renderListData(listCompleted, "completed");
};
window.processCheckStatus = processCheckStatus;

const checkStatus = async (id) => {
  isLoading = true;
  checkLoading();
  const taskById = await services.getTaskById(id);
  if (taskById.status == 200) {
    if (taskById.data.status == "todo") {
      processCheckStatus(taskById, "completed");
    } else {
      processCheckStatus(taskById, "todo");
    }
  } else {
    alert("Failure");
  }
};
window.checkStatus = checkStatus;
